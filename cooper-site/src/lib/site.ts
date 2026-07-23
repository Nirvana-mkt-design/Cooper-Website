// Canonical production origin used to build absolute URLs for SEO
// (canonical links, Open Graph URLs, JSON-LD @id / url fields).
//
// Defaults to the production domain. A build can override it (e.g. staging)
// via VITE_SITE_ORIGIN. Keep the static references in sync when changing the
// default:
//   - index.html
//   - public/robots.txt
//   - public/sitemap.xml
//   - scripts/prerender.cjs (reads SITE_ORIGIN from the environment)
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN ?? 'https://cooper-site-blush.vercel.app'

/** Build an absolute URL from a root-relative path (e.g. "/product/x"). */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
