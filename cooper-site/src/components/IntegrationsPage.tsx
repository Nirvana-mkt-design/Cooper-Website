/* ──────────────────────────────────────────────────────────────
   Integrations — dedicated page.

   Built on Amar's "Integration Directory" HTML as the base (hero +
   featured stacks + the logo grid), then extended to answer the real
   questions a prospect asks about connecting Cooper to their stack:
     · Which systems does it connect to?   → Directory + "Fits your stack"
     · How does the data actually move?     → "How it works" (3 steps)
     · Is my data safe?                     → "Secure by default"
     · What's required / how long?          → "Live in days"
     · What do I get out of it?             → "What changes"
   Visual language matches the Home integrations section and the site
   design system (serif / grotesk / cream / accent-orange).
─────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Plugs, Waveform, ArrowsClockwise, EnvelopeSimple, Table,
  Browser, Database, FileText, ShieldCheck, LockKey, Detective,
  Prohibit, ArrowRight,
} from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import CarrierWall from './CarrierWall'
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
   DATA
   ══════════════════════════════════════════════════════════════ */

/* Featured "insurance stacks" — the systems teams live in all day. */
type Featured = { name: string; cat: string; img: string }
const FEATURED: Featured[] = [
  { name: 'Applied Epic', cat: 'Agency management', img: '/images/logo-epic.webp' },
  { name: 'AMS360', cat: 'Agency management', img: '/images/logo-ams360.webp' },
  { name: 'Salesforce', cat: 'CRM', img: '/images/logo-salesforce.webp' },
  { name: 'Microsoft Outlook', cat: 'Email', img: '/images/logo-outlook.webp' },
  { name: 'Microsoft Teams', cat: 'Collaboration', img: '/images/logo-teams.png' },
]

/* The wider directory. Marks are either a logo image or a coloured
   monogram tile (matching Amar's file for systems without a local asset). */
type Cell =
  | { name: string; img: string }
  | { name: string; mono: string; color: string }
const DIRECTORY: Cell[] = [
  { name: 'EZLynx', img: '/images/chips/ezlynx.png' },
  { name: 'HawkSoft', img: '/images/logo-hawksoft.webp' },
  { name: 'Guidewire', img: '/images/logo-guidewire.svg' },
  { name: 'Gmail', img: '/images/logo-gmail.webp' },
  { name: 'Google Docs', img: '/images/logo-docs.webp' },
  { name: 'SharePoint', img: '/images/logo-sharepoint.webp' },
  { name: 'OneDrive', img: '/images/logo-onedrive.png' },
  { name: 'Dropbox', img: '/images/logo-dropbox.webp' },
  { name: 'Slack', img: '/images/logo-slack.webp' },
  { name: 'HubSpot', img: '/images/chips/hubspot.png' },
  { name: 'Excel', img: '/images/logo-excel.svg' },
  { name: 'PowerPoint', img: '/images/logo-powerpoint.svg' },
  { name: 'Adobe PDF', img: '/images/logo-adobepdf.svg' },
  { name: 'Google Slides', img: '/images/logo-gslides.svg' },
  { name: 'Google Sheets', img: '/images/logo-gsheets.svg' },
  { name: 'Zapier', img: '/images/logo-zapier.svg' },
  { name: 'PostgreSQL', img: '/images/logo-postgresql.svg' },
  { name: 'ClickUp', img: '/images/logo-clickup.svg' },
  // Long-tail insurance tools with no clean public brand SVG — kept as
  // coloured monogram tiles (same as Amar's original file).
  { name: 'Origami Risk', mono: 'OR', color: '#1FA37C' },
  { name: 'Loss Run Pro', mono: 'LR', color: '#CF6A2E' },
  { name: 'Snapsheet', mono: 'S', color: '#0FB5A5' },
]

/* How the data actually moves — the question the logo wall never answers. */
const STEPS = [
  {
    icon: Plugs,
    title: 'Connect',
    body: 'Link Cooper to the systems you already run on, your inbox, AMS, shared drives, and carrier portals. Secure OAuth or keys, so your team never learns a new login.',
  },
  {
    icon: Waveform,
    title: 'Read & structure',
    body: 'Cooper reads documents where they live, ACORDs, loss runs, policies, spreadsheets, in any format, and turns them into structured, checked data.',
  },
  {
    icon: ArrowsClockwise,
    title: 'Sync back',
    body: 'Results flow back into your system of record. Cooper updates your AMS or CRM and files documents automatically, so nothing gets re-keyed by hand.',
  },
]

/* "Does it fit my stack?" — the six surfaces named in the brief, with
   what Cooper actually does on each. */
const SURFACES = [
  { icon: EnvelopeSimple, title: 'Email', body: 'Watches shared inboxes, reads submissions and attachments, and routes them to the right workflow.', tags: ['Outlook', 'Gmail'] },
  { icon: Table, title: 'Excel & sheets', body: 'Bordereaux, schedules, and loss runs in any layout, parsed, reconciled, and kept clean.', tags: ['Excel', 'Google Sheets'] },
  { icon: Browser, title: 'Carrier portals', body: 'Navigates carrier and MGA portals to pull quotes, documents, and status, no copy-paste.', tags: ['Portals', 'Downloads'] },
  { icon: Database, title: 'AMS / CRM', body: 'Two-way sync with your system of record, so records stay current without double entry.', tags: ['Applied Epic', 'AMS360', 'Salesforce'] },
  { icon: FileText, title: 'ACORD forms', body: 'Reads and generates ACORD forms, prefilled from the data Cooper already has on the account.', tags: ['ACORD 125', '140', '25'] },
  { icon: FileText, title: 'Loss runs', body: 'Extracts and normalizes loss runs from any carrier format into one consistent, comparable view.', tags: ['Any carrier', 'Any format'] },
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

/* "What's required / how long?" */
const SETUP = [
  { step: '01', title: 'Connect in one session', body: 'Most teams are live in days, not a quarter. No servers to stand up, no data migration.' },
  { step: '02', title: 'Cooper maps your workflow', body: 'We tune Cooper to how your team actually works, your forms, your carriers, your rules.' },
  { step: '03', title: 'Keep your process', body: 'No rip and replace. Cooper works alongside the tools you already have, not instead of them.' },
]

/* "What do I get out of it?" */
const OUTCOMES = [
  { stat: 'No', unit: 'double entry', body: 'Data flows both ways, so nobody re-keys the same submission into three systems.' },
  { stat: 'Fewer', unit: 'errors', body: 'Every document is read and checked automatically, catching what tired eyes miss.' },
  { stat: 'Hours', unit: 'back each week', body: 'The manual pulling, filing, and formatting disappears, so your team works the accounts.' },
]

/* ══════════════════════════════════════════════════════════════
   SMALL PIECES
   ══════════════════════════════════════════════════════════════ */

function DirectoryMark({ item, size }: { item: Cell; size: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'w-[60px] h-[60px] rounded-[15px]' : 'w-[36px] h-[36px] rounded-[9px]'
  if ('img' in item) {
    return (
      <span className={`grid place-items-center overflow-hidden bg-white border border-dark/[0.06] ${box} ${size === 'lg' ? 'p-[11px]' : 'p-[6px]'}`}>
        <img src={item.img} alt="" loading="lazy" className="max-w-full max-h-full object-contain" />
      </span>
    )
  }
  return (
    <span
      className={`grid place-items-center font-grotesk font-bold text-white ${box} ${size === 'lg' ? 'text-[18px]' : 'text-[12px]'}`}
      style={{ background: item.color }}
    >
      {item.mono}
    </span>
  )
}

function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="max-w-[680px]">
      <p className={`mb-[16px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] ${dark ? 'text-accent-orange' : 'text-accent-orange'}`}>
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

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function IntegrationsPage() {
  useSeo({
    title: 'Integrations — Cooper',
    description:
      'Cooper connects to the systems insurance teams already use, email, Excel, carrier portals, AMS/CRM, ACORD forms, and loss runs. See what connects, how the data moves, and how it stays secure.',
    canonicalPath: '/integrations',
    jsonLd: pageJsonLd({
      name: 'Integrations',
      path: '/integrations',
      description: 'How Cooper connects to the tools insurance teams already use.',
    }),
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />

      {/* ══════════════ HERO — full-viewport dark w/ background image
          (same treatment as the About hero) ══════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark" />
        <img
          src="/images/integrations/hero-bg.jpg"
          alt=""
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
              Works with the tools you already use
            </h1>
          </div>

          {/* Bottom — count + CTAs (left), lede (right) */}
          <div className="mt-[64px] flex flex-col gap-[32px] lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-[24px] inline-flex items-center gap-[9px] font-grotesk text-[14px] font-medium text-cream-light">
                <span className="rounded-full bg-accent-orange px-[11px] py-[3px] text-[13px] text-cream-light">20+</span>
                integrations and counting
              </div>
              <div className="flex flex-wrap items-center gap-[14px]">
                <Link
                  to="/demo"
                  className="inline-flex items-center rounded-[6px] bg-cream-light px-[22px] py-[12px] font-sans text-[15px] text-dark no-underline transition-all duration-200 hover:scale-[1.03]"
                >
                  Request a Demo
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center rounded-[6px] border border-cream-light/30 px-[22px] py-[12px] font-sans text-[15px] text-cream-light no-underline transition-colors hover:bg-cream-light/10"
                >
                  See how it works
                </a>
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

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" className="scroll-mt-[90px] px-5 md:px-10 lg:px-[62px] py-[56px] lg:py-[80px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="How it works"
              title="Connected in three steps, then it just runs"
              sub="Cooper isn't a folder of one-off exports. It reads and writes across your systems continuously, so the data moves itself."
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
                <div
                  key={f.name}
                  className="rounded-[16px] border border-dark/[0.09] bg-cream-light p-[24px_16px] text-center transition-transform duration-150 hover:-translate-y-[3px] hover:shadow-[0_18px_40px_-24px_rgba(30,26,21,0.5)]"
                >
                  <span className="mx-auto mb-[15px] grid h-[60px] w-[60px] place-items-center overflow-hidden rounded-[15px] border border-dark/[0.06] bg-white p-[11px]">
                    <img src={f.img} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  </span>
                  <div className="font-sans text-[15px] font-semibold text-dark">{f.name}</div>
                  <div className="mt-[3px] font-sans text-[12.5px] text-dark/50">{f.cat}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Full grid */}
          <Reveal delay={120}>
            <p className="mb-[22px] mt-[52px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-dark/40">
              And many more
            </p>
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-4">
              {DIRECTORY.map((c) => (
                <div
                  key={c.name}
                  className="group flex items-center gap-[12px] rounded-[12px] border border-dark/[0.09] bg-cream-light px-[14px] py-[12px] transition-colors hover:border-accent-orange"
                >
                  <DirectoryMark item={c} size="sm" />
                  <span className="font-sans text-[14px] font-medium text-dark">{c.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-[26px] font-sans text-[15px] text-dark/55">
              Don't see your system?{' '}
              <a
                href="mailto:support@askcooper.ai?subject=Integration%20request"
                className="inline-flex items-center gap-1 font-semibold text-accent-orange no-underline hover:underline"
              >
                Tell us what to connect <ArrowRight size={15} weight="bold" />
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ FITS YOUR STACK ══════════════ */}
      <section className="bg-cream px-5 md:px-10 lg:px-[62px] py-[64px] lg:py-[88px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="Fits your stack"
              title="Cooper meets the work where it already happens"
              sub="It doesn't ask your team to change how they work. It plugs into the surfaces they touch every day."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[44px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
              {SURFACES.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="rounded-[16px] border border-dark/[0.08] bg-cream-light p-[26px]">
                    <span className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[10px] bg-dark/[0.05] text-dark/70">
                      <Icon size={22} weight="regular" />
                    </span>
                    <h3 className="mb-[8px] font-serif text-[20px] text-dark">{s.title}</h3>
                    <p className="mb-[16px] font-sans text-[14.5px] leading-[1.55] text-dark/55">{s.body}</p>
                    <div className="flex flex-wrap gap-[6px]">
                      {s.tags.map((t) => (
                        <span key={t} className="rounded-full border border-dark/10 px-[10px] py-[3px] font-grotesk text-[11px] font-medium uppercase tracking-[0.6px] text-dark/50">
                          {t}
                        </span>
                      ))}
                    </div>
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
              title="Is my data safe? Yes, and here's how"
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
                  <img src={b.icon} alt="" className="mb-[14px] h-[48px] w-[48px] object-contain opacity-90" />
                  <span className="text-center font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] text-cream-light/80">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ SETUP / TIME TO VALUE ══════════════ */}
      <section className="px-5 md:px-10 lg:px-[62px] py-[64px] lg:py-[88px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="Live in days"
              title="What's required, and how long it takes"
              sub="No IT project. No new system for your team to learn. Cooper connects to what you already have."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[44px] grid gap-[16px] md:grid-cols-3">
              {SETUP.map((s) => (
                <div key={s.step} className="rounded-[16px] border border-dark/[0.09] bg-white/40 p-[28px]">
                  <div className="mb-[16px] font-serif text-[34px] leading-none text-accent-orange">{s.step}</div>
                  <h3 className="mb-[8px] font-serif text-[20px] text-dark">{s.title}</h3>
                  <p className="font-sans text-[15px] leading-[1.55] text-dark/55">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ OUTCOMES ══════════════ */}
      <section className="bg-cream px-5 md:px-10 lg:px-[62px] py-[64px] lg:py-[88px]">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionHead
              eyebrow="What changes"
              title="Fewer re-keys, fewer errors, hours back"
              sub="When your systems talk to each other, the busywork between them disappears."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[44px] grid gap-[16px] md:grid-cols-3">
              {OUTCOMES.map((o) => (
                <div key={o.unit} className="rounded-[16px] border border-dark/[0.08] bg-cream-light p-[30px]">
                  <div className="font-serif text-[36px] leading-[1.05] text-dark">
                    {o.stat} <span className="text-[20px] text-dark/45">{o.unit}</span>
                  </div>
                  <p className="mt-[14px] font-sans text-[15px] leading-[1.55] text-dark/55">{o.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ CUSTOMER WALL (visual consistency w/ Home) ══════════════ */}
      <section className="px-5 md:px-10 lg:px-[62px] py-[40px] lg:py-[56px]">
        <div className="mx-auto max-w-[1440px]">
          <CarrierWall />
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden bg-dark px-5 md:px-10 lg:px-[62px] py-[72px] lg:py-[96px]">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <img
            src="/images/cooper-icon.svg"
            alt=""
            className="mb-[24px] h-[46px] w-[46px]"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <h2 className="font-serif text-[32px] leading-[1.18] text-cream-light md:text-[38px]">
            See Cooper connect to your stack
          </h2>
          <p className="mt-[18px] max-w-[480px] font-sans text-[16.5px] leading-[1.55] text-cream-light/60">
            We'll map Cooper to the exact systems your team uses, with your own data, in a live walkthrough.
          </p>
          <Link
            to="/demo"
            className="mt-[30px] inline-flex items-center rounded-[6px] bg-white px-[28px] py-[13px] font-sans text-[16px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
          >
            Request a Demo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
