/**
 * Build guard: the gated white paper must not be in the build output.
 *
 * The first version of the gate was a CSS blur over the real text, so the paper
 * shipped in the JS bundle and, because the route is prerendered, in the static
 * HTML. It looked gated in a browser and was fully public to `curl`.
 *
 * The fix moved the body to api/_white-paper-body.ts, which nothing under src/
 * imports. That is a convention, and conventions are one careless import away
 * from being undone — a single `import { WHITE_PAPER_BODY } from '...'` added to
 * a component would silently republish the whole paper with no visible symptom.
 * So the build checks rather than trusts: sentences taken from the gated body
 * are searched for across dist/, and finding one fails the build.
 *
 * Runs after prerender.cjs, when both dist/ and the prerendered HTML exist.
 */

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SOURCE = path.resolve(ROOT, '..', 'api', '_white-paper-body.ts')
const TEASER = path.join(ROOT, 'src', 'content', 'white-paper-preview.md')

/** Whitespace-insensitive, so a minifier or JSX reflow cannot hide a match. */
const normalize = (s) => s.replace(/\s+/g, ' ')

/* Text files only. A match inside a font or an image would be a coincidence,
   and reading them costs more than the check is worth. */
const TEXT = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.json', '.txt', '.xml', '.map'])

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (TEXT.has(path.extname(entry.name))) out.push(full)
  }
  return out
}

/**
 * The paper itself, without the module's own doc comment — probing with a
 * sentence from the header would test whether the comment leaked, which is
 * both harmless and not the question.
 */
function gatedMarkdown(source) {
  const open = source.indexOf('`', source.indexOf('WHITE_PAPER_BODY'))
  const close = source.lastIndexOf('`')
  if (open === -1 || close <= open) {
    throw new Error('assert-gate: could not find the WHITE_PAPER_BODY template literal')
  }
  return source.slice(open + 1, close)
}

/** Long sentences make good needles: distinctive, and unlikely to collide. */
function needles(markdown, count = 8) {
  const sentences = normalize(markdown)
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 90 && !s.startsWith('#') && !s.includes('http'))
  if (sentences.length < count) {
    throw new Error(`assert-gate: only ${sentences.length} usable sentences in the gated body`)
  }
  // Spread across the whole document rather than clustering at the top, so a
  // partial leak of any section is caught.
  const step = Math.floor(sentences.length / count)
  return Array.from({ length: count }, (_, i) => sentences[i * step])
}

/**
 * The teaser is a verbatim excerpt of the paper's opening, kept in a second
 * file so it can ship to the browser. Two consequences, both handled here.
 *
 * It must stay verbatim: if someone edits the opening of the paper and not the
 * teaser, a reader sees one wording before unlocking and a different one after,
 * which looks like a bug and is invisible in review. So the build checks the
 * prefix relationship rather than trusting a comment to be obeyed.
 *
 * And its text is public on purpose, so it cannot be used to probe for a leak —
 * searching dist/ for it would fail every build. Returns the paper with the
 * teaser removed, which is exactly the text that must never reach dist/.
 */
function withheldPortion(paper, teaser) {
  const body = normalize(teaser.replace(/^##[^\n]*\n/, '')).trim()
  const paperText = normalize(paper)
  if (!body) throw new Error('assert-gate: the teaser has no prose in it')
  const at = paperText.indexOf(body)
  if (at === -1) {
    console.error(
      '\nassert-gate FAILED — the teaser is no longer a verbatim excerpt of the paper.\n\n' +
        '  teaser: cooper-site/src/content/white-paper-preview.md\n' +
        '  paper:  api/_white-paper-body.ts\n\n' +
        'The teaser is what a visitor reads before unlocking and the paper is what\n' +
        'they read after. They have to agree word for word, or unlocking silently\n' +
        'rewrites the paragraph the reader just read. Edit both.\n',
    )
    process.exit(1)
  }
  return paperText.slice(at + body.length)
}

function main() {
  for (const [label, file] of [['gated body', SOURCE], ['teaser', TEASER]]) {
    if (!fs.existsSync(file)) {
      console.error(`assert-gate: ${label} not found at ${file}`)
      process.exit(1)
    }
  }
  if (!fs.existsSync(DIST)) {
    console.error(`assert-gate: no dist/ to check`)
    process.exit(1)
  }

  const paper = gatedMarkdown(fs.readFileSync(SOURCE, 'utf8'))
  const probes = needles(withheldPortion(paper, fs.readFileSync(TEASER, 'utf8')))
  const files = walk(DIST)
  const leaks = []

  for (const file of files) {
    const text = normalize(fs.readFileSync(file, 'utf8'))
    for (const probe of probes) {
      if (text.includes(probe)) {
        leaks.push({ file: path.relative(ROOT, file), probe: probe.slice(0, 60) })
        break
      }
    }
  }

  if (leaks.length) {
    console.error('\nassert-gate FAILED — the gated white paper is in the build output:\n')
    for (const leak of leaks) console.error(`  ${leak.file}\n    "${leak.probe}…"`)
    console.error(
      '\nSomething under cooper-site/src is importing api/_white-paper-body.ts,\n' +
        'or the paper was pasted back into src/content/. The body must reach the\n' +
        'browser only through api/white-paper.ts, after a lead is accepted.\n',
    )
    process.exit(1)
  }

  console.log(`gate verified: ${probes.length} probes, ${files.length} files, no leak`)
}

main()
