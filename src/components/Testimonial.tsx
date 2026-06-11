import { useState, useEffect, useCallback, useRef } from 'react'

const testimonials = [
  {
    id: 1,
    quote:
      '\u201CCooper transformed how we process submissions. What took hours now takes minutes. It\u2019s like having an insurance expert available 24/7. Cooper has become essential to scaling fast and staying competitive.\u201D',
    name: 'Rushil Goel, CEO Nirvana Insurance',
    photo: '/images/testimonial-rushil.png',
    logo: '/images/nirvana-logo.png',
    logoAlt: 'Nirvana',
  },
  {
    id: 2,
    quote:
      '\u201COur producers used to spend half their day chasing missing documents. Cooper handles that automatically now \u2014 flagging gaps, pulling data, and keeping everything organized. We\u2019ve doubled our submission volume without adding headcount.\u201D',
    name: 'Sarah Chen, VP Operations Apex Brokerage',
    photo: '/images/testimonial-sarah.jpg',
    logo: '/images/nirvana-logo.png',
    logoAlt: 'Apex',
  },
  {
    id: 3,
    quote:
      '\u201CThe policy comparison alone saves us 15 hours a week. Cooper reads every document, highlights what matters, and gives us side-by-side breakdowns that used to take our senior underwriters an entire afternoon.\u201D',
    name: 'James Mitchell, Head of Underwriting Trident MGA',
    photo: '/images/testimonial-james.jpg',
    logo: '/images/nirvana-logo.png',
    logoAlt: 'Trident',
  },
  {
    id: 4,
    quote:
      '\u201CWe were skeptical about AI in insurance, but Cooper proved us wrong in the first week. It caught coverage gaps we\u2019d been missing for months. Our loss ratio improved and our clients noticed the difference immediately.\u201D',
    name: 'Maria Santos, Managing Director Lighthouse Re',
    photo: '/images/testimonial-maria.jpg',
    logo: '/images/nirvana-logo.png',
    logoAlt: 'Lighthouse',
  },
]

const DURATION = 6000

export default function Testimonial() {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const rafRef = useRef<number>(0)
  const t = testimonials[active]

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  const goTo = (idx: number) => {
    if (idx === active) return
    setActive(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
    setPaused(true)
    setTimeout(() => setPaused(false), 10000)
  }

  useEffect(() => {
    if (paused) return
    startRef.current = Date.now() - (progress / 100) * DURATION

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        goNext()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, active, goNext])

  return (
    <section className="bg-cream-light py-[100px] px-[62px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Card */}
        <div className="relative">
          {/* Outer border box (quote side) */}
          <div className="ml-[33px] border border-dark">
            <div className="grid grid-cols-[342px_1fr] min-h-[387px]">
              {/* Left — Photo (overlaps border) */}
              <div className="relative">
                <div
                  className="absolute top-[-32px] left-[-33px] w-[343px] h-[346px] border border-dark overflow-hidden"
                  style={{ boxShadow: '0px 7.5px 69.6px -20px rgba(0,0,0,0.33)' }}
                >
                  <img
                    key={`photo-${animKey}`}
                    src={t.photo}
                    alt=""
                    className="w-full h-full object-cover animate-fade-blur-in"
                    style={{ mixBlendMode: 'luminosity' }}
                  />
                  {/* Radial vignette */}
                  <div
                    className="absolute inset-0 opacity-24"
                    style={{
                      background:
                        'radial-gradient(ellipse at 43% 92%, rgba(0,0,0,0) 0%, rgba(28,11,5,1) 100%)',
                    }}
                  />
                  {/* Bottom blur fade (progressive) */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-[140px] pointer-events-none"
                    style={{
                      opacity: 0.84,
                      backdropFilter: 'blur(40px)',
                      WebkitBackdropFilter: 'blur(40px)',
                      maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
                      background: 'linear-gradient(to top, rgba(237,231,217,0.5) 0%, rgba(237,231,217,0.2) 40%, transparent 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Right — Quote content */}
              <div className="flex flex-col justify-center px-[62px] py-[50px]" key={`content-${animKey}`}>
                <blockquote className="font-serif text-[24px] leading-[1.5] text-dark mb-[32px] max-w-[790px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                  {t.quote}
                </blockquote>
                <div className="flex items-center gap-[24px] animate-fade-blur-in" style={{ animationDelay: '0.3s' }}>
                  <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark">
                    {t.name}
                  </p>
                  <img
                    src={t.logo}
                    alt={t.logoAlt}
                    className="h-[24px] w-auto"
                    style={{ mixBlendMode: 'luminosity' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dots navigation with progress */}
          <div className="flex justify-center gap-[14px] mt-[40px]">
            {testimonials.map((_, i) => {
              const isActive = active === i
              const isPast = i < active
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative w-[14px] h-[14px] cursor-pointer flex items-center justify-center"
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  {/* Progress ring for active dot */}
                  {isActive && (
                    <svg className="absolute inset-0 w-[14px] h-[14px] -rotate-90">
                      <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(30,26,21,0.15)" strokeWidth="1.5" />
                      <circle
                        cx="7" cy="7" r="5.5" fill="none"
                        stroke="#1e1a15" strokeWidth="1.5"
                        strokeDasharray={`${2 * Math.PI * 5.5}`}
                        strokeDashoffset={`${2 * Math.PI * 5.5 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                      />
                    </svg>
                  )}
                  {/* Dot */}
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-[6px] h-[6px] bg-dark'
                        : isPast
                          ? 'w-[6px] h-[6px] bg-dark/40'
                          : 'w-[6px] h-[6px] bg-dark/20'
                    }`}
                  />
                  {/* Outline ring for inactive */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full border border-dark/15" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
