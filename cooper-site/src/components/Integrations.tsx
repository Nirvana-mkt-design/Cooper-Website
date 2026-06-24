import type { ReactNode } from 'react'

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
  { label: 'Inbox', card: 'Email', icon: 'inbox' as const },
  { label: 'Data', card: 'Documents', icon: 'data' as const },
  { label: 'AMS', card: 'Policies', icon: 'ams' as const },
  { label: 'Carriers', card: 'Submissions', icon: 'carriers' as const },
]

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

/* ──────────────────────────────────────────────────────────────
   WorkflowVisual — animated rules-builder mock for the intake card.
   Natural 470×290 canvas; the parent clips the right/bottom edge so
   it reads as a peek into a larger board (matches the reference).
─────────────────────────────────────────────────────────────── */
const wfIcon = {
  trigger: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />,
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  require: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
  notify: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
}

function WfNode({ name, accent = false, x, y, cls = '' }: { name: keyof typeof wfIcon; accent?: boolean; x: number; y: number; cls?: string }) {
  return (
    <div
      className={`absolute grid h-[28px] w-[28px] place-items-center rounded-[8px] ${cls}`}
      style={{
        left: x,
        top: y,
        background: accent ? '#3f6fd1' : '#dcd8cf',
        boxShadow: accent ? '0 4px 12px -4px rgba(63,111,209,0.55)' : '0 2px 6px -3px rgba(30,26,21,0.25)',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={accent ? '#ffffff' : '#6b675f'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[16px] w-[16px]"
        aria-hidden
      >
        {wfIcon[name]}
      </svg>
    </div>
  )
}

function WfPill({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-[9px] bg-white px-[11px] py-[7px] font-sans text-[12.5px] leading-none text-dark shadow-[0_3px_11px_-4px_rgba(30,26,21,0.22)]"
      style={muted ? { color: 'rgba(30,26,21,0.4)' } : undefined}
    >
      {children}
    </span>
  )
}

function WfChip({ initials, name, bg, fg }: { initials: string; name: string; bg: string; fg: string }) {
  return (
    <span className="inline-flex items-center gap-[8px] whitespace-nowrap rounded-[9px] bg-white py-[5px] pl-[5px] pr-[12px] font-sans text-[12.5px] leading-none text-dark shadow-[0_3px_11px_-4px_rgba(30,26,21,0.22)]">
      <span
        className="grid h-[20px] w-[20px] place-items-center rounded-[6px] text-[9.5px] font-bold"
        style={{ background: bg, color: fg }}
      >
        {initials}
      </span>
      {name}
    </span>
  )
}

function WorkflowVisual() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(30,26,21,0.10) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        backgroundColor: '#f4efe3',
      }}
    >
      <div className="absolute left-[16px] top-1/2 -translate-y-1/2" style={{ width: 470, height: 280 }}>
        {/* connectors */}
        <svg className="absolute inset-0 pointer-events-none" width="470" height="280" fill="none" aria-hidden>
          <path className="wf-d1" d="M30 42 V78" stroke="#bdb7aa" strokeWidth="1.5" pathLength={100} strokeDasharray={100} />
          <path className="wf-d2" d="M30 106 V148 Q30 156 38 156 H43" stroke="#bdb7aa" strokeWidth="1.5" fill="none" pathLength={100} strokeDasharray={100} />
          <path className="wf-arrow" d="M40 152 L46 156 L40 160 Z" fill="#bdb7aa" />
          <path className="wf-l3" d="M58 170 V206" stroke="#cbc6ba" strokeWidth="1.5" strokeDasharray="1.5 3.5" />
        </svg>

        {/* nodes */}
        <WfNode name="trigger" accent x={16} y={14} cls="wf-s1" />
        <WfNode name="filter" x={16} y={78} cls="wf-s2" />
        <WfNode name="require" x={44} y={142} cls="wf-s3" />
        <WfNode name="notify" x={44} y={206} cls="wf-s4" />

        {/* row 1 — trigger */}
        <div className="absolute" style={{ left: 54, top: 28, transform: 'translateY(-50%)' }}>
          <div className="wf-s1 flex items-center">
            <WfPill>When a submission arrives</WfPill>
          </div>
        </div>

        {/* row 2 — condition */}
        <div className="absolute" style={{ left: 54, top: 92, transform: 'translateY(-50%)' }}>
          <div className="wf-s2 flex items-center gap-[8px]">
            <span className="font-sans text-[12.5px] text-dark/55">If the</span>
            <WfPill muted>Premium</WfPill>
            <span className="font-sans text-[12.5px] text-dark/55">exceeds</span>
            <WfPill>
              $25,000<span className="ml-[2px] text-dark/35">✕</span>
            </WfPill>
          </div>
        </div>

        {/* row 3 — require */}
        <div className="absolute" style={{ left: 82, top: 156, transform: 'translateY(-50%)' }}>
          <div className="wf-s3 flex items-center gap-[8px]">
            <span className="font-sans text-[12.5px] text-dark/55">Require</span>
            <WfChip initials="UW" name="Underwriter" bg="#cfe3cf" fg="#3f7a45" />
            <span className="font-sans text-[13px] text-dark/45">+</span>
            <WfChip initials="AM" name="Account Mgr" bg="#dbe4f7" fg="#3f6fd1" />
          </div>
        </div>

        {/* row 4 — notify */}
        <div className="absolute" style={{ left: 82, top: 220, transform: 'translateY(-50%)' }}>
          <div className="wf-s4 flex items-center gap-[8px]">
            <span className="font-sans text-[12.5px] text-dark/55">Notify</span>
            <WfChip initials="PR" name="Producer" bg="#e6ddf5" fg="#7155b0" />
          </div>
        </div>

        {/* cursor + label */}
        <svg className="wf-cursor absolute" style={{ left: 214, top: 226 }} width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden>
          <path d="M2 2 L2 19 L7 14.5 L10.5 22 L13.5 20.7 L10 13.3 L17 13 Z" fill="#1e1a15" stroke="#fffcf1" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        <div className="wf-admin absolute rounded-[8px] bg-white px-[12px] py-[6px] font-sans text-[11.5px] text-dark shadow-[0_4px_12px_-4px_rgba(30,26,21,0.3)]" style={{ left: 232, top: 250 }}>
          Admin
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   PolicyWorkspaceVisual — workspace card for "every policy".
   A policy list where rows cascade in and one status flips to Bound.
─────────────────────────────────────────────────────────────── */
function WsRow({
  cls,
  initials,
  tint,
  name,
  line,
  children,
}: {
  cls: string
  initials: string
  tint: string
  name: string
  line: string
  children: ReactNode
}) {
  return (
    <div className={`${cls} flex items-center gap-[11px] rounded-[11px] px-[10px] py-[9px]`}>
      <span
        className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[8px] text-[10px] font-bold"
        style={{ background: tint, color: '#5d5950' }}
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-[12.5px] font-medium leading-tight text-dark">{name}</span>
        <span className="block truncate font-sans text-[11px] leading-tight text-dark/45">{line}</span>
      </span>
      {children}
    </div>
  )
}

function WsBadge({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[4px] whitespace-nowrap rounded-full px-[9px] py-[4px] font-grotesk text-[10px] font-medium tracking-[0.3px]"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  )
}

function PolicyWorkspaceVisual() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(30,26,21,0.06) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        backgroundColor: '#f4efe3',
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 320 }}>
        <div className="overflow-hidden rounded-[16px] border border-dark/[0.08] bg-white shadow-[0_18px_44px_-26px_rgba(30,26,21,0.5)]">
          {/* header */}
          <div className="rise-a flex items-center justify-between border-b border-dark/[0.06] px-[16px] py-[12px]">
            <div className="flex items-center gap-[8px]">
              <span className="font-serif text-[15px] text-dark">Policies</span>
              <span className="rounded-full bg-cream px-[7px] py-[2px] font-grotesk text-[10px] font-medium text-dark/50">128</span>
            </div>
            <span className="font-grotesk text-[15px] leading-none text-dark/30">···</span>
          </div>

          {/* tabs */}
          <div className="rise-a flex gap-[4px] border-b border-dark/[0.06] px-[10px] py-[8px]">
            <span className="rounded-full bg-cream px-[11px] py-[4px] font-grotesk text-[11px] font-medium text-dark">All</span>
            <span className="px-[11px] py-[4px] font-grotesk text-[11px] text-dark/45">Quotes</span>
            <span className="px-[11px] py-[4px] font-grotesk text-[11px] text-dark/45">Renewals</span>
            <span className="px-[11px] py-[4px] font-grotesk text-[11px] text-dark/45">Claims</span>
          </div>

          {/* rows */}
          <div className="flex flex-col gap-[2px] p-[8px]">
            <WsRow cls="rise-b" initials="AB" tint="#e6ddf5" name="ABC Trucking LLC" line="Commercial Auto">
              <WsBadge bg="#f6e6cb" fg="#9a6a1a">Renewing</WsBadge>
            </WsRow>
            <WsRow cls="rise-c" initials="HF" tint="#cfe3cf" name="Harbor Freight Co" line="General Liability">
              <WsBadge bg="#cfe3cf" fg="#3f7a45">Active</WsBadge>
            </WsRow>
            <WsRow cls="rise-d" initials="SL" tint="#dbe4f7" name="Sunrise Logistics" line="Cargo">
              <WsBadge bg="#dbe4f7" fg="#3f6fd1">Quoted</WsBadge>
            </WsRow>
            <WsRow cls="rise-e" initials="MB" tint="#f0dcd2" name="Metro Builders" line="Umbrella">
              <span className="relative inline-grid h-[22px] w-[78px] place-items-center justify-items-end">
                <span className="pw-badge-out absolute right-0">
                  <WsBadge bg="#e3dfd6" fg="#6b675f">In review</WsBadge>
                </span>
                <span className="pw-badge-in absolute right-0">
                  <WsBadge bg="#cfe3cf" fg="#3f7a45">
                    <svg viewBox="0 0 24 24" className="h-[10px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Bound
                  </WsBadge>
                </span>
              </span>
            </WsRow>
          </div>

          {/* footer */}
          <div className="rise-f border-t border-dark/[0.06] px-[16px] py-[10px] font-grotesk text-[11px] tracking-[0.2px] text-dark/40">
            + 124 more across all lines
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   DocExtractVisual — "Incoming Documents" extraction panel.
   Fields populate, source docs check in, then Cooper flags the
   missing elements in an alert that slides up.
─────────────────────────────────────────────────────────────── */
function DxField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-[10px] py-[1.5px] leading-[1.35]">
      <span className="w-[96px] shrink-0 font-sans text-[11.5px] font-semibold text-dark">{label}</span>
      <span className="font-sans text-[11.5px] text-dark/45">{value}</span>
    </div>
  )
}

function DxCheck({ cls, label }: { cls: string; label: string }) {
  return (
    <span className={`${cls} inline-flex items-center gap-[5px] rounded-full border border-dark/[0.08] bg-cream-light px-[10px] py-[5px] font-grotesk text-[10.5px] font-medium tracking-[0.2px] text-dark`}>
      <svg viewBox="0 0 24 24" className="h-[11px] w-[11px] text-accent-orange" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </span>
  )
}

function DxMissing({ label }: { label: string }) {
  return (
    <span className="dx-alert inline-flex items-center gap-[6px] rounded-full border border-dashed border-dark/25 px-[10px] py-[5px] font-grotesk text-[10.5px] font-medium tracking-[0.2px] text-dark/55">
      <span className="grid h-[12px] w-[12px] place-items-center rounded-full border border-dashed border-dark/30 text-[9px] leading-none text-dark/40">+</span>
      {label}
    </span>
  )
}

function DocExtractVisual() {
  return (
    <div
      className="absolute inset-0 grid place-items-center px-[18px]"
      style={{
        backgroundImage: 'radial-gradient(rgba(30,26,21,0.06) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        backgroundColor: '#f4efe3',
      }}
    >
      <div className="w-full max-w-[332px]" style={{ transform: 'scale(0.88)' }}>
        {/* main window */}
        <div className="rise-b overflow-hidden rounded-[16px] border border-dark/[0.08] bg-white shadow-[0_18px_44px_-24px_rgba(30,26,21,0.55)]">
          <div className="flex items-center justify-between border-b border-dark/[0.06] px-[16px] py-[11px]">
            <div className="flex items-center gap-[8px]">
              <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] text-dark" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              <span className="font-sans text-[13px] font-semibold text-dark">Incoming Documents</span>
            </div>
            <span className="flex gap-[3px]">
              <i className="h-[4px] w-[4px] rounded-full bg-dark/20" />
              <i className="h-[4px] w-[4px] rounded-full bg-dark/20" />
              <i className="h-[4px] w-[4px] rounded-full bg-dark/20" />
            </span>
          </div>

          <div className="rise-c px-[16px] pt-[12px]">
            <DxField label="Named Insured" value="ABC Trucking LLC" />
            <DxField label="Policy Period" value="01/15/2025 – 01/15/2026" />
            <DxField label="Coverage Lines" value="Auto, GL, Cargo" />
            <DxField label="Limits" value="$1M CSL / $2M Aggregate" />
          </div>

          <div className="mx-[16px] my-[11px] border-t border-dark/[0.06]" />

          <div className="px-[16px] pb-[15px]">
            <p className="rise-d mb-[9px] font-sans text-[11.5px] font-semibold text-dark">Source Documents</p>
            <div className="flex flex-wrap gap-[7px]">
              <DxCheck cls="rise-d" label="ACORD 125" />
              <DxCheck cls="rise-e" label="Loss Runs" />
              <DxCheck cls="rise-f" label="Email" />
            </div>
          </div>
        </div>

        {/* alert — slides up */}
        <div className="dx-alert mt-[18px]">
          <div className="mb-[9px] flex items-center gap-[7px]">
            <CooperMark className="h-[14px] w-[14px] text-accent-orange" />
            <span className="font-sans text-[12px] font-medium text-dark/55">Cooper found something…</span>
          </div>
          <div className="rounded-[12px] border border-dark/[0.08] bg-white px-[13px] py-[12px] shadow-[0_14px_34px_-20px_rgba(30,26,21,0.5)]">
            <div className="mb-[11px] flex items-start gap-[8px]">
              <span className="mt-[4px] h-[7px] w-[7px] shrink-0 rounded-full bg-accent-orange" />
              <span className="font-sans text-[11.5px] leading-[1.45] text-dark">It looks like some elements are missing in your files.</span>
            </div>
            <div className="flex gap-[7px]">
              <DxMissing label="Driver Schedule" />
              <DxMissing label="Vehicle List" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type VisualKind = 'workflow' | 'workspace' | 'docextract'
function FeatureVisual({ kind }: { kind: VisualKind }) {
  if (kind === 'workspace') return <PolicyWorkspaceVisual />
  if (kind === 'docextract') return <DocExtractVisual />
  return <WorkflowVisual />
}

/* ── Feature cards ── */
const features: { title: string; desc: string; cta: string; visual: VisualKind }[] = [
  {
    title: 'Triage every submission automatically.',
    desc: 'Cooper reads inbound emails and attachments, extracts the details, and routes each submission to the right place — no manual sorting.',
    cta: 'Explore intake',
    visual: 'workflow',
  },
  {
    title: 'One workspace for every policy.',
    desc: 'Quotes, endorsements, and renewals tracked in a single source of truth your team already trusts.',
    cta: 'Platform overview',
    visual: 'workspace',
  },
  {
    title: 'Built for every role on the team.',
    desc: 'From producers to account managers, Cooper fits the way your agency already works.',
    cta: 'See roles',
    visual: 'docextract',
  },
]

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
              <div className="relative m-[14px] mb-0 h-[360px] overflow-hidden rounded-[16px] border border-dark/[0.06] bg-cream">
                <FeatureVisual kind={f.visual} />
              </div>
              <div className="flex flex-1 flex-col p-[24px]">
                <h3 className="font-serif text-[21px] leading-[1.25] text-dark">{f.title}</h3>
                <p className="mt-[12px] flex-1 font-sans text-[14.5px] leading-[1.55] text-dark/55">{f.desc}</p>
                <a
                  href="#"
                  className="group mt-[20px] inline-flex items-center gap-[8px] font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] text-accent-orange"
                >
                  {f.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-[3px]">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ──────────── Customer logo wall ──────────── */}
        <div className="mt-[24px] grid items-stretch gap-[24px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light p-[14px] md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between rounded-[14px] bg-cream/50 p-[28px]">
            <p className="font-serif text-[24px] leading-[1.3] text-dark">
              Trusted by forward-thinking insurance teams.
            </p>
            <a
              href="#"
              className="group mt-[24px] inline-flex items-center gap-[8px] font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] text-dark/60 transition-colors hover:text-dark"
            >
              Read the case studies
              <span className="transition-transform duration-300 group-hover:translate-x-[3px]">→</span>
            </a>
          </div>
          <div className="grid grid-cols-3 gap-[1px] overflow-hidden rounded-[14px] bg-dark/[0.06] sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid aspect-[16/9] place-items-center bg-cream-light">
                <CooperMark className="h-[24px] w-[24px] text-dark/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
