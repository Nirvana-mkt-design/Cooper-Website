import React from 'react'

/* ── Icon square ── */
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

/* Icon sets for left and right streams */
const leftIcons = [
  '/images/logo-gmail.webp',
  '/images/logo-salesforce.webp',
  '/images/logo-samsara.webp',
  '/images/logo-slack.webp',
  '/images/logo-gcloud.webp',
]
const rightIcons = [
  '/images/logo-outlook.webp',
  '/images/logo-drive.webp',
  '/images/logo-gmail.webp',
  '/images/logo-salesforce.webp',
  '/images/logo-gear.webp',
]

export default function Integrations() {
  const emptySquares = (count: number) => Array.from({ length: count }).map((_, i) => <Sq key={i} size={SZ} />)

  /* Repeated icons for seamless loop */
  const leftStream = [...leftIcons, ...leftIcons, ...leftIcons, ...leftIcons]
  const rightStream = [...rightIcons, ...rightIcons, ...rightIcons, ...rightIcons]

  return (
    <section className="bg-cream-light overflow-hidden relative">
      {/* ── Icon grid with fade ── */}
      <div
        className="relative"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 60% at 50% 48%, black 35%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 48%, black 35%, transparent 70%)',
        }}
      >
        <div className="flex flex-col items-center pt-[40px]">

          {/* Row 0: empty squares — scrolling left slowly */}
          <div className="relative z-0 w-full">
            <div
              className="flex gap-[14px] w-max py-[20px]"
              style={{ animation: 'marquee-left 60s linear infinite' }}
            >
              {emptySquares(24)}
            </div>
          </div>

          {/* Row 1: left icons → Cooper ← right icons */}
          <div className="flex items-center justify-center relative z-10 -mt-[30px]">
            {/* Left stream: flowing RIGHT (toward Cooper) */}
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

            {/* Cooper center — fixed, z above streams */}
            <div className="shrink-0 -mx-[8px] relative z-20">
              <Sq size={XL}><img src="/images/cooper-icon.svg" alt="Cooper" className="w-[60px] h-[60px]" /></Sq>
            </div>

            {/* Right stream: flowing LEFT (toward Cooper) */}
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

          {/* Side columns with vertical animation */}
          <div className="relative w-full -mt-[16px]">
            <div className="flex justify-between px-[20px]">
              {/* Left columns — scrolling UP */}
              <div className="flex gap-[14px]" style={{ height: `${4 * (SZ + 14)}px` }}>
                <div
                  className="flex flex-col gap-[14px] px-[10px]"
                  style={{ animation: 'shapes-up 40s linear infinite' }}
                >
                  {emptySquares(12)}
                </div>
                <div
                  className="flex flex-col gap-[14px] px-[10px]"
                  style={{ animation: 'shapes-down 45s linear infinite' }}
                >
                  {emptySquares(12)}
                </div>
              </div>

              {/* Right columns — scrolling DOWN */}
              <div className="flex gap-[14px]" style={{ height: `${4 * (SZ + 14)}px` }}>
                <div
                  className="flex flex-col gap-[14px] px-[10px]"
                  style={{ animation: 'shapes-down 42s linear infinite' }}
                >
                  {emptySquares(12)}
                </div>
                <div
                  className="flex flex-col gap-[14px] px-[10px]"
                  style={{ animation: 'shapes-up 48s linear infinite' }}
                >
                  {emptySquares(12)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Text content ── */}
      <div className="relative z-20 text-center -mt-[380px] pb-[30px]">
        <div className="pt-[40px]">
          <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/40 mb-[20px]">
            Integrations
          </p>
          <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[16px]">
            Works with the tools you already use
          </h2>
          <p className="font-sans text-[17.8px] leading-[1.5] text-dark/50 max-w-[560px] mx-auto mb-[28px]">
            Cooper connects to your existing systems. No rip and replace. Your data stays where it lives.
          </p>
          <button className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-cream-light bg-accent-orange rounded-[8px] px-[28px] py-[14px] hover:opacity-90 transition-opacity cursor-pointer">
            View all Integrations
          </button>
        </div>
      </div>

      {/* ── Integration card ── */}
      <div className="relative z-10 max-w-[820px] mx-auto px-[62px] pt-[20px] pb-[80px]">
        <div
          className="bg-cream-light rounded-[12px] px-[48px] py-[40px] flex gap-[40px] items-start relative"
          style={{
            boxShadow: '0px 7.5px 69.6px -20px rgba(30,26,21,0.33)',
            border: '1px solid transparent',
            backgroundClip: 'padding-box',
          }}
        >
          {/* Gradient border overlay */}
          <div className="absolute inset-[-1px] rounded-[12px] pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(30,26,21,0.1), rgba(30,26,21,0.25))',
            zIndex: -1,
          }} />
          <div className="flex flex-col gap-[20px] shrink-0">
            <div className="flex items-center gap-[10px]">
              <div className="w-[12px] h-[12px] bg-accent-orange" />
              <span className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark">System</span>
            </div>
            <div className="flex gap-[28px]">
              <div className="flex flex-col gap-[14px]">
                <span className="font-sans text-[14px] text-dark/70">AMS360</span>
                <span className="font-sans text-[14px] text-dark/70">Applied Epic</span>
              </div>
              <div className="flex flex-col gap-[14px]">
                <span className="font-sans text-[14px] text-dark/70">HawkSoft</span>
                <span className="font-sans text-[14px] text-dark/70">Salesforce</span>
                <span className="font-sans text-[14px] text-dark/70">Gmail / Outlook</span>
              </div>
            </div>
          </div>
          <div className="w-[1px] bg-dark/15 self-stretch" />
          <div className="flex flex-col gap-[20px] flex-1">
            <div className="flex items-center gap-[10px]">
              <div className="w-[12px] h-[12px] bg-accent-orange" />
              <span className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark">Supported carriers</span>
            </div>
            <div className="grid grid-cols-2 gap-x-[48px] gap-y-[14px]">
              {['Hartford', 'Zurich', 'Travelers', 'Nationwide', 'Liberty Mutual', 'Progressive', 'Chubb', 'AmTrust'].map((c) => (
                <span key={c} className="font-sans text-[14px] text-dark/70">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
