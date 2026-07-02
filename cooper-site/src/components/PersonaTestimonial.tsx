/* ──────────────────────────────────────────────────────────────
   PersonaTestimonial — Harvey-style editorial quote slider, reusable
   across every persona page. Narrow meta column (author / role) on
   the left, a large serif pull-quote on the right, and a segmented
   progress bar that auto-advances. Pulls per-page testimonials via props.
─────────────────────────────────────────────────────────────── */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { TestimonialItem } from '../data/personas'

const DURATION = 9000

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduce(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduce
}

export default function PersonaTestimonial({ testimonials }: { testimonials: TestimonialItem[] }) {
  const reduce = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const rafRef = useRef<number>(0)
  const startRef = useRef(0)

  if (!testimonials.length) return null
  const multiple = testimonials.length > 1
  const t = testimonials[active]
  const clean = t.quote.replace(/^[“"]|[”"]$/g, '').trim()

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
  }, [testimonials.length])

  const goTo = (idx: number) => {
    if (idx === active) return
    setActive(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    setPaused(true)
    window.setTimeout(() => setPaused(false), DURATION)
  }

  useEffect(() => {
    if (!multiple || paused || reduce) return
    startRef.current = performance.now() - (progress / 100) * DURATION
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) goNext()
      else rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active, goNext, multiple, reduce])

  return (
    <section className="bg-cream-light py-[120px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[60px]">
        <div className="grid grid-cols-1 items-start gap-[40px] lg:grid-cols-[260px_1fr] lg:gap-[80px]">
          {/* Fixed label — never changes */}
          <div className="lg:pt-[8px]">
            <p className="font-grotesk text-[11px] font-medium uppercase tracking-[1.6px] text-dark/40">
              What they say about Cooper
            </p>
          </div>

          {/* Quote + attribution — fades in fresh on each change */}
          <div key={`quote-${animKey}`} className="animate-fade-in min-h-[200px] lg:min-h-[260px]" style={{ animationDelay: '0.08s' }}>
            <blockquote className="font-serif text-[26px] leading-[1.28] text-dark sm:text-[32px] lg:text-[40px] lg:leading-[1.24]">
              &ldquo;{clean}&rdquo;
            </blockquote>
            {(t.author || t.role) && (
              <p className="mt-[20px] font-sans text-[13px] text-dark/45">
                {t.author && <span className="font-medium text-dark/65">{t.author}</span>}
                {t.author && t.role && <span className="mx-[6px] text-dark/30">·</span>}
                {t.role && <span>{t.role}</span>}
              </p>
            )}
          </div>
        </div>

        {/* segmented progress bar (only when more than one) */}
        {multiple && (
          <div className="mt-10 md:mt-14 lg:mt-[72px] flex gap-[8px]">
            {testimonials.map((_, i) => {
              const fill = i < active ? 100 : i === active ? progress : 0
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="group relative h-[18px] flex-1 cursor-pointer"
                >
                  <span className="absolute inset-x-0 top-[8px] h-[2px] bg-dark/15" />
                  <span
                    className="absolute left-0 top-[8px] h-[2px] bg-dark"
                    style={{
                      width: `${fill}%`,
                      transition: i === active ? 'none' : 'width 0.3s ease',
                    }}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
