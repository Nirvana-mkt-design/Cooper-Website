import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { fetchJob, deptLabel, employmentLabel, locationLabel, compensationLabel, type AshbyJobDetail } from '../lib/ashby'

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

export default function CareerRolePage() {
  const { roleId } = useParams<{ roleId: string }>()
  const [job, setJob] = useState<AshbyJobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 120)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!roleId) return
    fetchJob(roleId)
      .then(setJob)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [roleId])

  if (notFound) return <Navigate to="/careers" replace />

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ══════════════════════════════════════════════
          BREADCRUMB + HEADER
          ══════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] pt-[120px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-[8px] mb-[40px] animate-fade-blur-in">
          <Link to="/" className="font-sans text-[13px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            Home
          </Link>
          <span className="font-sans text-[13px] text-dark/20">/</span>
          <Link to="/careers" className="font-sans text-[13px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            Careers
          </Link>
          <span className="font-sans text-[13px] text-dark/20">/</span>
          <span className="font-sans text-[13px] text-dark/70">{job?.title ?? '...'}</span>
        </nav>

        {loading ? (
          <div className="animate-pulse space-y-[16px] mb-[48px]">
            <div className="h-[52px] w-[60%] bg-dark/8 rounded-[8px]" />
            <div className="h-[28px] w-[30%] bg-dark/8 rounded-[8px]" />
          </div>
        ) : job && (
          /* Title + meta tags */
          <div className="mb-[48px]">
            <h1 className="font-serif text-[32px] leading-[36px] md:text-[44px] md:leading-[48px] lg:text-[52px] lg:leading-[56px] tracking-[-1px] text-dark mb-[20px] animate-fade-blur-in" style={{ animationDelay: '0.05s' }}>
              {job.title}
            </h1>
            <div className="flex items-center gap-[12px] flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className={`font-grotesk text-[11px] font-medium tracking-[0.5px] uppercase px-[10px] py-[4px] rounded-full ${deptColor(job.department)}`}>
                {deptLabel(job.department)}
              </span>
              <span className="font-sans text-[14px] text-dark/60 flex items-center gap-[6px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {locationLabel(job)}
              </span>
              <span className="font-sans text-[14px] text-dark/60 flex items-center gap-[6px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {employmentLabel(job.employmentType)}
              </span>
              {compensationLabel(job) && (
                <span className="font-sans text-[14px] text-dark/60 flex items-center gap-[6px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2.5" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  {compensationLabel(job)}
                </span>
              )}
            </div>
            {/* Mobile — inline Apply button at top */}
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden mt-[24px] block w-full text-center font-sans font-medium text-[15px] text-white rounded-[12px] py-[14px] hover:opacity-90 transition-opacity no-underline animate-fade-in"
              style={{ backgroundColor: '#BA4309', animationDelay: '0.15s' }}
            >
              Apply for this role
            </a>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          CONTENT — description + sidebar
          ══════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] pb-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-[64px] items-start">

          {/* ── Main content — Ashby HTML description ── */}
          <RevealSection>
            {loading ? (
              <div className="animate-pulse space-y-[12px]">
                {[80, 60, 90, 70, 50].map((w, i) => (
                  <div key={i} className="h-[18px] bg-dark/8 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : job && (
              <div
                className="ashby-description animate-fade-in"
                style={{ animationDelay: '0.15s' }}
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            )}
          </RevealSection>

          {/* ── Sidebar — desktop only ── */}
          {job && (
            <div className="hidden lg:block lg:sticky lg:top-[100px] w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-[20px] p-5 lg:p-[32px]" style={{ backgroundColor: '#1D1A17' }}>
                {/* Apply button */}
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-sans font-medium text-[15px] text-white rounded-[12px] py-[16px] hover:opacity-90 transition-opacity no-underline mb-[28px]"
                  style={{ backgroundColor: '#BA4309' }}
                >
                  Apply for this role
                </a>

                {/* Details */}
                <div className="space-y-[20px]">
                  <div>
                    <div className="font-grotesk font-medium text-[11px] tracking-[1px] uppercase mb-[4px]" style={{ color: '#C5C0AA' }}>Department</div>
                    <div className="font-sans text-[15px] text-white">{deptLabel(job.department)}</div>
                  </div>
                  <div className="border-t border-white/[0.08]" />
                  <div>
                    <div className="font-grotesk font-medium text-[11px] tracking-[1px] uppercase mb-[4px]" style={{ color: '#C5C0AA' }}>Location</div>
                    <div className="font-sans text-[15px] text-white">{locationLabel(job)}</div>
                  </div>
                  <div className="border-t border-white/[0.08]" />
                  <div>
                    <div className="font-grotesk font-medium text-[11px] tracking-[1px] uppercase mb-[4px]" style={{ color: '#C5C0AA' }}>Type</div>
                    <div className="font-sans text-[15px] text-white">{employmentLabel(job.employmentType)}</div>
                  </div>
                  {compensationLabel(job) && (
                    <>
                      <div className="border-t border-white/[0.08]" />
                      <div>
                        <div className="font-grotesk font-medium text-[11px] tracking-[1px] uppercase mb-[4px]" style={{ color: '#C5C0AA' }}>Compensation</div>
                        <div className="font-sans text-[15px] text-white">{compensationLabel(job)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Back to all roles */}
              <Link
                to="/careers#open-roles"
                className="flex items-center gap-[8px] mt-[20px] font-sans text-[14px] text-dark/40 hover:text-dark/70 no-underline transition-colors justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View all open roles
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Apply bar — mobile only, appears after scroll */}
      {job && (
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          style={{ backgroundColor: '#F5F1EA', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Fade gradient above the bar */}
          <div className="absolute -top-[40px] left-0 right-0 h-[40px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(245,241,234,0), rgba(245,241,234,1))' }} />
          <div className="px-5 pt-[12px] pb-[16px]">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center font-sans font-medium text-[15px] text-white rounded-[12px] py-[15px] hover:opacity-90 transition-opacity no-underline"
              style={{ backgroundColor: '#BA4309' }}
            >
              Apply for this role
            </a>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
