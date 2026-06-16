import { useState, useEffect, useRef } from 'react'

const metrics = [
  { end: 25, suffix: 'h', label: 'Saved monthly per producer', note: 'avg. across active teams' },
  { end: 17, suffix: '%', label: 'More bound premium per producer', note: 'avg. across active teams' },
  { end: 28, suffix: '%', label: 'Document processing accuracy', note: 'validated across all formats' },
]

function useCountUp(end: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let raf: number

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, start])

  return value
}

function AnimatedMetric({ metric, delay }: { metric: typeof metrics[0]; delay: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const count = useCountUp(metric.end, 1800, visible)

  return (
    <div ref={ref} className="flex flex-col gap-[16px] items-center text-center flex-1">
      <span className={`font-serif text-[96px] leading-[1] text-cream-light transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {visible ? `${count}${metric.suffix}` : `0${metric.suffix}`}
      </span>
      <span className={`font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-cream-light leading-[1.5] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
        {metric.label}
      </span>
      <span className={`font-sans text-[16px] leading-[1.2] text-cream-light/50 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.5s' }}>
        {metric.note}
      </span>
    </div>
  )
}

export default function Metrics() {
  return (
    <section className="relative h-[516px] overflow-hidden">
      {/* Background layers from Figma */}
      <div className="absolute inset-0">
        {/* Base dark color */}
        <div className="absolute inset-0 bg-[#1e1a15]" />
        {/* Photo */}
        <img
          src="/images/metrics-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
        {/* Warm gradient overlays — hard-light */}
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{ backgroundImage: 'linear-gradient(239.87deg, rgba(186,67,9,0) 47.62%, rgba(186,67,9,0.43) 82.36%)' }}
        />
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{ backgroundImage: 'linear-gradient(-69.48deg, rgba(186,186,9,0) 56.77%, rgba(186,89,9,0.43) 92.22%)' }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: 'radial-gradient(ellipse at 71% 70%, rgba(0,0,0,0) 0%, rgba(28,11,5,1) 100%)' }}
        />
      </div>

      {/* Glassmorphism blur overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[138px] pt-[50px] pb-[50px]">
        <div className="flex flex-col gap-[50px]">
          {/* Heading */}
          <div className="flex flex-col gap-[28px] max-w-[483px]">
            <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-cream-light leading-[1.5]">
              Impact
            </p>
            <h2 className="font-serif text-[48px] leading-[1.2] text-cream-light">
              Measurable results from day one
            </h2>
          </div>

          {/* Metrics row */}
          <div className="flex items-start justify-between w-full">
            {metrics.map((m, i) => (
              <AnimatedMetric key={m.label} metric={m} delay={i * 200} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
