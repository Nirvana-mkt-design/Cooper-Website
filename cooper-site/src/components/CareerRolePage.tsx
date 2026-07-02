import { useEffect, useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { fetchJob, deptLabel, employmentLabel, locationLabel, type AshbyJobDetail } from '../lib/ashby'

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
            <div className="flex items-center gap-[12px] flex-wrap animate-fade-blur-in" style={{ animationDelay: '0.1s' }}>
              <span className={`font-grotesk text-[11px] font-medium tracking-[0.5px] uppercase px-[10px] py-[4px] rounded-full ${deptColor(job.department)}`}>
                {deptLabel(job.department)}
              </span>
              <span className="font-sans text-[14px] text-dark/50 flex items-center gap-[6px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {locationLabel(job)}
              </span>
              <span className="font-sans text-[14px] text-dark/50 flex items-center gap-[6px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {employmentLabel(job.employmentType)}
              </span>
            </div>
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
                className="ashby-description animate-fade-blur-in"
                style={{ animationDelay: '0.15s' }}
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            )}
          </RevealSection>

          {/* ── Sidebar ── */}
          {job && (
            <div className="static lg:sticky lg:top-[100px] w-full animate-fade-blur-in" style={{ animationDelay: '0.2s' }}>
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

      <Footer />
    </div>
  )
}
