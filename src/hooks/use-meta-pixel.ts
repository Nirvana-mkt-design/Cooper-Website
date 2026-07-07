declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    Cookiebot?: { consent?: { marketing?: boolean }; renew: () => void };
  }
}

function hasMarketingConsent(): boolean {
  return window.Cookiebot?.consent?.marketing === true;
}

export function useMetaPixel() {
  function getMarketingConsent(): boolean {
    return hasMarketingConsent();
  }

  function trackLead(eventId: string) {
    if (!window.fbq || !hasMarketingConsent()) return;
    window.fbq("track", "Lead", {}, { eventID: eventId });
  }

  return { getMarketingConsent, trackLead };
}
