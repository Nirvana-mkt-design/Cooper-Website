import { useState, useEffect, useCallback, useRef } from 'react'

/* ──────────────────────────────────────────────────────────────
   OnePlatform — "One platform, every workflow".
   Segmented tab control over three jobs Cooper finishes end to end:
   build the submission, fill the portals, turn quotes into proposals.
   Each panel pairs editorial copy with a clean product-UI diagram,
   styled to match the real Cooper app (light cards, ochre accents).
─────────────────────────────────────────────────────────────── */

const ORANGE = '#d95611'

const tabs = [
  {
    id: 'submission',
    tab: 'Build the submission',
    eyebrow: 'Submissions',
    title: 'Submission, built',
    tagline: 'Forward the docs. Get a finished package.',
    description:
      'Send Cooper the email and attachments, or point it at your AMS and SharePoint. It reads every dec page, loss run, and application, fills the ACORD forms, and assembles the whole submission.',
    checks: [
      'Pulls exposures, drivers, and prior losses into the right fields',
      'Fills the ACORD forms and carrier supplements automatically',
      'Flags only what is truly missing for you to confirm',
    ],
  },
  {
    id: 'portals',
    tab: 'Fill the portals',
    eyebrow: "Carrier portals · Cooper's edge",
    title: 'Portals, filled',
    tagline: "Cooper hits the markets, you don't.",
    description:
      'Cooper logs into each carrier portal and enters the same risk across all of them. The real forms, uploads, and clicks. You stop re-keying identical data ten times.',
    checks: [
      'Drives live carrier portals, not just PDFs',
      'Submits one risk across every market in parallel',
      'You watch progress while Cooper does the typing',
    ],
  },
  {
    id: 'proposals',
    tab: 'Turn quotes into proposals',
    eyebrow: 'Proposals',
    title: 'Proposal, drafted',
    tagline: 'Quotes in, client-ready proposal out.',
    description:
      "As quotes come back, Cooper normalizes every carrier's terms into one comparison and drafts the proposal in your agency's format. Ready to send, not just ready to read.",
    checks: [
      'Normalizes mismatched quotes into one clean comparison',
      'Flags coverage differences and silent downgrades',
      'Drafts the client proposal in your template',
    ],
  },
] as const

const DURATION = 11000 // ms per tab

/* ── shared bits ── */
function Check({ className = '' }: { className?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} aria-hidden>
      <circle cx="12" cy="12" r="11" fill={ORANGE} opacity="0.12" />
      <path d="M7 12.5l3 3 7-7.5" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FlowArrow() {
  return (
    <svg viewBox="0 0 40 24" fill="none" className="h-[28px] w-[28px] text-accent-orange" aria-hidden>
      <path d="M2 12h34M28 4l9 8-9 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeadChip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full border border-dark/[0.1] bg-cream-light px-[11px] py-[5px] font-grotesk text-[11px] font-medium text-dark/65">
      <span className="h-[7px] w-[7px] rounded-full" style={{ background: color }} />
      {children}
    </span>
  )
}

const panelBase = 'rounded-[12px] border border-dark/[0.12] bg-cream/30 p-[14px]'
const h5cls = 'mb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-dark/55'
const cardWrap =
  'flex min-h-[360px] flex-col gap-[14px] rounded-[18px] border border-dark/[0.1] bg-cream-light p-[22px] shadow-[0_24px_70px_-44px_rgba(30,26,21,0.55)]'

function FileChip({ kind, name }: { kind: string; name: string }) {
  return (
    <div className="mb-[7px] flex items-center gap-[8px] rounded-[8px] border border-dark/[0.12] bg-white px-[10px] py-[7px] text-[12.5px] text-dark">
      <span className="grid h-[18px] w-[18px] place-items-center rounded-[4px] bg-accent-orange font-grotesk text-[8px] font-bold text-white">
        {kind}
      </span>
      {name}
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-[10px] border-b border-dashed border-dark/[0.18] py-[5px] text-[12.5px] last:border-b-0">
      <span className="text-dark/55">{k}</span>
      <b className="font-semibold text-dark">{v}</b>
    </div>
  )
}

/* ── diagrams ── */
function SubmissionDiagram() {
  return (
    <div className={cardWrap}>
      <div className="flex items-center justify-between gap-[10px]">
        <span className="font-grotesk text-[12px] text-dark/50">Submission package</span>
        <HeadChip color="#3f7d3f">Ready to send</HeadChip>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.05fr] items-center gap-[14px]">
        <div className={panelBase}>
          <h5 className={h5cls}>Forwarded to Cooper</h5>
          <FileChip kind="PDF" name="Dec page.pdf" />
          <FileChip kind="PDF" name="Loss runs · 5 yr.pdf" />
          <FileChip kind="EML" name="Submission email" />
          <FileChip kind="XLS" name="Vehicle schedule.xls" />
          <div className="mt-[6px] text-[11px] leading-[1.4] text-dark/45">
            From dana@riversideins.com · ABC Trucking LLC · 4 files
          </div>
        </div>
        <div className="grid place-items-center">
          <FlowArrow />
        </div>
        <div className="rounded-[12px] border border-accent-orange/25 bg-accent-orange/[0.06] p-[14px]">
          <h5 className={h5cls}>Filled by Cooper</h5>
          <KV k="Named insured" v="ABC Trucking LLC" />
          <KV k="Lines" v="Auto Liab · Cargo" />
          <KV k="Effective" v="2026-06-25" />
          <div className="mt-[10px] flex flex-col gap-[6px]">
            {['ACORD application filled', 'Motor Truck Cargo supplement built', '5-yr loss summary built'].map((t) => (
              <div key={t} className="flex items-center gap-[8px] text-[12.5px] text-dark/80">
                <Check />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-[12px] border border-dashed border-dark/[0.2] bg-white px-[14px] py-[12px] text-[12px] text-dark/60">
        <b className="font-semibold text-accent-red">2 items need you</b> · MC# missing · garaging address unconfirmed
      </div>
    </div>
  )
}

function PortalsDiagram() {
  const fields = [
    { label: 'Named insured', value: 'ABC Trucking LLC', typing: false },
    { label: 'FEIN', value: '47-20••••', typing: false },
    { label: 'Garaging ZIP', value: '60629', typing: false },
    { label: 'Power units', value: '18', typing: true },
  ]
  return (
    <div className={cardWrap}>
      <div className="flex items-center justify-between gap-[10px]">
        <span className="font-grotesk text-[12px] text-dark/50">Carrier portals · live</span>
        <HeadChip color={ORANGE}>Cooper is driving</HeadChip>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-dark/[0.12] bg-white">
        <div className="flex items-center gap-[7px] border-b border-dark/[0.12] bg-cream/60 px-[12px] py-[9px]">
          <span className="h-[9px] w-[9px] rounded-full bg-dark/20" />
          <span className="h-[9px] w-[9px] rounded-full bg-dark/20" />
          <span className="h-[9px] w-[9px] rounded-full bg-dark/20" />
          <span className="ml-[8px] flex-1 truncate rounded-[6px] border border-dark/[0.12] bg-white px-[10px] py-[4px] font-grotesk text-[11px] text-dark/55">
            portal.travelers.com › new-submission › commercial-auto
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[10px] p-[14px]">
          {fields.map((f) => (
            <div key={f.label} className="text-[11.5px]">
              <span className="mb-[3px] block font-grotesk text-[9.5px] uppercase tracking-[0.05em] text-dark/45">
                {f.label}
              </span>
              <div className="rounded-[6px] border border-accent-orange bg-white px-[8px] py-[6px] text-dark shadow-[0_0_0_3px_rgba(217,86,17,0.12)]">
                {f.value}
                {f.typing && <span className="ml-[2px] inline-block h-[13px] w-[1px] -translate-y-[1px] animate-pulse bg-accent-orange align-middle" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        {[
          { name: 'Travelers', state: 'submitted' as const },
          { name: 'Chubb', state: 'submitted' as const },
          { name: 'Nationwide', state: 'filling' as const },
          { name: 'Sentry · Amtrust · Zurich', state: 'queued' as const },
        ].map((q) => (
          <div
            key={q.name}
            className="flex items-center justify-between rounded-[8px] border border-dark/[0.12] bg-white px-[11px] py-[8px] text-[12.5px]"
          >
            <span className="font-semibold text-dark">{q.name}</span>
            {q.state === 'submitted' && <span className="text-[#3f7d3f]">✓ submitted</span>}
            {q.state === 'filling' && (
              <span className="flex items-center gap-[8px] text-dark/60">
                <span className="h-[5px] w-[64px] overflow-hidden rounded-[3px] bg-dark/10">
                  <span className="block h-full w-[78%] bg-accent-orange" />
                </span>
                filling 78%
              </span>
            )}
            {q.state === 'queued' && <span className="text-dark/40">queued</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProposalsDiagram() {
  const quotes = [
    { name: 'Travelers', price: '$42,180' },
    { name: 'Chubb', price: '$39,750' },
    { name: 'Nationwide', price: '$45,600' },
  ]
  const rows = [
    { c: 'Travelers', p: '$42,180', d: '$2,500', g: '$100k', rec: false },
    { c: 'Chubb', p: '$39,750', d: '$5,000', g: '$250k', rec: true },
    { c: 'Nationwide', p: '$45,600', d: '$1,000', g: '$100k', rec: false },
  ]
  return (
    <div className={cardWrap}>
      <div className="flex items-center justify-between gap-[10px]">
        <span className="font-grotesk text-[12px] text-dark/50">Quotes to proposal</span>
        <HeadChip color="#3f7d3f">Drafted in your template</HeadChip>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.15fr] items-center gap-[14px]">
        <div className={panelBase}>
          <h5 className={h5cls}>Quotes received</h5>
          <div className="flex flex-col gap-[9px]">
            {quotes.map((q) => (
              <div
                key={q.name}
                className="flex items-center justify-between rounded-[9px] border border-dark/[0.12] bg-white px-[12px] py-[9px]"
              >
                <span className="text-[13px] font-semibold text-dark">{q.name}</span>
                <span className="font-serif text-[17px] text-dark">{q.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid place-items-center">
          <FlowArrow />
        </div>
        <div className="rounded-[12px] border border-dark/[0.12] bg-white p-[14px]">
          <h5 className={h5cls}>Client proposal · ABC Trucking</h5>
          <table className="w-full border-collapse text-[11.5px]">
            <thead>
              <tr>
                {['Carrier', 'Premium', 'Deductible', 'Cargo'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-dark/[0.12] px-[8px] py-[6px] text-left font-grotesk text-[9.5px] uppercase tracking-[0.05em] text-dark/50"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.c}>
                  <td className="border-b border-dark/[0.08] px-[8px] py-[6px] text-dark/75">
                    {r.rec ? <b className="font-semibold text-dark">{r.c}</b> : r.c}
                  </td>
                  <td className="border-b border-dark/[0.08] px-[8px] py-[6px] text-dark/75">
                    {r.rec ? <b className="font-semibold text-dark">{r.p}</b> : r.p}
                  </td>
                  <td className="border-b border-dark/[0.08] px-[8px] py-[6px] text-dark/75">{r.d}</td>
                  <td className="border-b border-dark/[0.08] px-[8px] py-[6px] text-dark/75">{r.g}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-[10px] flex items-start gap-[8px] text-[12.5px] text-dark/70">
            <Check className="mt-[1px]" />
            <span>
              <b className="font-semibold text-dark">Recommended: Chubb</b> · lowest premium and best cargo, at a higher $5k deductible
            </span>
          </div>
          <div className="mt-[8px] text-[11px] text-dark/45">
            Drafted in Riverside Insurance Group's template · review before sending
          </div>
        </div>
      </div>
    </div>
  )
}

function Diagram({ id }: { id: string }) {
  if (id === 'submission') return <SubmissionDiagram />
  if (id === 'portals') return <PortalsDiagram />
  return <ProposalsDiagram />
}

export default function OnePlatform() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [animKey, setAnimKey] = useState(0)
  const active = tabs[activeIdx]

  const goNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % tabs.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = performance.now()
  }, [])

  useEffect(() => {
    if (paused) return
    startRef.current = performance.now() - (progress / 100) * DURATION
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) goNext()
      else rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeIdx, goNext])

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = performance.now()
    setPaused(true)
    setTimeout(() => setPaused(false), DURATION)
  }

  return (
    <section id="platform" className="scroll-mt-[90px] bg-cream py-[100px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px]">
        <h2 className="mb-[44px] text-center font-serif text-[26px] md:text-[34px] lg:text-[38px] leading-[1.2] text-dark">
          One platform, every workflow
        </h2>

        {/* Segmented tab control */}
        <div className="mx-auto mb-[40px] flex max-w-[760px] gap-[4px] rounded-[12px] border border-dark/[0.12] bg-cream-light p-[5px]">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(i)}
              className={`relative flex-1 overflow-hidden rounded-[8px] px-[6px] md:px-[10px] py-[11px] font-grotesk text-[10px] leading-[1.2] md:text-[11px] lg:text-[12.5px] font-semibold uppercase tracking-[0.04em] transition-colors duration-200 cursor-pointer ${
                activeIdx === i ? 'bg-dark text-cream-light' : 'bg-transparent text-dark/45 hover:text-dark/70'
              }`}
            >
              {tab.tab}
              {activeIdx === i && (
                <span
                  className="absolute bottom-0 left-0 h-[2px] bg-accent-orange"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Active panel */}
        <div
          key={`panel-${animKey}`}
          className="grid grid-cols-1 items-center gap-8 lg:gap-[48px] lg:grid-cols-[0.92fr_1.15fr]"
        >
          {/* Copy */}
          <div>
            <p className="mb-[14px] font-grotesk text-[13px] font-medium uppercase tracking-[1.4px] text-accent-orange animate-fade-in">
              {active.eyebrow}
            </p>
            <h3 className="mb-[8px] font-serif text-[22px] md:text-[28px] lg:text-[34px] leading-[1.1] text-dark animate-fade-in" style={{ animationDelay: '0.05s' }}>
              {active.title}
            </h3>
            <p className="mb-[18px] font-serif text-[17px] lg:text-[20px] leading-[1.3] text-accent-orange animate-fade-blur-in" style={{ animationDelay: '0.12s' }}>
              {active.tagline}
            </p>
            <p className="mb-[24px] max-w-[44ch] font-sans text-[16.5px] leading-[1.55] text-dark/60 animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
              {active.description}
            </p>
            <ul className="flex flex-col gap-[12px]">
              {active.checks.map((c, i) => (
                <li
                  key={c}
                  className="flex items-start gap-[10px] font-sans text-[14.5px] leading-[1.4] text-dark/85 animate-fade-blur-in"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <Check className="mt-[2px]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Diagram */}
          <div className="animate-fade-blur-in" style={{ animationDelay: '0.15s' }}>
            <Diagram id={active.id} />
          </div>
        </div>
      </div>
    </section>
  )
}
