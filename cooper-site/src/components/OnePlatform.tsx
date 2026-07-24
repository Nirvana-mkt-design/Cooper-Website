import { useState, useEffect, useCallback, useRef } from 'react'

const tabs = [
  {
    id: 'submission',
    label: 'Build the submissions',
    category: 'Submissions',
    title: 'Forward your docs, Cooper gives you a finished package.',
    subtitle: '',
    description:
      'Send Cooper the email and attachments, or point it at your AMS and SharePoint. It reads every dec page, loss run, and application, fills the ACORD forms, and assembles the whole submission.',
    checks: [
      'Pulls exposures and prior losses into the right fields',
      'Fills the ACORD forms and carrier supplements automatically',
      'Flags only what is truly missing for you to confirm',
    ],
  },
  {
    id: 'portals',
    label: 'Fill the portals',
    category: 'Carrier Portals',
    title: 'Pick your portals, Cooper fills them in.',
    subtitle: '',
    description:
      'Cooper logs into each carrier portal and enters the same risk across all of them. The real forms, uploads, and clicks. You stop re-entering identical data ten times.',
    checks: [
      'Drives live carrier portals, not just PDFs',
      'Submits one risk across every market in parallel',
      'You watch progress while Cooper does the typing',
    ],
  },
  {
    id: 'proposals',
    label: 'Turn quotes into proposals',
    category: 'Proposals',
    title: 'Send your quotes, Cooper drafts a complete proposal.',
    subtitle: '',
    description:
      "As quotes come back, Cooper normalizes every carrier's terms into one comparison and drafts the proposal in your agency's format. Ready to bind, not just ready to read.",
    checks: [
      'Normalizes mismatched quotes into one clean comparison',
      'Flags coverage differences and silent downgrades',
      'Drafts the client proposal in your template',
    ],
  },
]

/* ── Right-panel UI components — Cooper app visual language ── */

/* Shared tokens */
const C = {
  card: 'bg-white/[0.94] rounded-[16px] overflow-hidden border border-[#E2D9CF]',
  label: 'font-grotesk text-[9.5px] font-medium tracking-[1.3px] uppercase text-[#A5A09A]',
  body: 'font-sans text-[12.5px] text-[#2B2520]',
  divider: 'border-[#E2D9CF]',
} as const

function CoopCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="7" fill="#C44818" />
      <path d="M4.2 7.1 6.1 9l3.7-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileTag({ type }: { type: 'PDF' | 'EML' | 'XLS' }) {
  const bg = type === 'XLS' ? '#2B7A3A' : '#C44818'
  return (
    <span className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-[6px] shrink-0" style={{ background: bg }}>
      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
        <path d="M1 2C1 1.45 1.45 1 2 1H7.5L12 5.5V14C12 14.55 11.55 15 11 15H2C1.45 15 1 14.55 1 14V2Z" fill="white" fillOpacity="0.88"/>
        <path d="M7.5 1L12 5.5H7.5V1Z" fill="white" fillOpacity="0.5"/>
        <path d="M3 8.5H10M3 11H7.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.45"/>
      </svg>
    </span>
  )
}

// Callers key this on `active` so a fresh instance (count = 0) mounts on each
// activation — no reset-state-in-effect needed.
function TypedText({ text, active, msPerChar = 48 }: { text: string; active: boolean; msPerChar?: number }) {
  const [count, setCount] = useState(0)
  const done = count >= text.length
  useEffect(() => {
    if (!active) return
    let i = 0
    const t = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) clearInterval(t)
    }, msPerChar)
    return () => clearInterval(t)
  }, [active, text, msPerChar])
  return (
    <>
      {text.slice(0, count)}
      {active && !done && <span className="animate-pulse text-[#C44818] ml-[1px]">|</span>}
    </>
  )
}

/* Cooper icon path (reused across panels) */
const COOPER_ICON_PATH = 'M60.0615 0C72.8642 0.000149885 83.2434 10.3788 83.2435 23.1815L83.2416 23.4811C83.1479 30.88 79.5864 37.442 74.1093 41.621C79.6604 45.8563 83.2435 52.5399 83.2435 60.061L83.2416 60.3607C83.0811 73.0254 72.7642 83.2428 60.0615 83.243L59.7619 83.2411C52.3632 83.1473 45.8009 79.5862 41.622 74.1093C37.3866 79.6603 30.7026 83.2429 23.1815 83.243L22.8818 83.2411C10.2172 83.0805 7.73898e-05 72.7637 0 60.061C4.11592e-05 52.5405 3.58211 45.8573 9.13223 41.622C3.58171 37.3866 7.63667e-06 30.7023 0 23.1815C7.00685e-05 10.3787 10.3787 7.00776e-05 23.1815 0C30.7026 4.03379e-05 37.3861 3.58279 41.6215 9.13367C45.8568 3.58276 52.5404 4.1168e-05 60.0615 0ZM18.6642 46.9719C13.2366 48.8446 9.33768 53.9971 9.33763 60.061C9.3377 67.7067 15.5358 73.9052 23.1815 73.9054C29.5238 73.9053 34.8689 69.6397 36.5073 63.8212C36.5133 63.8224 36.5195 63.8234 36.5255 63.8246C27.8285 62.0864 20.8884 55.4832 18.6642 46.9719ZM63.598 46.6742C61.5421 54.9938 54.9941 61.5414 46.6747 63.598C48.2377 69.5303 53.6383 73.9053 60.0615 73.9054C67.7072 73.9052 73.9058 67.7067 73.9059 60.061C73.9058 53.6377 69.5306 48.2371 63.598 46.6742ZM41.0933 27.2504C33.4476 27.2505 27.2496 33.4486 27.2495 41.0943C27.2495 48.7401 33.4476 54.9386 41.0933 54.9386C48.7392 54.9386 54.9377 48.7401 54.9377 41.0943C54.9376 33.4485 48.7391 27.2505 41.0933 27.2504ZM64.2686 41.6225C64.2725 41.4469 64.2758 41.2708 64.2758 41.0943L64.2734 41.394C64.2724 41.4702 64.2703 41.5464 64.2686 41.6225ZM60.0615 9.33762C53.9972 9.33768 48.8444 13.2371 46.9719 18.6651C46.9635 18.6629 46.9549 18.6606 46.9464 18.6584C55.4854 20.8798 62.1083 27.847 63.8332 36.5751C63.8288 36.5524 63.8253 36.5295 63.8207 36.5068C69.6397 34.8687 73.9058 29.5241 73.9059 23.1815C73.9058 15.5358 67.7072 9.33777 60.0615 9.33762ZM36.1884 18.4338C34.2509 13.1266 29.1592 9.33768 23.1815 9.33762C15.5357 9.33769 9.3377 15.5357 9.33763 23.1815C9.33764 29.1593 13.1266 34.2509 18.4338 36.1883C20.3441 27.3232 27.323 20.3437 36.1884 18.4338Z'

function SubmissionPanel() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Cumulative delays: file1, file2, file3, file4, outlook, cooperIcon,
    // field1, field2, field3, checksVisible, check1, check2, check3, callout
    const delays = [300, 350, 350, 350, 420, 680, 900, 950, 950, 700, 500, 500, 520, 680]
    let t = 0
    const timers = delays.map((d, i) => {
      t += d
      return setTimeout(() => setPhase(i + 1), t)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const files = [
    { type: 'PDF' as const, name: 'Dec page.pdf' },
    { type: 'PDF' as const, name: 'Loss runs · 5 yr.pdf' },
    { type: 'XLS' as const, name: 'Statement of values.xlsx' },
    { type: 'EML' as const, name: 'Submission email' },
  ] as const

  const fields = [
    { label: 'Named insured', value: 'Brightwater Apartments LLC' },
    { label: 'Lines', value: 'Property · General Liability' },
    { label: 'Effective', value: '2026-07-01' },
  ]

  const checks = [
    'ACORD 125 + 126 + 140 filled',
    'Statement of values built · 6 buildings',
    '5-yr loss summary built',
  ]

  // phase: 1-4=files, 5=outlook, 6=cooperLoading, 7-9=fields, 10=checksVisible, 11-13=checked, 14=callout
  const cooperActive = phase >= 6 && phase < 14

  return (
    <div className="w-full max-w-[500px] bg-white/[0.94] overflow-hidden border border-[#D5CCC2] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-[14px] md:px-[20px] py-[10px] md:py-[13px] border-b border-[#D5CCC2] bg-[#F9F6F2]">
        <span className={C.label}>Submission Package</span>
        <span className="flex items-center gap-[5px] font-sans text-[10px] md:text-[11.5px] text-[#2B7A3A]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#2B7A3A]" />
          Ready to send
        </span>
      </div>

      {/* Two columns — always side by side */}
      <div className="grid grid-cols-2 divide-x divide-[#D5CCC2]">
        {/* Left — Forwarded to Cooper */}
        <div className="p-[14px] md:p-[18px]">
          <p className={`${C.label} mb-[10px] md:mb-[12px]`}>Forwarded to Cooper</p>
          <div className="flex flex-col gap-[6px] md:gap-[7px]">
            {files.map((f, i) => (
              <div
                key={f.name}
                className="flex items-center gap-[8px] md:gap-[10px] px-[10px] md:px-[12px] py-[8px] md:py-[9px] border border-[#E2D9CF] bg-white min-w-0"
                style={{
                  opacity: phase > i ? 1 : 0,
                  transform: phase > i ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.28s ease, transform 0.28s ease',
                }}
              >
                <FileTag type={f.type} />
                <span className="font-sans text-[12px] text-[#2B2520] truncate">{f.name}</span>
              </div>
            ))}
          </div>
          {/* Outlook source */}
          <div
            className="mt-[10px] flex items-center gap-[8px] px-[10px] py-[7px] bg-[#EEF3FA] border border-[#C5D4E8] min-w-0"
            style={{
              opacity: phase >= 5 ? 1 : 0,
              transform: phase >= 5 ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
            }}
          >
            <img src="/images/logo-outlook.webp" alt="Outlook" className="w-[15px] h-[15px] object-contain shrink-0" />
            <p className="font-sans text-[10.5px] text-[#3F6CA5] leading-[1.35] truncate">From dana@riversideins.com · Brightwater Apartments LLC · 4 files</p>
          </div>
        </div>

        {/* Right — Filled by Cooper */}
        <div className="p-[14px] md:p-[18px]">
          {/* Label + Cooper loading badge */}
          <div className="flex items-center gap-[7px] mb-[10px] md:mb-[12px]">
            <div
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 transition-colors duration-500"
              style={{
                background: phase >= 6 ? '#C44818' : '#E2D9CF',
                animation: cooperActive ? 'pulse 1.6s ease-in-out infinite' : 'none',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 84 84" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d={COOPER_ICON_PATH} fill="white" />
              </svg>
            </div>
            <p className={C.label}>Filled by Cooper</p>
          </div>

          {/* Fields — type in one by one */}
          <div className="flex flex-col mb-[14px]">
            {fields.map((r, i) => (
              <div
                key={r.label}
                className="py-[8px] border-b border-[#EBE5DE] last:border-0 min-w-0"
                style={{
                  opacity: phase >= 7 + i ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <p className="font-sans text-[9.5px] md:text-[10.5px] text-[#A5A09A] truncate">{r.label}</p>
                <p className="font-sans text-[12px] md:text-[13px] font-semibold text-[#2B2520] min-h-[20px] truncate">
                  <TypedText key={String(phase >= 7 + i)} text={r.value} active={phase >= 7 + i} />
                </p>
              </div>
            ))}
          </div>

          {/* Checklist — skeleton → checked */}
          <div className="flex flex-col gap-[8px]">
            {checks.map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-[7px] min-w-0"
                style={{
                  opacity: phase >= 10 ? 1 : 0,
                  transform: phase >= 10 ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 0.28s ease, transform 0.28s ease',
                  transitionDelay: phase >= 10 ? `${i * 40}ms` : '0ms',
                }}
              >
                {phase >= 11 + i ? (
                  <CoopCheck />
                ) : (
                  <span className="w-[14px] h-[14px] rounded-full border-2 border-[#D5CCC2] shrink-0 flex items-center justify-center">
                    <span className="w-[4px] h-[4px] rounded-full bg-[#D5CCC2] animate-pulse" />
                  </span>
                )}
                <span
                  className="font-sans text-[11px] md:text-[12px] truncate transition-colors duration-300"
                  style={{ color: phase >= 11 + i ? '#2B2520' : '#C5BFB8' }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Callout footer */}
      <div
        className="px-[14px] md:px-[16px] py-[10px] md:py-[12px] border-t border-[#D5CCC2]"
        style={{
          opacity: phase >= 14 ? 1 : 0,
          transform: phase >= 14 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div className="flex items-center gap-[10px] px-[12px] py-[9px] bg-[#FDF6F0] border-l-[3px] border-[#C44818]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="7" fill="#C44818" opacity="0.15" />
            <path d="M7 4v3.5M7 9.5v.5" stroke="#C44818" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[10.5px] md:text-[11.5px] text-[#2B2520] leading-[1.4]">
            <span className="font-semibold text-[#C44818]">2 items need you</span> · roof ages unconfirmed · sprinkler (NFPA 13) status missing
          </span>
        </div>
      </div>
    </div>
  )
}

function PortalsPanel() {
  const carriers: { name: string; pct?: number; status: string; type: 'done' | 'progress' | 'queued' }[] = [
    { name: 'The Hartford', status: 'submitted', type: 'done' },
    { name: 'Travelers', status: 'submitted', type: 'done' },
    { name: 'Nationwide', status: 'filling 78%', type: 'progress', pct: 78 },
    { name: 'Progressive · Sentry · Zurich', status: 'queued', type: 'queued' },
  ]
  return (
    <div className="w-full max-w-[440px] animate-fade-blur-in relative" style={{ animationDelay: '0.1s', height: 370 }}>
      {/* Browser window card — top-left, behind */}
      <div className="absolute left-0 top-0 bg-white/[0.94] overflow-hidden border border-[#D5CCC2]" style={{ width: '84%' }}>
        <div className="flex items-center justify-between px-[20px] py-[12px] border-b border-[#D5CCC2] bg-[#F9F6F2]">
          <span className={C.label}>Carrier Portals · Live</span>
          <span className="flex items-center gap-[5px] font-sans text-[11.5px] text-[#C44818]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#C44818]" />
            Cooper is driving
          </span>
        </div>
        <div className="p-[12px]">
          {/* Browser chrome */}
          <div className="border border-[#D5CCC2] overflow-hidden">
            <div className="flex items-center gap-[7px] px-[10px] py-[7px] bg-[#F2EDE7] border-b border-[#D5CCC2]">
              <div className="flex gap-[4px] shrink-0">
                <span className="w-[7px] h-[7px] rounded-full bg-[#E2D9CF]" />
                <span className="w-[7px] h-[7px] rounded-full bg-[#E2D9CF]" />
                <span className="w-[7px] h-[7px] rounded-full bg-[#E2D9CF]" />
              </div>
              <span className="font-sans text-[9.5px] text-[#A5A09A] truncate">portal.thehartford.com › new-submission › commercial-auto</span>
            </div>
            <div className="p-[12px] grid grid-cols-2 gap-[8px] bg-white">
              {[
                { label: 'Named Insured', value: 'Northgate Mechanical Services' },
                { label: 'FEIN', value: '47-20••••' },
                { label: 'Garaging ZIP', value: '60629' },
                { label: 'Vehicles', value: '12' },
              ].map((f) => (
                <div key={f.label}>
                  <p className={`${C.label} mb-[3px]`}>{f.label}</p>
                  <div className="border-2 border-[#C44818]/50 px-[7px] py-[5px] bg-white font-sans text-[11.5px] text-[#2B2520]">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Markets card — bottom-right, in front */}
      <div
        className="absolute right-0 bottom-0 bg-white/[0.97] overflow-hidden border border-[#D5CCC2] z-10"
        style={{ width: '72%', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
      >
        <div className="px-[16px] py-[10px] border-b border-[#D5CCC2] bg-[#F9F6F2]">
          <span className={C.label}>Markets</span>
        </div>
        <div className="divide-y divide-[#EBE5DE]">
          {carriers.map((c) => {
            const [first, ...rest] = c.name.split(' · ')
            return (
            <div key={c.name} className="flex items-center gap-[10px] px-[14px] py-[11px]">
              <span className="flex-1 min-w-0 font-sans text-[12px] truncate">
                <span className="font-semibold text-[#2B2520]">{first}</span>
                {rest.length > 0 && <span className="text-[#2B2520]/55">{' · ' + rest.join(' · ')}</span>}
              </span>
              {c.type === 'done' && (
                <span className="flex items-center gap-[5px] shrink-0 font-sans text-[11px] text-[#5F8168]">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.2 5.7 10l5.3-6" stroke="#5F8168" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c.status}
                </span>
              )}
              {c.type === 'progress' && (
                <div className="flex items-center gap-[8px] shrink-0">
                  <div className="w-[70px] h-[4px] rounded-full bg-[#E2D9CF] overflow-hidden">
                    <div className="h-full bg-[#C44818] rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="font-sans text-[10.5px] text-[#A5A09A] whitespace-nowrap">{c.status}</span>
                </div>
              )}
              {c.type === 'queued' && (
                <span className="font-sans text-[11px] text-[#A5A09A] shrink-0">{c.status}</span>
              )}
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ProposalPanel() {
  return (
    // No overflow-hidden — lets the receipt overlap the panel edge
    <div
      className="w-full max-w-[580px] bg-white/[0.94] border border-[#E2D9CF] animate-fade-blur-in"
      style={{ animationDelay: '0.1s' }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-[14px] md:px-[20px] py-[10px] md:py-[13px] border-b ${C.divider} bg-[#F9F6F2]`}>
        <span className={C.label}>Quotes to Proposal</span>
        <span className="flex items-center gap-[5px] font-sans text-[10px] md:text-[11.5px] text-[#2B7A3A]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#2B7A3A]" />
          Drafted in your template
        </span>
      </div>

      {/* Body — receipt floats left with arrow */}
      <div className="flex flex-row items-start p-[16px] gap-0">

        {/* Receipt card — overlaps the left panel edge */}
        <div
          className="w-[180px] shrink-0 relative z-10 -ml-[36px]"
        >
          <div
            className="bg-white overflow-hidden"
            style={{
              boxShadow: '0 8px 32px -8px rgba(30,20,10,0.28), 0 2px 10px rgba(30,20,10,0.12)',
              transform: 'rotate(-1.2deg)',
            }}
          >
            {/* Orange header strip */}
            <div className="px-[14px] py-[10px]" style={{ background: '#C44818' }}>
              <p className="font-grotesk text-[9px] font-medium tracking-[1.3px] uppercase text-white">Quotes Received</p>
            </div>
            {/* Perforation divider */}
            <div className="mx-[12px] border-t border-dashed border-[#EDE7DE]" />
            {/* Quote rows */}
            <div className="px-[14px] py-[11px] flex flex-col gap-[6px]">
              {[
                { carrier: 'The Hartford', amount: '$28,400' },
                { carrier: 'Travelers', amount: '$26,950' },
                { carrier: 'AmTrust', amount: '$31,200' },
              ].map((q) => (
                <div key={q.carrier} className="border border-[#EDE7DE] px-[10px] py-[8px] flex items-baseline justify-between gap-[4px] bg-[#FDFAF7]">
                  <span className="font-sans text-[11.5px] font-medium text-[#2B2520]">{q.carrier}</span>
                  <span className="font-sans text-[13.5px] font-bold text-[#2B2520]">{q.amount}</span>
                </div>
              ))}
            </div>
            {/* Perforation divider bottom */}
            <div className="mx-[12px] border-t border-dashed border-[#EDE7DE]" />
            {/* Receipt footer */}
            <div className="px-[14px] py-[8px]">
              <p className="font-sans text-[9px] text-[#A5A09A] text-center">3 markets · received Jun 24</p>
            </div>
          </div>
        </div>

        {/* Arrow — points right */}
        <div className="flex items-center justify-center w-[40px] shrink-0 mt-[68px]">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none" className="rotate-0">
            <path d="M1 6h20M15 1l6 5-6 5" stroke="#C44818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Proposal table */}
        <div className="flex-1 min-w-0 bg-white border border-[#E2D9CF] p-[10px] md:p-[12px] overflow-x-auto">
          <p className={`${C.label} mb-[10px]`}>Client Proposal · Summit Builders Inc · Workers' Comp</p>
          <table className="w-full mb-[10px]">
            <thead>
              <tr className="border-b border-[#E2D9CF]">
                {['Carrier', 'Premium', 'Dividend', 'Pay-Go'].map((h) => (
                  <th key={h} className={`${C.label} text-left pb-[6px] pr-[4px] last:pr-0 font-medium whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { carrier: 'The Hartford', premium: '$28,400', dividend: '5%', paygo: 'yes', highlight: false },
                { carrier: 'Travelers', premium: '$26,950', dividend: '3%', paygo: 'yes', highlight: true },
                { carrier: 'AmTrust', premium: '$31,200', dividend: '—', paygo: 'no', highlight: false },
              ].map((r) => (
                <tr key={r.carrier} className={`border-t border-[#E2D9CF] ${r.highlight ? 'bg-[#FDF6F0]' : ''}`}>
                  <td className={`py-[6px] font-sans text-[10px] md:text-[11.5px] text-[#2B2520] pr-[4px] whitespace-nowrap ${r.highlight ? 'font-bold' : ''}`}>{r.carrier}</td>
                  <td className={`py-[6px] font-sans text-[10px] md:text-[11.5px] text-[#2B2520] pr-[4px] whitespace-nowrap ${r.highlight ? 'font-bold' : ''}`}>{r.premium}</td>
                  <td className={`py-[6px] font-sans text-[10px] md:text-[11.5px] text-[#2B2520] pr-[4px] whitespace-nowrap ${r.highlight ? 'font-bold' : ''}`}>{r.dividend}</td>
                  <td className={`py-[6px] font-sans text-[10px] md:text-[11.5px] text-[#2B2520] whitespace-nowrap ${r.highlight ? 'font-bold' : ''}`}>{r.paygo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-start gap-[6px] p-[8px] bg-[#FDF6F0] border border-[#C44818]/20 mb-[8px]">
            <CoopCheck size={12} />
            <span className="font-sans text-[10.5px] text-[#2B2520] leading-[1.4]">
              <span className="font-semibold">Recommended: Travelers</span> · lowest premium with pay-as-you-go billing
            </span>
          </div>
          <p className="font-sans text-[10px] text-[#A5A09A] leading-[1.4]">Drafted in Riverside Insurance Group's template · review before sending</p>
        </div>
      </div>
    </div>
  )
}

const DURATION = 15000 // ms per tab

const bgImages = [
  '/images/platform-bg-submissions.webp',
  '/images/platform-bg-portals.webp',
  '/images/platform-bg-proposals.webp',
]

// Each platform background ships a 2000w original plus -800/-1200 variants so
// phones (including DPR 2–3) pick a small file instead of the 170 KB original.
const bgSrcSet = (src: string) =>
  `${src.replace('.webp', '-800.webp')} 800w, ${src.replace('.webp', '-1200.webp')} 1200w, ${src} 2000w`

function MobileAccordion() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="lg:hidden overflow-hidden" style={{ boxShadow: '0px 4px 32px -8px rgba(0,0,0,0.18), 0 0 0 4px rgba(0,0,0,0.02)' }}>
      {tabs.map((tab, idx) => {
        const isOpen = openIdx === idx
        return (
          <div key={tab.id} className="border-b border-dark/[0.08] last:border-b-0 bg-cream-light">
            {/* Header — always visible */}
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="w-full flex items-start justify-between px-[28px] pt-[32px] pb-[0px] text-left gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[7px] mb-[16px]">
                  <img
                    src="/images/cooper-icon.svg"
                    alt=""
                    className="w-[16px] h-[16px] shrink-0"
                    style={isOpen
                      ? { filter: 'invert(35%) sepia(70%) saturate(800%) hue-rotate(355deg) brightness(90%)' }
                      : { filter: 'brightness(0) opacity(0.25)' }
                    }
                  />
                  <p className={`font-grotesk font-medium text-[11px] tracking-[1.2px] uppercase ${isOpen ? 'text-accent-orange' : 'text-dark/60'}`}>
                    {tab.category}
                  </p>
                </div>
                <h3 className="font-serif text-[26px] leading-[1.2] text-dark">
                  {tab.title}
                </h3>
              </div>
              <span className="font-sans text-[24px] font-light text-dark/35 shrink-0 mt-[4px] leading-none select-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {/* Description — always visible */}
            <div className="px-[28px] pt-[20px] pb-[28px]">
              <p className="font-sans text-[17px] leading-[1.7] text-dark/55">
                {tab.description}
              </p>
            </div>

            {/* Expandable body — checks + image */}
            <div style={{ maxHeight: isOpen ? '700px' : '0px', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div className="px-[28px] pb-[32px]">
                <div className="flex flex-col gap-[16px]">
                  {tab.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-[10px]">
                      <img src="/images/check-circle.svg" alt="" className="w-[20px] h-[20px] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[15px] leading-[1.5] text-dark">{check}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background image strip with UI panels */}
              <div className="relative h-[340px] overflow-hidden">
                <img src={bgImages[idx]} alt="" width={2000} height={1116} srcSet={bgSrcSet(bgImages[idx])} sizes="100vw" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(-89.4deg, rgba(186,67,9,0.36) 35%, rgba(186,67,9,0) 70%)' }} />
                <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(241.6deg, rgba(186,186,9,0) 43%, rgba(186,89,9,0.43) 57%)' }} />
                <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 90% -15%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.56) 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 100% 110%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.52) 100%)' }} />
                {/* UI panels — only mounted when open so animation replays each time */}
                {isOpen && (
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    {idx === 0 && (
                      <div style={{ position: 'absolute', top: 40, left: '50%', width: 500, marginLeft: -250, transform: 'scale(0.65)', transformOrigin: 'top center' }}>
                        <SubmissionPanel />
                      </div>
                    )}
                    {idx === 1 && (
                      <div style={{ position: 'absolute', top: 36, left: '50%', width: 440, marginLeft: -220, transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                        <PortalsPanel />
                      </div>
                    )}
                    {idx === 2 && (
                      <div style={{ position: 'absolute', top: 92, left: '50%', width: 580, marginLeft: -280, transform: 'scale(0.55)', transformOrigin: 'top center' }}>
                        <ProposalPanel />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OnePlatform() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  // startRef/progressRef are written by the rAF effect below (never during
  // render); progressRef mirrors `progress` so the effect can resume mid-bar
  // without depending on the state value.
  const startRef = useRef(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [animKey, setAnimKey] = useState(0)
  const active = tabs[activeIdx]

  const goNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % tabs.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    progressRef.current = 0
  }, [])

  // Only start the auto-advance + progress bar once the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          setAnimKey((k) => k + 1) // replay panel animations from the top
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Animation frame loop for smooth progress bar. Keyed on animKey (bumped by
  // every transition, including same-tab clicks) so each one restarts the
  // clock from progressRef.
  useEffect(() => {
    if (!inView) return

    startRef.current = Date.now() - (progressRef.current / 100) * DURATION

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      progressRef.current = pct
      setProgress(pct)
      if (pct >= 100) {
        goNext()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, animKey, goNext])

  // Manual click: restart this tab's progress from 0 and keep the carousel running
  const handleTabClick = (idx: number) => {
    setActiveIdx(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    progressRef.current = 0
  }

  return (
    <section ref={sectionRef} className="bg-cream py-[60px] md:py-[100px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[62px]">
        {/* Heading */}
        <p className="font-grotesk font-medium text-[13px] tracking-[1.45px] uppercase text-accent-orange text-center mb-[14px] md:mb-[16px]">
          Spotlight Use Case
        </p>
        <h2 className="font-serif text-[36px] md:text-[38px] leading-[1.2] text-dark text-center mb-[40px] md:mb-[60px]">
          Agencies & Brokers
        </h2>

        {/* Mobile accordion */}
        <MobileAccordion />

        {/* Card — desktop only (≥lg, matches the accordion's lg:hidden so they never both show) */}
        <div
          className="hidden lg:block bg-cream-light border-4 border-black/[0.02] overflow-hidden relative md:max-h-[755px]"
          style={{ boxShadow: '0px 7.5px 69.6px -20px rgba(0,0,0,0.33)' }}
        >
          {/* Tab bar */}
          <div className="flex">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(i)}
                className={`relative flex-1 min-h-[56px] md:h-[73px] px-[4px] md:px-0 flex items-center justify-center text-center leading-[1.2] border-b border-r border-black/[0.12] font-grotesk font-medium text-[11px] md:text-[14.5px] tracking-[0.4px] md:tracking-[1.45px] uppercase cursor-pointer transition-colors ${
                  activeIdx === i
                    ? 'text-dark bg-cream-light'
                    : 'text-dark/40 bg-cream-light hover:text-dark/60'
                } last:border-r-0`}
              >
                {/* Progress line on top */}
                <span
                  className="absolute top-0 left-0 h-[3px] bg-accent-orange"
                  style={{
                    width: activeIdx === i ? `${progress}%` : '0%',
                    transition: activeIdx === i ? 'none' : 'width 0.3s ease',
                  }}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 h-auto md:h-[682px] ${activeIdx !== 2 ? 'overflow-hidden' : ''}`}>
            {/* Left text */}
            <div className="px-[24px] md:px-[62px] pt-[48px] md:pt-[80px] pb-[40px] md:pb-[60px] flex flex-col overflow-hidden h-auto md:h-[682px]" key={`text-${animKey}`}>
              {/* Cooper icon — orange */}
              <svg width="42" height="42" viewBox="0 0 84 84" fill="none" className="mb-[20px] shrink-0 animate-fade-in" style={{ animationDelay: '0.05s' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M60.0615 0C72.8642 0.000149885 83.2434 10.3788 83.2435 23.1815L83.2416 23.4811C83.1479 30.88 79.5864 37.442 74.1093 41.621C79.6604 45.8563 83.2435 52.5399 83.2435 60.061L83.2416 60.3607C83.0811 73.0254 72.7642 83.2428 60.0615 83.243L59.7619 83.2411C52.3632 83.1473 45.8009 79.5862 41.622 74.1093C37.3866 79.6603 30.7026 83.2429 23.1815 83.243L22.8818 83.2411C10.2172 83.0805 7.73898e-05 72.7637 0 60.061C4.11592e-05 52.5405 3.58211 45.8573 9.13223 41.622C3.58171 37.3866 7.63667e-06 30.7023 0 23.1815C7.00685e-05 10.3787 10.3787 7.00776e-05 23.1815 0C30.7026 4.03379e-05 37.3861 3.58279 41.6215 9.13367C45.8568 3.58276 52.5404 4.1168e-05 60.0615 0ZM18.6642 46.9719C13.2366 48.8446 9.33768 53.9971 9.33763 60.061C9.3377 67.7067 15.5358 73.9052 23.1815 73.9054C29.5238 73.9053 34.8689 69.6397 36.5073 63.8212C36.5133 63.8224 36.5195 63.8234 36.5255 63.8246C27.8285 62.0864 20.8884 55.4832 18.6642 46.9719ZM63.598 46.6742C61.5421 54.9938 54.9941 61.5414 46.6747 63.598C48.2377 69.5303 53.6383 73.9053 60.0615 73.9054C67.7072 73.9052 73.9058 67.7067 73.9059 60.061C73.9058 53.6377 69.5306 48.2371 63.598 46.6742ZM41.0933 27.2504C33.4476 27.2505 27.2496 33.4486 27.2495 41.0943C27.2495 48.7401 33.4476 54.9386 41.0933 54.9386C48.7392 54.9386 54.9377 48.7401 54.9377 41.0943C54.9376 33.4485 48.7391 27.2505 41.0933 27.2504ZM64.2686 41.6225C64.2725 41.4469 64.2758 41.2708 64.2758 41.0943L64.2734 41.394C64.2724 41.4702 64.2703 41.5464 64.2686 41.6225ZM60.0615 9.33762C53.9972 9.33768 48.8444 13.2371 46.9719 18.6651C46.9635 18.6629 46.9549 18.6606 46.9464 18.6584C55.4854 20.8798 62.1083 27.847 63.8332 36.5751C63.8288 36.5524 63.8253 36.5295 63.8207 36.5068C69.6397 34.8687 73.9058 29.5241 73.9059 23.1815C73.9058 15.5358 67.7072 9.33777 60.0615 9.33762ZM36.1884 18.4338C34.2509 13.1266 29.1592 9.33768 23.1815 9.33762C15.5357 9.33769 9.3377 15.5357 9.33763 23.1815C9.33764 29.1593 13.1266 34.2509 18.4338 36.1883C20.3441 27.3232 27.323 20.3437 36.1884 18.4338Z" fill="#d95611"/>
              </svg>
              {/* Category label */}
              <p className="font-grotesk font-medium text-[13px] tracking-[1.45px] uppercase text-dark/60 mb-[16px] md:mb-[20px] shrink-0 animate-fade-in" style={{ animationDelay: '0.08s' }}>
                {active.category}
              </p>
              <h3 className="font-serif text-[26px] md:text-[38px] leading-[1.15] text-dark mb-[20px] md:mb-[28px] max-w-[445px] animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {active.title}
              </h3>
              <p className="font-sans text-[16px] md:text-[17.8px] leading-[1.5] text-dark/70 max-w-[491px] mb-[32px] md:mb-[44px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
                {active.description}
              </p>
              <div className="flex flex-col gap-[20px]">
                {active.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-[12px] animate-fade-blur-in" style={{ animationDelay: `${0.4 + i * 0.12}s` }}>
                    <img src="/images/check-circle.svg" alt="" className="w-[22px] h-[22px] shrink-0" />
                    <p className="font-sans text-[16px] leading-[1.4] text-dark">{check}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — layered background + UI overlay */}
            <div className={`relative min-h-[440px] md:h-auto border-t md:border-t-0 md:border-l border-black/[0.12] overflow-hidden flex items-center justify-center ${activeIdx !== 2 ? 'md:overflow-hidden' : 'md:overflow-visible'}`}>
              {/* Background images — one per tab, crossfaded with opacity */}
              {bgImages.map((src, i) => (
                <img key={src} src={src} alt="" width={2000} height={1116}
                  srcSet={bgSrcSet(src)}
                  sizes="(min-width: 768px) 50vw, 100vw" loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: activeIdx === i ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(-89.4deg, rgba(186,67,9,0.36) 35%, rgba(186,67,9,0) 70%)' }} />
              <div className="absolute inset-0 mix-blend-hard-light" style={{ backgroundImage: 'linear-gradient(241.6deg, rgba(186,186,9,0) 43%, rgba(186,89,9,0.43) 57%)' }} />
              <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 90% -15%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.56) 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 100% 110%, rgba(55,27,19,0) 46%, rgba(55,27,19,0.52) 100%)' }} />

              {/* UI Elements — per-tab coded panels. Submission and Proposal have
                  their own responsive layout. Portals is still a desktop-fixed
                  layout, shrunk uniformly until it gets the same treatment. */}
              <div className="relative z-10 w-full py-[24px] px-[14px] md:p-[40px]" key={`ui-${animKey}`}>
                {activeIdx === 0 && (
                  <div className="w-full flex justify-center">
                    <SubmissionPanel />
                  </div>
                )}
                {activeIdx === 1 && (
                  <div className="w-full flex justify-center scale-[0.85] sm:scale-[0.95] md:scale-100 origin-center">
                    <PortalsPanel />
                  </div>
                )}
                {activeIdx === 2 && <ProposalPanel />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
