/*
 * Post-build prerender for the SPA.
 *
 * Social scrapers (Facebook, LinkedIn, Slack, X, iMessage) do NOT run JavaScript,
 * so per-route meta set by the app at runtime never reaches them. This script
 * bakes the correct <title>, description, canonical and Open Graph / Twitter tags
 * into a static HTML file per route, so scrapers get the right preview. The body
 * is untouched — the SPA still boots and takes over for real users.
 *
 * Served via `cleanUrls: true` in vercel.json: a request to /personas/x resolves
 * to personas/x.html before the SPA catch-all rewrite applies.
 *
 * Runs from `npm run build`. Route copy must stay in sync with the useSeo() calls
 * in the components (Home lives statically in index.html and is not rewritten).
 */
const fs = require('fs')
const path = require('path')

const DIST = path.resolve(__dirname, '..', 'dist')
const ORIGIN = 'https://cooper-site-blush.vercel.app'
const DEFAULT_OG = `${ORIGIN}/images/og-default.png`

const personas = [
  ['retail-agencies', 'Retail Agencies', 'Producers sell, account managers serve, Cooper does the rest. The submissions, carrier supplements, renewals, and certificates are handled end to end, so your team stays ahead of the book.'],
  ['wholesale-brokers', 'Wholesale Brokers', 'Cooper triages submissions, matches each risk to the markets most likely to write it, and drafts the proposal. Your brokers place more business.'],
  ['mgas-insurers', 'MGA & Insurers', 'Cooper prices to your rating logic, refers what\'s outside appetite with the reason attached, and keeps every program audit-ready, so a lean team covers more programs.'],
  ['claims-tpas', 'Claims TPA', 'Cooper handles intake, coverage checks, and reporting, so your adjusters resolve the files that need real judgment faster.'],
  // Reinsurers is pulled pre-launch (fast-follow rebuild): route redirects, so no prerendered page.
]

/** path, title, description, ogImage */
const routes = [
  ...personas.map(([slug, name, subtitle]) => ({
    path: `/personas/${slug}`,
    title: `Cooper for ${name} — AI for Insurance`,
    description: subtitle,
    ogImage: `${ORIGIN}/images/og/${slug}.png`,
  })),
  { path: '/about', title: 'About Cooper — AI for Insurance Professionals', description: "Cooper's mission, team, and why we're building AI for insurance professionals.", ogImage: DEFAULT_OG },
  { path: '/demo', title: 'Request a Demo — Cooper', description: 'See Cooper in action with your own data. Book a personalized demo for your insurance team.', ogImage: DEFAULT_OG },
  { path: '/careers', title: 'Careers — Cooper', description: 'Join the team building AI for insurance professionals. See open roles at Cooper.', ogImage: DEFAULT_OG },
  { path: '/privacy', title: 'Privacy Policy — Cooper', description: 'How Cooper collects, uses, shares, and protects your personal information.', ogImage: DEFAULT_OG },
  { path: '/terms', title: 'Terms of Service — Cooper', description: 'The terms governing your use of Cooper and its services.', ogImage: DEFAULT_OG },
  { path: '/subprocessors', title: 'Subprocessors — Cooper', description: 'The third-party subprocessors Cooper uses to deliver its services.', ogImage: DEFAULT_OG },
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Replace a head tag matched by `re` with `replacement`; if absent, insert before </head>.
function swap(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`)
}

function render(template, route) {
  const url = `${ORIGIN}${route.path}`
  const t = esc(route.title)
  const d = esc(route.description)
  let html = template
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/?>/, `<meta name="description" content="${d}" />`)
  html = swap(html, /<link\s+rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${url}" />`)
  html = swap(html, /<meta\s+property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${t}" />`)
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/?>/, `<meta property="og:description" content="${d}" />`)
  html = swap(html, /<meta\s+property="og:url"[^>]*\/?>/, `<meta property="og:url" content="${url}" />`)
  html = swap(html, /<meta\s+property="og:image"[^>]*\/?>/, `<meta property="og:image" content="${route.ogImage}" />`)
  html = swap(html, /<meta\s+name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${t}" />`)
  html = swap(html, /<meta\s+name="twitter:description"[\s\S]*?\/?>/, `<meta name="twitter:description" content="${d}" />`)
  html = swap(html, /<meta\s+name="twitter:image"[^>]*\/?>/, `<meta name="twitter:image" content="${route.ogImage}" />`)
  return html
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

for (const route of routes) {
  const outFile = path.join(DIST, `${route.path.replace(/^\//, '')}.html`)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, render(template, route))
}

console.log(`prerendered ${routes.length} routes`)
