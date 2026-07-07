/* ──────────────────────────────────────────────────────────────
   Integrations — "Works with the tools you already use".
   Four category clusters (AMS, Carriers, Documents, Communication)
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

/* ── Orange Cooper orb (exact Figma SVG: flat #CE4411 body, drop +
   inner shadow, glow). The SVG is 244² with the 144.6² body inset;
   `size` is the visible body edge. */
const ORB_SVG_RATIO = 244 / 144.623
function CooperOrb({ size = 144 }: { size?: number }) {
  const total = size * ORB_SVG_RATIO
  return (
    <img src="/images/integ/orb.svg" alt="" aria-hidden className="pointer-events-none" style={{ width: total, height: total }} />
  )
}

/* ── Chip icons — brand marks for the chips ──
   Carriers use small brand marks (not wordmarks). Chubb is cropped
   from the wordmark strip to isolate the mark, matching Figma. */
type Chip = { src: string; label: string; crop?: boolean; h?: number; maxW?: number }

const logo = {
  epic: '/images/logo-epic.webp',
  hawksoft: '/images/logo-hawksoft.webp',
  ams360: '/images/logo-ams360.webp',
  ezlynx: '/images/chips/ezlynx.png',
  sharepoint: '/images/logo-sharepoint.webp',
  onedrive: '/images/logo-onedrive.png',
  dropbox: '/images/logo-dropbox.webp',
  hubspot: '/images/chips/hubspot.png',
  salesforce: '/images/chips/salesforce.png',
  travelers: '/images/chips/travelers.png',
  libertymutual: '/images/chips/liberty-mutual.png',
  chubb: '/images/chips/chubb.png',
  outlook: '/images/logo-outlook.webp',
  teams: '/images/logo-teams.png',
}

type Group = { label: string; chips: Chip[]; more: string; carriers?: boolean }

const GROUPS: Record<'ams' | 'carriers' | 'documents' | 'communication', Group> = {
  ams: {
    label: 'AMS',
    more: 'And more...',
    chips: [
      { src: logo.epic, label: 'Applied Epic' },
      { src: logo.hawksoft, label: 'HawkSoft' },
      { src: logo.ams360, label: 'AMS360' },
      { src: logo.ezlynx, label: 'EzLynx', h: 21, maxW: 42 },
    ],
  },
  carriers: {
    label: 'Carriers',
    more: '+ hundreds more',
    carriers: true,
    chips: [
      { src: logo.travelers, label: 'Travelers', h: 22 },
      { src: logo.libertymutual, label: 'Liberty Mutual', h: 28 },
      { src: logo.chubb, label: 'Chubb', crop: true },
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
    label: 'Communication',
    more: 'And more...',
    chips: [
      { src: logo.outlook, label: 'Outlook' },
      { src: logo.teams, label: 'Teams' },
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
      <ChipIcon item={item} />
      <span className="whitespace-nowrap font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark">
        {item.label}
      </span>
    </div>
  )
}

function Cluster({ group }: { group: Group }) {
  const more = (
    <div className="flex items-center whitespace-nowrap px-[10px] font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark">
      {group.more}
    </div>
  )
  return (
    <div className="flex flex-col gap-[26px]">
      <span className="font-grotesk text-[14.5px] font-medium uppercase leading-none tracking-[1.45px] text-dark underline decoration-dotted decoration-dark/40 underline-offset-[5px]">
        {group.label}
      </span>
      {group.carriers ? (
        // Explicit flex rows (Figma): row 1 = two chips, row 2 = one chip +
        // "+ hundreds more". Chips hug their content so wide labels never
        // shrink/overflow their pill.
        <div className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-[10px] sm:flex-row sm:gap-[14px]">
            <ChipTag item={group.chips[0]} />
            <ChipTag item={group.chips[1]} />
          </div>
          <div className="flex flex-col gap-[10px] sm:flex-row sm:items-center sm:gap-[17px]">
            <ChipTag item={group.chips[2]} />
            {more}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-[8px] gap-y-[10px] sm:grid-cols-2">
          {group.chips.map((c, i) => (
            <ChipTag key={i} item={c} />
          ))}
          {more}
        </div>
      )}
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

        {/* ──────────── Diagram panel ──────────── */}
        <div className="relative mt-[40px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light shadow-[0_30px_80px_-50px_rgba(30,26,21,0.45)]">
          {/* exact Figma grid tile (solid dark lines → softened to the
              faint warm-grey the design shows) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
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

          {/* ── below xl: stacked (single column of clusters) ── */}
          <div className="relative flex flex-col items-center gap-[44px] px-[24px] py-[56px] xl:hidden">
            <CooperOrb size={120} />
            <div className="flex flex-col items-start gap-[40px]">
              <Cluster group={GROUPS.ams} />
              <Cluster group={GROUPS.carriers} />
              <Cluster group={GROUPS.documents} />
              <Cluster group={GROUPS.communication} />
            </div>
          </div>
        </div>

        {/* ──────────── Customer logo wall ──────────── */}
        <CarrierWall />
      </div>
    </section>
  )
}
