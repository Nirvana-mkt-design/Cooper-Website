import { Link } from 'react-router-dom'

const roles = [
  { label: 'Retail Agencies', slug: 'retail-agencies', delay: '1.6s' },
  { label: 'Wholesale Brokers', slug: 'wholesale-brokers', delay: '1.75s' },
  { label: 'MGAs & Insurers', slug: 'mgas-insurers', delay: '1.9s' },
  { label: 'Claims TPAs', slug: 'claims-tpas', delay: '2.05s' },
  { label: 'Reinsurers', slug: 'reinsurers', delay: '2.2s' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden h-auto pb-[48px] lg:pb-0 lg:h-[897px]">
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
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px] pt-[120px] md:pt-[180px] lg:pt-[254px]">
        <div className="max-w-[794px]">
          <p className="animate-fade-blur-in font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-[#fffcf1]/80 mb-[20px]" style={{ animationDelay: '0.2s' }}>
            Built for Insurance Professionals
          </p>
          <h1 className="font-serif text-[40px] md:text-[64px] lg:text-[96px] leading-[1.05] text-cream-light mb-[20px]" style={{ textIndent: '-5px' }}>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.5s' }}>More business. </span>
            <span className="animate-fade-blur-in block" style={{ animationDelay: '0.8s' }}>Less busywork.</span>
          </h1>
          <p className="animate-fade-blur-in font-sans font-normal text-[17.8px] leading-[1.5] text-[#FFFCF1] max-w-[536px]" style={{ animationDelay: '1.1s' }}>
            Cooper is AI built for insurance, bringing your workflows together and automating what slows you down.
          </p>
        </div>
      </div>

      {/* Built For bar at bottom */}
      <div className="relative mt-[48px] lg:mt-0 lg:absolute lg:bottom-[20px] left-0 right-0 z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px]">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-[52px]">
          <span className="animate-fade-blur-in font-serif text-[26px] md:text-[34px] lg:text-[36px] leading-[1.2] text-cream-light shrink-0" style={{ animationDelay: '1.4s' }}>
            Built<br />For
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:gap-[52px] font-serif text-[18px] md:text-[20px] lg:text-[24px] leading-[1.2] text-cream-light">
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
      </div>
    </section>
  )
}
