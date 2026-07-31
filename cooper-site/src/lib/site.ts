// Canonical production origin used to build absolute URLs for SEO
// (canonical links, Open Graph URLs, JSON-LD @id / url fields).
//
// Defaults to the production domain. A build can override it (e.g. staging)
// via VITE_SITE_ORIGIN.
//
// robots.txt and sitemap.xml are generated from this value at build time by
// scripts/prerender.cjs (it reads SITE_ORIGIN from the environment), so they
// need no manual updating. index.html still holds a static copy.
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN ?? 'https://www.askcooper.ai'

// Cooper's canonical description — the meta description and the JSON-LD
// Organization / SoftwareApplication descriptions all use this exact text, so a
// search snippet says the same thing as the homepage hero. First sentence is the
// hero line; the second carries the workflow + segment keywords.
//
// index.html holds static copies (meta description + Organization JSON-LD)
// because it is plain HTML and can't import this. Keep them in sync.
export const COOPER_DESCRIPTION =
  'Cooper is your AI coworker for the entire insurance workflow from intake to renewal. It automates submissions, renewals, coverage checks, certificates, and reporting for agencies, brokers, MGAs, insurers, and claims TPAs.'

/** Build an absolute URL from a root-relative path (e.g. "/product/x"). */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
