/* ──────────────────────────────────────────────────────────────
   Integrations — "Works with the tools you already use".
   Desktop: 1297×858 scaled canvas. Hub-and-spoke layout with
   L-bracket connectors and floating chip groups (Figma ref).
   Mobile: 390×1515 scaled canvas, hub-and-spoke stacked
   vertically (Figma node 6280:1137).
─────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react'
import CarrierWall from './CarrierWall'

/* ── Chip types & data ── */
type Chip = { src: string; label: string; crop?: boolean; h?: number; maxW?: number }

const logo = {
  epic:          '/images/logo-epic.webp',
  hawksoft:      '/images/logo-hawksoft.webp',
  ams360:        '/images/logo-ams360.webp',
  ezlynx:        '/images/chips/ezlynx.png',
  guidewire:     '/images/logo-guidewire.svg',
  sharepoint:    '/images/logo-sharepoint.webp',
  onedrive:      '/images/logo-onedrive.png',
  dropbox:       '/images/logo-dropbox.webp',
  hubspot:       '/images/chips/hubspot.png',
  salesforce:    '/images/chips/salesforce.png',
  travelers:     '/images/chips/travelers.png',
  libertymutual: '/images/chips/liberty-mutual.png',
  chubb:         '/images/chips/chubb.png',
  outlook:       '/images/logo-outlook.webp',
  teams:         '/images/logo-teams.png',
}

type Group = { label: string; chips: Chip[]; more: string }

const GROUPS: Record<'ams' | 'carriers' | 'documents' | 'communication', Group> = {
  ams: {
    label: 'Records',
    more: 'And more...',
    chips: [
      { src: logo.epic,      label: 'Applied Epic' },
      { src: logo.hawksoft,  label: 'HawkSoft' },
      { src: logo.ams360,    label: 'AMS360' },
      { src: logo.ezlynx,    label: 'EzLynx', h: 21, maxW: 42 },
      { src: logo.guidewire, label: 'Guidewire' },
      { src: logo.hubspot,   label: 'HubSpot', h: 22 },
      { src: logo.salesforce, label: 'Salesforce', h: 20, maxW: 42 },
    ],
  },
  carriers: {
    label: 'Carriers',
    more: '+ hundreds more',
    chips: [
      { src: logo.travelers,     label: 'Travelers',      h: 22 },
      { src: logo.libertymutual, label: 'Liberty Mutual',  h: 28 },
      { src: logo.chubb,         label: 'Chubb', crop: true },
    ],
  },
  documents: {
    label: 'Documents',
    more: 'And more...',
    chips: [
      { src: logo.sharepoint, label: 'SharePoint' },
      { src: logo.onedrive,   label: 'OneDrive', h: 22 },
      { src: logo.dropbox,    label: 'Dropbox' },
    ],
  },
  communication: {
    label: 'Communication',
    more: 'And more...',
    chips: [
      { src: logo.outlook, label: 'Outlook' },
      { src: logo.teams,   label: 'Teams' },
    ],
  },
}

/* Desktop carrier scroll — names only (no logos) */
const SCROLL_NAMES = [
  'Chubb', 'Zurich', 'AIG', 'CNA', 'Markel',
  'Progressive', 'The Hanover', 'Hiscox', 'Nationwide',
  'The Hartford', 'Berkley', 'Amtrust',
]

/* ── Shared chip components ── */
function ChipIcon({ item }: { item: Chip }) {
  if (item.crop) {
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
      className="relative inline-flex w-fit items-center gap-[10px] rounded-[30px] px-[20px] py-[10px]"
      style={{
        border: '1px solid transparent',
        background:
          'linear-gradient(#fffcf1, #fffcf1) padding-box, linear-gradient(154deg, rgba(30,26,21,0.29) 6%, rgba(30,26,21,0) 100%) border-box',
        boxShadow: '0 7px 60px -20px rgba(30,26,21,0.33), inset 7px 6px 23px 0 rgba(30,26,21,0.10)',
      }}
    >
      <ChipIcon item={item} />
      <span className="whitespace-nowrap font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark">
        {item.label}
      </span>
    </div>
  )
}

/* Text-only pill for carrier scroll */
function TextChip({ label }: { label: string }) {
  return (
    <div
      className="relative inline-flex w-fit items-center rounded-[30px] px-[20px] py-[10px] h-[46px]"
      style={{
        border: '1px solid transparent',
        background:
          'linear-gradient(#fffcf1, #fffcf1) padding-box, linear-gradient(154deg, rgba(30,26,21,0.29) 6%, rgba(30,26,21,0) 100%) border-box',
        boxShadow: '0 7px 60px -20px rgba(30,26,21,0.33), inset 7px 6px 23px 0 rgba(30,26,21,0.10)',
      }}
    >
      <span className="whitespace-nowrap font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark">
        {label}
      </span>
    </div>
  )
}

/* ── Desktop: category label near center ── */
function CanvasLabel({ children }: { children: string }) {
  return (
    <span
      className="font-grotesk font-medium uppercase leading-none"
      style={{
        fontSize: 22,
        letterSpacing: '2.27px',
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

/* ── Mobile chips (Figma mobile canvas ≈ 0.784× the desktop chip) ── */
const M = 0.784 // mobile scale factor vs desktop chip metrics

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
        border: '0.784px solid transparent',
        background:
          'linear-gradient(#fffcf1, #fffcf1) padding-box, linear-gradient(154deg, rgba(30,26,21,0.29) 6%, rgba(30,26,21,0) 100%) border-box',
        boxShadow: '0 5.9px 54.6px -15.7px rgba(30,26,21,0.33), inset 5.5px 4.7px 18.1px 0 rgba(30,26,21,0.10)',
      }}
    >
      <MobileChipIcon item={item} />
      <span className="whitespace-nowrap font-grotesk text-[11.3px] font-medium uppercase leading-none tracking-[1.13px] text-dark">
        {item.label}
      </span>
    </div>
  )
}

/* Mobile "and more" / "+ hundreds more" pill text */
function MoreText({ children }: { children: string }) {
  return (
    <div className="flex items-center whitespace-nowrap p-[7.8px] font-grotesk text-[11.3px] font-medium uppercase leading-none tracking-[1.13px] text-dark/80">
      {children}
    </div>
  )
}

/* ── Desktop: carrier scroll (names only) ── */
function DesktopCarrierScroll() {
  const doubled = [...SCROLL_NAMES, ...SCROLL_NAMES]
  return (
    <div
      style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          width: 'max-content',
          animation: 'integ-scroll 26s linear infinite',
        }}
      >
        {doubled.map((name, i) => (
          <TextChip key={i} label={name} />
        ))}
      </div>
    </div>
  )
}

/* ── Canvas scale hook ── */
function useCanvasScale(targetW: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => {
      setScale(e.contentRect.width / targetW)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [targetW])
  return { ref, scale }
}

/* ── Canvas constants (match Figma: 1297×858) ── */
const CW = 1297
const CH = 858

/* ── Mobile canvas constants (match Figma mobile card: 390×1515) ── */
const MCW = 390
const MCH = 1515

/* L-bracket SVG paths (Figma node 65:431 ff.) */
const V_PATH = 'M89.0874 237.378V31C89.0874 14.4315 75.6559 1 59.0874 1H0'
const V_VB   = '0 0 90.0874 237.378'
const H_PATH = 'M124.025 262.75V31C124.025 14.4315 110.594 1 94.0254 1H0'
const H_VB   = '0 0 125.025 262.75'

/* Stable random from a seed (for consistent animation offsets per bracket) */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

/* ── L-bracket connector component ──
   fadeV/fadeH control which LOCAL edges get the gradient fade.
   'start' = top/left edge, 'end' = bottom/right edge. */
function Bracket({
  left, top, outerW, outerH, innerW, innerH, innerTransform, path, viewBox, orange, reverse,
  fadeV = 'end', fadeH = 'start',
}: {
  left: number; top: number; outerW: number; outerH: number
  innerW: number; innerH: number; innerTransform: string
  path: string; viewBox: string; orange?: boolean; reverse?: boolean
  fadeV?: 'start' | 'end'; fadeH?: 'start' | 'end'
}) {
  const isH = path === H_PATH
  // Each bracket gets a unique but stable random delay and duration based on position
  const seed = left * 7 + top * 13 + (reverse ? 31 : 0)
  const animDelay = `${-(seededRandom(seed) * 8).toFixed(2)}s`
  const animDuration = `${(4 + seededRandom(seed + 1) * 3).toFixed(2)}s`
  const vMask = fadeV === 'end'
    ? 'linear-gradient(to top, transparent, black 30%)'
    : 'linear-gradient(to bottom, transparent, black 30%)'
  const hMask = fadeH === 'start'
    ? 'linear-gradient(to right, transparent, black 30%)'
    : 'linear-gradient(to left, transparent, black 30%)'
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left, top, width: outerW, height: outerH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ transform: innerTransform, flex: 'none' }}>
        <div
          style={{
            width: innerW, height: innerH, position: 'relative',
            maskImage: `${vMask}, ${hMask}`,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in' as never,
          }}
        >
          <svg viewBox={viewBox} fill="none" style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
            {orange ? (
              <>
                {/* Soft halo — wider dash, low opacity for gradient edges */}
                <path
                  d={path}
                  stroke="rgba(186,67,9,0.2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="80 380"
                  style={{
                    animation: `${isH ? (reverse ? 'trim-bracket-h-rev' : 'trim-bracket-h') : (reverse ? 'trim-bracket-v-rev' : 'trim-bracket-v')} ${animDuration} linear infinite`,
                    animationDelay: animDelay,
                  }}
                />
                {/* Core dash — narrower, full opacity */}
                <path
                  d={path}
                  stroke="rgba(186,67,9,0.85)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="45 415"
                  style={{
                    animation: `${isH ? (reverse ? 'trim-bracket-h-rev' : 'trim-bracket-h') : (reverse ? 'trim-bracket-v-rev' : 'trim-bracket-v')} ${animDuration} linear infinite`,
                    animationDelay: animDelay,
                  }}
                />
              </>
            ) : (
              <path
                d={path}
                stroke="rgba(30,26,21,0.22)"
                strokeWidth="1.2"
                opacity="0.6"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}

/* Shorthand for rendering both grey + orange bracket at same position.
   `reverse` flips the orange dash direction (away from Cooper instead of toward). */
function BracketPair(props: Omit<Parameters<typeof Bracket>[0], 'orange'>) {
  return (
    <>
      <Bracket {...props} />
      <Bracket {...props} orange />
    </>
  )
}

/* ── Mobile connectors (Figma groups 1000005510 / 1000005509) ──
   Inline SVG so the orange can flow. Two grey base paths + a
   travelling orange dash (normalized pathLength) + cream fade
   masks over the line ends. */
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
  cfg, gradId, flowRev, left, top, width, height, transform,
}: {
  cfg: ConnCfg; gradId: string; flowRev?: boolean
  left: number; top: number; width: number; height: number; transform?: string
}) {
  const anim = `${flowRev ? 'integ-flow-rev' : 'integ-flow'} 3.2s linear infinite`
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

      {/* grey base */}
      <path d={cfg.v203} stroke="#CCCCCC" strokeWidth={2} opacity={0.6} />
      <path d={cfg.v204} stroke="#CCCCCC" strokeWidth={2} opacity={0.6} />

      {/* travelling orange dash — halo + core */}
      {[cfg.v203, cfg.v204].map((d, i) => (
        <g key={i}>
          <path d={d} pathLength={1} stroke="rgba(218,76,7,0.22)" strokeWidth={4}
            strokeLinecap="round" strokeDasharray="0.16 0.84" style={{ animation: anim }} />
          <path d={d} pathLength={1} stroke="rgba(218,76,7,0.95)" strokeWidth={2}
            strokeLinecap="round" strokeDasharray="0.09 0.91" style={{ animation: anim }} />
        </g>
      ))}

      {/* cream fade masks over the line ends */}
      {cfg.rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} transform={r.transform} fill={`url(#${gradId})`} />
      ))}
    </svg>
  )
}

/* ──────────────────────────────────────────
    MOBILE — scaled 390×1515 canvas (below xl)
    Hub-and-spoke stacked vertically (Figma node 6280:1137).
    Capped at 390px + centered so it never balloons on tablet.
──────────────────────────────────────── */
function MobileIntegrations() {
  const { ref, scale } = useCanvasScale(MCW)
  const fade = 'linear-gradient(to right, black 72%, transparent)'
  return (
    <div className="mx-auto mt-[40px] w-full max-w-[390px] xl:hidden">
      <div ref={ref} className="relative overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light">
        {/* Aspect-ratio spacer */}
        <div style={{ paddingBottom: `${(MCH / MCW) * 100}%` }} />

        {/* Scaled canvas */}
        <div
          className="absolute top-0 left-0"
          style={{ width: MCW, height: MCH, transformOrigin: 'top left', transform: `scale(${scale})` }}
        >
          {/* Grid background */}
          <img
            src="/images/integ/grid-bg.png"
            alt="" aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-50 pointer-events-none"
          />

          {/* Connectors — flowing orange dash toward Cooper */}
          <MobileConnector
            cfg={CONN.top} gradId="mc-top-fade" flowRev
            left={97.5} top={71.5} width={261.9} height={617.8}
            transform="rotate(180deg) scaleX(-1)"
          />
          <MobileConnector
            cfg={CONN.bottom} gradId="mc-bot-fade" flowRev
            left={97.5} top={774.8} width={281.7} height={513.9}
          />

          {/* Cooper orb (visible square 119.7px; orb.svg has glow padding ⇒ render 202px) */}
          <img
            src="/images/integ/orb.svg"
            alt="" aria-hidden
            className="absolute z-10 pointer-events-none"
            style={{ left: 93.5, top: 621.5, width: 202, height: 202, animation: 'orb-bump 4s ease-in-out infinite' }}
          />

          {/* Category labels */}
          <div className="absolute" style={{ left: 32.7, top: 100 }}><CanvasLabel>Records</CanvasLabel></div>
          <div className="absolute" style={{ left: 32.7, top: 383 }}><CanvasLabel>Carriers</CanvasLabel></div>
          <div className="absolute" style={{ left: 40.6, top: 995 }}><CanvasLabel>Documents</CanvasLabel></div>
          <div className="absolute" style={{ left: 40.6, top: 1240 }}><CanvasLabel>Communication</CanvasLabel></div>

          {/* AMS — top-left 2-col grid */}
          <div
            className="absolute grid grid-cols-2 justify-items-start gap-x-[3.9px] gap-y-[7.8px]"
            style={{ left: 32.7, top: 163.5, width: 300.5 }}
          >
            {GROUPS.ams.chips.map((c, i) => <MobileChipTag key={i} item={c} />)}
            <div className="col-span-2"><MoreText>{GROUPS.ams.more}</MoreText></div>
          </div>

          {/* Carriers — right, second row fades off the edge */}
          <div className="absolute" style={{ left: 32.7, top: 433.4, width: 326.7 }}>
            <div className="flex flex-col gap-[10.2px]">
              <div className="flex gap-[11px]">
                <MobileChipTag item={GROUPS.carriers.chips[0]} />
                <MobileChipTag item={GROUPS.carriers.chips[1]} />
              </div>
              <div
                className="flex gap-[11px] overflow-hidden"
                style={{ width: 326.7, maskImage: fade, WebkitMaskImage: fade }}
              >
                <MobileChipTag item={GROUPS.carriers.chips[2]} />
                <MobileChipTag item={GROUPS.carriers.chips[1]} />
                <MobileChipTag item={GROUPS.carriers.chips[1]} />
              </div>
            </div>
          </div>
          <div className="absolute" style={{ left: 44.7, top: 560 }}><MoreText>{GROUPS.carriers.more}</MoreText></div>

          {/* Documents — bottom-left 2-col grid */}
          <div
            className="absolute grid grid-cols-2 justify-items-start gap-x-[3.9px] gap-y-[7.8px]"
            style={{ left: 40.6, top: 1063.8, width: 281 }}
          >
            {GROUPS.documents.chips.map((c, i) => <MobileChipTag key={i} item={c} />)}
            <MoreText>{GROUPS.documents.more}</MoreText>
          </div>

          {/* Communication — bottom-right */}
          <div
            className="absolute flex flex-wrap items-center gap-[12.5px]"
            style={{ left: 40.6, top: 1303.5, width: 249.3 }}
          >
            {GROUPS.communication.chips.map((c, i) => <MobileChipTag key={i} item={c} />)}
            <MoreText>{GROUPS.communication.more}</MoreText>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Integrations() {
  const { ref: canvasRef, scale } = useCanvasScale(CW)

  return (
    <section id="integrations" className="bg-cream-light overflow-hidden px-5 sm:px-6 lg:px-[40px]">
      <div className="mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-[40px] py-[64px] lg:py-[96px]">

        {/* ── Header ── */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <p className="mb-[18px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-accent-orange">
              Integrations
            </p>
            <h2 className="font-serif text-[36px] leading-[1.12] text-dark md:text-[44px] lg:text-[48px]">
              Works with the tools you already use
            </h2>
          </div>
          <div className="lg:max-w-[360px] lg:pb-[6px]">
            <p className="font-sans text-[16.5px] leading-[1.55] text-dark/55">
              Cooper connects to your existing systems. No rip and replace. Your data stays where it lives.
            </p>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            DESKTOP — scaled canvas (xl+)
        ────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          className="hidden xl:block relative mt-[40px] overflow-hidden rounded-[20px] border border-dark/[0.08] bg-cream-light"
        >
          {/* Aspect-ratio spacer */}
          <div style={{ paddingBottom: `${(CH / CW) * 100}%` }} />

          {/* Scaled canvas */}
          <div
            className="absolute top-0 left-0"
            style={{ width: CW, height: CH, transformOrigin: 'top left', transform: `scale(${scale})` }}
          >
            {/* Grid background */}
            <img
              src="/images/integ/grid-bg.png"
              alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* ── L-bracket connectors (Figma node 65:431 ff.) ── */}

            {/* Vertical — top pair: left goes toward Cooper, right goes away */}
            <BracketPair left={556} top={118} outerW={89} outerH={236} innerW={89} innerH={236} innerTransform="none"                     path={V_PATH} viewBox={V_VB} />
            <BracketPair left={644} top={118} outerW={89} outerH={236} innerW={89} innerH={236} innerTransform="scaleY(-1) rotate(180deg)" path={V_PATH} viewBox={V_VB} reverse />

            {/* Vertical — bottom pair: left goes away, right goes toward Cooper */}
            <BracketPair left={556} top={494} outerW={89} outerH={236} innerW={89} innerH={236} innerTransform="scaleY(-1)"               path={V_PATH} viewBox={V_VB} reverse />
            <BracketPair left={644} top={494} outerW={89} outerH={236} innerW={89} innerH={236} innerTransform="rotate(180deg)"            path={V_PATH} viewBox={V_VB} />

            {/* Horizontal — left pair: top goes toward Cooper, bottom goes away */}
            <BracketPair left={311} top={300} outerW={261} outerH={124} innerW={124} innerH={261} innerTransform="rotate(90deg) scaleY(-1)"  path={H_PATH} viewBox={H_VB} />
            <BracketPair left={311} top={424} outerW={261} outerH={124} innerW={124} innerH={261} innerTransform="rotate(-90deg)"             path={H_PATH} viewBox={H_VB} reverse />

            {/* Horizontal — right pair: top goes away, bottom goes toward Cooper */}
            <BracketPair left={717} top={300} outerW={261} outerH={124} innerW={124} innerH={261} innerTransform="rotate(90deg)"              path={H_PATH} viewBox={H_VB} reverse />
            <BracketPair left={717} top={424} outerW={261} outerH={124} innerW={124} innerH={261} innerTransform="rotate(-90deg) scaleY(-1)"  path={H_PATH} viewBox={H_VB} />

            {/* ── Category labels — float near center ── */}
            <div className="absolute" style={{ left: 431, top: 297, transform: 'translateY(-50%)' }}>
              <CanvasLabel>Records</CanvasLabel>
            </div>
            <div className="absolute" style={{ left: 746, top: 297, transform: 'translateY(-50%)' }}>
              <CanvasLabel>Carriers</CanvasLabel>
            </div>
            <div className="absolute" style={{ left: 392, top: 538, transform: 'translateY(-50%)' }}>
              <CanvasLabel>Documents</CanvasLabel>
            </div>
            <div className="absolute" style={{ left: 719, top: 538, transform: 'translateY(-50%)' }}>
              <CanvasLabel>Communication</CanvasLabel>
            </div>

            {/* ── AMS chip group — top-left ── */}
            <div className="absolute" style={{ left: 178, top: 125 }}>
              <div className="grid gap-x-[5px] gap-y-[10px]" style={{ gridTemplateColumns: 'auto auto' }}>
                {GROUPS.ams.chips.map((c, i) => <ChipTag key={i} item={c} />)}
                <div className="flex items-center px-[10px] font-grotesk text-[13px] font-medium uppercase tracking-[1.1px] text-dark/55 whitespace-nowrap">
                  {GROUPS.ams.more}
                </div>
              </div>
            </div>

            {/* ── Carriers chip group — top-right ── */}
            <div className="absolute" style={{ left: 799, top: 115, width: 416, overflow: 'hidden' }}>
              <div className="flex flex-col gap-[13px]">
                <div className="flex gap-[14px] items-center">
                  <ChipTag item={GROUPS.carriers.chips[0]} />
                  <ChipTag item={GROUPS.carriers.chips[1]} />
                </div>
                <div className="flex gap-[14px] items-center">
                  <ChipTag item={GROUPS.carriers.chips[2]} />
                  <DesktopCarrierScroll />
                </div>
                <div className="px-[10px] font-grotesk text-[13px] font-medium uppercase tracking-[1.1px] text-dark/50">
                  {GROUPS.carriers.more}
                </div>
              </div>
            </div>

            {/* ── Documents chip group — bottom-left ── */}
            <div className="absolute" style={{ left: 200, top: 630 }}>
              <div className="grid gap-x-[5px] gap-y-[10px]" style={{ gridTemplateColumns: 'auto auto' }}>
                {GROUPS.documents.chips.map((c, i) => <ChipTag key={i} item={c} />)}
                <div className="flex items-center px-[10px] font-grotesk text-[13px] font-medium uppercase tracking-[1.1px] text-dark/55 whitespace-nowrap">
                  {GROUPS.documents.more}
                </div>
              </div>
            </div>

            {/* ── Communication chip group — bottom-right ── */}
            <div className="absolute" style={{ left: 814, top: 634 }}>
              <div className="flex flex-wrap gap-[16px] items-center">
                {GROUPS.communication.chips.map((c, i) => <ChipTag key={i} item={c} />)}
                <div className="px-[10px] font-grotesk text-[13px] font-medium uppercase tracking-[1.1px] text-dark/55 whitespace-nowrap">
                  {GROUPS.communication.more}
                </div>
              </div>
            </div>

            {/* ── Cooper orb at canvas center ── */}
            <div
              className="absolute z-10 pointer-events-none"
              style={{ left: CW / 2 - 122, top: CH / 2 - 122, width: 244, height: 244 }}
            >
              <img
                src="/images/integ/orb.svg"
                alt="" aria-hidden
                style={{
                  width: 244, height: 244,
                  animation: 'orb-bump 4s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Mobile (scaled 390×1515 canvas) ── */}
        <MobileIntegrations />

        {/* ── Customer carrier wall ── */}
        <CarrierWall />
      </div>
    </section>
  )
}
