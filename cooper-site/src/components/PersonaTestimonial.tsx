/* ──────────────────────────────────────────────────────────────
   PersonaTestimonial — photo-less editorial quote slider, reusable
   across every persona page. Pulls the per-page testimonials via props.
─────────────────────────────────────────────────────────────── */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { TestimonialItem } from '../data/personas'

const DURATION = 9000

export default function PersonaTestimonial({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const rafRef = useRef<number>(0)

  const multiple = testimonials.length > 1
  const t = testimonials[active]
  const clean = t.quote.replace(/^[“"]|[”"]$/g, '').trim()

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
  }, [testimonials.length])

  const goTo = (idx: number) => {
    if (idx === active) return
    setActive(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startRef.current = Date.now()
    setPaused(true)
    setTimeout(() => setPaused(false), DURATION)
  }

  useEffect(() => {
    if (!multiple || paused) return
    startRef.current = Date.now() - (progress / 100) * DURATION
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) goNext()
      else rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active, goNext, multiple])

  return (
    <section className="bg-cream-light py-[120px] px-[40px]">
      <div className="mx-auto max-w-[900px] text-center">
        {/* Oversized ocre quotation mark — sits on the right while the rest is centered */}
        <div aria-hidden className="translate-y-[20px] text-right font-serif text-[124px] leading-[0.6] text-accent-orange select-none">
          &rdquo;
        </div>

        <blockquote
          key={`q-${animKey}`}
          className="animate-fade-blur-in mt-[24px] font-serif text-[32px] leading-[1.3] tracking-[-0.5px] text-[#0a0a0a] sm:text-[40px]"
        >
          {clean}
        </blockquote>

        <div key={`a-${animKey}`} className="animate-fade-blur-in mt-[40px] flex flex-col items-center gap-[6px]" style={{ animationDelay: '0.12s' }}>
          <p className="font-grotesk text-[14px] font-medium uppercase tracking-[1.6px] text-dark">{t.author}</p>
          {t.role && <p className="font-sans text-[15px] text-dark/50">{t.role}</p>}
        </div>

        {/* Dots navigation with progress (only when more than one) */}
        {multiple && (
          <div className="mt-[48px] flex justify-center gap-[14px]">
            {testimonials.map((_, i) => {
              const isActive = active === i
              const isPast = i < active
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex h-[14px] w-[14px] cursor-pointer items-center justify-center"
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  {isActive && (
                    <svg className="absolute inset-0 h-[14px] w-[14px] -rotate-90">
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
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isActive ? 'h-[6px] w-[6px] bg-dark' : isPast ? 'h-[6px] w-[6px] bg-dark/40' : 'h-[6px] w-[6px] bg-dark/20'
                    }`}
                  />
                  {!isActive && <div className="absolute inset-0 rounded-full border border-dark/15" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
