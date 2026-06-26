/* ──────────────────────────────────────────────────────────────
   Integrations — horizontal data-flow layout.
   Sources (left) → Cooper orb (centre) → tool-logo grid (right),
   linked by curved connectors with travelling pulses.
   Followed by a 3-card feature row and a customer logo wall.
   Layout reproduced from the "Idea V1" reference, Cooper content.
─────────────────────────────────────────────────────────────── */

/* ── Cooper interlocked mark (currentColor) ── */
function CooperMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 84" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60.0615 0C72.8642 0.000149885 83.2434 10.3788 83.2435 23.1815L83.2416 23.4811C83.1479 30.88 79.5864 37.442 74.1093 41.621C79.6604 45.8563 83.2435 52.5399 83.2435 60.061L83.2416 60.3607C83.0811 73.0254 72.7642 83.2428 60.0615 83.243L59.7619 83.2411C52.3632 83.1473 45.8009 79.5862 41.622 74.1093C37.3866 79.6603 30.7026 83.2429 23.1815 83.243L22.8818 83.2411C10.2172 83.0805 7.73898e-05 72.7637 0 60.061C4.11592e-05 52.5405 3.58211 45.8573 9.13223 41.622C3.58171 37.3866 7.63667e-06 30.7023 0 23.1815C7.00685e-05 10.3787 10.3787 7.00776e-05 23.1815 0C30.7026 4.03379e-05 37.3861 3.58279 41.6215 9.13367C45.8568 3.58276 52.5404 4.1168e-05 60.0615 0ZM18.6642 46.9719C13.2366 48.8446 9.33768 53.9971 9.33763 60.061C9.3377 67.7067 15.5358 73.9052 23.1815 73.9054C29.5238 73.9053 34.8689 69.6397 36.5073 63.8212C36.5133 63.8224 36.5195 63.8234 36.5255 63.8246C27.8285 62.0864 20.8884 55.4832 18.6642 46.9719ZM63.598 46.6742C61.5421 54.9938 54.9941 61.5414 46.6747 63.598C48.2377 69.5303 53.6383 73.9053 60.0615 73.9054C67.7072 73.9052 73.9058 67.7067 73.9059 60.061C73.9058 53.6377 69.5306 48.2371 63.598 46.6742ZM41.0933 27.2504C33.4476 27.2505 27.2496 33.4486 27.2495 41.0943C27.2495 48.7401 33.4476 54.9386 41.0933 54.9386C48.7392 54.9386 54.9377 48.7401 54.9377 41.0943C54.9376 33.4485 48.7391 27.2505 41.0933 27.2504ZM64.2686 41.6225C64.2725 41.4469 64.2758 41.2708 64.2758 41.0943L64.2734 41.394C64.2724 41.4702 64.2703 41.5464 64.2686 41.6225ZM60.0615 9.33762C53.9972 9.33768 48.8444 13.2371 46.9719 18.6651C46.9635 18.6629 46.9549 18.6606 46.9464 18.6584C55.4854 20.8798 62.1083 27.847 63.8332 36.5751C63.8288 36.5524 63.8253 36.5295 63.8207 36.5068C69.6397 34.8687 73.9058 29.5241 73.9059 23.1815C73.9058 15.5358 67.7072 9.33777 60.0615 9.33762ZM36.1884 18.4338C34.2509 13.1266 29.1592 9.33768 23.1815 9.33762C15.5357 9.33769 9.3377 15.5357 9.33763 23.1815C9.33764 29.1593 13.1266 34.2509 18.4338 36.1883C20.3441 27.3232 27.323 20.3437 36.1884 18.4338Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ── Monochrome glyphs for the source cards (lucide-style) ── */
const glyph = {
  inbox: (
    <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  ),
  data: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
  ),
  ams: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  carriers: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4" />
  ),
}

function SourceIcon({ name }: { name: keyof typeof glyph }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[17px] h-[17px]"
      aria-hidden
    >
      {glyph[name]}
    </svg>
  )
}

/* ── Data ── */
const sources = [
  { label: 'Communication', card: 'Email', icon: 'inbox' as const },
  { label: 'Data', card: 'Documents', icon: 'data' as const },
  { label: 'AMS', card: 'Policies', icon: 'ams' as const },
  { label: 'Carriers', card: 'Submissions', icon: 'carriers' as const },
]

/* Carriers Cooper submits into — sample set from the June-24 home spec. */
const carriersTop = ['Travelers', 'Chubb', 'Nationwide', 'The Hartford', 'Liberty Mutual', 'Zurich']
const carriersBottom = ['CNA', 'Markel', 'AmTrust', 'Progressive', 'Great American', 'Nautilus']

const tools = [
  { src: '/images/logo-gmail.png', label: 'Gmail' },
  { src: '/images/logo-outlook.png', label: 'Outlook' },
  { src: '/images/logo-salesforce.png', label: 'Salesforce' },
  { src: '/images/logo-docs.png', label: 'Google Docs' },
  { src: '/images/logo-dropbox.png', label: 'Dropbox' },
  { src: '/images/logo-sharepoint.png', label: 'SharePoint' },
  { src: '/images/logo-drive.png', label: 'Google Drive' },
  { src: '/images/logo-slack.png', label: 'Slack' },
  { src: '/images/logo-gcloud.png', label: 'Google Cloud' },
  { src: '/images/logo-hawksoft.png', label: 'HawkSoft' },
  { src: '/images/logo-epic.png', label: 'Applied Epic' },
  { src: '/images/logo-ams360.png', label: 'AMS360' },
]

/* ── Diagram geometry (xl canvas) ── */
const VW = 1200
const VH = 600
const ORB = { x: 600, y: 300, r: 75 }

// Vertical centres for the 4 left rows and the 4 left-column grid tiles.
const srcY = [96, 232, 368, 504]
const colY = [168, 256, 344, 432]
const CARD_RIGHT = 300 // right edge of source cards (connector start)
const GRID_LEFT = 892 // left edge of the logo grid (connector end, col 0)

const inPath = (y: number) =>
  `M ${CARD_RIGHT} ${y} C ${ORB.x - 190} ${y}, ${ORB.x - 185} ${ORB.y}, ${ORB.x - ORB.r} ${ORB.y}`
const outPath = (y: number) =>
  `M ${ORB.x + ORB.r} ${ORB.y} C ${ORB.x + 110} ${ORB.y}, ${GRID_LEFT - 112} ${y}, ${GRID_LEFT} ${y}`

const connectors = [
  ...srcY.map((y, i) => ({ id: `in-${i}`, d: inPath(y), dir: 'in' as const, dur: 2.7 + i * 0.18, delay: -i * 0.55 })),
  ...colY.map((y, i) => ({ id: `out-${i}`, d: outPath(y), dir: 'out' as const, dur: 2.7 + i * 0.18, delay: -i * 0.4 })),
]

/* ── Reusable bits ── */
function PillButton() {
  return (
    <a
      href="#integrations"
      className="group inline-flex items-center gap-[10px] rounded-full border border-dark/15 bg-cream-light px-[22px] py-[13px] font-grotesk text-[13px] font-medium tracking-[0.3px] text-dark shadow-[0_4px_18px_-8px_rgba(30,26,21,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:border-dark/25 hover:shadow-[0_10px_28px_-10px_rgba(30,26,21,0.3)]"
    >
      Explore integrations
      <span className="transition-transform duration-300 group-hover:translate-x-[3px]">→</span>
    </a>
  )
}

function CooperOrb({ size = 150 }: { size?: number }) {
  return (
    <div className="cooper-orb relative grid place-items-center" style={{ width: size, height: size }}>
      {/* outer glow */}
      <div
        className="orb-glow absolute rounded-full blur-2xl"
        style={{
          inset: -size * 0.35,
          background: 'radial-gradient(circle, rgba(217,86,17,0.32), rgba(217,86,17,0) 68%)',
        }}
      />
      {/* squircle (Apple-icon style) */}
      <div
        className="orb-body relative grid place-items-center"
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.2237,
          background: 'radial-gradient(circle at 32% 26%, #38322a 0%, #1e1a15 52%, #14110c 100%)',
        }}
      >
        <CooperMark className="orb-mark w-[58px] h-[58px] text-cream-light" />
      </div>
    </div>
  )
}


/* ── Feature cards ── */
const features: { title: string; desc: string; image: string }[] = [
  {
    title: 'Triage every submission automatically.',
    desc: 'Cooper reads inbound emails and attachments, extracts the details, and routes each submission to the right place — no manual sorting.',
    image: '/images/integ-intake.png',
  },
  {
    title: 'One workspace for every policy.',
    desc: 'Quotes, endorsements, and renewals tracked in a single source of truth your team already trusts.',
    image: '/images/integ-policies.png',
  },
  {
    title: 'Built for every role on the team.',
    desc: 'From producers to account managers, Cooper fits the way your agency already works.',
    image: '/images/integ-roles.png',
  },
]

/* ── Carrier name marquee — one continuously scrolling row ── */
function CarrierMarquee({ names, reverse = false, duration = 34 }: { names: string[]; reverse?: boolean; duration?: number }) {
  return (
    <div
      className="flex w-max items-center"
      style={{ animation: `${reverse ? 'carrier-marquee-r' : 'carrier-marquee-l'} ${duration}s linear infinite` }}
    >
      {[...names, ...names].map((name, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-[26px] font-sans text-[15px] font-medium leading-none text-dark/40">{name}</span>
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent-orange/40" />
        </span>
      ))}
    </div>
  )
}

export default function Integrations() {
  return (
    <section id="integrations" className="bg-cream-light overflow-hidden px-[40px]">
      <div className="mx-auto max-w-[1440px] px-[40px] py-[96px]">
        {/* ── Header (two columns) ── */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <p className="mb-[18px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-accent-orange">
              Integrations
            </p>
            <h2 className="font-serif text-[40px] leading-[1.12] text-dark sm:text-[48px]">
              Works with the tools you already use
            </h2>
          </div>
          <div className="lg:max-w-[360px] lg:pb-[6px]">
            <p className="mb-[22px] font-sans text-[16.5px] leading-[1.55] text-dark/55">
              Cooper connects to your existing systems. No rip and replace. Your data stays where it lives.
            </p>
            <PillButton />
          </div>
        </div>

        {/* ──────────── Diagram panel ──────────── */}
        <div className="relative mt-[56px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream/40 shadow-[0_30px_80px_-50px_rgba(30,26,21,0.45)]">
          {/* faint dotted texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage: 'radial-gradient(rgba(30,26,21,0.07) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />

          {/* ── xl: absolute flow canvas ── */}
          <div className="relative mx-auto hidden xl:block" style={{ width: VW, height: VH }}>
            {/* connectors */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={VW}
              height={VH}
              viewBox={`0 0 ${VW} ${VH}`}
              fill="none"
            >
              <defs>
                <linearGradient id="flowIn" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#d95611" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#d95611" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="flowOut" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#d95611" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#d95611" stopOpacity="0.22" />
                </linearGradient>
              </defs>
              {connectors.map((c) => (
                <path
                  key={`p-${c.id}`}
                  d={c.d}
                  stroke={c.dir === 'in' ? 'url(#flowIn)' : 'url(#flowOut)'}
                  strokeWidth="1.6"
                  strokeDasharray="5 6"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {connectors.map((c) => (
                <circle key={`d-${c.id}`} r="3.6" fill="#d95611">
                  <animateMotion dur={`${c.dur}s`} begin={`${c.delay}s`} repeatCount="indefinite" path={c.d} />
                </circle>
              ))}
            </svg>

            {/* left source rows */}
            {sources.map((s, i) => (
              <div
                key={s.label}
                className="absolute flex items-center gap-[14px]"
                style={{ left: 56, top: srcY[i], transform: 'translateY(-50%)' }}
              >
                <span className="w-[72px] text-right font-serif text-[19px] text-dark/70">{s.label}</span>
                <div className="flex items-center gap-[10px] rounded-[14px] border border-dark/[0.10] bg-cream-light px-[16px] py-[12px] shadow-[0_8px_26px_-14px_rgba(30,26,21,0.3)]">
                  <span className="text-accent-orange">
                    <SourceIcon name={s.icon} />
                  </span>
                  <span className="font-grotesk text-[13.5px] font-medium tracking-[0.2px] text-dark">{s.card}</span>
                </div>
              </div>
            ))}

            {/* centre orb */}
            <div className="absolute" style={{ left: ORB.x, top: ORB.y, transform: 'translate(-50%, -50%)' }}>
              <CooperOrb size={150} />
            </div>

            {/* right tool grid */}
            <div
              className="absolute grid grid-cols-3 gap-[16px]"
              style={{ right: 56, top: ORB.y, transform: 'translateY(-50%)' }}
            >
              {tools.map((t) => (
                <div
                  key={t.label}
                  title={t.label}
                  className="grid h-[72px] w-[72px] place-items-center rounded-[18px] border border-dark/[0.08] bg-cream-light shadow-[0_8px_26px_-14px_rgba(30,26,21,0.32)] transition-transform duration-300 hover:-translate-y-[2px]"
                >
                  <img src={t.src} alt={t.label} className="h-[30px] w-[30px] object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* ── below xl: stacked ── */}
          <div className="relative flex flex-col items-center gap-[36px] px-[24px] py-[56px] xl:hidden">
            <CooperOrb size={120} />
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              {sources.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-[10px] rounded-[14px] border border-dark/[0.10] bg-cream-light px-[16px] py-[12px] shadow-[0_8px_26px_-14px_rgba(30,26,21,0.3)]"
                >
                  <span className="text-accent-orange">
                    <SourceIcon name={s.icon} />
                  </span>
                  <span className="font-grotesk text-[13px] font-medium text-dark">
                    {s.label} · {s.card}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid max-w-[460px] grid-cols-4 gap-[14px] sm:grid-cols-6">
              {tools.map((t) => (
                <div
                  key={t.label}
                  title={t.label}
                  className="grid aspect-square place-items-center rounded-[16px] border border-dark/[0.08] bg-cream-light shadow-[0_8px_26px_-14px_rgba(30,26,21,0.32)]"
                >
                  <img src={t.src} alt={t.label} className="h-[26px] w-[26px] object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────── Feature cards ──────────── */}
        <div className="mt-[40px] grid gap-[24px] lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light shadow-[0_24px_60px_-48px_rgba(30,26,21,0.5)]"
            >
              <div className="relative m-[14px] mb-0 aspect-square overflow-hidden rounded-[16px] border border-dark/[0.06] bg-cream">
                <img src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-[24px]">
                <h3 className="font-serif text-[21px] leading-[1.25] text-dark">{f.title}</h3>
                <p className="mt-[12px] font-sans text-[14.5px] leading-[1.55] text-dark/55">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ──────────── Customer logo wall ──────────── */}
        <div className="mt-[24px] grid items-stretch gap-[24px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light p-[14px] md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-center rounded-[14px] bg-cream/50 p-[28px]">
            <p className="font-serif text-[24px] leading-[1.3] text-dark">
              Trusted by forward-thinking insurance teams.
            </p>
          </div>
          <div
            className="relative flex flex-col justify-center gap-[18px] overflow-hidden rounded-[14px] bg-cream/40 py-[40px]"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)',
            }}
          >
            <style>{`
              @keyframes carrier-marquee-l { from { transform: translateX(0) } to { transform: translateX(-50%) } }
              @keyframes carrier-marquee-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
            `}</style>
            <CarrierMarquee names={carriersTop} />
            <CarrierMarquee names={carriersBottom} reverse duration={38} />
          </div>
        </div>
      </div>
    </section>
  )
}
