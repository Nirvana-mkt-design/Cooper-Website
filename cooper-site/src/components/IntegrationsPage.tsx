/* ──────────────────────────────────────────────────────────────
   Integrations — dedicated page.

   Built on Amar's "Integration Directory" HTML as the base (hero +
   featured stacks + the logo grid), then extended to answer the real
   questions a prospect asks about connecting Cooper to their stack:
     · Which systems does it connect to?   → Directory
     · How does the data actually move?     → "How it works" (3 steps)
     · Is my data safe?                     → "Secure by default"
     · What do I get out of it?             → "What changes"
   Clicking any integration opens a full detail modal (two-column,
   Intercom-style); the directory also lets prospects request a system
   we don't list yet.
   Visual language matches the Home integrations section and the site
   design system (serif / grotesk / cream / accent-orange).
─────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plugs, ArrowsClockwise, FileText, ShieldCheck, LockKey, Detective,
  Prohibit, ArrowRight, Plus, Check,
} from '@phosphor-icons/react'
import Navbar from './Navbar'
import ModalShell from './ModalShell'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

/* ── Scroll reveal (same pattern as the other pages) ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return (
    <div ref={ref} className="reveal-section" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   INTEGRATION DATA

   Each integration references a category template (below) that
   generates its copy from the system name, so the detail modal stays
   rich without hand-writing every field 26 times. Marks are a logo
   image or a coloured monogram tile (for long-tail insurance tools
   with no clean public brand SVG).
   ══════════════════════════════════════════════════════════════ */

type Tpl = {
  cat: string
}

const TPL: Record<string, Tpl> = {
  ams: { cat: 'Agency management' },
  crm: { cat: 'CRM' },
  email: { cat: 'Email' },
  collab: { cat: 'Collaboration' },
  docs: { cat: 'Documents' },
  sheets: { cat: 'Spreadsheets' },
  slides: { cat: 'Presentations' },
  core: { cat: 'Core system' },
  automation: { cat: 'Automation' },
  data: { cat: 'Data' },
  pm: { cat: 'Project management' },
  risk: { cat: 'Risk management' },
  lossrun: { cat: 'Loss runs' },
  claims: { cat: 'Claims' },
}

type Base = {
  name: string
  tpl: keyof typeof TPL
  img?: string
  featured?: boolean
  /* Amar's launch copy — the brief summary shown in the featured modal. */
  summary?: string
}

const INTEGRATIONS: Base[] = [
  /* ── Featured five (copy provided by Amar for launch) ── */
  { name: 'Applied Epic', tpl: 'ams', featured: true, img: '/images/logo-epic.webp',
    summary: 'Cooper looks up accounts, reads policy history, logs activities under your codes, and pulls renewal dates.' },
  { name: 'AMS360', tpl: 'ams', featured: true, img: '/images/logo-ams360.webp',
    summary: 'Cooper reads client records, policy terms, coverage history, prior premiums and expiration dates, and writes back directly.' },
  { name: 'Salesforce', tpl: 'crm', featured: true, img: '/images/logo-salesforce.webp',
    summary: 'Cooper reads pipeline status and account ownership, tracks renewal dates, and syncs custom fields back to Salesforce.' },
  { name: 'Microsoft Outlook', tpl: 'email', featured: true, img: '/images/logo-outlook.webp',
    summary: 'Cooper captures the intake, extracts attachments, surfaces tasks, and replies with the completed package.' },
  { name: 'OneDrive', tpl: 'docs', featured: true, img: '/images/logo-onedrive.png',
    summary: 'Cooper reads the correct files, makes decisions, and writes forms back directly to OneDrive.' },

  /* ── The wider directory ── */
  { name: 'EZLynx', tpl: 'ams', img: '/images/chips/ezlynx.png' },
  { name: 'HawkSoft', tpl: 'ams', img: '/images/logo-hawksoft.webp' },
  { name: 'Guidewire', tpl: 'core', img: '/images/logo-guidewire.svg' },
  { name: 'Origami Risk', tpl: 'risk', img: '/images/logo-origami.webp' },
  { name: 'HubSpot', tpl: 'crm', img: '/images/chips/hubspot.png' },
  { name: 'SharePoint', tpl: 'docs', img: '/images/logo-sharepoint.webp' },
  { name: 'Microsoft Teams', tpl: 'collab', img: '/images/logo-teams.png' },
  { name: 'Dropbox', tpl: 'docs', img: '/images/logo-dropbox.webp' },
  { name: 'Slack', tpl: 'collab', img: '/images/logo-slack.webp' },
  { name: 'Google Docs', tpl: 'docs', img: '/images/logo-docs.webp' },
  { name: 'Excel', tpl: 'sheets', img: '/images/logo-excel.svg' },
  { name: 'PowerPoint', tpl: 'slides', img: '/images/logo-powerpoint.svg' },
  { name: 'Adobe PDF', tpl: 'docs', img: '/images/logo-adobepdf.svg' },
  { name: 'Google Sheets', tpl: 'sheets', img: '/images/logo-gsheets.svg' },
  { name: 'Zapier', tpl: 'automation', img: '/images/logo-zapier.svg' },
  { name: 'PostgreSQL', tpl: 'data', img: '/images/logo-postgresql.svg' },
  { name: 'ClickUp', tpl: 'pm', img: '/images/logo-clickup.svg' },
  { name: 'Gmail', tpl: 'email', img: '/images/logo-gmail.webp' },
  { name: 'Loss Run Pro', tpl: 'lossrun', img: '/images/logo-lossrunpro.webp' },
  { name: 'Snapsheet', tpl: 'claims', img: '/images/logo-snapsheet.webp' },
]

/* Fully-expanded integration used by cards + modal. */
type Integration = Base & {
  cat: string
}
function expand(b: Base): Integration {
  return { ...b, cat: TPL[b.tpl].cat }
}

const ALL = INTEGRATIONS.map(expand)
const FEATURED = ALL.filter((i) => i.featured)
const DIRECTORY = ALL.filter((i) => !i.featured)

/* Small marks for the hero "and counting" queue. */
const STREAM_LOGOS = [
  '/images/logo-outlook.webp',
  '/images/logo-salesforce.webp',
  '/images/logo-slack.webp',
  '/images/logo-excel.svg',
  '/images/logo-gsheets.svg',
  '/images/logo-zapier.svg',
  '/images/logo-teams.png',
  '/images/logo-dropbox.webp',
  '/images/logo-sharepoint.webp',
  '/images/chips/hubspot.png',
]

/* How the data actually moves — the question the logo wall never answers. */
const STEPS = [
  {
    icon: Plugs,
    title: 'Connect',
    body: 'One click to connect Cooper to your inbox, AMS, CRM, and data stores.',
  },
  {
    icon: FileText,
    title: 'Read & structure',
    body: 'Cooper reads documents where they live, ACORDs, loss runs, policies, spreadsheets, in any format, and turns them into structured, actionable data.',
  },
  {
    icon: ArrowsClockwise,
    title: 'Sync back',
    body: 'Results flow back directly into your system of record. Cooper updates your AMS or CRM and files documents automatically. Nothing gets re-entered by hand.',
  },
]

/* Security guarantees. Badges mirror the Home Security & Compliance strip. */
const GUARANTEES = [
  { icon: LockKey, title: 'Your data stays put', body: 'Cooper reads and writes inside your systems with the permissions you grant. Nothing is copied out to live somewhere else.' },
  { icon: ShieldCheck, title: 'Encrypted end to end', body: 'Everything is encrypted in transit and at rest, with SOC 2 Type II controls and HIPAA-compliant handling.' },
  { icon: Prohibit, title: 'Never trains on your data', body: 'Your documents and records are never used to train models, yours or anyone else\'s.' },
  { icon: Detective, title: 'Full visibility', body: 'Role-based access and complete audit logs mean you always know who did what, and when.' },
]
const BADGES = [
  { label: 'SOC 2 Type ii', icon: '/images/icon-soc2.webp' },
  { label: 'No model training', icon: '/images/icon-no-training.webp' },
  { label: 'HIPAA Compliant', icon: '/images/icon-hipaa.webp' },
  { label: 'RBAC & audit logs', icon: '/images/icon-audit.webp' },
]

/* ══════════════════════════════════════════════════════════════
   SMALL PIECES
   ══════════════════════════════════════════════════════════════ */

function Mark({ item, size }: { item: Base; size: 'sm' | 'lg' }) {
  const box =
    size === 'lg' ? 'w-[60px] h-[60px] rounded-[15px]' : 'w-[36px] h-[36px] rounded-[9px]'
  const pad = size === 'lg' ? 'p-[11px]' : 'p-[6px]'
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden bg-white border border-dark/[0.06] ${box} ${pad}`}>
      <img src={item.img} alt="" loading="lazy" className="max-w-full max-h-full object-contain" />
    </span>
  )
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/* ── Count-up number ("20+") — eases from 0 to the target on mount ── */
function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Jump to the final value on the next frame (not synchronously in the
      // effect body) so reduced-motion users see the number without animating.
      const jump = requestAnimationFrame(() => setN(to))
      return () => cancelAnimationFrame(jump)
    }
    let raf = 0
    let start = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / duration)
      setN(Math.round(ease(p) * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    // wait for the hero's fade-blur-in to settle so the count reads crisp
    const t = window.setTimeout(() => { raf = requestAnimationFrame(tick) }, 1150)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [to, duration])
  return <span className="tabular-nums">{n}+</span>
}

/* ── Hero "and counting" queue ──
   On each tick a new logo joins on the LEFT, the row slides right, and the
   oldest drops off the RIGHT.

   The row is a fixed set of slots and only the track's `transform` animates —
   nothing resizes. Each tick shifts every slot's logo one place right and, in
   the same paint, parks the track one pitch to the left so the shift is
   invisible; sliding the track back to 0 is what the eye actually sees. Keeping
   the row's width constant is also what holds the "+" overlap steady. */
const QUEUE_SLOTS = 6 // circles visible at rest
const QUEUE_SIZE = 30 // circle diameter
const QUEUE_OVERLAP = 9 // how far each circle tucks under its left neighbour
const QUEUE_PITCH = QUEUE_SIZE - QUEUE_OVERLAP

/** Logo `n` places back from the newest, wrapping round the list. */
const queueLogo = (n: number) => STREAM_LOGOS[((n % STREAM_LOGOS.length) + STREAM_LOGOS.length) % STREAM_LOGOS.length]

function LogoQueue() {
  // `head` counts ticks; slot i holds the logo that arrived i ticks ago.
  const [head, setHead] = useState(0)
  const [slid, setSlid] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const iv = setInterval(() => {
      // Background tabs pause rAF but keep firing this, so the track would
      // never un-park and the logos would skip several slots on return.
      if (document.hidden) return
      // Batched into one render: the logos move a slot right and the track
      // re-parks at -pitch with no transition, which cancels the move out.
      setHead((h) => h + 1)
      setSlid(false)
    }, 2000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    // Two frames so the parked position paints before the slide starts.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSlid(true)))
    return () => cancelAnimationFrame(id)
  }, [head])

  return (
    <div className="hidden items-center sm:flex" aria-hidden>
      <div
        className="relative overflow-hidden"
        style={{
          width: QUEUE_SLOTS * QUEUE_PITCH + QUEUE_OVERLAP,
          maskImage: 'linear-gradient(90deg, transparent, #000 16%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 16%, #000 100%)',
        }}
      >
        {/* One slot more than fits: it is the circle on its way out. */}
        <div
          className="flex w-max"
          style={{
            transform: `translate3d(${slid ? 0 : -QUEUE_PITCH}px,0,0)`,
            transition: slid ? 'transform 0.62s cubic-bezier(0.22,0.75,0.3,1)' : 'none',
          }}
        >
          {Array.from({ length: QUEUE_SLOTS + 1 }, (_, i) => (
            <span
              key={i}
              className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-cream-light/25 bg-cream-light shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)]"
              style={{ width: QUEUE_SIZE, height: QUEUE_SIZE, marginRight: -QUEUE_OVERLAP }}
            >
              <img src={queueLogo(head - i)} alt="" className="h-[16px] w-[16px] min-w-[16px] object-contain" />
            </span>
          ))}
        </div>
      </div>
      <span
        className="relative z-10 -ml-[9px] grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-accent-orange text-cream-light"
        style={{ animation: 'stream-pulse 2.4s ease-in-out infinite' }}
      >
        <Plus size={14} weight="bold" />
      </span>
    </div>
  )
}

function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="max-w-[680px]">
      <p className="mb-[16px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-accent-orange">
        {eyebrow}
      </p>
      <h2 className={`font-serif text-[30px] leading-[1.14] md:text-[38px] lg:text-[42px] ${dark ? 'text-cream-light' : 'text-dark'}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-[18px] font-sans text-[16.5px] leading-[1.55] ${dark ? 'text-cream-light/55' : 'text-dark/55'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ── Integration detail modal — compact card with Amar's launch copy. ── */
function IntegrationModal({ item, onClose }: { item: Integration; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} labelledBy="integ-modal-title">
      <div className="p-[28px] sm:p-[34px]">
        {/* Header */}
        <div className="flex items-start gap-[16px] pr-[40px]">
          <Mark item={item} size="lg" />
          <div className="pt-[3px]">
            <h3 id="integ-modal-title" className="font-serif text-[24px] leading-[1.1] text-dark">
              {item.name}
            </h3>
            <div className="mt-[8px] flex flex-wrap items-center gap-[10px]">
              <span className="rounded-full border border-dark/10 px-[10px] py-[3px] font-grotesk text-[11px] font-medium uppercase tracking-[0.8px] text-dark/50">
                {item.cat}
              </span>
              <span className="inline-flex items-center gap-[5px] font-grotesk text-[11.5px] font-medium uppercase tracking-[0.8px] text-accent-orange">
                <Check size={13} weight="bold" /> Works with Cooper
              </span>
            </div>
          </div>
        </div>

        {/* Amar's summary */}
        <p className="mt-[22px] font-sans text-[16px] leading-[1.6] text-dark/70">
          {item.summary}
        </p>

        {/* CTA */}
        <div className="mt-[28px] flex flex-col gap-[12px] border-t border-dark/[0.08] pt-[22px] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[14px] leading-[1.5] text-dark/50">
            See Cooper connect to {item.name} with your own data.
          </p>
          <Link
            to="/demo"
            className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-dark px-[22px] py-[12px] font-sans text-[15px] font-medium text-cream-light no-underline transition-all duration-200 hover:scale-[1.03]"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </ModalShell>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function IntegrationsPage() {
  useSeo({
    title: 'Integrations — Cooper',
    description:
      'Cooper connects to the systems insurance teams already use: email, Excel, carrier portals, AMS/CRM, ACORD forms, and loss runs. See what connects, how the data moves, and how it stays secure.',
    canonicalPath: '/integrations',
    jsonLd: pageJsonLd({
      name: 'Integrations',
      path: '/integrations',
      description: 'How Cooper connects to the tools insurance teams already use.',
    }),
  })

  const [active, setActive] = useState<Integration | null>(null)

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />

      {/* ══════════════ HERO — full-viewport dark w/ background image
          (same treatment as the About hero) ══════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark" />
        <img
          src="/images/integrations/hero-bg.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{ backgroundImage: 'linear-gradient(261deg, rgba(186,67,9,0) 37%, rgba(186,67,9,0.36) 53%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(37deg, rgba(0,0,0,0.42) 47%, rgba(0,0,0,0) 77%)' }}
        />

        {/* Top frosted blur — matches the home / about hero navbar area */}
        <div
          className="absolute left-0 right-0 top-0 z-[5] h-[102px] opacity-50"
          style={{ filter: 'blur(39.85px)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))' }}
        />
        <div
          className="absolute left-0 right-0 top-0 z-[5] h-[102px]"
          style={{
            backdropFilter: 'blur(6.3px)',
            WebkitBackdropFilter: 'blur(6.3px)',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between px-5 pb-[80px] pt-[180px] md:px-10 lg:px-[62px] lg:pb-[120px] lg:pt-[200px]">
          {/* Top — eyebrow + headline */}
          <div className="max-w-[720px]">
            <span className="mb-[16px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
              Integrations
            </span>
            <h1
              className="animate-fade-blur-in font-serif text-[44px] leading-[1.05] tracking-[-1.44px] text-cream-light md:text-[60px] md:leading-[1.04] lg:text-[64px] lg:leading-[68px]"
              style={{ animationDelay: '0.1s' }}
            >
              Cooper works with the tools you already use
            </h1>
          </div>

          {/* Bottom — count + CTAs (left), lede (right) */}
          <div className="mt-[64px] flex flex-col gap-[32px] lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
              {/* Live count — big serif stat + logos conveyor
                  (new logo arrives on the left, oldest exits on the right) */}
              <div className="mb-[28px]">
                <div className="font-serif leading-[0.9] text-cream-light text-[52px] lg:text-[64px]">
                  <CountUp to={Math.floor(ALL.length / 5) * 5} />
                </div>
                <div className="mt-[12px] flex items-center gap-[16px]">
                  <span className="font-grotesk text-[14px] font-medium text-cream-light">
                    integrations and counting
                  </span>
                  <LogoQueue />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[14px]">
                <Link
                  to="/demo"
                  className="inline-flex items-center rounded-[6px] bg-cream-light px-[22px] py-[12px] font-sans text-[15px] text-dark no-underline transition-all duration-200 hover:scale-[1.03]"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
            <p
              className="max-w-full animate-fade-blur-in font-sans text-[17.8px] leading-[1.5] text-cream-light lg:max-w-[465px]"
              style={{ animationDelay: '0.3s' }}
            >
              Cooper connects to the systems your team already runs on. No rip and replace, no data migration. Your records stay where they live, and Cooper works across them.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ DIRECTORY (Amar's base) ══════════════ */}
      <section className="px-5 md:px-10 lg:px-[62px] py-[56px] lg:py-[80px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="The directory"
              title="Built for insurance stacks"
              sub="The systems agencies, brokers, MGAs, and carriers run on, ready out of the box."
            />
          </Reveal>

          {/* Featured five */}
          <Reveal delay={80}>
            <div className="mt-[36px] grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-5">
              {FEATURED.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setActive(f)}
                  className="rounded-[16px] border border-dark/[0.09] bg-cream-light p-[24px_16px] text-center transition-transform duration-150 hover:-translate-y-[3px] hover:border-accent-orange hover:shadow-[0_18px_40px_-24px_rgba(30,26,21,0.5)]"
                >
                  <span className="mx-auto mb-[15px] grid h-[60px] w-[60px] place-items-center overflow-hidden rounded-[15px] border border-dark/[0.06] bg-white p-[11px]">
                    <img src={f.img} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  </span>
                  <div className="font-sans text-[15px] font-semibold text-dark">{f.name}</div>
                  <div className="mt-[3px] font-sans text-[12.5px] text-dark/50">{f.cat}</div>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Full grid */}
          <Reveal delay={120}>
            <p className="mb-[22px] mt-[52px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-dark/40">
              And many more
            </p>
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-4">
              {/* Non-clickable — hover effect only (per Amar's launch note). */}
              {DIRECTORY.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-[12px] rounded-[12px] border border-dark/[0.09] bg-cream-light px-[14px] py-[12px] transition-colors hover:border-accent-orange"
                >
                  <Mark item={c} size="sm" />
                  <span className="font-sans text-[14px] font-medium text-dark">{c.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-[26px] font-sans text-[15px] text-dark/55">
              Don't see your system?{' '}
              <Link
                to="/demo?utm_content=integrations-directory"
                className="inline-flex items-center gap-1 font-semibold text-accent-orange no-underline hover:underline"
              >
                Tell us what to connect <ArrowRight size={15} weight="bold" />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" className="scroll-mt-[90px] px-5 md:px-10 lg:px-[62px] py-[56px] lg:py-[80px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="How it works"
              title="Click once to connect your apps, Cooper does the rest"
              sub="Cooper understands where your data lives, pulls the right context for each task, and writes back continuously."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[44px] grid gap-[16px] md:grid-cols-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="relative rounded-[16px] border border-dark/[0.09] bg-white/40 p-[28px]">
                    <div className="mb-[20px] flex items-center gap-[14px]">
                      <span className="grid h-[44px] w-[44px] place-items-center rounded-[11px] bg-accent-orange/10 text-accent-orange">
                        <Icon size={24} weight="regular" />
                      </span>
                      <span className="font-grotesk text-[13px] font-medium text-dark/35">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mb-[10px] font-serif text-[22px] text-dark">{s.title}</h3>
                    <p className="font-sans text-[15px] leading-[1.55] text-dark/55">{s.body}</p>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ SECURITY ══════════════ */}
      <section className="bg-dark px-5 md:px-10 lg:px-[62px] py-[64px] lg:py-[88px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              dark
              eyebrow="Secure by default"
              title="Cooper takes data safety seriously"
              sub="Cooper works inside your systems with the access you grant. Your data never leaves your control, and it is never used to train models."
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-[44px] grid gap-[16px] sm:grid-cols-2">
              {GUARANTEES.map((g) => {
                const Icon = g.icon
                return (
                  <div key={g.title} className="flex gap-[16px] rounded-[16px] border border-cream-light/10 bg-cream-light/[0.03] p-[24px]">
                    <span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[11px] bg-accent-orange/15 text-accent-orange">
                      <Icon size={24} weight="regular" />
                    </span>
                    <div>
                      <h3 className="mb-[6px] font-serif text-[19px] text-cream-light">{g.title}</h3>
                      <p className="font-sans text-[14.5px] leading-[1.55] text-cream-light/50">{g.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          {/* Compliance badges — mirrors the Home strip */}
          <Reveal delay={120}>
            <div className="mt-[28px] flex flex-wrap justify-center gap-3 lg:flex-nowrap lg:gap-0 lg:overflow-hidden lg:rounded-[4px] lg:border lg:border-cream-light/10">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className="flex min-w-[130px] flex-col items-center justify-center px-[16px] py-[26px] lg:min-w-0 lg:flex-1 lg:border-r lg:border-cream-light/10 lg:last:border-r-0"
                >
                  <img src={b.icon} alt="" width={48} height={48} loading="lazy" decoding="async" className="mb-[14px] h-[48px] w-[48px] object-contain opacity-90" />
                  <span className="text-center font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] text-cream-light/80">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ FINAL CTA — contained rounded card
          (same treatment as the About / Careers banner) ══════════════ */}
      <Reveal>
        <section className="bg-cream-light">
          <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-[85px] py-[48px]">
            <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
              {/* Background — orange grain + Cooper logo watermark */}
              <img
                src="/images/about/careers-cta-bg.webp"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Content — 2 col */}
              <div className="relative z-10 flex h-full flex-col items-start gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-[72px] lg:py-0">
                {/* Left — eyebrow + heading + button */}
                <div className="flex-1">
                  <span className="mb-[16px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
                    Get started
                  </span>
                  <h2
                    className="mb-[36px] animate-fade-blur-in font-serif text-[36px] leading-[1.15] text-white md:text-[34px] lg:text-[42px]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    See Cooper connect to your stack
                  </h2>
                  <Link
                    to="/demo"
                    className="inline-block w-fit animate-fade-blur-in rounded-[6px] bg-white px-[28px] py-[12px] font-sans text-[15px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
                    style={{ animationDelay: '0.25s' }}
                  >
                    Request a Demo
                  </Link>
                </div>

                {/* Right — body text */}
                <div className="flex w-full flex-1 lg:justify-end">
                  <p
                    className="max-w-full animate-fade-blur-in font-sans text-[15px] leading-[24.75px] text-white/80 lg:max-w-[380px]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    We'll connect Cooper to your team's exact systems in a live walkthrough.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Footer />

      {/* ══════════════ MODALS ══════════════ */}
      {active && <IntegrationModal item={active} onClose={() => setActive(null)} />}
    </div>
  )
}
