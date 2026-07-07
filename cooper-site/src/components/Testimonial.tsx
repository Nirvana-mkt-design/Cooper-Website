import { useState, useEffect, useCallback, useRef } from 'react'

const testimonials = [
  {
    id: 1,
    quote:
      '\u201CIt has really opened the minds of our producers and a lot of our team who were previously very closed off to the idea of using AI.\u201D',
    name: 'Operations Director, Specialty Commercial Brokerage',
  },
  {
    id: 2,
    quote: '\u201CCooper is literally a magic wand.\u201D',
    name: 'Claims Examiner, Boutique Claims TPA',
  },
  {
    id: 3,
    quote:
      '\u201CWe now have the capacity to get submissions out same day. It used to be \u2018we can\u2019t do this today, we\u2019ll get it out tomorrow morning.\u2019 Now anything we get in a day, we can get out to market, which is huge.\u201D',
    name: 'Marketing Manager, Specialty Commercial Brokerage',
  },
  {
    id: 4,
    quote:
      '\u201CThe coverage analysis is amazing, I absolutely love it. If we were to do that on our own, it would probably take five hours in itself.\u201D',
    name: 'Commercial Lines Account Manager, Independent Retail Agency',
  },
  {
    id: 5,
    quote:
      '\u201CI get a lot of documents from the producer, and now I can just forward them to Cooper instead of going into the system. I really like that a lot.\u201D',
    name: 'Account Manager, Independent Retail Agency',
  },
]

const DURATION = 12000

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
          {/* Quote card */}
          <div className="border border-dark">
            <div className="flex flex-col justify-center min-h-[387px] px-6 py-[50px] md:px-[62px]" key={`content-${animKey}`}>
              <blockquote className="font-serif text-[24px] lg:text-[30px] leading-[1.5] text-dark mb-[32px] max-w-[900px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                {t.quote}
              </blockquote>
              <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark animate-fade-blur-in" style={{ animationDelay: '0.3s' }}>
                {t.name}
              </p>
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
