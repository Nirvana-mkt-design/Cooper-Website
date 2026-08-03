/**
 * White paper gate.
 *
 * The paper used to ship inside the client bundle behind a CSS blur, which
 * meant `curl https://…/resources/white-paper` returned all 3,900 words with no
 * JavaScript involved. This endpoint is the fix: the body lives only here, and
 * the only way to get it is to send a lead the upstream pipeline accepts.
 *
 * The flow deliberately keeps one lead pipeline and one captcha consumer:
 *
 *   browser ──POST lead + turnstile token──▶ this function
 *                                             │
 *                     forwards the same payload, plus the visitor's real IP,
 *                     to /send-code/ with defer_sms — the exact call the ROI
 *                     gate makes from the browser
 *                                             ▼
 *                                       Cooper API (verifies Turnstile,
 *                                       rate-limits, writes the lead)
 *                                             │
 *                            2xx ─────────────┘
 *                             │
 *   browser ◀──the paper──────┘
 *
 * The captcha token is single-use, so exactly one party may verify it. That is
 * the upstream API, same as every other form on the site — this function does
 * not hold a Turnstile secret and does not need one. It forwards the caller's
 * address in X-Forwarded-For / CF-Connecting-IP so an upstream that passes
 * `remoteip` to siteverify still sees the visitor rather than a Vercel host.
 *
 * The body is returned on exactly one path: upstream said 2xx. Every other
 * branch returns an error and no content.
 */

/* The .js extension is required, not optional. The repo root's package.json
   sets "type": "module", so this compiles to ESM, and ESM resolves relative
   specifiers literally — no extension means no file. It typechecks and builds
   clean without it, and then fails only inside the Vercel runtime, with
   ERR_MODULE_NOT_FOUND at import time and a 500 on every request to the gate. */
import { WHITE_PAPER_BODY } from './_white-paper-body.js'

/* ── Types declared here rather than imported from @types/node.

   Vercel's installCommand is `cd cooper-site && npm install`, so the root's
   dependencies are never on disk when this file is type-checked. Importing
   node:http, or touching `process` and `Buffer` bare, fills the build log with
   "Cannot find name" errors on every deploy. They are non-fatal — the function
   builds and runs — but an error in a build log that is always there is an
   error nobody reads when it starts mattering.

   Declaring the handful of members this file actually uses costs less than
   installing a second dependency tree in CI, and it documents the surface the
   function depends on. ── */
declare const process: { env: Record<string, string | undefined> }
declare const Buffer: { concat(list: Uint8Array[]): { toString(encoding: string): string } }

interface IncomingMessage extends AsyncIterable<Uint8Array> {
  method?: string
  headers: Record<string, string | string[] | undefined>
  socket: { remoteAddress?: string }
}

interface ServerResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(chunk: string): void
}

const API_ORIGIN = process.env.API_ORIGIN ?? 'https://api.askcooper.ai'
const LEAD_PATH = '/api/v1/demo-requests/send-code/'

/** Vercel sets this on every deployment, so it is false only on a laptop. */
const IS_DEPLOYED = process.env.VERCEL === '1'

/**
 * Serve the paper without calling the lead pipeline, on a laptop only.
 *
 * Two reasons, and neither is convenience alone. Turnstile has no site key in
 * dev, so the token is empty and upstream would reject every local unlock,
 * leaving the unlocked state impossible to look at while designing it. And a
 * dev server posting to the default origin means test leads landing in the
 * production CRM, which is worse than not testing.
 *
 * Set API_ORIGIN (to a local backend, or to production deliberately) to opt
 * back into the real call locally. On Vercel this is always false: VERCEL=1 is
 * set on preview and production alike, so no deployment can serve the paper
 * without a lead.
 */
const DEV_BYPASS = !IS_DEPLOYED && !process.env.API_ORIGIN

interface Payload {
  full_name?: unknown
  email?: unknown
  company?: unknown
  phone?: unknown
  turnstile_token?: unknown
  attribution?: unknown
  fbc?: unknown
  fbp?: unknown
  /** Which CTA the visitor used: 'rail' or 'modal'. */
  variant?: unknown
}

function str(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function send(res: ServerResponse, status: number, data: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  // The paper must never sit in a shared cache, and neither should a refusal.
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

/** Vercel pre-parses JSON bodies; the Vite dev middleware does not. */
async function readBody(req: IncomingMessage & { body?: unknown }): Promise<Payload> {
  if (req.body && typeof req.body === 'object') return req.body as Payload
  const chunks: Uint8Array[] = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Payload
  } catch {
    return {}
  }
}

/** Leftmost entry of X-Forwarded-For is the client; the rest are proxies. */
function clientIp(req: IncomingMessage): string {
  const fwd = req.headers['x-forwarded-for']
  const raw = Array.isArray(fwd) ? fwd[0] : fwd
  return (raw ?? '').split(',')[0].trim() || (req.socket.remoteAddress ?? '')
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'method_not_allowed' })
  }

  const body = await readBody(req)
  const full_name = str(body.full_name, 200)
  const email = str(body.email, 320)
  const company = str(body.company, 200)
  const phone = str(body.phone, 40)

  // Shape only. The upstream API owns the real rules (work-email policy, dedupe,
  // rate limits) and a second copy of them here would drift out of agreement
  // with it, so anything past "this could plausibly be a lead" is left to it.
  if (!full_name || !company || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return send(res, 400, { error: 'invalid_lead' })
  }

  if (DEV_BYPASS) {
    return send(res, 200, { body: WHITE_PAPER_BODY, dev_bypass: true })
  }

  /* Which presentation converted: the rail card or the modal in layout A, the
     bottom panel in layout B, or the rail form on the report page in layout C. This is what the A/B is measured on, so it
     matters that it is trustworthy — whitelisted rather than passed through,
     because form_source lands in the CRM and an endpoint that writes whatever
     string a caller sends is how junk gets into reporting. Anything
     unrecognised falls back to the plain page name. */
  const VARIANTS: Record<string, string> = {
    rail: 'white-paper-rail',
    modal: 'white-paper-modal',
    sheet: 'white-paper-sheet',
    report: 'white-paper-report',
  }
  const formSource = VARIANTS[str(body.variant, 20)] ?? 'white-paper'

  const lead = {
    full_name,
    email,
    company,
    phone,
    attribution: {
      ...(body.attribution && typeof body.attribution === 'object' ? body.attribution : {}),
      form_source: formSource,
    },
    fbc: str(body.fbc, 500),
    fbp: str(body.fbp, 500),
    turnstile_token: str(body.turnstile_token, 4000),
    defer_sms: true,
  }

  const ip = clientIp(req)
  let upstream: Response
  try {
    upstream = await fetch(`${API_ORIGIN}${LEAD_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Present the visitor, not this function, to anything downstream that
        // looks at the address: rate limiting and Turnstile's optional remoteip.
        ...(ip ? { 'X-Forwarded-For': ip, 'CF-Connecting-IP': ip } : {}),
      },
      body: JSON.stringify(lead),
    })
  } catch {
    return send(res, 502, { error: 'upstream_unreachable' })
  }

  if (!upstream.ok) {
    // 429 is worth distinguishing so the form can say "wait a moment" instead of
    // "something went wrong"; everything else collapses to a generic failure.
    return send(res, upstream.status === 429 ? 429 : 502, {
      error: upstream.status === 429 ? 'rate_limited' : 'lead_rejected',
    })
  }

  return send(res, 200, { body: WHITE_PAPER_BODY })
}
