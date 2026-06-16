import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { personas, getPersonaBySlug } from '../data/personas'
import type { Feature } from '../data/personas'
import Navbar from './Navbar'
import Testimonial from './Testimonial'
import Footer from './Footer'

function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

function FeatureBlock({ feature, index }: { feature: Feature; index: number }) {
  const isReversed = index % 2 === 1

  return (
    <RevealOnScroll delay={index * 100}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[80px] items-center py-[64px] ${
        index > 0 ? 'border-t border-dark/[0.06]' : ''
      }`}>
        {/* Text side */}
        <div className={isReversed ? 'lg:order-2' : ''}>
          <span className="inline-flex items-center justify-center w-[36px] h-[36px] rounded-full bg-accent-orange/10 text-accent-orange font-grotesk font-semibold text-[14px] mb-[24px]">
            {index + 1}
          </span>
          <h3 className="font-serif text-[32px] leading-[1.2] text-dark mb-[16px]">
            {feature.title}
          </h3>
          <p className="font-sans text-[17px] leading-[1.7] text-dark/55">
            {feature.description}
          </p>
        </div>

        {/* Visual placeholder */}
        <div className={isReversed ? 'lg:order-1' : ''}>
          <div
            className="w-full aspect-[4/3] rounded-[16px] border border-dark/[0.06]"
            style={{
              background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE6D8 50%, #E8DFD0 100%)',
            }}
          />
        </div>
      </div>
    </RevealOnScroll>
  )
}

export default function PersonaPage() {
  const { slug } = useParams<{ slug: string }>()
  const persona = getPersonaBySlug(slug || '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!persona) {
    return (
      <div className="min-h-screen bg-cream-light">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-[62px] pt-[200px] pb-[120px] text-center">
          <h1 className="font-serif text-[48px] text-dark mb-[16px]">Page not found</h1>
          <p className="font-sans text-[17px] text-dark/50 mb-[32px]">
            The persona you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="font-sans font-medium text-[16px] text-cream-light bg-accent-orange rounded-[8px] px-[28px] py-[14px] no-underline hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const otherPersonas = personas.filter((p) => p.slug !== persona.slug)

  const personaIcons: Record<string, React.ReactNode> = {
    'retail-agencies': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    'wholesale-brokers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
      </svg>
    ),
    'mgas-insurers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    'claims-tpas': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    'reinsurers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  }

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* Hero Section — Harvey-style layout */}
      <section className="bg-cream-light">
        {/* Top: text row */}
        <div className="max-w-[1440px] mx-auto px-[62px] pt-[160px] pb-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[80px] items-end">
            {/* Left — label + headline */}
            <div>
              <p
                className="animate-fade-blur-in font-grotesk font-medium text-[13px] tracking-[1.3px] uppercase text-accent-orange mb-[28px]"
                style={{ animationDelay: '0.2s' }}
              >
                {persona.label}
              </p>
              <h1
                className="animate-fade-blur-in font-serif text-[67px] leading-[1.05] text-dark"
                style={{ animationDelay: '0.4s' }}
              >
                {persona.headline}
              </h1>
            </div>

            {/* Right — subtitle + CTA */}
            <div className="lg:pb-[8px]">
              <p
                className="animate-fade-blur-in font-sans text-[18px] leading-[1.6] text-dark/50 max-w-[460px] mb-[32px]"
                style={{ animationDelay: '0.6s' }}
              >
                {persona.subtitle}
              </p>
              <Link
                to="/demo"
                className="animate-fade-blur-in inline-block font-sans font-medium text-[16px] text-cream-light bg-dark rounded-[8px] px-[32px] py-[14px] no-underline hover:opacity-90 transition-opacity cursor-pointer"
                style={{ animationDelay: '0.8s' }}
              >
                {persona.ctaText}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: full-width video/image */}
        <div className="max-w-[1440px] mx-auto px-[62px] pb-[0px]">
          <div
            className="animate-fade-blur-in w-full aspect-[2.4/1] rounded-[16px] overflow-hidden relative"
            style={{ animationDelay: '0.6s' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/images/persona-hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cream-light pb-[80px]">
        <div className="max-w-[1440px] mx-auto px-[62px]">

          <div className="flex flex-col">
            {persona.features.map((feature, index) => (
              <FeatureBlock key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <RevealOnScroll>
        <Testimonial />
      </RevealOnScroll>

      {/* CTA Section */}
      <RevealOnScroll>
        <section className="relative overflow-hidden py-[120px]">
          {/* Video background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#1e1a15]" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            >
              <source src="/images/persona-cta-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(30,26,21,0.3) 0%, rgba(30,26,21,0.7) 100%)' }} />
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-[62px] text-center">
            <h2 className="font-serif text-[42px] leading-[1.2] text-cream-light mb-[16px]">
              Ready to see Cooper in action?
            </h2>
            <p className="font-sans text-[17px] leading-[1.6] text-cream-light/60 max-w-[460px] mx-auto mb-[32px]">
              No generic demo. We show you how Cooper works for {persona.name.toLowerCase()}, with your own data.
            </p>
            <Link
              to="/demo"
              className="inline-block font-sans font-medium text-[16px] text-dark bg-cream-light rounded-[8px] px-[32px] py-[14px] no-underline hover:opacity-90 transition-opacity cursor-pointer"
            >
              Book a Demo
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      {/* Other Personas Navigation */}
      <RevealOnScroll>
        <section className="bg-cream-light py-[100px]">
          <div className="max-w-[1440px] mx-auto px-[62px]">
            <p className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark/40 mb-[40px]">
              Built for every role
            </p>
            <div className="flex flex-col">
              {otherPersonas.map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/personas/${p.slug}`}
                  className={`group flex items-center justify-between py-[24px] no-underline transition-colors ${
                    i < otherPersonas.length - 1 ? 'border-b border-dark/[0.08]' : ''
                  }`}
                >
                  <div className="flex items-center gap-[20px]">
                    <div className="w-[48px] h-[48px] rounded-[12px] bg-dark/[0.05] flex items-center justify-center text-dark/40 group-hover:text-accent-orange group-hover:bg-accent-orange/[0.08] transition-colors shrink-0">
                      {personaIcons[p.slug]}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                    <span className="font-serif text-[28px] leading-[1.3] text-dark group-hover:text-accent-orange transition-colors">
                      {p.name}
                    </span>
                    <span className="font-sans text-[15px] text-dark/40 group-hover:text-dark/60 transition-colors">
                      {p.subtitle.split(' — ')[0].split('.')[0]}.
                    </span>
                  </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-dark/20 group-hover:text-accent-orange transition-colors shrink-0 ml-[24px]"
                  >
                    <path
                      d="M7 4l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <Footer />
    </div>
  )
}
