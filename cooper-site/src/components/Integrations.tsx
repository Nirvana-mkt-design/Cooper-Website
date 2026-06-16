import React, { useState } from 'react'

/* ── Icon square for marquee ── */
function Sq({ children, size = 56 }: { children?: React.ReactNode; size?: number }) {
  return (
    <div
      className="bg-cream-light border border-dark/[0.12] shrink-0 flex items-center justify-center relative"
      style={{
        width: size, height: size, borderRadius: 28,
        boxShadow: '0px 8px 40px -10px rgba(30,26,21,0.2)',
      }}
    >
      {children}
    </div>
  )
}

const Logo = ({ src }: { src: string }) => <img src={src} alt="" className="w-[44px] h-[44px] object-contain" />

const SZ = 95
const XL = 130

const leftIcons = [
  '/images/logo-gmail.png',
  '/images/logo-salesforce.png',
  '/images/logo-samsara.png',
  '/images/logo-slack.png',
  '/images/logo-gcloud.png',
]
const rightIcons = [
  '/images/logo-outlook.png',
  '/images/logo-drive.png',
  '/images/logo-gmail.png',
  '/images/logo-salesforce.png',
  '/images/logo-gear.png',
]

/* ── Source pill ── */
function SourcePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-[8px] bg-cream-light border border-dark/[0.12] rounded-full px-[14px] py-[8px] shadow-sm">
      <img src={icon} alt="" className="w-[18px] h-[18px] object-contain" />
      <span className="font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase text-dark">{label}</span>
    </div>
  )
}

/* ── Carrier tag ── */
function CarrierTag({ label, faded }: { label: string; faded?: boolean }) {
  return (
    <span className={`inline-block border border-dark/[0.15] rounded-full px-[14px] py-[6px] font-grotesk font-medium text-[10px] tracking-[1px] uppercase ${faded ? 'text-dark/25' : 'text-dark/60'}`}>
      {label}
    </span>
  )
}


const initialCarriers = ['Travelers', 'Sentry', 'Liberty Mutual', 'Nationwide', 'Nirvana', 'Chubb', 'AmTrust', 'Zurich', 'Cover Whale', 'The Hartford', 'Pie Insurance']
const extraCarriers = ['Great West', 'Progressive', 'State Auto', 'Employers', 'Markel', 'Hanover', 'ICW Group', 'Guard Insurance', 'Berkshire Hathaway', 'Westfield', 'EMC Insurance', 'Donegal', 'Selective', 'Auto-Owners', 'Erie Insurance', 'Frankenmuth', 'Grinnell Mutual', 'SECURA', 'Acuity', 'Society Insurance']

function CarriersCard() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-cream-light rounded-[12px] px-[28px] py-[28px] flex flex-col gap-[18px] w-[320px] shrink-0 transition-all duration-500"
      style={{
        boxShadow: '0px 4px 30px -8px rgba(30,26,21,0.15)',
        border: '1px solid rgba(30,26,21,0.08)',
        maxHeight: expanded ? 600 : 420,
      }}
    >
      <div className="flex items-center gap-[10px]">
        <div className="w-[12px] h-[12px] bg-accent-orange rounded-[2px]" />
        <span className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark">System</span>
      </div>
      <div
        className="flex flex-wrap gap-[8px] transition-all duration-500"
        style={{
          maxHeight: expanded ? 400 : 220,
          overflowY: expanded ? 'auto' : 'hidden',
          maskImage: expanded ? 'none' : 'linear-gradient(to bottom, black 70%, transparent 100%)',
          WebkitMaskImage: expanded ? 'none' : 'linear-gradient(to bottom, black 70%, transparent 100%)',
        }}
      >
        {initialCarriers.map((c) => (
          <CarrierTag key={c} label={c} />
        ))}
        {expanded && extraCarriers.map((c) => (
          <CarrierTag key={c} label={c} />
        ))}
      </div>
      <span
        onClick={() => setExpanded(!expanded)}
        className="font-sans text-[14px] text-dark/60 w-fit cursor-pointer select-none"
        style={{ borderBottom: '1.2px dashed rgba(30,26,21,0.3)', paddingBottom: '2px' }}
      >
        {expanded ? 'View Less' : 'View More'}
      </span>
    </div>
  )
}

export default function Integrations() {
  const emptySquares = (count: number) => Array.from({ length: count }).map((_, i) => <Sq key={i} size={SZ} />)

  const leftStream = [...leftIcons, ...leftIcons, ...leftIcons, ...leftIcons]
  const rightStream = [...rightIcons, ...rightIcons, ...rightIcons, ...rightIcons]

  return (
    <section className="bg-cream-light overflow-hidden relative">
      {/* ── Text header ── */}
      <div className="text-center pt-[80px] pb-[20px] relative z-20">
        <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/40 mb-[20px]">
          Integrations
        </p>
        <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[16px]">
          Works with the tools you already use
        </h2>
        <p className="font-sans text-[17.8px] leading-[1.5] text-dark/50 max-w-[560px] mx-auto">
          Cooper connects to your existing systems. No rip and replace. Your data stays where it lives.
        </p>
      </div>

      {/* ── Diagram section ── */}
      <div className="max-w-[1200px] mx-auto px-[62px] py-[60px] relative z-10">
        <div className="flex items-center justify-between gap-[0px] relative">

          {/* Left: Source integrations */}
          <div className="flex flex-col gap-[28px] w-[320px] shrink-0 relative z-10 mr-[-40px]">
            {/* Document sources */}
            <div className="flex flex-col gap-[10px] items-start">
              <div className="flex gap-[10px]">
                <SourcePill icon="/images/logo-docs.png" label="Docs" />
                <SourcePill icon="/images/logo-dropbox.png" label="Dropbox" />
              </div>
              <div className="flex pl-[40px]">
                <SourcePill icon="/images/logo-sharepoint.png" label="SharePoint" />
              </div>
            </div>

            {/* Email sources */}
            <div className="flex gap-[10px] items-start pl-[20px]">
              <SourcePill icon="/images/logo-outlook.png" label="Outlook" />
              <SourcePill icon="/images/logo-gmail.png" label="Gmail" />
            </div>

            {/* AMS sources */}
            <div className="flex flex-col gap-[10px] items-start">
              <div className="flex pl-[50px]">
                <SourcePill icon="/images/logo-hawksoft.png" label="HawkSoft" />
              </div>
              <div className="flex gap-[10px] pl-[10px]">
                <SourcePill icon="/images/logo-epic.png" label="Applied Epic" />
                <SourcePill icon="/images/logo-ams360.png" label="AMS360" />
              </div>
            </div>
          </div>

          {/* Center: Connections + Cooper icon */}
          <div className="flex items-center justify-center flex-1 relative z-10" style={{ minHeight: 380 }}>
            {/* Dashed connection lines + animated dots */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 500 380" preserveAspectRatio="none" fill="none"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            >
              <defs>
                <circle id="dot" r="4" fill="#d95611" />
                <linearGradient id="fade-left" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c8c8c4" stopOpacity="0" />
                  <stop offset="30%" stopColor="#c8c8c4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#c8c8c4" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="fade-right" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c8c8c4" stopOpacity="1" />
                  <stop offset="70%" stopColor="#c8c8c4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#c8c8c4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Top path */}
              <path id="path-top" d="M 0 70 L 210 70 Q 250 70 250 110 L 250 155" stroke="#c8c8c4" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
              <circle r="4" fill="#d95611">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href="#path-top" />
                </animateMotion>
              </circle>
              <circle r="4" fill="#d95611" opacity="0.4">
                <animateMotion dur="3s" repeatCount="indefinite" begin="-1.5s">
                  <mpath href="#path-top" />
                </animateMotion>
              </circle>

              {/* Middle path */}
              <path id="path-mid" d="M 0 190 L 195 190" stroke="#c8c8c4" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
              <circle r="4" fill="#d95611">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <mpath href="#path-mid" />
                </animateMotion>
              </circle>
              <circle r="4" fill="#d95611" opacity="0.4">
                <animateMotion dur="2s" repeatCount="indefinite" begin="-1s">
                  <mpath href="#path-mid" />
                </animateMotion>
              </circle>

              {/* Bottom path */}
              <path id="path-bot" d="M 0 310 L 210 310 Q 250 310 250 270 L 250 225" stroke="#c8c8c4" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
              <circle r="4" fill="#d95611">
                <animateMotion dur="3s" repeatCount="indefinite" begin="-0.5s">
                  <mpath href="#path-bot" />
                </animateMotion>
              </circle>
              <circle r="4" fill="#d95611" opacity="0.4">
                <animateMotion dur="3s" repeatCount="indefinite" begin="-2s">
                  <mpath href="#path-bot" />
                </animateMotion>
              </circle>

              {/* Right path (reversed — from right toward Cooper) */}
              <path id="path-right" d="M 500 190 L 305 190" stroke="#c8c8c4" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
              <circle r="4" fill="#d95611">
                <animateMotion dur="2s" repeatCount="indefinite" begin="-0.3s">
                  <mpath href="#path-right" />
                </animateMotion>
              </circle>
              <circle r="4" fill="#d95611" opacity="0.4">
                <animateMotion dur="2s" repeatCount="indefinite" begin="-1.3s">
                  <mpath href="#path-right" />
                </animateMotion>
              </circle>
            </svg>

            {/* Cooper icon */}
            <div
              className="shrink-0 w-[110px] h-[110px] bg-accent-orange rounded-[24px] flex items-center justify-center relative z-10"
              style={{ boxShadow: '0 12px 40px -8px rgba(217,86,17,0.35)' }}
            >
              <img src="/images/cooper-icon.svg" alt="Cooper" className="w-[56px] h-[56px]" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>

          {/* Right: System carriers card */}
          <CarriersCard />
        </div>
      </div>

      {/* ── Icon marquee (moved down) ── */}
      <div
        className="relative"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 60% at 50% 48%, black 35%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 48%, black 35%, transparent 70%)',
        }}
      >
        <div className="flex flex-col items-center">
          {/* Row 0: empty squares */}
          <div className="relative z-0 w-full">
            <div
              className="flex gap-[14px] w-max py-[20px]"
              style={{ animation: 'marquee-left 60s linear infinite' }}
            >
              {emptySquares(24)}
            </div>
          </div>

          {/* Row 1: icons */}
          <div className="flex items-center justify-center relative z-10 -mt-[30px]">
            <div
              style={{
                width: `${5 * (SZ + 14)}px`,
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 100%)',
              }}
            >
              <div
                className="flex gap-[14px] w-max py-[20px]"
                style={{ animation: 'marquee-right 30s linear infinite' }}
              >
                {leftStream.map((src, i) => (
                  <Sq key={`l-${i}`} size={SZ}><Logo src={src} /></Sq>
                ))}
              </div>
            </div>

            <div className="shrink-0 -mx-[8px] relative z-20">
              <Sq size={XL}><img src="/images/cooper-icon.svg" alt="Cooper" className="w-[60px] h-[60px]" /></Sq>
            </div>

            <div
              style={{
                width: `${5 * (SZ + 14)}px`,
                maskImage: 'linear-gradient(to left, transparent 0%, black 15%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 15%, black 100%)',
              }}
            >
              <div
                className="flex gap-[14px] w-max py-[20px]"
                style={{ animation: 'marquee-left 30s linear infinite' }}
              >
                {rightStream.map((src, i) => (
                  <Sq key={`r-${i}`} size={SZ}><Logo src={src} /></Sq>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: empty squares */}
          <div className="relative z-0 w-full -mt-[30px]">
            <div
              className="flex gap-[14px] w-max py-[20px]"
              style={{ animation: 'marquee-right 55s linear infinite' }}
            >
              {emptySquares(24)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
