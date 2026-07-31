/*
 * Rasterises the PNG favicons from public/favicon.svg.
 * Local dev tool (needs macOS Chrome):  node scripts/favicons/generate.cjs
 *
 * Output: public/favicon-{16,32,48}.png
 *
 * Why these exist alongside favicon.svg and favicon.ico: Safari drew a blank
 * tile without them. It does not reliably take an SVG favicon, and every entry
 * inside our .ico is PNG-compressed rather than BMP/DIB, which Safari also
 * handles badly — so it had nothing left it could decode. A plain PNG it does
 * take. Chrome and Firefox still prefer the SVG.
 *
 * favicon.svg itself is generated upstream from frontend/public/cooper-icon.svg
 * (the icon the product ships). Re-run this after changing that, so the tab
 * icon and the product icon stay the same mark.
 *
 * Same headless-Chrome approach as scripts/og/generate.cjs, for the same
 * reason: no image dependency in package.json for an asset built by hand a few
 * times a year.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const PUBLIC = path.join(ROOT, 'public')
const SOURCE = path.join(PUBLIC, 'favicon.svg')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SIZES = [16, 32, 48]

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME} — this is a macOS-only dev tool.`)
  process.exit(1)
}
if (!fs.existsSync(SOURCE)) {
  console.error(`Missing ${SOURCE}.`)
  process.exit(1)
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cooper-favicons-'))

for (const px of SIZES) {
  // The <img> is sized exactly to the viewport so Chrome's screenshot is the
  // icon and nothing else — no padding, no scrollbar.
  const page = path.join(tmp, `${px}.html`)
  fs.writeFileSync(
    page,
    `<style>html,body{margin:0;padding:0;width:${px}px;height:${px}px;overflow:hidden}` +
      `img{display:block;width:${px}px;height:${px}px}</style>` +
      `<img src="file://${SOURCE}">`
  )
  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--window-size=${px},${px}`,
    `--screenshot=${path.join(PUBLIC, `favicon-${px}.png`)}`,
    `file://${page}`,
  ], { stdio: 'ignore' })
  console.log(`wrote public/favicon-${px}.png`)
}

fs.rmSync(tmp, { recursive: true, force: true })
