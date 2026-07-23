/* ──────────────────────────────────────────────────────────────
   Integrations — dedicated page.

   Built on Amar's "Integration Directory" HTML as the base (hero +
   featured stacks + the logo grid), then extended to answer the real
   questions a prospect asks about connecting Cooper to their stack:
     · Which systems does it connect to?   → Directory + "Fits your stack"
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
  Plugs, ArrowsClockwise, EnvelopeSimple, Table,
  Browser, Database, FileText, ShieldCheck, LockKey, Detective,
  Prohibit, ArrowRight, Plus, X, Check,
} from '@phosphor-icons/react'
import Navbar from './Navbar'
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

/* Cooper capability keys, kept on each integration for the fuller modal
   (see IntegrationsPage.fullmodal.backup.tsx). */
type CapKey = 'read' | 'sync' | 'automate' | 'secure'

type Tpl = {
  cat: string
  cats: string[]
  tagline: (n: string) => string
  overview: (n: string) => string
  does: (n: string) => string[]
  caps: CapKey[]
}

const TPL: Record<string, Tpl> = {
  ams: {
    cat: 'Agency management',
    cats: ['Agency management', 'System of record', 'Two-way sync'],
    tagline: (n) => `Keep ${n}, your book of record, accurate both ways.`,
    overview: (n) => `Cooper connects directly to ${n}, the system your agency runs on all day. It reads account, policy, and activity data, and writes structured results back, so your records stay current without anyone re-keying them.`,
    does: (n) => [
      `Pulls accounts, policies, and activities straight from ${n}`,
      'Files documents and logs activity automatically',
      'Writes updates back so nothing is entered twice',
    ],
    caps: ['read', 'sync', 'automate', 'secure'],
  },
  crm: {
    cat: 'CRM',
    cats: ['CRM', 'Sales', 'Two-way sync'],
    tagline: (n) => `Keep ${n} current without manual data entry.`,
    overview: (n) => `Cooper syncs with ${n} so your pipeline reflects the real work. Contacts, companies, and deals stay up to date, and activity is logged automatically from what your team actually does, not from someone remembering to type it in.`,
    does: () => [
      'Syncs contacts, companies, and deals',
      'Logs activity from real work, no manual notes',
      'Connects records to the documents behind each deal',
    ],
    caps: ['sync', 'automate', 'secure'],
  },
  email: {
    cat: 'Email',
    cats: ['Email', 'Intake', 'Automations'],
    tagline: () => `Cooper watches your inbox and acts on what lands there.`,
    overview: (n) => `Cooper monitors shared ${n} inboxes, reads submissions, ACORDs, and attachments as they arrive, routes each one to the right workflow, and files the reply, so nothing sits unread and nothing gets lost in a thread.`,
    does: () => [
      'Reads submissions and attachments as they arrive',
      'Routes each email to the right workflow',
      'Drafts and files replies inside your process',
    ],
    caps: ['read', 'automate', 'secure'],
  },
  collab: {
    cat: 'Collaboration',
    cats: ['Collaboration', 'Notifications'],
    tagline: () => `Cooper works where your team already talks.`,
    overview: (n) => `Cooper plugs into ${n} so updates, handoffs, and account context show up in the channels your team already uses. No new tool to check, and no context lost between systems.`,
    does: () => [
      'Shares updates and hands off work in channels',
      'Surfaces documents and account context on demand',
      'Keeps everyone on the same version',
    ],
    caps: ['automate', 'secure'],
  },
  docs: {
    cat: 'Documents',
    cats: ['Documents', 'Storage', 'Reads documents'],
    tagline: () => `Cooper reads and files documents where they already live.`,
    overview: (n) => `Cooper reads documents stored in ${n}, ACORDs, policies, loss runs, in any format, turns them into structured data, and files results back into the right place automatically, so your team stops copying files between tools.`,
    does: (n) => [
      `Reads files directly from ${n}`,
      'Turns documents into structured, checked data',
      'Files results back where they belong',
    ],
    caps: ['read', 'sync', 'secure'],
  },
  sheets: {
    cat: 'Spreadsheets',
    cats: ['Spreadsheets', 'Bordereaux', 'Loss runs'],
    tagline: () => `Bordereaux and loss runs in any layout, parsed and reconciled.`,
    overview: (n) => `Cooper reads spreadsheets from ${n} in any layout, schedules, bordereaux, and loss runs, then cleans, reconciles, and keeps the data consistent, so you can actually trust the numbers you're comparing.`,
    does: () => [
      'Reads schedules, bordereaux, and loss runs',
      'Reconciles and cleans the data automatically',
      'Keeps one consistent, comparable view',
    ],
    caps: ['read', 'sync', 'secure'],
  },
  slides: {
    cat: 'Presentations',
    cats: ['Presentations', 'Reporting'],
    tagline: () => `Cooper reads and drafts decks from your data.`,
    overview: (n) => `Cooper pulls content from ${n} and drafts formatted slides from the data it already has on the account, so reports, reviews, and renewals come together in minutes instead of an afternoon.`,
    does: () => [
      'Pulls content from existing decks',
      'Drafts formatted slides from your data',
      'Keeps presentations consistent with the source',
    ],
    caps: ['read', 'automate'],
  },
  core: {
    cat: 'Core system',
    cats: ['Core system', 'Policy', 'Two-way sync'],
    tagline: (n) => `Cooper reads and updates policy data in ${n}.`,
    overview: (n) => `Cooper connects to ${n} to read policy, billing, and claim data and sync structured results back into the core system, so everything downstream stays consistent with your source of truth.`,
    does: () => [
      'Pulls policy, billing, and claim data',
      'Syncs structured results back into the core system',
      'Keeps downstream systems in step',
    ],
    caps: ['read', 'sync', 'secure'],
  },
  automation: {
    cat: 'Automation',
    cats: ['Automation', 'Workflows'],
    tagline: (n) => `Connect Cooper to thousands of apps through ${n}.`,
    overview: (n) => `Cooper triggers from, and sends structured output to, anything ${n} reaches, so you can wire it into the tools you already automate without writing or maintaining custom code.`,
    does: (n) => [
      'Triggers Cooper from the tools you already automate',
      `Sends structured output anywhere ${n} reaches`,
      'No custom code to build or maintain',
    ],
    caps: ['automate', 'sync'],
  },
  data: {
    cat: 'Data',
    cats: ['Data', 'Database', 'Two-way sync'],
    tagline: (n) => `Cooper reads and writes to your ${n} database.`,
    overview: (n) => `Cooper queries your ${n} database where it lives and writes structured results back on a schedule, so your warehouse and Cooper stay in sync without an export-import dance.`,
    does: () => [
      'Queries your data where it lives',
      'Writes structured results back on a schedule',
      'Keeps your database and Cooper in sync',
    ],
    caps: ['read', 'sync', 'secure'],
  },
  pm: {
    cat: 'Project management',
    cats: ['Project management', 'Tasks', 'Automations'],
    tagline: (n) => `Cooper keeps work moving in ${n}.`,
    overview: (n) => `Cooper creates and updates tasks in ${n} from real activity and keeps status in sync with your process, so work doesn't fall through the cracks between systems.`,
    does: () => [
      'Creates and updates tasks from real activity',
      'Keeps status in sync with your process',
      'Nothing falls through the cracks',
    ],
    caps: ['automate', 'sync'],
  },
  risk: {
    cat: 'Risk management',
    cats: ['Risk management', 'Policy', 'Claims'],
    tagline: (n) => `Cooper connects to ${n} for policy and claims data.`,
    overview: (n) => `Cooper reads risk, policy, and claims records from ${n} and syncs structured output back automatically, keeping your system of record current as accounts move.`,
    does: () => [
      'Reads risk, policy, and claims records',
      'Syncs structured output back automatically',
      'Keeps your system of record current',
    ],
    caps: ['read', 'sync', 'secure'],
  },
  lossrun: {
    cat: 'Loss runs',
    cats: ['Loss runs', 'Data extraction'],
    tagline: (n) => `Cooper reads and normalizes loss runs from ${n}.`,
    overview: (n) => `Cooper extracts loss data from ${n} in any format and normalizes it into one consistent, comparable view, so you can compare accounts and carriers without reformatting a thing.`,
    does: () => [
      'Extracts loss data from any format',
      'Normalizes it into one comparable view',
      'Ready to compare across accounts and carriers',
    ],
    caps: ['read', 'sync'],
  },
  claims: {
    cat: 'Claims',
    cats: ['Claims', 'Payments', 'Two-way sync'],
    tagline: (n) => `Cooper connects to ${n} for claims and payments data.`,
    overview: (n) => `Cooper reads claim status and documents from ${n} and keeps your system of record in step, so claims data isn't stuck in a silo away from the rest of the account.`,
    does: () => [
      'Reads claim status and documents',
      'Keeps your system of record in step',
      'No more siloed claims data',
    ],
    caps: ['read', 'sync', 'secure'],
  },
}

type Base = {
  name: string
  tpl: keyof typeof TPL
  img?: string
  mono?: string
  color?: string
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
  cats: string[]
  tagline: string
  overview: string
  does: string[]
  caps: CapKey[]
}
function expand(b: Base): Integration {
  const t = TPL[b.tpl]
  return {
    ...b,
    cat: t.cat,
    cats: t.cats,
    tagline: t.tagline(b.name),
    overview: t.overview(b.name),
    does: t.does(b.name),
    caps: t.caps,
  }
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

/* "Does it fit my stack?" — the six surfaces named in the brief, with
   what Cooper actually does on each. */
const SURFACES = [
  { icon: EnvelopeSimple, title: 'Email', body: 'Reads shared inboxes, grabs submissions and attachments, and routes them to the correct recipient.' },
  { icon: Table, title: 'Excel & sheets', body: 'Bordereaux, schedules, and loss runs in any layout, parsed, reconciled, and kept clean.' },
  { icon: Browser, title: 'Carrier portals', body: 'Navigates carrier and MGA portals to pull quotes, documents, and status, no copy-paste.' },
  { icon: Database, title: 'AMS / CRM', body: 'Two-way sync with your system of record, so records stay current without manual re-entry.' },
  { icon: FileText, title: 'ACORD forms', body: 'Reads and generates ACORD forms, prefilled from the data Cooper already has on the account.' },
  { icon: FileText, title: 'Loss runs', body: 'Extracts and normalizes loss runs from any carrier format into one consistent, comparable view.' },
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

function Mark({ item, size }: { item: Base; size: 'sm' | 'lg' | 'xl' }) {
  const box =
    size === 'xl' ? 'w-[86px] h-[86px] rounded-[20px]'
    : size === 'lg' ? 'w-[60px] h-[60px] rounded-[15px]'
    : 'w-[36px] h-[36px] rounded-[9px]'
  const pad = size === 'xl' ? 'p-[16px]' : size === 'lg' ? 'p-[11px]' : 'p-[6px]'
  const mono = size === 'xl' ? 'text-[26px]' : size === 'lg' ? 'text-[18px]' : 'text-[12px]'
  if (item.img) {
    return (
      <span className={`grid shrink-0 place-items-center overflow-hidden bg-white border border-dark/[0.06] ${box} ${pad}`}>
        <img src={item.img} alt="" loading="lazy" className="max-w-full max-h-full object-contain" />
      </span>
    )
  }
  return (
    <span className={`grid shrink-0 place-items-center font-grotesk font-bold text-white ${box} ${mono}`} style={{ background: item.color }}>
      {item.mono}
    </span>
  )
}

/* ── Count-up number ("20+") — eases from 0 to the target on mount ── */
function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
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
   Discrete, not a slide: on each tick a new logo pops in on the LEFT,
   the row shifts to make room, and the oldest one drops off the RIGHT.
   Then it settles and repeats. */
function QueueCircle({ src, exiting = false }: { src: string; exiting?: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    // two frames so the width:0 start actually paints before it grows
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  const shown = open && !exiting
  return (
    <span
      className="-mr-[9px] grid h-[30px] shrink-0 place-items-center overflow-hidden rounded-full border border-cream-light/25 bg-cream-light shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)]"
      style={{
        width: shown ? 30 : 0,
        opacity: shown ? 1 : 0,
        transform: shown ? 'scale(1)' : 'scale(0.4)',
        transition: 'width 0.45s cubic-bezier(0.2,0.85,0.25,1), opacity 0.36s ease-out, transform 0.45s cubic-bezier(0.2,0.85,0.25,1)',
      }}
    >
      <img src={src} alt="" className="h-[16px] w-[16px] min-w-[16px] object-contain" />
    </span>
  )
}

/* One in, one out: a new circle grows on the left while the rightmost
   shrinks away, so the row's width stays constant and the "+" always
   overlaps the last circle by the same little bit as every other. */
function LogoQueue() {
  const N = 6
  const [items, setItems] = useState(() => STREAM_LOGOS.slice(0, N).map((src, i) => ({ id: i, src, exiting: false })))
  const next = useRef(N % STREAM_LOGOS.length)
  const uid = useRef(N)
  useEffect(() => {
    const iv = setInterval(() => {
      const src = STREAM_LOGOS[next.current]
      next.current = (next.current + 1) % STREAM_LOGOS.length
      const nid = uid.current++
      // mark the oldest (rightmost) to shrink out, add a new one growing in
      setItems((prev) => [
        { id: nid, src, exiting: false },
        ...prev.map((it, i) => (i === prev.length - 1 ? { ...it, exiting: true } : it)),
      ])
      // drop the shrunk one once its exit transition has finished
      window.setTimeout(() => setItems((prev) => prev.filter((it) => !it.exiting)), 480)
    }, 2000)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="hidden items-center sm:flex" aria-hidden>
      <div
        className="relative w-[136px] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 16%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 16%, #000 100%)',
        }}
      >
        <div className="flex w-max">
          {items.map((it) => (
            <QueueCircle key={it.id} src={it.src} exiting={it.exiting} />
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

/* ── Shared modal shell — dark overlay + centered cream panel.
   Closes on Escape, overlay click, and the X button. ── */
function ModalShell({ onClose, children, labelledBy, wide = false }: {
  onClose: () => void; children: React.ReactNode; labelledBy: string; wide?: boolean
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[100] flex items-end justify-center bg-dark/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={`animate-modal-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[20px] border border-dark/10 bg-cream-light shadow-[0_40px_120px_-40px_rgba(30,26,21,0.6)] sm:rounded-[20px] ${wide ? 'max-w-[1000px]' : 'max-w-[560px]'}`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[16px] top-[16px] z-10 grid h-[34px] w-[34px] place-items-center rounded-full border border-dark/10 bg-cream-light text-dark/50 transition-colors hover:bg-cream hover:text-dark"
        >
          <X size={17} weight="bold" />
        </button>
        {children}
      </div>
    </div>
  )
}

/* ── Integration detail modal — compact card with Amar's launch copy.
   (A fuller two-column version is kept in IntegrationsPage.fullmodal.backup.tsx.) ── */
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
          {item.summary ?? item.overview}
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

/* ── "Tell us what to connect" request modal ──
   Captures the system name + a work email and posts to the same lead
   endpoint the demo form uses (system carried in the message field).
   On failure it falls back to a prefilled mailto so a lead is never lost. */
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'mail.com', 'gmx.com', 'gmx.net', 'inbox.com',
])
function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

type ReqState = 'idle' | 'submitting' | 'success' | 'error'

function ConnectRequestModal({ onClose }: { onClose: () => void }) {
  const [system, setSystem] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [systemError, setSystemError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [state, setState] = useState<ReqState>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true
    if (!system.trim()) { setSystemError('Please name the system.'); valid = false }
    if (!isWorkEmail(email)) { setEmailError('Please use a work email address.'); valid = false }
    if (!valid) return
    setSystemError(''); setEmailError('')
    setState('submitting')

    const messageParts = [`Integration request: ${system.trim()}`]
    if (note.trim()) messageParts.push(note.trim())
    const payload = {
      first_name: 'Integration',
      last_name: 'Request',
      email,
      phone: '',
      message: messageParts.join('\n\n'),
      event_source_url: window.location.href,
    }
    try {
      const res = await fetch('https://api.askcooper.ai/api/v1/demo-requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <ModalShell onClose={onClose} labelledBy="connect-modal-title">
      <div className="overflow-y-auto p-[28px] sm:p-[34px]">
        {state === 'success' ? (
          <div className="py-[10px] text-center">
            <span className="mx-auto mb-[18px] grid h-[52px] w-[52px] place-items-center rounded-full bg-accent-orange/12 text-accent-orange">
              <Check size={26} weight="bold" />
            </span>
            <h3 id="connect-modal-title" className="font-serif text-[24px] leading-[1.15] text-dark">
              Thanks, we're on it
            </h3>
            <p className="mx-auto mt-[12px] max-w-[360px] font-sans text-[15px] leading-[1.55] text-dark/55">
              We'll look at connecting <span className="font-medium text-dark">{system.trim()}</span> and follow up at your email.
            </p>
            <button
              onClick={onClose}
              className="mt-[24px] inline-flex items-center rounded-[6px] bg-dark px-[24px] py-[12px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.03]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="pr-[40px]">
              <p className="mb-[12px] font-grotesk text-[12px] font-medium uppercase tracking-[1.4px] text-accent-orange">
                Request an integration
              </p>
              <h3 id="connect-modal-title" className="font-serif text-[26px] leading-[1.1] text-dark">
                Tell us what to connect
              </h3>
              <p className="mt-[12px] font-sans text-[15px] leading-[1.55] text-dark/55">
                Name the system your team lives in and we'll wire Cooper to it. We'll follow up at your email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-[24px] flex flex-col gap-[16px]" noValidate>
              <label className="flex flex-col gap-[7px]">
                <span className="font-grotesk text-[12px] font-medium uppercase tracking-[1px] text-dark/45">System</span>
                <input
                  type="text"
                  value={system}
                  onChange={(e) => { setSystem(e.target.value); if (systemError) setSystemError('') }}
                  placeholder="e.g. Vertafore, ImageRight, NetSuite"
                  className="rounded-[8px] border border-dark/15 bg-cream-light px-[14px] py-[11px] font-sans text-[15px] text-dark outline-none transition-colors placeholder:text-dark/30 focus:border-accent-orange"
                />
                {systemError && <span className="font-sans text-[12.5px] text-accent-red">{systemError}</span>}
              </label>

              <label className="flex flex-col gap-[7px]">
                <span className="font-grotesk text-[12px] font-medium uppercase tracking-[1px] text-dark/45">Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                  placeholder="you@company.com"
                  className="rounded-[8px] border border-dark/15 bg-cream-light px-[14px] py-[11px] font-sans text-[15px] text-dark outline-none transition-colors placeholder:text-dark/30 focus:border-accent-orange"
                />
                {emailError && <span className="font-sans text-[12.5px] text-accent-red">{emailError}</span>}
              </label>

              <label className="flex flex-col gap-[7px]">
                <span className="font-grotesk text-[12px] font-medium uppercase tracking-[1px] text-dark/45">
                  Anything else <span className="normal-case tracking-normal text-dark/30">(optional)</span>
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="How your team uses it, what you'd want Cooper to do…"
                  className="resize-none rounded-[8px] border border-dark/15 bg-cream-light px-[14px] py-[11px] font-sans text-[15px] text-dark outline-none transition-colors placeholder:text-dark/30 focus:border-accent-orange"
                />
              </label>

              {state === 'error' && (
                <p className="font-sans text-[13.5px] leading-[1.5] text-accent-red">
                  Something went wrong. Please email us at{' '}
                  <a
                    href={`mailto:support@askcooper.ai?subject=${encodeURIComponent('Integration request')}&body=${encodeURIComponent(`System: ${system}\n\n${note}`)}`}
                    className="font-semibold underline"
                  >
                    support@askcooper.ai
                  </a>.
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="mt-[4px] inline-flex items-center justify-center rounded-[6px] bg-dark px-[24px] py-[13px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'submitting' ? 'Sending…' : 'Send request'}
              </button>
            </form>
          </>
        )}
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
      'Cooper connects to the systems insurance teams already use, email, Excel, carrier portals, AMS/CRM, ACORD forms, and loss runs. See what connects, how the data moves, and how it stays secure.',
    canonicalPath: '/integrations',
    jsonLd: pageJsonLd({
      name: 'Integrations',
      path: '/integrations',
      description: 'How Cooper connects to the tools insurance teams already use.',
    }),
  })

  const [active, setActive] = useState<Integration | null>(null)
  const [connectOpen, setConnectOpen] = useState(false)

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
                  <CountUp to={20} />
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
              <button
                type="button"
                onClick={() => setConnectOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-accent-orange no-underline hover:underline"
              >
                Tell us what to connect <ArrowRight size={15} weight="bold" />
              </button>
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
              sub="Cooper doesn't ask your team to change how they work. It enables each person to do more without the busywork."
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
                    <p className="font-sans text-[14.5px] leading-[1.55] text-dark/55">{s.body}</p>
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

      {/* ══════════════ FINAL CTA — contained rounded card
          (same treatment as the About / Careers banner) ══════════════ */}
      <Reveal>
        <section className="bg-cream-light">
          <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-[85px] py-[48px]">
            <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
              {/* Background — orange grain + Cooper logo watermark */}
              <img
                src="/images/about/careers-cta-bg.png"
                alt=""
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
      {connectOpen && <ConnectRequestModal onClose={() => setConnectOpen(false)} />}
    </div>
  )
}
