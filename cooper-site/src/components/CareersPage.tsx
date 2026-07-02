import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { fetchJobs, deptLabel, employmentLabel, locationLabel, type AshbyJob } from '../lib/ashby'

/* ── Scroll reveal ── */
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

/* ── Team photos for marquee ── */
const teamPhotos = [
  '/images/careers/IMG_2940.jpg',
  '/images/careers/IMG_5227.jpg',
  '/images/careers/IMG_2941.jpg',
  '/images/careers/IMG_7892.jpg',
  '/images/careers/IMG_2942.jpg',
  '/images/careers/IMG_3044.jpg',
  '/images/careers/IMG_7951.jpg',
  '/images/careers/IMG_2943.jpg',
  '/images/careers/IMG_8809.jpg',
  '/images/careers/IMG_3113.jpg',
  '/images/careers/IMG_2953.jpg',
  '/images/careers/IMG_9381.jpg',
  '/images/careers/IMG_3224.jpg',
  '/images/careers/IMG_2954.jpg',
  '/images/careers/IMG_3225.jpg',
  '/images/careers/IMG_3423.jpg',
  '/images/careers/IMG_3462.jpg',
  '/images/careers/image-1.jpg',
  '/images/careers/WhatsApp Image 2026-06-22 at 15.35.21.jpeg',
]

/* ── Investors ── */
const investors = [
  { name: 'Lightspeed', image: '/images/about/investor-2.png' },
  { name: 'General Catalyst', image: '/images/about/investor-3.png' },
  { name: 'Valor Equity Partners', image: '/images/about/investor-1.png' },
]


/* ── Department color helper ── */
function deptColor(dept: string) {
  const label = deptLabel(dept)
  switch (label) {
    case 'Engineering': return 'bg-[#BA4309]/10 text-[#BA4309]'
    case 'Sales & Marketing': return 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
    case 'Operations': return 'bg-[#7C5E3C]/10 text-[#7C5E3C]'
    default: return 'bg-dark/10 text-dark'
  }
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<AshbyJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false))
  }, [])

  const departments = [...new Set(jobs.map(j => deptLabel(j.department)))]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO — reuse careers CTA background
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background layers — same pattern as About/Home hero */}
        <div className="absolute inset-0 bg-dark" />
        <img
          src="/images/careers-hero.jpg"
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

        {/* Top frosted blur — darker tone */}
        <div
          className="absolute top-0 left-0 right-0 h-[102px] z-[5] opacity-60"
          style={{
            filter: 'blur(39.85px)',
            background: 'linear-gradient(to bottom, rgba(30,26,21,0.5), rgba(30,26,21,0))',
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
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] pt-[200px] pb-[120px] min-h-screen flex flex-col justify-end">
          <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-cream-light/70 mb-[16px] block animate-fade-blur-in">
            Careers at Cooper
          </span>
          <h1 className="font-serif text-[40px] leading-[44px] md:text-[64px] md:leading-[68px] lg:text-[64px] lg:leading-[68px] tracking-[-1.44px] text-white max-w-[700px] mb-[32px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
            We're building the insurance coworker, one that does the real work.
          </h1>
          <p className="font-sans text-[18px] leading-[1.6] text-white/80 max-w-full lg:max-w-[540px] mb-[40px] animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
            We're a small team teaching Cooper the judgment of a top insurance professional. If that's your kind of problem, we'd love to meet you.
          </p>
          <a
            href="#open-roles"
            className="inline-block w-fit font-sans font-medium text-[15px] text-dark bg-white rounded-[6px] px-[28px] py-[12px] hover:bg-cream hover:scale-[1.03] transition-all duration-200 no-underline animate-fade-blur-in"
            style={{ animationDelay: '0.3s' }}
          >
            View open roles
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MISSION INTRO — 2-col heading + body
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px] lg:py-[120px]">
            <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 lg:gap-[80px] items-start">
              {/* Left — heading */}
              <div className="lg:sticky lg:top-[120px]">
                <h2 className="font-serif text-[30px] leading-[36px] md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[52px] tracking-[-0.5px] text-dark animate-fade-blur-in">
                  We're building the coworker insurance never had.
                </h2>
              </div>

              {/* Right — body paragraphs */}
              <div className="flex flex-col gap-[28px] animate-fade-blur-in" style={{ animationDelay: '0.15s' }}>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  Insurance is one of the largest industries in the world, and most of it still runs by hand: documents read one at a time, forms filled in, policies checked line by line. The people who do this work are good at it. The tools they've been given aren't.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  That's where Cooper comes in. It takes on the work the way a sharp colleague would, learning how each shop runs and earning its way onto the tasks that matter most. It takes real judgment, not just automation, and it's hard to get right.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark/70">
                  The work here stays close to the ground. You'll see how customers actually operate, put real things in their hands quickly, and own the outcome from start to finish. A rare problem, hiding in plain sight.
                </p>
                <p className="font-sans text-[18px] leading-[1.7] text-dark">
                  If it's the kind you've been looking for, come find your place here.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          PHOTO STRIP — slow continuous marquee, pauses on hover
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light overflow-hidden pb-[80px] group/strip">
          <div className="flex gap-[10px] w-max animate-marquee-slow group-hover/strip:[animation-play-state:paused]">
            {[...teamPhotos, ...teamPhotos].map((src, i) => (
              <div
                key={i}
                className="h-[220px] md:h-[260px] shrink-0 overflow-hidden rounded-[6px] transition-all duration-500 ease-out"
                style={{
                  aspectRatio: '4/3',
                  ['--rotate' as string]: i % 2 === 0 ? '1.5deg' : '-1.5deg',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = `rotate(var(--rotate)) scale(1.03)`)}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          INVESTORS
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-cream-light">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px]">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-[24px] mb-[56px]">
              <span className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange md:pt-[12px] shrink-0 animate-fade-blur-in">
                Our Investors
              </span>
              <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark max-w-[756px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                Backed by builders of <span className="whitespace-nowrap">category-defining</span> companies.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {investors.map((inv, i) => (
                <div key={inv.name} className="animate-fade-blur-in" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
                  <img src={inv.image} alt={inv.name} className="w-full h-auto rounded-[16px] opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════
          OPEN ROLES
          ══════════════════════════════════════════════ */}
      <RevealSection>
        <section id="open-roles" className="bg-cream-light scroll-mt-[80px]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[100px]">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-[24px] mb-[64px]">
              <span className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange md:pt-[12px] shrink-0 animate-fade-blur-in">
                Open Roles
              </span>
              <h2 className="font-serif text-[26px] leading-[32px] md:text-[34px] md:leading-[40px] lg:text-[40px] lg:leading-[44.8px] text-dark max-w-[600px] animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
                Find your place at Cooper.
              </h2>
            </div>

            {loading && (
              <p className="font-sans text-[15px] text-dark/40 animate-pulse">Loading open roles...</p>
            )}
            {!loading && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-[80px] text-center animate-fade-blur-in">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-[24px] text-dark/25">
                  {/* Briefcase */}
                  <rect x="6" y="18" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 18v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6 30h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 30v2h8v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-serif text-[22px] text-dark mb-[12px]">No open roles right now.</p>
                <p className="font-sans text-[15px] leading-[1.6] text-dark/50 max-w-[380px]">
                  We're a small team and hire carefully. Follow us on{' '}
                  <a
                    href="https://www.linkedin.com/company/cooperai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-orange hover:underline"
                  >
                    LinkedIn
                  </a>{' '}
                  to be the first to know when something opens up.
                </p>
              </div>
            )}
            {departments.map((dept) => (
              <div key={dept} className="mb-[48px]">
                <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark/40 mb-[20px] pb-[12px] border-b border-dark/[0.08]">
                  {dept}
                </h3>
                <div className="flex flex-col">
                  {jobs
                    .filter(j => deptLabel(j.department) === dept)
                    .map((job, i) => (
                      <Link
                        key={job.id}
                        to={`/careers/${job.id}`}
                        className="group flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-[20px] border-b border-dark/[0.06] no-underline transition-colors hover:bg-cream/50 px-[16px] -mx-[16px] rounded-[8px] animate-fade-blur-in"
                        style={{ animationDelay: `${0.2 + i * 0.06}s` }}
                      >
                        <div className="flex items-center gap-[16px]">
                          <span className="font-sans text-[17px] font-medium text-dark group-hover:text-accent-orange transition-colors">
                            {job.title}
                          </span>
                          <span className={`font-grotesk text-[11px] font-medium tracking-[0.5px] uppercase px-[8px] py-[3px] rounded-full ${deptColor(job.department)}`}>
                            {dept}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-[16px] gap-y-2 md:gap-[24px]">
                          <span className="font-sans text-[14px] text-dark/40">{locationLabel(job)}</span>
                          <span className="font-sans text-[14px] text-dark/40">{employmentLabel(job.employmentType)}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-dark/30 group-hover:text-accent-orange group-hover:translate-x-1 transition-all">
                            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>


      <Footer />
    </div>
  )
}
