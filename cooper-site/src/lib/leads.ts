/**
 * Shared plumbing for every form on the site that creates a lead.
 *
 * The demo form owned all of this privately until the ROI calculator needed a
 * second entry point. Two copies of an API origin or an E.164 helper is how a
 * lead silently stops reaching the CRM from one form but not the other, so it
 * lives here and both import it.
 *
 * Leads land in the same place either way: the Cooper API verifies Turnstile,
 * rate-limits, and forwards to the Zapier webhook that owns dedupe and the CRM
 * write (backend/apps/core/demo_requests).
 */

import { parsePhoneNumber } from 'libphonenumber-js'

// Explicit VITE_API_ORIGIN wins; otherwise default to the local backend in dev
// and production otherwise, so `task website:dev` never posts to prod.
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ??
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://api.askcooper.ai')

// Cloudflare Turnstile. When the site key is set the widget shows and a token
// is required; the backend verifies it. Unset (dev) skips both ends.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
export const USE_TURNSTILE = Boolean(TURNSTILE_SITE_KEY)

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'mail.com', 'gmx.com', 'gmx.net', 'inbox.com',
])

/** Mirrors PERSONAL_EMAIL_DOMAINS in backend/apps/core/demo_requests/schemas.py. */
export function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return Boolean(domain) && !PERSONAL_EMAIL_DOMAINS.has(domain)
}

/**
 * Normalize to E.164 (+1XXXXXXXXXX) so Twilio Verify sees the same canonical
 * number on send-code and check.
 */
export function toE164(raw: string): string {
  try {
    return parsePhoneNumber(raw, 'US')?.number ?? raw
  } catch {
    return raw
  }
}

const ATTRIBUTION_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id', 'twclid',
]

/**
 * Campaign params captured on the visitor's first page (see use-utm-capture).
 * Best-effort: absent when they arrived without any.
 */
export function collectAttribution(): Record<string, string> {
  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem('cooper_ad_params') ?? '{}') as Record<string, string> }
    catch { return {} }
  })()
  return Object.fromEntries(ATTRIBUTION_KEYS.filter((k) => stored[k]).map((k) => [k, stored[k]]))
}

/** Meta first-party cookies, for CAPI match quality. Empty without consent. */
export function readCookie(name: string): string {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)')
  )
  return m ? decodeURIComponent(m[1]) : ''
}

interface LeadFields {
  full_name: string
  email: string
  company: string
  phone: string
  /** CRM qualification bucket, when the form has enough to fill it in. */
  annual_book_of_business?: string
  /** Extra attribution merged over the captured campaign params. */
  source?: Record<string, string>
}

/**
 * The fields every lead carries, however it was captured: trimmed, phone in
 * E.164, campaign attribution merged, Meta cookies attached.
 *
 * This is the reusable unit rather than the POST itself — the demo form's
 * two-step verify flow posts a superset of this to a different endpoint, so it
 * spreads this and adds its qualification answers on top. One definition of
 * "what a lead looks like", two callers.
 */
export function leadPayload(fields: LeadFields) {
  return {
    full_name: fields.full_name.trim(),
    email: fields.email.trim(),
    company: fields.company.trim(),
    phone: toE164(fields.phone),
    attribution: { ...collectAttribution(), ...fields.source },
    fbc: readCookie('_fbc'),
    fbp: readCookie('_fbp'),
    ...(fields.annual_book_of_business
      ? { annual_book_of_business: fields.annual_book_of_business }
      : {}),
  }
}

/**
 * Capture a lead without triggering the SMS step.
 *
 * `/send-code/` writes the lead through to Zapier before any phone
 * verification — that is how the demo form avoids losing prospects who abandon
 * at the code screen. `defer_sms` makes that the whole interaction rather than
 * the first half of one, which is what a non-demo form (the ROI gate) wants:
 * the lead is captured, and nobody gets an unexpected text message.
 *
 * Throws on a non-2xx, with `status` attached so callers can single out 429.
 */
export async function captureLead(
  fields: LeadFields & { turnstile_token?: string }
): Promise<void> {
  const res = await fetch(`${API_ORIGIN}/api/v1/demo-requests/send-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...leadPayload(fields),
      turnstile_token: fields.turnstile_token ?? '',
      defer_sms: true,
    }),
  })
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status })
}

/**
 * Trade a lead for the body of the white paper.
 *
 * The one form on the site that does not post to the API directly. The paper is
 * not in the bundle and not in the prerendered HTML — api/white-paper.ts holds
 * it and hands it over only once the same /send-code/ call the other forms make
 * has come back 2xx. So the lead still lands in exactly one pipeline; the extra
 * hop exists so that "did this visitor actually convert" is answered by the
 * server rather than by a CSS class the visitor can delete.
 *
 * Resolves with markdown. Throws on any failure, with `status` attached.
 */
export async function unlockWhitePaper(
  fields: LeadFields & { turnstile_token?: string; variant: 'rail' | 'modal' | 'sheet' | 'report' }
): Promise<string> {
  const res = await fetch('/api/white-paper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...leadPayload(fields),
      turnstile_token: fields.turnstile_token ?? '',
      variant: fields.variant,
    }),
  })
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status })
  const data = (await res.json()) as { body?: string }
  if (!data.body) throw Object.assign(new Error('empty body'), { status: res.status })
  return data.body
}
