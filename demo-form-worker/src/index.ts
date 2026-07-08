/**
 * Cooper demo-form worker (STOPGAP)
 * ---------------------------------
 * Receives a demo request from the marketing site, verifies the Cloudflare
 * Turnstile token server-side (this is the only place the captcha is actually
 * enforced), and stores the lead in the `demo_leads` D1 table.
 *
 * This is a temporary store on Cooper's own Cloudflare account. When the team
 * is ready, point the site's VITE_DEMO_ENDPOINT back at api.askcooper.ai and
 * this worker can be retired. See README.md for the handoff.
 */

export interface Env {
  DB: D1Database
  TURNSTILE_SECRET_KEY: string
}

const ALLOWED_ORIGINS = new Set([
  'https://askcooper.ai',
  'https://www.askcooper.ai',
  'https://askcooper.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
])

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://askcooper.ai'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

// Coerce to a trimmed, length-capped string so a malicious payload can't bloat the row.
function str(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.slice(0, max) : ''
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, cors)
    }

    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return json({ ok: false, error: 'invalid_json' }, 400, cors)
    }

    const token = str(body.turnstile_token, 4000)
    if (!token) {
      return json({ ok: false, error: 'captcha_missing' }, 400, cors)
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? ''
    const ok = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip)
    if (!ok) {
      return json({ ok: false, error: 'captcha_failed' }, 400, cors)
    }

    const email = str(body.email)
    if (!email) {
      return json({ ok: false, error: 'email_required' }, 400, cors)
    }

    try {
      await env.DB.prepare(
        `INSERT INTO demo_leads
          (first_name,last_name,email,phone,company,reason,message,
           event_id,event_source_url,ga_client_id,
           utm_source,utm_medium,utm_campaign,utm_term,utm_content,
           gclid,fbclid,msclkid,ttclid,li_fat_id,twclid,ip,user_agent)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
        .bind(
          str(body.first_name),
          str(body.last_name),
          email,
          str(body.phone),
          str(body.company),
          str(body.reason),
          str(body.message, 5000),
          str(body.event_id),
          str(body.event_source_url),
          str(body.ga_client_id),
          str(body.utm_source),
          str(body.utm_medium),
          str(body.utm_campaign),
          str(body.utm_term),
          str(body.utm_content),
          str(body.gclid),
          str(body.fbclid),
          str(body.msclkid),
          str(body.ttclid),
          str(body.li_fat_id),
          str(body.twclid),
          ip,
          str(request.headers.get('User-Agent'), 500),
        )
        .run()
    } catch {
      return json({ ok: false, error: 'db_error' }, 500, cors)
    }

    return json({ ok: true }, 200, cors)
  },
}
