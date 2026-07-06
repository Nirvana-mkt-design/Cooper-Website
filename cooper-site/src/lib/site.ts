// Canonical production origin used to build absolute URLs for SEO
// (canonical links, Open Graph URLs, JSON-LD @id / url fields).
//
// Currently pointed at the test deploy. When moving to the primary domain,
// update this constant AND the static references in:
//   - index.html
//   - public/robots.txt
//   - public/sitemap.xml
export const SITE_ORIGIN = 'https://cooper-site-blush.vercel.app'

/** Build an absolute URL from a root-relative path (e.g. "/personas/x"). */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
