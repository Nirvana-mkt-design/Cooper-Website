import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll-reveal wrapper — adds `.revealed` the first time the block enters the
 * viewport, which the `.reveal-section` rule in index.css animates against.
 *
 * The older pages each carry their own copy of this; the Resources pages share
 * this one so the three of them stay in step.
 */
export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="reveal-section" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
