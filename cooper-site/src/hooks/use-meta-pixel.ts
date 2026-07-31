import { leadValueUsd, leadValueUsdMinor } from '../lib/conversions'

function hasMarketingConsent(): boolean {
  return window.Cookiebot?.consent?.marketing === true
}

export function useMetaPixel() {
  function getMarketingConsent(): boolean {
    return hasMarketingConsent()
  }

  function trackLead(
    eventId: string,
    employeeCount: string,
    bookOfBusiness: string,
    softwareBudget: string,
  ) {
    if (!window.fbq || !hasMarketingConsent()) return
    window.fbq(
      'track',
      'Lead',
      { value: leadValueUsd(employeeCount, bookOfBusiness, softwareBudget), currency: 'USD' },
      { eventID: eventId },
    )
  }

  function trackOpenAiLead(
    employeeCount: string,
    bookOfBusiness: string,
    softwareBudget: string,
  ) {
    if (!window.oaiq || !hasMarketingConsent()) return
    // `currency` is required whenever `amount` is set.
    window.oaiq('measure', 'lead_created', {
      type: 'customer_action',
      amount: leadValueUsdMinor(employeeCount, bookOfBusiness, softwareBudget),
      currency: 'USD',
    })
  }

  return { getMarketingConsent, trackLead, trackOpenAiLead }
}
