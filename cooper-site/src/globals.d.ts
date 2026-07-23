interface Window {
  fbq?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  Cookiebot?: { consent?: { marketing?: boolean }; renew: () => void }
  oaiq?: ((...args: unknown[]) => void) & { q?: unknown[] }
}

// Raw markdown imports (Vite `?raw` suffix) — used by the legal document pages.
declare module '*.md?raw' {
  const content: string
  export default content
}
