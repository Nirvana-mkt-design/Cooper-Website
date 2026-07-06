/*
 * Generates the 1200x630 Open Graph images for the Home + persona pages.
 * Local dev tool (needs macOS Chrome) — not run on Vercel. Re-run after
 * changing copy or hero art:  node scripts/og/generate.cjs
 *
 * Output: public/images/og/{slug}.png  (+ public/images/og-default.png for Home)
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const PUBLIC = path.join(ROOT, 'public')
const IMG = path.join(PUBLIC, 'images')
const OUT_DIR = path.join(IMG, 'og')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const logo = fs.readFileSync(path.join(IMG, 'cooper-logo-full.svg'), 'utf8')

// slug: null => Home (writes og-default.png). bg is relative to public/images.
const CARDS = [
  {
    out: path.join(IMG, 'og-default.png'),
    bg: 'home-hero-frame.jpg',
    label: 'Built for insurance professionals',
    l1: 'More business.',
    l2: 'Less busywork.',
    size: 86,
    sub: 'AI built for the insurance industry, bringing your workflows together and automating what slows you down.',
  },
  {
    out: path.join(OUT_DIR, 'retail-agencies.png'),
    bg: 'persona/persona-retail-hero.jpg',
    label: 'For retail agencies',
    l1: 'Producers sell.',
    l2: 'Cooper does the rest.',
    size: 66,
    sub: 'The data entry, submissions, renewals and certificates — automated. So producers sell and account managers stay ahead.',
  },
  {
    out: path.join(OUT_DIR, 'wholesale-brokers.png'),
    bg: 'persona/persona-wholesale-hero.webp',
    label: 'For wholesale brokers',
    l1: 'Quote first.',
    l2: 'Win the deal.',
    size: 82,
    sub: 'Cooper triages submissions, matches risks to markets and sends proposals while the deal is still warm.',
  },
  {
    out: path.join(OUT_DIR, 'mgas-insurers.png'),
    bg: 'persona/persona-mgas-hero.webp',
    label: 'For MGAs & insurers',
    l1: 'Scale underwriting.',
    l2: 'Not headcount.',
    size: 74,
    sub: 'Enforce your guidelines, price consistently and stay audit-ready — without adding underwriters.',
  },
  {
    out: path.join(OUT_DIR, 'claims-tpas.png'),
    bg: 'persona/persona-claims-hero.webp',
    label: 'For claims TPAs',
    l1: 'More claims.',
    l2: 'Not a beat missed.',
    size: 76,
    sub: 'Intake, coverage checks and reporting, handled — so adjusters focus on the files that need real judgment.',
  },
  {
    out: path.join(OUT_DIR, 'reinsurers.png'),
    bg: 'persona/persona-reinsurers-hero.webp',
    label: 'For reinsurers',
    l1: 'Renewal season.',
    l2: 'Prepared, not scrambling.',
    size: 60,
    sub: 'Clean cedent data, track accumulation and assemble renewal files, ready on time for pricing and relationships.',
  },
]

function template({ bg, label, l1, l2, size, sub }) {
  const bgAbs = path.join(IMG, bg)
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body { position:relative; overflow:hidden; background:#ede7d9; }
  .bg { position:absolute; inset:0; background:url('file://${bgAbs}') center right/cover; }
  .veil { position:absolute; inset:0; background:linear-gradient(100deg,
      rgba(237,231,217,0.97) 0%, rgba(237,231,217,0.94) 34%, rgba(237,231,217,0.70) 54%,
      rgba(237,231,217,0.18) 74%, rgba(237,231,217,0.00) 100%); }
  .dots { position:absolute; inset:0;
    background-image:radial-gradient(rgba(30,26,21,0.10) 1.2px, transparent 1.3px);
    background-size:26px 26px;
    -webkit-mask-image:linear-gradient(100deg, #000 40%, transparent 68%); }
  .edge { position:absolute; left:0; right:0; bottom:0; height:8px; background:#d95611; }
  .content { position:absolute; inset:0; padding:60px 64px 56px; display:flex; flex-direction:column; }
  .logo svg { height:40px; width:auto; display:block; }
  .label { display:flex; align-items:center; gap:14px; margin-top:30px;
    font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:19px;
    letter-spacing:3px; text-transform:uppercase; color:#d95611; }
  .label .tick { width:34px; height:2px; background:#d95611; display:block; }
  .headline { margin-top:20px; font-family:'Space Grotesk',sans-serif; font-weight:700;
    font-size:${size}px; line-height:1.0; letter-spacing:-2px; color:#1e1a15; max-width:840px; }
  .headline .l2 { display:inline-block; color:#d95611; border-bottom:5px solid #d95611;
    padding-bottom:6px; margin-top:8px; }
  .sub { margin-top:32px; font-family:'Inter',sans-serif; font-weight:400; font-size:26px;
    line-height:1.45; color:#4d4c48; max-width:640px; }
  .foot { margin-top:auto; display:flex; align-items:center; justify-content:space-between; }
  .foot .url { font-family:'Inter',sans-serif; font-weight:700; font-size:22px; color:#1e1a15; }
  .foot .tags { font-family:'Space Grotesk',sans-serif; font-weight:500; font-size:18px;
    letter-spacing:2px; color:rgba(30,26,21,0.45); text-transform:uppercase; }
</style></head><body>
  <div class="bg"></div><div class="veil"></div><div class="dots"></div>
  <div class="content">
    <div class="logo">${logo}</div>
    <div class="label"><span class="tick"></span>${label}</div>
    <div class="headline">${l1}<br><span class="l2">${l2}</span></div>
    <div class="sub">${sub}</div>
    <div class="foot"><span class="url">askcooper.ai</span><span class="tags">AI &middot; Insurance &middot; Agentic</span></div>
  </div>
  <div class="edge"></div>
</body></html>`
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const tmp = path.join(require('os').tmpdir(), 'og-card.html')

for (const card of CARDS) {
  fs.writeFileSync(tmp, template(card))
  execSync(
    `"${CHROME}" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files ` +
      `--window-size=1200,630 --force-device-scale-factor=1 --virtual-time-budget=5000 ` +
      `--screenshot="${card.out}" "file://${tmp}"`,
    { stdio: 'ignore' }
  )
  console.log('rendered', path.relative(ROOT, card.out))
}
