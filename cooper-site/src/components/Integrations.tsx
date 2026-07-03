/* ──────────────────────────────────────────────────────────────
   Integrations — "Works with the tools you already use".
   Desktop: 1280×800 canvas scaled to fit. 4 standalone boxes
   separated by SVG rails (grey gradient + orange trim-path anim).
   Labels live inside each box. Carriers = static + scroll + more.
   Mobile: stacked single column (unchanged).
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
    label: 'AMS',
    more: 'And more...',
    chips: [
      { src: logo.epic,      label: 'Applied Epic' },
      { src: logo.hawksoft,  label: 'HawkSoft' },
      { src: logo.ams360,    label: 'AMS360' },
      { src: logo.ezlynx,    label: 'EzLynx', h: 21, maxW: 42 },
    ],
  },
  carriers: {
    label: 'Carriers',
    more: '+ hundreds more',
    chips: [
      { src: logo.travelers,     label: 'Travelers',     h: 22 },
      { src: logo.libertymutual, label: 'Liberty Mutual', h: 28 },
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
      { src: logo.hubspot,    label: 'HubSpot', h: 22 },
      { src: logo.salesforce, label: 'Salesforce', h: 20, maxW: 42 },
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

/* Text-only pill for desktop carrier scroll */
function TextChip({ label }: { label: string }) {
  return (
    <div
      className="relative inline-flex w-fit items-center rounded-[30px] px-[20px] py-[10px]"
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

/* ── Desktop: label inside box ── */
function BoxLabel({ children }: { children: string }) {
  return (
    <div className="mb-[22px]">
      <div
        className="font-grotesk font-medium uppercase leading-none"
        style={{ fontSize: 26, letterSpacing: '3.5px', color: 'rgba(30,26,21,0.16)' }}
      >
        {children}
      </div>
      <div className="flex gap-[5px] mt-[10px]">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(30,26,21,0.13)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Desktop: carrier scroll (names only) ── */
function DesktopCarrierScroll() {
  const doubled = [...SCROLL_NAMES, ...SCROLL_NAMES]
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
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

/* ── ChipGrid for both mobile and desktop box interiors ── */
function ChipGrid({ group, twoCol = true }: { group: Group; twoCol?: boolean }) {
  return (
    <div className={`grid gap-x-[10px] gap-y-[10px] justify-start ${twoCol ? 'grid-cols-[auto_auto]' : 'grid-cols-1'}`}>
      {group.chips.map((c, i) => (
        <ChipTag key={i} item={c} />
      ))}
      <div className="flex items-center whitespace-nowrap px-[10px] font-grotesk text-[13px] font-medium uppercase leading-none tracking-[1.1px] text-dark/55">
        {group.more}
      </div>
    </div>
  )
}

/* ── Mobile cluster ── */
function Cluster({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-[26px]">
      <span className="font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark underline decoration-dotted decoration-dark/40 underline-offset-[5px]">
        {group.label}
      </span>
      <ChipGrid group={group} />
    </div>
  )
}

/* ── Mobile Cooper orb ── */
function CooperOrb({ size = 144 }: { size?: number }) {
  const RATIO = 244 / 144.623
  const total = size * RATIO
  return (
    <img src="/images/integ/orb.svg" alt="" aria-hidden className="pointer-events-none" style={{ width: total, height: total }} />
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

/* ── Canvas constants ── */
const CW = 1280   // canvas width
const CH = 800    // canvas height
const RX = 620    // vertical rail x  (center of horizontal gap)
const RY = 400    // horizontal rail y (center of vertical gap)
const BP = 36     // box inner padding

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
          className="hidden xl:block relative mt-[40px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light"
        >
          {/* Aspect-ratio spacer */}
          <div style={{ paddingBottom: `${(CH / CW) * 100}%` }} />

          {/* Scaled canvas */}
          <div
            className="absolute top-0 left-0"
            style={{ width: CW, height: CH, transformOrigin: 'top left', transform: `scale(${scale})` }}
          >
            {/* Grid background texture */}
            <img
              src="/images/integ/grid-bg.png"
              alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* ── SVG rails ── */}
            <svg className="absolute inset-0 pointer-events-none" width={CW} height={CH}>
              <defs>
                <linearGradient id="integ-hg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="rgba(30,26,21,0)" />
                  <stop offset="10%"  stopColor="rgba(30,26,21,0.22)" />
                  <stop offset="90%"  stopColor="rgba(30,26,21,0.22)" />
                  <stop offset="100%" stopColor="rgba(30,26,21,0)" />
                </linearGradient>
                <linearGradient id="integ-vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(30,26,21,0)" />
                  <stop offset="10%"  stopColor="rgba(30,26,21,0.22)" />
                  <stop offset="90%"  stopColor="rgba(30,26,21,0.22)" />
                  <stop offset="100%" stopColor="rgba(30,26,21,0)" />
                </linearGradient>
              </defs>

              {/* Grey horizontal rail */}
              <line x1={0} y1={RY} x2={CW} y2={RY} stroke="url(#integ-hg)" strokeWidth={1.5} />
              {/* Grey vertical rail */}
              <line x1={RX} y1={0} x2={RX} y2={CH} stroke="url(#integ-vg)" strokeWidth={1.5} />

              {/* Orange trim-path — horizontal */}
              <line
                x1={0} y1={RY} x2={CW} y2={RY}
                stroke="rgba(186,67,9,0.85)" strokeWidth={2}
                strokeDasharray={`70 ${CW}`}
                style={{ animation: 'trim-h-rail 5s linear infinite' }}
              />
              {/* Orange trim-path — vertical */}
              <line
                x1={RX} y1={0} x2={RX} y2={CH}
                stroke="rgba(186,67,9,0.85)" strokeWidth={2}
                strokeDasharray={`70 ${CH}`}
                style={{ animation: 'trim-v-rail 4s linear infinite' }}
              />
            </svg>

            {/* ── AMS — top-left ── */}
            <div
              className="absolute bg-cream-light overflow-hidden"
              style={{ left: 40, top: 40, width: 540, height: 320, borderRadius: 16, border: '1px solid rgba(30,26,21,0.10)' }}
            >
              <div style={{ padding: BP }}>
                <BoxLabel>AMS</BoxLabel>
                <ChipGrid group={GROUPS.ams} />
              </div>
            </div>

            {/* ── Carriers — top-right ── */}
            <div
              className="absolute bg-cream-light overflow-hidden"
              style={{ left: 700, top: 40, width: 540, height: 320, borderRadius: 16, border: '1px solid rgba(30,26,21,0.10)' }}
            >
              <div style={{ padding: BP, paddingBottom: 24 }}>
                <BoxLabel>Carriers</BoxLabel>
                {/* Static featured carriers */}
                <div className="flex gap-[10px] mb-[12px]">
                  <ChipTag item={GROUPS.carriers.chips[0]} />
                  <ChipTag item={GROUPS.carriers.chips[1]} />
                </div>
                {/* Infinity scroll — names only */}
                <DesktopCarrierScroll />
                {/* More label */}
                <div className="mt-[12px] font-grotesk text-[13px] font-medium uppercase tracking-[1.1px] text-dark/50">
                  + hundreds more
                </div>
              </div>
            </div>

            {/* ── Documents — bottom-left ── */}
            <div
              className="absolute bg-cream-light overflow-hidden"
              style={{ left: 40, top: 440, width: 540, height: 320, borderRadius: 16, border: '1px solid rgba(30,26,21,0.10)' }}
            >
              <div style={{ padding: BP }}>
                <BoxLabel>Documents</BoxLabel>
                <ChipGrid group={GROUPS.documents} />
              </div>
            </div>

            {/* ── Communication — bottom-right ── */}
            <div
              className="absolute bg-cream-light overflow-hidden"
              style={{ left: 700, top: 440, width: 540, height: 320, borderRadius: 16, border: '1px solid rgba(30,26,21,0.10)' }}
            >
              <div style={{ padding: BP }}>
                <BoxLabel>Communication</BoxLabel>
                <ChipGrid group={GROUPS.communication} twoCol={false} />
              </div>
            </div>

            {/* ── Cooper orb at rail intersection ── */}
            <div
              className="absolute z-10 pointer-events-none"
              style={{ left: RX - 122, top: RY - 122, width: 244, height: 244 }}
            >
              <img src="/images/integ/orb.svg" alt="" aria-hidden style={{ width: 244, height: 244 }} />
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            MOBILE — stacked clusters (below xl)
        ────────────────────────────────────────── */}
        <div className="relative mt-[40px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light xl:hidden">
          <img
            src="/images/integ/grid-bg.png"
            alt="" aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative flex flex-col items-center gap-[44px] px-[24px] py-[56px]">
            <CooperOrb size={120} />
            <div className="flex flex-col items-start gap-[56px]">
              <Cluster group={GROUPS.ams} />
              <Cluster group={GROUPS.carriers} />
              <Cluster group={GROUPS.documents} />
              <Cluster group={GROUPS.communication} />
            </div>
          </div>
        </div>

        {/* ── Customer carrier wall ── */}
        <CarrierWall />
      </div>
    </section>
  )
}
