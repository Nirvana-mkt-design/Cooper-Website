import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/* ── Scroll reveal (same pattern as HomePage) ── */
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

/* ── Scroll-linked principle item ── */
function PrincipleItem({ title, desc }: { title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="max-w-[672px]">
      <h3
        className="font-serif text-[22px] leading-[27.5px] text-accent-orange mb-[16px] transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0.4 }}
      >
        {title}
      </h3>
      <p
        className="font-sans text-[24px] leading-[28.8px] tracking-[-0.24px] text-dark transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0.4 }}
      >
        {desc}
      </p>
    </div>
  )
}

/* ── Principles data ── */
const principles = [
  {
    title: 'A coworker, not software.',
    desc: 'We benchmark against the best insurance employee, not against other tools. Every decision starts with how a person handles the work today, and how they\'d handle it with a hundred people at their disposal.',
  },
  {
    title: 'Domain knowledge is the moat.',
    desc: 'We pair the general expertise of how insurance works with the specific way each agency, carrier, and MGA actually operates. The first gets us in the door. The second makes us hard to replace.',
  },
  {
    title: 'Careful before fast.',
    desc: 'In insurance, a wrong answer costs more than a slow one. When Cooper is unsure it checks instead of guessing, and asks instead of making something up. Customers hand us their most important work only if they trust it completely.',
  },
]

/* ── Investors ── */
const investors = [
  { name: 'Valor Equity Partners', image: '/images/about/investor-1.png' },
  { name: 'Lightspeed', image: '/images/about/investor-2.png' },
  { name: 'General Catalyst', image: '/images/about/investor-3.png' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO — full-viewport dark with background image
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark" />
        <img
          src="/images/about/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-hard-light"
          style={{
            backgroundImage: 'linear-gradient(261deg, rgba(186,67,9,0) 37%, rgba(186,67,9,0.36) 53%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(37deg, rgba(0,0,0,0.42) 47%, rgba(0,0,0,0) 77%)',
          }}
        />

        {/* Top frosted blur — same as home hero navbar area */}
        <div
          className="absolute top-0 left-0 right-0 h-[102px] z-[5] opacity-50"
          style={{
            filter: 'blur(39.85px)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[102px] z-[5]"
          style={{
            backdropFilter: 'blur(6.3px)',
            WebkitBackdropFilter: 'blur(6.3px)',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }}
        />


        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[62px] w-full pt-[200px] pb-[120px] min-h-screen flex flex-col justify-between">
          {/* Top — headline */}
          <div className="max-w-[645px]">
            <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-cream-light mb-[16px] block animate-fade-blur-in">
              About Cooper
            </span>
            <h1 className="font-serif text-[40px] leading-[44px] md:text-[64px] md:leading-[68px] lg:text-[64px] lg:leading-[68px] tracking-[-1.44px] text-cream-light animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
              We're building the coworker insurance has been missing.
            </h1>
          </div>

          {/* Bottom-right — body text */}
          <div className="flex lg:justify-end mt-[80px]">
            <p className="font-sans text-[17.8px] leading-[1.5] text-cream-light max-w-full lg:max-w-[465px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
              Cooper is AI built for commercial insurance. Not another platform with menus and fixed workflows, but a teammate that does the document-heavy work the way your best people do, and adapts to how your shop actually runs.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRINCIPLES — bg cream, heading left, principles right, image bottom-right
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] pt-[110px] pb-[0px] relative">
            {/* Cooper icon */}
            <div className="mb-[48px] animate-fade-blur-in">
              <img
                src="/images/cooper-icon.svg"
                alt=""
                className="w-[37px] h-[37px]"
                style={{ filter: 'brightness(0)' }}
              />
            </div>

            {/* 2-col: heading left, principles right */}
            <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 lg:gap-[80px] items-start">
              {/* Left — heading */}
              <div className="static lg:sticky lg:top-[120px]">
                <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                  A few principles we don't compromise on.
                </h2>
              </div>

              {/* Right — stacked principles with scroll-linked opacity */}
              <div className="flex flex-col gap-[64px] lg:gap-[120px]">
                {principles.map((p) => (
                  <PrincipleItem key={p.title} title={p.title} desc={p.desc} />
                ))}
              </div>
            </div>

          </div>
          {/* Image at bottom-right — flush to right edge */}
          <div className="flex justify-end mt-[80px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-full max-w-full lg:w-[898px] aspect-[898/530] overflow-hidden relative mr-0 lg:mr-[-85px]">
              <img
                src="/images/about/principles-photo.jpg"
                alt="Team at work"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          INVESTORS — label + heading inline, 3 cards
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px]">
            {/* Label + Heading on same line */}
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-[24px] mb-[56px]">
              <span className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange md:pt-[12px] shrink-0 animate-fade-blur-in">
                Our Investors
              </span>
              <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark max-w-[756px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                Backed by investors who have built category-defining companies.
              </h2>
            </div>

            {/* Investor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {investors.map((inv, i) => (
                <div
                  key={inv.name}
                  className="animate-fade-blur-in"
                  style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                >
                  <img
                    src={inv.image}
                    alt={inv.name}
                    className="w-full h-auto rounded-[16px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          CAREERS CTA — contained rounded card
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[48px]">
            <div className="relative overflow-hidden rounded-[30px] h-auto lg:h-[420px]">
              {/* Background image with Cooper logo shapes */}
              <img
                src="/images/about/careers-cta-bg.png"
                alt=""
                className="absolute top-0 left-0 w-full max-w-none"
                style={{ height: '140%' }}
              />

              {/* Content — 2 col */}
              <div className="relative z-10 h-full flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 px-5 md:px-10 lg:px-[72px] py-12 lg:py-0">
                {/* Left — heading + button */}
                <div className="flex-1">
                  <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-cream-light mb-[16px] block animate-fade-blur-in">
                    Careers
                  </span>
                  <h2 className="font-serif text-[26px] md:text-[34px] lg:text-[42px] leading-[1.15] text-white mb-[36px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                    Come teach an<br className="hidden lg:block" /> industry to a coworker.
                  </h2>
                  <Link
                    to="/careers"
                    className="inline-block w-fit font-sans font-medium text-[15px] text-dark bg-white rounded-[6px] px-[28px] py-[12px] hover:bg-cream-light transition-colors no-underline animate-fade-blur-in"
                    style={{ animationDelay: '0.25s' }}
                  >
                    See open roles
                  </Link>
                </div>

                {/* Right — body text */}
                <div className="flex-1 flex lg:justify-end w-full">
                  <p className="font-sans text-[15px] leading-[24.75px] text-white/80 max-w-full lg:max-w-[380px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
                    We're a small team giving Cooper the judgment of a great insurance professional. If that's your kind of problem, we're hiring across engineering, design, and go-to-market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <Footer />
    </div>
  )
}
