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
    <section className="relative min-h-[500px] lg:h-[631px] overflow-hidden">
      {/* Background image */}
      <img
        src="/images/final-cta-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 md:px-10 lg:px-[62px] py-[64px] lg:py-0">
        {/* Cooper icon */}
        <img
          src="/images/cooper-icon.svg"
          alt=""
          className="w-[50px] h-[50px] mb-[28px]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        {/* Heading: line 1 static, line 2 rotating word */}
        <h2 className="font-serif text-[26px] md:text-[34px] lg:text-[38px] leading-[1.2] text-cream-light mb-[20px] text-center">
          <span>No more manual </span>
          {/* Rotating word — inline after the static text */}
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{ height: '1.25em', minWidth: '160px' }}
          >
            <span
              key={key}
              className="relative inline-block"
              style={{ animation: 'slot-roll-in 0.5s ease-out forwards' }}
            >
              {rotatingWords[currentIdx]}
              {/* Dashed underline tracks word width */}
              <span className="absolute bottom-[3px] left-0 right-0 h-0 border-b border-dashed border-cream-light/50" />
            </span>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-[17.8px] leading-[1.5] text-white/70 max-w-[480px] mb-[32px]">
          See Cooper in action with your own submissions.
          <br />
          No generic demo. We show how it works for your\u00a0team.
        </p>

        {/* Button */}
        <button className="font-sans font-medium text-[16px] text-dark bg-white rounded-[5px] px-[28px] py-[12px] hover:bg-cream hover:scale-[1.03] transition-all duration-200 cursor-pointer">
          Request a Demo
        </button>
      </div>
    </section>
  )
}
