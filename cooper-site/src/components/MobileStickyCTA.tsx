import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

/**
 * Mobile-only floating "Request a Demo" CTA.
 * Pinned to the bottom of the viewport, it hides when the user scrolls down
 * and reappears when they scroll up (and whenever near the top of the page).
 *
 * Behind the button sits the same frosted glassmorphism fade used at the
 * bottom of the hero: a backdrop blur that's strongest at the bottom and
 * dissolves upward, so page content softly blurs behind the CTA.
 */
export default function MobileStickyCTA() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY

      // Always show near the very top; otherwise follow scroll direction with a
      // small threshold so tiny jitters don't toggle the button.
      if (y < 80) {
        setHidden(false)
      } else if (delta > 6) {
        setHidden(true)
      } else if (delta < -6) {
        setHidden(false)
      }

      lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 h-[190px] flex items-end pointer-events-none transition-transform duration-300 ease-out"
      style={{ transform: hidden ? 'translateY(100%)' : 'translateY(0)' }}
    >
      {/* Frosted glassmorphism fade — same recipe as the hero bottom bar. */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          background: 'linear-gradient(to top, rgba(255,255,255,0.18), rgba(255,255,255,0))',
          maskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
        }}
      />

      {/* The button */}
      <div
        className="relative w-full px-5"
        style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
      >
        <Link
          to="/demo"
          className="pointer-events-auto flex w-full items-center justify-center gap-3 rounded-[18px] border border-white/25 px-6 py-[20px] font-sans text-[18px] text-cream-light no-underline shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          style={{
            background: 'rgba(30,26,21,0.28)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <img
            src="/images/cooper-icon.svg"
            alt=""
            aria-hidden="true"
            className="h-[24px] w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          Request a Demo
        </Link>
      </div>
    </div>
  )
}
