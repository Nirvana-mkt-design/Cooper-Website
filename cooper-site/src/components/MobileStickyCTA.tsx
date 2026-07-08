import { Link } from 'react-router-dom'

/**
 * Mobile-only "Request a Demo" CTA, used on the home page only.
 * Pinned to the bottom of the viewport and always visible (it stays fixed
 * rather than hiding on scroll).
 *
 * Behind the button sits the same frosted glassmorphism fade used at the
 * bottom of the hero: a backdrop blur that's strongest at the bottom and
 * dissolves upward, so page content softly blurs behind the CTA.
 */
export default function MobileStickyCTA() {
  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 h-[190px] flex items-end pointer-events-none"
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
          className="pointer-events-auto flex w-full items-center justify-center gap-3 rounded-[18px] border border-white/15 bg-accent-orange px-6 py-[20px] font-sans text-[18px] text-cream-light no-underline shadow-[0_8px_30px_rgba(217,86,17,0.35)] hover:opacity-90 transition-opacity"
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
