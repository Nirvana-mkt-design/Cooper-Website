import { useState, useEffect } from 'react'

const rotatingWords = [
  'Acords',
  'Submissions',
  'Loss Runs',
  'Renewals',
  'Policy Checks',
  'Endorsements',
]

export default function FinalCTA() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % rotatingWords.length)
      setKey((k) => k + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[631px] overflow-hidden bg-cream">
      {/* Background gradient strips — orange pattern from Figma */}
      <div className="absolute inset-0">
        {/* Row 1 */}
        <div className="absolute top-0 left-0 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)' }} />
        <div className="absolute top-0 left-1/2 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)' }} />
        {/* Row 2 — flipped */}
        <div className="absolute top-[158px] left-0 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)', transform: 'scaleY(-1) rotate(180deg)' }} />
        <div className="absolute top-[158px] left-1/2 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)', transform: 'scaleY(-1) rotate(180deg)' }} />
        {/* Row 3 */}
        <div className="absolute top-[316px] left-0 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)' }} />
        <div className="absolute top-[316px] left-1/2 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)' }} />
        {/* Row 4 — flipped */}
        <div className="absolute top-[473px] left-0 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)', transform: 'scaleY(-1) rotate(180deg)' }} />
        <div className="absolute top-[473px] left-1/2 w-1/2 h-[158px]" style={{ background: 'linear-gradient(90deg, rgb(218,76,7) 0%, rgba(215,100,3,0.5) 50%, rgba(221,133,8,0) 100%)', transform: 'scaleY(-1) rotate(180deg)' }} />
      </div>

      {/* Glassmorphism overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(28.7px)',
          WebkitBackdropFilter: 'blur(28.7px)',
          background: 'linear-gradient(90deg, rgba(105,48,19,0.09), rgba(105,48,19,0.09)), linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04))',
          borderBottom: '0.5px solid rgba(255,255,255,0.7)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-[62px]">
        {/* Cooper icon */}
        <img
          src="/images/cooper-icon.svg"
          alt=""
          className="w-[50px] h-[50px] mb-[28px]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        {/* Heading with slot-machine rotating word */}
        <h2 className="font-serif text-[38px] leading-[1.2] text-cream-light mb-[20px] flex items-baseline justify-center gap-[12px]">
          <span>Stop doing</span>
          <span className="inline-block overflow-hidden relative" style={{ height: '1.2em', minWidth: '180px' }}>
            <span
              key={key}
              className="inline-block"
              style={{
                animation: 'slot-roll-in 0.5s ease-out forwards',
              }}
            >
              {rotatingWords[currentIdx]}
            </span>
            {/* Dashed underline */}
            <span className="absolute bottom-[2px] left-0 right-0 h-0 border-b border-dashed border-cream-light/50" />
          </span>
          <span>manually</span>
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-[17.8px] leading-[1.5] text-white/70 max-w-[480px] mb-[32px]">
          See Cooper in action with your own submissions.
          <br />
          No generic demo, we show you how it works for your team.
        </p>

        {/* Button */}
        <button className="font-sans font-medium text-[16px] text-dark bg-white rounded-[5px] px-[28px] py-[12px] hover:bg-cream-light transition-colors cursor-pointer">
          Request a Demo
        </button>
      </div>
    </section>
  )
}
