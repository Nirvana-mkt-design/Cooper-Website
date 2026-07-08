interface Window {
  fbq?: (...args: unknown[]) => void
  Cookiebot?: { consent?: { marketing?: boolean }; renew: () => void }
  oaiq?: ((...args: unknown[]) => void) & { q?: unknown[] }
}
