/* ──────────────────────────────────────────────────────────────
   White Paper — "The AI Advantage for Insurance Agents."

   Layout follows the launch brief (White Paper v2.1):
     1. Key takeaways box (the exec-summary bullets) at the very top.
     2. A demo CTA directly under it, so a summary-only reader still
        converts. On mobile the order is summary, then button, then paper.
     3. The full paper, rendered from src/content/white-paper.md.
     4. A closing CTA banner (matches the Integrations / Careers banner).

   Published ungated per the Jul 21 decision: no lead form on the page,
   the CTAs point to /demo. Visual language matches the legal pages
   (light navbar, cream) and the site design system.
─────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { LockSimple } from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'
import { SITE_ORIGIN, absoluteUrl } from '../lib/site'
import content from '../content/white-paper.md?raw'

/* ── Markdown body styling (mirrors LegalDocPage, tuned for long-form reading) ── */
const linkCls =
  'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors break-words'
const pCls = 'font-sans text-[16px] leading-[1.75] text-dark/70 mb-[18px]'
const h2Cls = 'font-serif text-[26px] md:text-[30px] leading-[1.2] text-dark mt-[52px] mb-[20px]'
const h3Cls = 'font-sans font-semibold text-[17px] text-dark mb-[12px] mt-[32px]'
const listCls = 'font-sans text-[16px] leading-[1.75] text-dark/70 mb-[18px] pl-[22px] space-y-[8px]'

/* ── The exec-summary bullets, kept out of the markdown so they can be
   rendered as a highlighted box at the top (and reused for the SEO
   description / answer engines). Each is a bold lead-in + the rest. ── */
const TAKEAWAYS: { lead: string; rest: string }[] = [
  {
    lead: 'AI has moved from chat assistants to doing the work:',
    rest: ' modern platforms complete submissions, fill ACORD forms and carrier supplements, drive live carrier portals, compare quotes, and build proposals.',
  },
  {
    lead: 'The adoption window favors agencies that move now.',
    rest: ' 76% of insurance executives say their organization has deployed generative AI somewhere, yet only 7% of insurers have scaled it and just 8% of independent agents use AI regularly and strategically.',
  },
  {
    lead: 'Evaluate on seven criteria:',
    rest: ' end-to-end workflow coverage, measured accuracy, real portal execution, security and data-use policies, fit with your systems, human oversight, and insurance-specific depth.',
  },
  {
    lead: 'End-to-end beats point solutions.',
    rest: ' Tools that automate one step just move the bottleneck. Cooper completes the entire workflow, intake to renewal, with 99.2% form-fill accuracy and quotes reaching clients 4x faster.',
  },
]

/* ── FAQ, mirrored from the paper's FAQ section, used for FAQPage JSON-LD
   (eligible for the FAQ rich result and read by answer engines). ── */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What can AI actually do for an insurance agency today?',
    a: 'Production-ready AI platforms read intake documents (dec pages, loss runs, applications), fill ACORD forms and carrier supplements, submit risks through live carrier portals in parallel, normalize quotes into side-by-side comparisons, generate client proposals, and monitor renewals. The best tools, like Cooper, cover this entire chain rather than a single step.',
  },
  {
    q: 'Will AI replace insurance agents?',
    a: 'No. The tools replacing keystrokes are not replacing judgment. Coverage advice, carrier relationships, negotiation, and client trust remain human work. AI removes the administrative load around them, which is why it lands hardest as a response to the industry\'s staffing shortage rather than as a substitute for producers.',
  },
  {
    q: 'What should an agency look for when evaluating AI tools?',
    a: 'Seven things: end-to-end workflow coverage, measured real-world accuracy, the ability to execute inside carrier portals (not just fill PDFs), security and data-use commitments (SOC 2 Type II, HIPAA, no training on your data), fit with your existing AMS and templates, human review points, and insurance-specific depth.',
  },
  {
    q: 'How is Cooper different from other insurance AI tools?',
    a: 'Cooper completes the end-to-end workflow, from intake to renewal, rather than automating one step. It fills forms with 99.2% accuracy, drives live carrier portals to market a risk across every carrier in parallel, flags coverage differences and silent downgrades across quotes, delivers proposals in your agency\'s templates, and reaches first quote 4x faster.',
  },
  {
    q: 'Is client data safe with an AI platform like Cooper?',
    a: 'Look for independent attestation rather than assurances. Cooper is SOC 2 Type II certified, HIPAA compliant, and contractually commits to no model training on customer data. Those are the three commitments any agency should require of any AI vendor.',
  },
]

const PAGE_PATH = '/resources/white-paper'
export const PAGE_TITLE = 'AI for Insurance Agents: How to Evaluate Tools'
export const PAGE_DESC =
  'Why the moment to adopt AI is now, and how to evaluate the tools that actually finish the job, from intake to renewal. A Cooper white paper for insurance agents and brokers.'

function jsonLd() {
  const url = absoluteUrl(PAGE_PATH)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: 'The AI Advantage for Insurance Agents',
        description: PAGE_DESC,
        url,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        author: { '@type': 'Organization', name: 'Cooper', url: `${SITE_ORIGIN}/` },
        publisher: { '@type': 'Organization', name: 'Cooper', url: `${SITE_ORIGIN}/` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'White Paper', item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

/* ── The unlock. Sits beside the takeaways on desktop and directly under them
   on mobile, so the CTA is on the first screen either way. ── */
function UnlockCta({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="rounded-[16px] border border-accent-orange/20 bg-accent-orange/[0.06] px-[24px] py-[22px]">
      <p className="font-sans text-[15.5px] leading-[1.55] text-dark/70">
        We read the surveys, traced every figure back to its primary source, and
        sat with the agencies doing this work. What we found is in the twelve
        minutes below.
      </p>
      <button
        type="button"
        onClick={onUnlock}
        className="mt-[18px] inline-flex w-full items-center justify-center gap-[8px] rounded-[6px] bg-dark px-[24px] py-[13px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02]"
      >
        <LockSimple size={15} weight="bold" /> Unlock to Read
      </button>
    </div>
  )
}

export default function WhitePaperPage() {
  const [unlocked, setUnlocked] = useState(false)
  useSeo({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    canonicalPath: PAGE_PATH,
    jsonLd: jsonLd(),
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ══════════════ HERO ══════════════ */}
      <section className="bg-cream pt-[120px] pb-[56px]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-[85px]">
          <div className="max-w-[860px]">
            <span className="mb-[14px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-accent-orange">
              White Paper
            </span>
            <h1
              className="mb-[20px] animate-fade-blur-in font-serif text-[40px] leading-[1.08] tracking-[-1px] text-dark md:text-[54px]"
              style={{ animationDelay: '0.05s' }}
            >
              The AI Advantage for Insurance Agents
            </h1>
            <p
              className="mb-[20px] max-w-[680px] animate-fade-blur-in font-sans text-[17px] leading-[1.55] text-dark/60"
              style={{ animationDelay: '0.08s' }}
            >
              Why the moment to adopt is now, and how to evaluate tools that actually finish the job, from intake to renewal.
            </p>
            <div
              className="flex items-center gap-[10px] animate-fade-blur-in font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] text-dark/40"
              style={{ animationDelay: '0.1s' }}
            >
              <span>July 2026</span>
              <span className="text-dark/20">•</span>
              <span>10 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ BODY ══════════════ */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-[85px] py-[56px] lg:py-[72px]">
        <article className="max-w-[1040px]">
          {/* Takeaways and the unlock sit side by side on desktop; on mobile the
              takeaways condense and the CTA follows immediately, so both land
              on the first screen. */}
          <div className="grid gap-[20px] lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="rounded-[20px] border border-dark/[0.09] bg-white/50 p-[24px] md:p-[32px]">
            <p className="mb-[20px] font-grotesk text-[12px] font-medium uppercase tracking-[1.6px] text-accent-orange">
              Key takeaways
            </p>
            <ul className="space-y-[12px]">
              {TAKEAWAYS.map((t) => (
                <li key={t.lead} className="flex gap-[12px]">
                  <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent-orange" />
                  <p className="font-sans text-[15px] leading-[1.5] text-dark/70">
                    <span className="font-medium text-dark">{t.lead}</span>
                    {/* Condensed on mobile: the lead sentence carries the point,
                        and the full clause is there from sm up. */}
                    <span className="hidden sm:inline">{t.rest}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-[96px]">
            <UnlockCta onUnlock={() => setUnlocked(true)} />
          </div>
          </div>

          {/* The paper — blurred until unlocked */}
          <div className={`mt-[24px] max-w-[820px] ${unlocked ? '' : 'pointer-events-none select-none blur-[6px] saturate-50'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
                h2: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
                h3: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                h4: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                p: ({ children }) => <p className={pCls}>{children}</p>,
                ul: ({ children }) => <ul className={`${listCls} list-disc`}>{children}</ul>,
                ol: ({ children }) => <ol className={`${listCls} list-decimal`}>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                strong: ({ children }) => <strong className="font-medium text-dark">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                  <a href={href} className={linkCls} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-[36px] border-dark/[0.08]" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>

      {/* ══════════════ CLOSING CTA — contained rounded card
          (same treatment as the Integrations / Careers banner) ══════════════ */}
      <section className="bg-cream-light">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-[85px] py-[48px]">
          <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
            <img
              src="/images/about/careers-cta-bg.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 flex h-full flex-col items-start gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-[72px] lg:py-0">
              <div className="flex-1">
                <span className="mb-[16px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
                  Get started
                </span>
                <h2
                  className="mb-[36px] animate-fade-blur-in font-serif text-[36px] leading-[1.15] text-white lg:text-[42px]"
                  style={{ animationDelay: '0.1s' }}
                >
                  See what end-to-end looks like on your book
                </h2>
                <Link
                  to="/demo"
                  className="inline-block w-fit animate-fade-blur-in rounded-[6px] bg-white px-[28px] py-[12px] font-sans text-[15px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
                  style={{ animationDelay: '0.25s' }}
                >
                  Request a Demo
                </Link>
              </div>
              <div className="flex w-full flex-1 lg:justify-end">
                <p
                  className="max-w-full animate-fade-blur-in font-sans text-[15px] leading-[24.75px] text-white/80 lg:max-w-[380px]"
                  style={{ animationDelay: '0.2s' }}
                >
                  We'll run one of your real submissions through Cooper in a live walkthrough, intake to renewal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
