function hasMarketingConsent(): boolean {
  return window.Cookiebot?.consent?.marketing === true
}

export function useMetaPixel() {
  function getMarketingConsent(): boolean {
    return hasMarketingConsent()
  }

  function trackLead(eventId: string) {
    if (!window.fbq || !hasMarketingConsent()) return
    window.fbq('track', 'Lead', {}, { eventID: eventId })
  }

  function trackOpenAiLead() {
    window.oaiq?.('measure', 'lead_created', { type: 'customer_action' })
  }

  return { getMarketingConsent, trackLead, trackOpenAiLead }
}
