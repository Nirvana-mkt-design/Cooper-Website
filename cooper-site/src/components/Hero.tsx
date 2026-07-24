import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const roles = [
  { label: 'Retail Agencies', slug: 'retail-agencies' },
  { label: 'Wholesale Brokers', slug: 'wholesale-brokers' },
  { label: 'MGA & Insurers', slug: 'mgas-insurers' },
  { label: 'Claims TPA', slug: 'claims-tpas' },
]

// Stagger for the "Built For" row: the label reveals at 0.6s, each persona
// 0.1s after the previous one.
const roleDelay = (i: number) => `${0.6 + 0.1 * (i + 1)}s`

export default function Hero() {
  // Mobile-only carousel for the "Built For" personas
  const [activeRole, setActiveRole] = useState(0)

  // The background video is desktop-only: on phones its ~780 KB competed with
  // fonts, CSS and JS for 4G bandwidth and wrecked LCP. Mobile keeps the still
  // frame below (visually the video's first frame); desktop layers the video
  // in after mount, so prerendered HTML stays identical for SSR hydration.
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setShowVideo(true)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Height uses svh (small viewport height), not dvh: dvh recomputes as the
  // mobile browser's address bar hides/shows on scroll, which resized this
  // section mid-scroll and shifted the centered content + absolute "Built For"
  // bar (the distortion on iOS). svh is stable across that toolbar toggle.
  return (
    <section className="relative overflow-hidden min-h-[100svh] lg:min-h-0 lg:h-[897px] flex flex-col lg:block">
      {/* Background: still frame first (fast LCP paint), video layered in on desktop */}
      <div className="absolute inset-0">
        <img
          src="/images/home-hero-frame-1920.webp"
          srcSet="/images/home-hero-frame-828.webp 828w, /images/home-hero-frame-1200.webp 1200w, /images/home-hero-frame-1920.webp 1928w"
          sizes="100vw"
          width={1928}
          height={1072}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/hero-bg-compressed.mp4" type="video/mp4" />
          </video>
        )}
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

      {/* Content — on short/landscape phones (max-height 520) it stays centered but
          shrinks and reserves room at the bottom for the desktop-style "Built For"
          row; the sticky CTA is hidden there. Portrait/desktop are unchanged. */}
      <div className="relative z-10 max-w-[1440px] mx-auto [@media(max-height:520px)]:mx-0 [@media(max-height:520px)]:self-stretch px-5 md:px-10 lg:px-[62px] flex-1 flex flex-col pt-[80px] pb-[150px] [@media(max-height:520px)]:justify-center [@media(max-height:520px)]:pt-[60px] [@media(max-height:520px)]:pb-[92px] lg:flex-none lg:block lg:pt-[254px] lg:pb-0">
        <div className="max-w-[794px]">
          <p className="animate-fade-blur-in font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-[#fffcf1]/80 mb-[20px] [@media(max-height:520px)]:mb-[10px]" style={{ animationDelay: '0.05s' }}>
            Built for Insurance Professionals
          </p>
          <h1 className="font-serif text-[52px] md:text-[64px] lg:text-[96px] leading-[1.05] text-cream-light mb-[20px] [@media(max-height:520px)]:text-[40px] [@media(max-height:520px)]:mb-[12px]" style={{ textIndent: '-5px' }}>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.15s' }}>More business. </span>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.3s' }}>Less busywork.</span>
          </h1>
          <p className="animate-fade-blur-in font-sans font-normal text-[17.8px] leading-[1.5] text-[#FFFCF1] max-w-[536px] [@media(max-height:520px)]:text-[15px]" style={{ animationDelay: '0.45s' }}>
            Cooper is your AI coworker for the entire insurance workflow from intake to renewal.
          </p>
        </div>

        {/* Mobile-portrait "Built For" bar: in normal flow, pinned to the bottom with
            mt-auto so a taller headline/paragraph can never drop onto it on short
            viewports (was absolute bottom-[150px], which collided on small iPhones).
            Desktop + landscape keep the absolute row below. */}
        <div className="flex lg:hidden [@media(max-height:520px)]:hidden items-center gap-4 mt-auto">
          <span className="animate-fade-blur-in font-serif text-[24px] md:text-[34px] leading-[1.15] text-cream-light shrink-0 whitespace-nowrap" style={{ animationDelay: '0.6s' }}>
            Built For
          </span>
          <div className="flex-1 min-w-0">
            {/* Sliding persona label — left-aligned in the remaining space */}
            <div className="relative h-[34px] md:h-[42px] overflow-hidden">
              {roles.map((role, i) => (
                <Link
                  key={role.slug}
                  to={`/product/${role.slug}`}
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

      {/* Built For bar. Mobile-portrait sits higher (bottom-150) to clear the fixed CTA + the stacked blur bands;
          landscape phones sit at the bottom like desktop (the CTA is hidden there) and
          show the full persona row instead of the carousel. */}
      <div className="hidden lg:block [@media(max-height:520px)]:block absolute bottom-[150px] lg:bottom-[20px] left-0 right-0 z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px] [@media(max-height:520px)]:bottom-[24px]">
        {/* Desktop + landscape-phone: full row of all personas */}
        <div className="hidden lg:flex [@media(max-height:520px)]:flex items-center gap-[52px] [@media(max-height:520px)]:gap-[24px]">
          <span className="animate-fade-blur-in font-serif text-[36px] leading-[1.2] text-cream-light shrink-0 [@media(max-height:520px)]:text-[22px]" style={{ animationDelay: '0.6s' }}>
            Built<br />For
          </span>
          <div className="flex flex-wrap items-center gap-[52px] font-serif text-[24px] leading-[1.2] text-cream-light [@media(max-height:520px)]:gap-x-[26px] [@media(max-height:520px)]:gap-y-[6px] [@media(max-height:520px)]:text-[19px]">
            {roles.map((role, i) => (
              <Link
                key={role.slug}
                to={`/product/${role.slug}`}
                className="animate-fade-blur-in no-underline text-cream-light hover:text-cream-light"
                style={{
                  animationDelay: roleDelay(i),
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
      </div>
    </section>
  )
}
