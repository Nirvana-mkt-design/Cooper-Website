import React, { useEffect, useRef } from 'react'
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


/* ── Comparison table check icon ── */
function CheckCircle({ color = 'orange' }: { color?: 'orange' | 'white' }) {
  const stroke = color === 'white' ? '#fff' : '#d95611'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke={stroke} strokeWidth="1.5" />
      <path d="M7 11.5L9.5 14L15 8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Comparison data ── */
const cooperRows = [
  'Rekey the same data into ACORD 125 / 137',
  'Fill the submission across six carrier portals',
  'Chase missing documents over email',
  'Copy everything back into the AMS',
]
const humanRows = [
  'Win and keep the account',
  'Read the loss runs, spot the real exposure',
  'Compare the quotes, advise the client',
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
              We're building the insurance coworker — one that does the real work.
            </h1>
          </div>

          {/* Bottom-right — body text */}
          <div className="flex lg:justify-end mt-[80px]">
            <p className="font-sans text-[17.8px] leading-[1.5] text-cream-light max-w-full lg:max-w-[465px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
              Cooper is AI built for insurance. Not another platform of menus and fixed workflows, but a teammate that does the document-heavy work the way your best people do, and adapts to how your shop actually runs.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TEAM INTRO — photo left, copy right
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[80px] lg:py-[100px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[48px] lg:gap-[80px] items-center">
              {/* Left — team photo */}
              <div className="w-full overflow-hidden">
                <img
                  src="/images/about/team-photo.jpg"
                  alt="Cooper team"
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              {/* Right — copy */}
              <div>
                <img
                  src="/images/cooper-icon.svg"
                  alt=""
                  className="w-[40px] h-[40px] mb-[28px]"
                />
                <h2
                  className="font-serif text-[28px] md:text-[36px] lg:text-[42px] leading-[1.15] text-dark mb-[32px] animate-fade-blur-in"
                >
                  Cooper works with you as an AI coworker, not an app.
                </h2>
                <div className="flex flex-col gap-[20px] animate-fade-blur-in" style={{ animationDelay: '0.15s' }}>
                  <p className="font-sans text-[17px] leading-[1.7] text-dark/60">
                    A great coworker follows instructions, adapts to your process, and figures out the right move when nobody wrote the playbook.
                  </p>
                  <p className="font-sans text-[17px] leading-[1.7] text-dark/60">
                    Software has never worked that way. It stays boxed in by rigid interfaces and fixed menus. We hold Cooper to the coworker standard and grow it by teaching, not by adding features.
                  </p>
                  <p className="font-sans text-[17px] leading-[1.7] text-dark/60">
                    Founded by a team with deep expertise in insurance and the technology to reshape it, we've lived the busywork firsthand. That's why we built Cooper to handle it, so brokers get their time back for the work only people can do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          BUSYWORK vs JUDGMENT — comparison table
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[80px] lg:py-[100px]">

            {/* Section header */}
            <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-accent-orange mb-[20px] block animate-fade-blur-in">
              The Problem
            </span>
            <h2 className="font-serif text-[30px] md:text-[44px] lg:text-[54px] leading-[1.1] text-dark mb-[56px] max-w-[760px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
              Insurance brokers are drowning in busywork. Cooper gives you time back to focus on judgment.
            </h2>

            {/* Table — flat grid so colored columns are truly continuous */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[520px] grid grid-cols-[1fr_180px_180px] lg:grid-cols-[1fr_220px_220px]">

                {/* Row 1 — category headings */}
                <div />
                <div className="px-4 pb-[10px] text-center">
                  <p className="font-serif text-[18px] lg:text-[20px] text-dark leading-none mb-[4px]">Busywork</p>
                  <p className="font-grotesk font-medium text-[10px] tracking-[1.2px] uppercase text-accent-orange">Cooper handles</p>
                </div>
                <div className="px-4 pb-[10px] text-center">
                  <p className="font-serif text-[18px] lg:text-[20px] text-dark leading-none mb-[4px]">Judgment</p>
                  <p className="font-grotesk font-medium text-[10px] tracking-[1.2px] uppercase text-accent-orange">Your people keep</p>
                </div>

                {/* Row 2 — sub-column headers */}
                <div />
                <div className="bg-accent-orange rounded-t-[12px] px-4 py-[16px] flex flex-col items-center gap-[6px]">
                  <img src="/images/cooper-icon.svg" alt="" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="font-grotesk font-medium text-[10px] tracking-[1.3px] uppercase text-white">Cooper</span>
                </div>
                <div className="px-4 py-[16px] flex items-center justify-center">
                  <span className="font-grotesk font-medium text-[10px] tracking-[1.3px] uppercase text-dark/40">Your team</span>
                </div>

                {/* Cooper rows */}
                {cooperRows.map((label, i) => (
                  <React.Fragment key={`c-${i}`}>
                    <div className="py-[13px] pr-6 border-t border-dark/8 font-sans text-[14px] lg:text-[15px] leading-[1.5] text-dark/55 self-center">{label}</div>
                    <div className="bg-accent-orange flex items-center justify-center py-[13px] border-t border-white/15">
                      <CheckCircle color="white" />
                    </div>
                    <div className="flex items-center justify-center py-[13px] border-t border-dark/8">
                      <span className="text-dark/25 text-[16px] leading-none">—</span>
                    </div>
                  </React.Fragment>
                ))}

                {/* Human rows */}
                {humanRows.map((label, i) => (
                  <React.Fragment key={`h-${i}`}>
                    <div className="py-[13px] pr-6 border-t border-dark/8 font-sans text-[14px] lg:text-[15px] leading-[1.5] text-dark/55 self-center">{label}</div>
                    <div className={`bg-accent-orange/20 flex items-center justify-center py-[13px] border-t border-accent-orange/20 ${i === humanRows.length - 1 ? 'rounded-b-[12px]' : ''}`}>
                      <span className="text-accent-orange/50 text-[16px] leading-none">—</span>
                    </div>
                    <div className="flex items-center justify-center py-[13px] border-t border-dark/8">
                      <CheckCircle color="orange" />
                    </div>
                  </React.Fragment>
                ))}

              </div>
            </div>

            {/* Footer */}
            <p className="font-sans text-[13px] lg:text-[14px] leading-[1.75] text-dark/45 mt-[48px] max-w-[760px]">
              Insurance runs on email, Excel, a browser, and a CRM. None of those tools were built for the expertise the work actually takes.{' '}
              <span className="font-medium text-accent-orange">Cooper takes the busywork. Your people keep the judgment.</span>
            </p>

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
                    Join us in bringing insurance brokers to the future.
                  </h2>
                  <Link
                    to="/careers"
                    className="inline-block w-fit font-sans font-medium text-[15px] text-dark bg-white rounded-[6px] px-[28px] py-[12px] hover:bg-cream hover:scale-[1.03] transition-all duration-200 no-underline animate-fade-blur-in"
                    style={{ animationDelay: '0.25s' }}
                  >
                    Open roles
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
