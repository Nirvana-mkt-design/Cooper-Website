import { leadValueUsd } from '../lib/conversions'

// Google conversion tracking for the demo form.
//
// The Google tag (gtag config for AW-18264278460, combined with the GA4
// destination G-NC06YD4CB6 under one Google tag) is loaded in index.html; here
// we fire the lead events on a successful submit, alongside the Meta Lead (see
// use-meta-pixel.ts).
//
// Events fire regardless of the visitor's consent choice: Consent Mode v2 (see
// index.html) governs what Google may store — denied consent downgrades the
// hits to cookieless pings that feed conversion modeling, granted consent sends
// them in full. Gating on consent here would drop the denied-consent pings and
// the modeled conversions with them.
//
// CONVERSION_LABEL comes from the Google Ads "Submit lead form" conversion
// action (Tag setup → event snippet: send_to 'AW-18264278460/<label>').
const CONVERSION_ID = 'AW-18264278460'
const CONVERSION_LABEL = 'cQRICOCR9M8cELyLi4VE'
const GA4_ID = 'G-NC06YD4CB6'

export function useGoogleAds() {
  function trackGoogleLead(lead: {
    employeeCount: string
    bookOfBusiness: string
    softwareBudget: string
    email: string
    phone: string
    eventId: string
  }) {
    if (!window.gtag) return
    const params = {
      value: leadValueUsd(lead.employeeCount, lead.bookOfBusiness, lead.softwareBudget),
      currency: 'USD',
      transaction_id: lead.eventId,
    }
    // Enhanced conversions: gtag normalizes and hashes user_data client-side
    // before sending, and omits it while ad_user_data consent is denied.
    window.gtag('set', 'user_data', { email: lead.email, phone_number: lead.phone })
    // Google Ads conversion — counted only when Google can attribute an ad click.
    window.gtag('event', 'conversion', {
      send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
      ...params,
    })
    // GA4 lead event — records the lead whatever the traffic source.
    window.gtag('event', 'generate_lead', { send_to: GA4_ID, ...params })
  }

  return { trackGoogleLead }
}
