/* ──────────────────────────────────────────────────────────────
   Integrations — "Works with the tools you already use".
   Four category clusters (Records, Carriers, Documents, Communications)
   arranged around a central orange Cooper orb, linked by dashed
   orthogonal connectors over a faint grid. Followed by the
   customer carrier wall.
   Layout reproduced pixel-for-pixel from Figma "Desktop - 9".
─────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react'
import CarrierWall from './CarrierWall'

/* Scale the fixed-size diagram canvas down to fit its container
   (never up), so the layout stays proportional at every width. */
function useFitScale(natural: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / natural))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [natural])
  return { ref, scale }
}

/* ── Chip icons — brand marks for the chips ──
   Carriers use small brand marks (not wordmarks). Chubb is cropped
   from the wordmark strip to isolate the mark, matching Figma. */
type Chip = { src?: string; label: string; crop?: boolean; h?: number; maxW?: number; text?: boolean }

const logo = {
  epic: '/images/logo-epic.webp',
  hawksoft: '/images/logo-hawksoft.webp',
  ams360: '/images/logo-ams360.webp',
  ezlynx: '/images/chips/ezlynx.png',
  guidewire: '/images/logo-guidewire.svg',
  sharepoint: '/images/logo-sharepoint.webp',
  onedrive: '/images/logo-onedrive.png',
  dropbox: '/images/logo-dropbox.webp',
  hubspot: '/images/chips/hubspot.png',
  salesforce: '/images/chips/salesforce.png',
  travelers: '/images/chips/travelers.png',
  libertymutual: '/images/chips/liberty-mutual.png',
  chubb: '/images/chips/chubb.png',
  zurich: '/images/chips/zurich.png',
  hanover: '/images/chips/hanover.svg',
  outlook: '/images/logo-outlook.webp',
  teams: '/images/logo-teams.png',
  slack: '/images/logo-slack.webp',
}

type Group = { label: string; chips: Chip[]; more: string }

const GROUPS: Record<'ams' | 'carriers' | 'documents' | 'communication', Group> = {
  ams: {
    label: 'Records',
    more: 'And more...',
    chips: [
      { src: logo.epic, label: 'Applied Epic' },
      { src: logo.guidewire, label: 'Guidewire' },
      { src: logo.ams360, label: 'AMS360' },
      { src: logo.hawksoft, label: 'HawkSoft' },
      { src: logo.ezlynx, label: 'EzLynx', h: 21, maxW: 42 },
    ],
  },
  carriers: {
    label: 'Carriers',
    more: '+ hundreds more',
    chips: [
      { src: logo.travelers, label: 'Travelers', h: 22 },
      { src: logo.libertymutual, label: 'Liberty Mutual', h: 28 },
      { src: logo.chubb, label: 'Chubb', crop: true },
      { src: logo.zurich, label: 'Zurich', h: 24, maxW: 28 },
      { src: logo.hanover, label: 'The Hanover', h: 24, maxW: 26 },
    ],
  },
  documents: {
    label: 'Documents',
    more: 'And more...',
    chips: [
      { src: logo.sharepoint, label: 'SharePoint' },
      { src: logo.onedrive, label: 'OneDrive', h: 22 },
      { src: logo.dropbox, label: 'Dropbox' },
      { src: logo.hubspot, label: 'HubSpot', h: 22 },
      { src: logo.salesforce, label: 'Salesforce', h: 20, maxW: 42 },
    ],
  },
  communication: {
    label: 'Communications',
    more: 'And more...',
    chips: [
      { src: logo.outlook, label: 'Outlook' },
      { src: logo.teams, label: 'Teams' },
      { src: logo.slack, label: 'Slack' },
    ],
  },
}

/* ── Reusable pieces ── */
function ChipIcon({ item }: { item: Chip }) {
  if (item.crop) {
    // Isolate the leftmost mark from a wide wordmark strip (Figma crop).
    return (
      <span className="relative block h-[23px] w-[33px] shrink-0 overflow-hidden">
        <img src={item.src} alt="" className="absolute left-0 top-0 h-full w-[693%] max-w-none" />
      </span>
    )
  }
  return (
    <img
      src={item.src}
      alt=""
      className="w-auto shrink-0 object-contain"
      style={{ height: item.h ?? 24, maxWidth: item.maxW ?? 36 }}
    />
  )
}

function ChipTag({ item }: { item: Chip }) {
  return (
    <div
      className="relative inline-flex items-center gap-[10px] rounded-[30px] px-[20px] py-[10px]"
      style={{
        // Figma: cream fill + gradient stroke (dark @29% → transparent, 154deg).
        border: '1px solid transparent',
        background:
          'linear-gradient(#fffcf1, #fffcf1) padding-box, linear-gradient(154deg, rgba(30,26,21,0.29) 6%, rgba(30,26,21,0) 100%) border-box',
        boxShadow: '0 7px 60px -20px rgba(30,26,21,0.33), inset 7px 6px 23px 0 rgba(30,26,21,0.10)',
      }}
    >
      {!item.text && <ChipIcon item={item} />}
      <span className="whitespace-nowrap font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark">
        {item.label}
      </span>
    </div>
  )
}

function Cluster({ group }: { group: Group }) {
  // "And more..." / "+ hundreds more" render as text-only pills, matching the
  // logo chips around them.
  const more = <ChipTag item={{ label: group.more, text: true }} />
  return (
    <div className="flex flex-col gap-[26px]">
      <span className="font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark underline decoration-dotted decoration-dark/40 underline-offset-[5px]">
        {group.label}
      </span>
      <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2">
        {group.chips.map((c, i) => (
          <ChipTag key={i} item={c} />
        ))}
        {more}
      </div>
    </div>
  )
}

/* ── Diagram geometry (xl canvas = Figma panel coords, 1297×859) ── */
const VW = 1297
const VH = 859

// Connector centre-lines derived from the exact Figma connector geometry.
// Each path runs from its source node (outer dot) into the Cooper orb, so
// the travelling pulse flows "into Cooper". Dashed style matches Figma
// (#151515 @60%, 2px, dash 8/8, rounded elbows).
const CONN_PATHS: { d: string; dur: number; begin: number }[] = [
  { d: 'M 457.22 80.67 H 594.92 Q 623.84 80.67 623.84 109.99 V 321.32', dur: 2.8, begin: 0 }, // AMS → orb top
  { d: 'M 750.76 261.1 H 665 Q 638.27 261.1 638.27 288 V 320.86', dur: 2.4, begin: -0.6 }, // Carriers → orb top-right
  { d: 'M 458.65 551.75 H 589.45 Q 614.68 551.75 614.68 523.16 V 470.68', dur: 2.6, begin: -1.2 }, // Documents → orb bottom-left
  { d: 'M 766.43 675.85 H 656 Q 628.88 675.85 628.88 646 V 470.68', dur: 3.0, begin: -0.3 }, // Communication → orb bottom
]
// Source anchor dots (path starts), grey #73716D, ⌀11.36.
const CONN_STARTS: [number, number][] = [
  [457.22, 80.67],
  [750.76, 261.1],
  [458.65, 551.75],
  [766.43, 675.85],
]

/* ══════════════ Mobile (below xl) ══════════════
   Vertical hub-and-spoke on a scaled 390×1515 canvas: AMS + Carriers
   above the orb, Documents + Communication below. Same structure as
   the Figma mobile layout, but the connectors use the grey dashed
   trace of the desktop diagram instead of the flowing orange one. */
const M = 0.784 // mobile chip scale vs desktop

function useCanvasScale(targetW: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / targetW))
    ro.observe(el)
    return () => ro.disconnect()
  }, [targetW])
  return { ref, scale }
}

const MCW = 390
const MCH = 1515

function MobileChipIcon({ item }: { item: Chip }) {
  if (item.crop) {
    return (
      <span className="relative block shrink-0 overflow-hidden" style={{ height: 18, width: 26 }}>
        <img src={item.src} alt="" className="absolute left-0 top-0 h-full w-[693%] max-w-none" />
      </span>
    )
  }
  return (
    <img
      src={item.src}
      alt=""
      className="w-auto shrink-0 object-contain"
      style={{ height: (item.h ?? 24) * M, maxWidth: (item.maxW ?? 36) * M }}
    />
  )
}

function MobileChipTag({ item }: { item: Chip }) {
  return (
    <div
      className="relative inline-flex w-fit items-center gap-[7.8px] rounded-[23.5px] px-[15.7px] py-[7.8px]"
      style={{
        // Match the height of the logo chips so text-only pills ("+ hundreds
        // more" / "And more...") don't render shorter than their neighbours:
        // default icon height (24 * M) + vertical padding + border.
        minHeight: 24 * M + 2 * 7.8 + 2 * 0.784,
        border: '0.784px solid transparent',
        background:
          'linear-gradient(#fffcf1, #fffcf1) padding-box, linear-gradient(154deg, rgba(30,26,21,0.29) 6%, rgba(30,26,21,0) 100%) border-box',
        boxShadow: '0 5.9px 54.6px -15.7px rgba(30,26,21,0.33), inset 5.5px 4.7px 18.1px 0 rgba(30,26,21,0.10)',
      }}
    >
      {!item.text && <MobileChipIcon item={item} />}
      <span className="whitespace-nowrap font-grotesk text-[11.3px] font-medium uppercase leading-none tracking-[1.13px] text-dark">
        {item.label}
      </span>
    </div>
  )
}

/* "And more..." / "+ hundreds more" marker, rendered as a text-only pill to
   match the chips around it. */
function MobileMore({ children }: { children: string }) {
  return <MobileChipTag item={{ label: children, text: true }} />
}

function MobileLabel({ children }: { children: string }) {
  return (
    <span
      className="font-grotesk font-medium uppercase leading-none"
      style={{
        fontSize: 20,
        letterSpacing: '2px',
        color: 'rgba(30,26,21,0.40)',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'rgba(30,26,21,0.25)',
        textUnderlineOffset: '6px',
      }}
    >
      {children}
    </span>
  )
}

/* Mobile connector geometry (Figma) — reused, but restyled as the grey
   dashed trace. Two sub-paths per connector + cream fade masks. */
type ConnCfg = {
  viewBox: string
  v203: string
  v204: string
  rects: { x?: number; y?: number; w: number; h: number; transform?: string }[]
}

const CONN: Record<'top' | 'bottom', ConnCfg> = {
  top: {
    viewBox: '0 0 262.936 617.842',
    v203: 'M93.5009 0.000177191V96.8205C93.5009 113.389 80.0695 126.82 63.5009 126.82H4.41357',
    v204: 'M93.2847 0V96.8203C93.2847 113.389 106.716 126.82 123.285 126.82H231.936C248.505 126.82 261.936 140.252 261.936 156.82V550.639C261.936 567.207 248.505 580.639 231.936 580.639H93.2847',
    rects: [
      { w: 74.4062, h: 115.249, transform: 'matrix(0 1 1 0 0 90.176)' },
      { w: 74.4062, h: 115.249, transform: 'matrix(0 1 1 0 83.2466 543.436)' },
      { x: 61.4902, y: 0, w: 74.4062, h: 115.249 },
    ],
  },
  bottom: {
    viewBox: '0 0 281.702 513.949',
    v203: 'M93.5009 1.71456e-06V96.8203C93.5009 113.389 80.0695 126.82 63.5009 126.82H4.41357',
    v204: 'M93.2847 0.000556946V152.838C93.2847 169.407 106.716 182.838 123.285 182.838H217.894C234.462 182.838 247.894 196.27 247.894 212.838V450.436C247.894 467.004 234.462 480.436 217.894 480.436H177.082',
    rects: [
      { w: 74.4062, h: 115.249, transform: 'matrix(0 1 1 0 0 90.1758)' },
      { w: 74.4062, h: 115.249, transform: 'matrix(0 1 1 0 166.452 439.543)' },
      { x: 61.4902, y: 0, w: 74.4062, h: 115.249 },
    ],
  },
}

function MobileConnector({
  cfg, gradId, left, top, width, height, transform,
}: {
  cfg: ConnCfg; gradId: string
  left: number; top: number; width: number; height: number; transform?: string
}) {
  return (
    <svg
      viewBox={cfg.viewBox}
      preserveAspectRatio="none"
      fill="none"
      className="absolute pointer-events-none overflow-visible"
      style={{ left, top, width, height, transform }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="115.249" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFCF1" />
          <stop offset="1" stopColor="#FFFCF1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grey dashed trace (matches desktop: #151515 @60%, 2px, dash 8/8) */}
      {[cfg.v203, cfg.v204].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="#151515"
          strokeOpacity="0.6"
          strokeWidth={2}
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      ))}

      {/* travelling grey pulse along each line (same as desktop) */}
      {[cfg.v203, cfg.v204].map((d, i) => (
        <circle key={`m${i}`} r={5.5} fill="#73716D">
          <animateMotion dur={`${2.6 + i * 0.6}s`} begin={`${i * -0.9}s`} repeatCount="indefinite" path={d} rotate="auto" />
        </circle>
      ))}

      {/* cream fade masks over the line ends */}
      {cfg.rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} transform={r.transform} fill={`url(#${gradId})`} />
      ))}
    </svg>
  )
}

/* Renders an icon chip or a text-only chip (Markel / The Hanover). */
function MobileChip({ item }: { item: Chip }) {
  return <MobileChipTag item={item} />
}

function MobileIntegrations() {
  const { ref, scale } = useCanvasScale(MCW)
  return (
    <div className="mx-auto mt-[40px] w-full max-w-[390px] xl:hidden">
      <div ref={ref} className="relative overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light">
        {/* aspect-ratio spacer */}
        <div style={{ paddingBottom: `${(MCH / MCW) * 100}%` }} />

        {/* scaled canvas */}
        <div
          className="absolute left-0 top-0"
          style={{ width: MCW, height: MCH, transformOrigin: 'top left', transform: `scale(${scale})` }}
        >
          {/* faint grid background */}
          <img
            src="/images/integ/grid-bg.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.35]"
          />

          {/* grey dashed connectors */}
          <MobileConnector cfg={CONN.top} gradId="mc-top-fade" left={97.5} top={71.5} width={261.9} height={617.8} transform="rotate(180deg) scaleX(-1)" />
          <MobileConnector cfg={CONN.bottom} gradId="mc-bot-fade" left={97.5} top={774.8} width={281.7} height={513.9} />

          {/* centre orb */}
          <img
            src="/images/integ/orb.svg"
            alt=""
            aria-hidden
            className="absolute z-10 pointer-events-none"
            style={{ left: 93.5, top: 621.5, width: 202, height: 202, animation: 'orb-bump 4s ease-in-out infinite' }}
          />

          {/* labels */}
          <div className="absolute" style={{ left: 32.7, top: 100 }}><MobileLabel>{GROUPS.ams.label}</MobileLabel></div>
          <div className="absolute" style={{ left: 32.7, top: 314 }}><MobileLabel>{GROUPS.carriers.label}</MobileLabel></div>
          <div className="absolute" style={{ left: 40.6, top: 995 }}><MobileLabel>{GROUPS.documents.label}</MobileLabel></div>
          <div className="absolute" style={{ left: 40.6, top: 1240 }}><MobileLabel>{GROUPS.communication.label}</MobileLabel></div>

          {/* AMS — natural-wrap grid (even spacing, pills sit adjacent) */}
          <div className="absolute flex flex-wrap items-center gap-x-[8px] gap-y-[7.8px]" style={{ left: 32.7, top: 163.5, width: 300.5 }}>
            {GROUPS.ams.chips.map((c, i) => <MobileChip key={i} item={c} />)}
            <MobileMore>{GROUPS.ams.more}</MobileMore>
          </div>

          {/* Carriers — natural-wrap grid (all pills visible, no fade-off edge).
              Nudged up as a block so the wrapped rows clear the flow line. */}
          <div className="absolute flex flex-wrap items-center gap-x-[11px] gap-y-[10.2px]" style={{ left: 32.7, top: 364.4, width: 300.5 }}>
            {GROUPS.carriers.chips.map((c, i) => <MobileChip key={i} item={c} />)}
            <MobileMore>{GROUPS.carriers.more}</MobileMore>
          </div>

          {/* Documents — bottom-left 2-col grid */}
          <div className="absolute grid grid-cols-2 justify-items-start gap-x-[3.9px] gap-y-[7.8px]" style={{ left: 40.6, top: 1063.8, width: 281 }}>
            {GROUPS.documents.chips.map((c, i) => <MobileChip key={i} item={c} />)}
            <MobileMore>{GROUPS.documents.more}</MobileMore>
          </div>

          {/* Communication — bottom-right 2-col grid */}
          <div className="absolute grid grid-cols-2 justify-items-start gap-x-[3.9px] gap-y-[7.8px]" style={{ left: 40.6, top: 1303.5, width: 249.3 }}>
            {GROUPS.communication.chips.map((c, i) => <MobileChip key={i} item={c} />)}
            <MobileMore>{GROUPS.communication.more}</MobileMore>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Integrations() {
  const { ref: fitRef, scale } = useFitScale(VW)
  return (
    <section id="integrations" className="bg-cream-light overflow-hidden px-5 sm:px-6 lg:px-[40px]">
      <div className="mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-[40px] py-[64px] lg:py-[96px]">
        {/* ── Header (two columns) ── */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <p className="mb-[18px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-accent-orange">
              Integrations
            </p>
            <h2 className="font-serif text-[32px] leading-[1.12] text-dark md:text-[44px] lg:text-[48px]">
              Works with the tools you already use
            </h2>
          </div>
          <div className="lg:max-w-[360px] lg:pb-[6px]">
            <p className="font-sans text-[16.5px] leading-[1.55] text-dark/55">
              Cooper connects to your existing systems. No rip and replace. Your data stays where it lives.
            </p>
          </div>
        </div>

        {/* ──────────── Diagram panel (xl and up) ──────────── */}
        <div className="relative mt-[40px] hidden overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light shadow-[0_30px_80px_-50px_rgba(30,26,21,0.45)] xl:block">
          {/* exact Figma grid tile (solid dark lines → softened to the
              faint warm-grey the design shows) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'url(/images/integ/grid.png)',
              backgroundRepeat: 'repeat',
              backgroundSize: '68px 68px',
              backgroundPosition: 'center',
            }}
          />
          {/* radial vignette — fades the grid to cream at the edges */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(255,252,241,0) 0%, rgba(255,252,241,1) 100%)',
            }}
          />

          {/* ── xl: absolute flow canvas (scaled to fit) ── */}
          <div ref={fitRef} className="relative hidden w-full xl:block" style={{ height: VH * scale }}>
            <div
              className="absolute left-1/2 top-0"
              style={{ width: VW, height: VH, marginLeft: -VW / 2, transformOrigin: 'top center', transform: `scale(${scale})` }}
            >
            {/* dashed connectors + travelling pulses (flow into Cooper) */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={VW}
              height={VH}
              viewBox={`0 0 ${VW} ${VH}`}
              fill="none"
            >
              {CONN_PATHS.map((c, i) => (
                <path
                  key={`p-${i}`}
                  d={c.d}
                  stroke="#151515"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
              ))}
              {CONN_STARTS.map(([cx, cy], i) => (
                <circle key={`s-${i}`} cx={cx} cy={cy} r="5.68" fill="#73716D" />
              ))}
              {CONN_PATHS.map((c, i) => (
                <circle key={`m-${i}`} r="5.68" fill="#73716D">
                  <animateMotion
                    dur={`${c.dur}s`}
                    begin={`${c.begin}s`}
                    repeatCount="indefinite"
                    path={c.d}
                    rotate="auto"
                  />
                </circle>
              ))}
            </svg>

            {/* cream fade masks (Figma) — dissolve the dashed lines + pulses
                into the orb where they meet it, top and bottom */}
            <div
              className="absolute pointer-events-none"
              style={{ left: 592.97, top: 211.76, width: 74.41, height: 115.25, background: 'linear-gradient(0deg, #FFFCF1 0%, rgba(255,252,241,0) 100%)' }}
            />
            <div
              className="absolute pointer-events-none"
              style={{ left: 575, top: 463.76, width: 74.41, height: 115.25, background: 'linear-gradient(180deg, #FFFCF1 0%, rgba(255,252,241,0) 100%)' }}
            />

            {/* centre orb (SVG body 144.6² centred at 625,396) */}
            <img
              src="/images/integ/orb.svg"
              alt=""
              aria-hidden
              className="absolute pointer-events-none"
              style={{ left: 502.98, top: 281.02, width: 244, height: 244 }}
            />

            {/* four clusters at Figma coordinates (AMS nudged left for
                clearance from the vertical connector) */}
            <div className="absolute" style={{ left: 190, top: 75 }}>
              <Cluster group={GROUPS.ams} />
            </div>
            <div className="absolute" style={{ left: 804, top: 158 }}>
              <Cluster group={GROUPS.carriers} />
            </div>
            <div className="absolute" style={{ left: 112, top: 444 }}>
              <Cluster group={GROUPS.documents} />
            </div>
            <div className="absolute" style={{ left: 820, top: 584 }}>
              <Cluster group={GROUPS.communication} />
            </div>
            </div>
          </div>

        </div>

        {/* ──────────── Diagram (below xl) ──────────── */}
        <MobileIntegrations />

        {/* ──────────── Customer logo wall ──────────── */}
        <CarrierWall />
      </div>
    </section>
  )
}
