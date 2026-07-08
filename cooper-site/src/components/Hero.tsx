import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const roles = [
  { label: 'Retail Agencies', slug: 'retail-agencies', delay: '1.6s' },
  { label: 'Wholesale Brokers', slug: 'wholesale-brokers', delay: '1.75s' },
  { label: 'MGA & Insurers', slug: 'mgas-insurers', delay: '1.9s' },
  { label: 'Claims TPA', slug: 'claims-tpas', delay: '2.05s' },
]

export default function Hero() {
  // Mobile-only carousel for the "Built For" personas
  const [activeRole, setActiveRole] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[100dvh] lg:min-h-0 lg:h-[897px] flex flex-col lg:block">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/hero-bg-compressed.mp4" type="video/mp4" />
        </video>
        {/* Warm gradient overlays matching Figma */}
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{
            backgroundImage: 'linear-gradient(261deg, rgba(186, 67, 9, 0) 36.6%, rgba(186, 67, 9, 0.36) 53%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(37.4deg, rgba(0, 0, 0, 0.42) 46.8%, rgba(0, 0, 0, 0) 76.9%)',
          }}
        />
      </div>

      {/* Frosted glassmorphism bar at bottom — dreamy fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[180px] lg:h-[350px] z-[5]"
        style={{
          backdropFilter: 'blur(39.85px)',
          WebkitBackdropFilter: 'blur(39.85px)',
          background: 'linear-gradient(to top, rgba(255,255,255,0.25), rgba(255,255,255,0))',
          maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px] flex-1 flex flex-col justify-center pt-[80px] pb-[120px] lg:flex-none lg:block lg:pt-[254px] lg:pb-0">
        <div className="max-w-[794px]">
          <p className="animate-fade-blur-in font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-[#fffcf1]/80 mb-[20px]" style={{ animationDelay: '0.2s' }}>
            Built for Insurance Professionals
          </p>
          <h1 className="font-serif text-[52px] md:text-[64px] lg:text-[96px] leading-[1.05] text-cream-light mb-[20px]" style={{ textIndent: '-5px' }}>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.5s' }}>More business. </span>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.8s' }}>Less busywork.</span>
          </h1>
          <p className="animate-fade-blur-in font-sans font-normal text-[17.8px] leading-[1.5] text-[#FFFCF1] max-w-[536px]" style={{ animationDelay: '1.1s' }}>
            Cooper is your AI coworker for the entire insurance workflow from intake to renewal.
          </p>
        </div>
      </div>

      {/* Built For bar at bottom (mobile sits higher to clear the fixed CTA) */}
      <div className="absolute bottom-[104px] lg:bottom-[20px] left-0 right-0 z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px]">
        {/* Desktop / tablet-landscape: full row of all personas */}
        <div className="hidden lg:flex items-center gap-[52px]">
          <span className="animate-fade-blur-in font-serif text-[36px] leading-[1.2] text-cream-light shrink-0" style={{ animationDelay: '1.4s' }}>
            Built<br />For
          </span>
          <div className="flex flex-wrap items-center gap-[52px] font-serif text-[24px] leading-[1.2] text-cream-light">
            {roles.map((role) => (
              <Link
                key={role.slug}
                to={`/personas/${role.slug}`}
                className="animate-fade-blur-in no-underline text-cream-light hover:text-cream-light"
                style={{
                  animationDelay: role.delay,
                  borderBottom: '1.2px dashed transparent',
                  paddingBottom: '2px',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,252,241,0.6)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                {role.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: "Built For" fixed, personas as an auto-rotating carousel */}
        <div className="flex lg:hidden items-center gap-4">
          <span className="animate-fade-blur-in font-serif text-[24px] md:text-[34px] leading-[1.15] text-cream-light shrink-0 whitespace-nowrap" style={{ animationDelay: '1.4s' }}>
            Built For
          </span>
          <div className="flex-1 min-w-0">
            {/* Sliding persona label — left-aligned in the remaining space */}
            <div className="relative h-[34px] md:h-[42px] overflow-hidden">
              {roles.map((role, i) => (
                <Link
                  key={role.slug}
                  to={`/personas/${role.slug}`}
                  aria-hidden={i !== activeRole}
                  className="absolute inset-0 flex items-center justify-start no-underline"
                  style={{
                    opacity: i === activeRole ? 1 : 0,
                    transform: i === activeRole ? 'translateY(0)' : 'translateY(10px)',
                    pointerEvents: i === activeRole ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }}
                >
                  <span
                    className="font-serif text-[19px] md:text-[28px] leading-[1.2] text-cream-light whitespace-nowrap"
                    style={{ borderBottom: '1.2px dashed rgba(255,252,241,0.5)', paddingBottom: '2px' }}
                  >
                    {role.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
