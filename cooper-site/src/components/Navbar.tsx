import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CooperLogo from './CooperLogo'

/* ── Panel data ── */
interface NavItem {
  title: string
  desc: string
  href?: string
}

interface NavPanel {
  cols: { label: string; items: NavItem[] }[]
  featured: { badge: string; title: string; desc: string; link: string }
}

const productPanel: NavPanel = {
  cols: [
    {
      label: 'Capabilities',
      items: [
        { title: 'Intelligent Intake', desc: 'Submissions processed in seconds — any format, any carrier.' },
        { title: 'Deep Insights', desc: 'Coverage gaps, policy changes, red flags — caught before they cost money.' },
        { title: 'Workflow Automation', desc: 'Guidelines, correspondence, reports — your process at machine speed.' },
      ],
    },
    {
      label: 'By role',
      items: [
        { title: 'Retail Brokers', desc: 'Win more business and serve clients better.', href: '/personas/retail-agencies' },
        { title: 'Wholesale Brokers', desc: 'Place more business faster with intelligent matching.', href: '/personas/wholesale-brokers' },
        { title: 'Insurers & MGAs', desc: 'Scale underwriting without scaling headcount.', href: '/personas/mgas-insurers' },
        { title: 'Reinsurers', desc: 'Optimize treaties and risk at portfolio scale.', href: '/personas/reinsurers' },
        { title: 'Claims TPAs', desc: 'Streamline claims from intake to reporting.', href: '/personas/claims-tpas' },
      ],
    },
  ],
  featured: {
    badge: 'Featured',
    title: 'Cooper for Submissions',
    desc: 'See how teams process submissions 3x faster — from intake to bound policy, fully automated.',
    link: 'Learn more',
  },
}

const customersPanel: NavPanel = {
  cols: [
    {
      label: 'Customer stories',
      items: [
        { title: 'All Stories', desc: 'How insurance teams are using Cooper to work faster.' },
        { title: 'Case Studies', desc: 'Detailed results and outcomes from real teams.' },
        { title: 'Security & Compliance', desc: 'SOC 2 Type II, HIPAA, audit logs, and more.' },
      ],
    },
  ],
  featured: {
    badge: 'Case study',
    title: 'Nirvana Insurance',
    desc: '"What took hours now takes seconds." See how Nirvana transformed their submission process.',
    link: 'Read the story',
  },
}

const aboutPanel: NavPanel = {
  cols: [
    {
      label: 'Company',
      items: [
        { title: 'About Cooper', desc: 'Our mission, team, and why we\'re building for insurance.' },
        { title: 'Contact', desc: 'Get in touch with our team.' },
      ],
    },
    {
      label: 'News & Press',
      items: [
        { title: 'Newsroom', desc: 'Latest announcements, launches, and company updates.' },
        { title: 'Press Kit', desc: 'Logos, brand assets, and media resources.' },
        { title: 'In the Media', desc: 'Cooper in industry publications and coverage.' },
      ],
    },
  ],
  featured: {
    badge: 'Announcement',
    title: 'Latest from Cooper',
    desc: 'Placeholder for the latest company announcement, funding round, or product launch.',
    link: 'Read more',
  },
}

const panels: Record<string, NavPanel> = {
  Product: productPanel,
  Customers: customersPanel,
  About: aboutPanel,
}

const navLinks = [
  { label: 'Product', hasDropdown: true },
  { label: 'Customers', hasDropdown: true },
  { label: 'About', hasDropdown: true },
  { label: 'Blog', hasDropdown: false },
  { label: 'Careers', hasDropdown: false, badge: "We're hiring" },
]

export default function Navbar({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light'
  const [scrolled, setScrolled] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleEnter = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    if (panels[label]) setOpenPanel(label)
  }

  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenPanel(null), 150)
  }

  const handlePanelEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
  }

  const panel = openPanel ? panels[openPanel] : null

  const isOpen = !!panel

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      onMouseLeave={handleLeave}
    >
      {/* ── Background ── */}
      {isLight ? (
        <div className="absolute inset-0 bg-cream-light" style={{ borderBottom: scrolled || isOpen ? '1px solid rgba(30,26,21,0.1)' : '1px solid rgba(30,26,21,0.08)' }} />
      ) : (scrolled || isOpen) ? (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(39.85px)',
            WebkitBackdropFilter: 'blur(39.85px)',
            background: 'linear-gradient(to bottom, rgba(80,70,55,0.55), rgba(80,70,55,0.4))',
            boxShadow: isOpen ? '0 12px 40px rgba(0,0,0,0.12)' : 'none',
          }}
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              height: '102px',
              filter: 'blur(39.85px)',
              opacity: 0.5,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              height: '102px',
              backdropFilter: 'blur(6.3px)',
              WebkitBackdropFilter: 'blur(6.3px)',
              maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            }}
          />
        </>
      )}

      {/* ── Nav bar content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto flex items-center justify-between h-[72px] px-[62px]">
        <Link to="/" className="no-underline">
          <CooperLogo dark={isLight} className={`origin-left transition-transform duration-300 ${scrolled || isLight ? 'scale-100' : 'scale-[1.8]'}`} />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 font-sans transition-colors cursor-pointer text-[16px] ${
                isLight
                  ? `text-dark/70 hover:text-dark ${openPanel === link.label ? 'text-dark' : ''}`
                  : `text-white/90 hover:text-white ${openPanel === link.label ? 'text-white' : ''}`
              }`}
              onMouseEnter={() => link.hasDropdown ? handleEnter(link.label) : setOpenPanel(null)}
            >
              {link.label}
              {/* Dashed underline on active/hover */}
              <span
                className={`absolute bottom-0 left-3 right-3 border-b border-dashed ${isLight ? 'border-dark/30' : 'border-white/50'} transition-opacity duration-200 ${
                  openPanel === link.label ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ bottom: '2px' }}
              />
              {link.hasDropdown && (
                <svg
                  width="8" height="5" viewBox="0 0 8 5" fill="none"
                  className={`opacity-40 mt-px transition-transform duration-200 ${openPanel === link.label ? 'rotate-180' : ''}`}
                >
                  <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {link.badge && (
                <span className={`text-[12px] font-semibold tracking-[0.36px] rounded-full px-2 py-0.5 uppercase ml-1 ${isLight ? 'border border-dark/20 bg-dark/5 text-dark/70' : 'border border-white/40 bg-white/10 text-white'}`}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/demo" className={`font-sans text-[16px] rounded-[5px] px-5 py-2.5 transition-colors cursor-pointer no-underline ${isLight ? 'text-cream-light bg-dark hover:bg-dark/90 border border-dark' : 'text-white border border-white/40 bg-white/10 hover:bg-white/20'}`}>
            Request a Demo
          </Link>
        </div>
      </div>

      {/* ── Mega menu panel (inside same nav) ── */}
      <div
        className="relative z-10 grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        onMouseEnter={handlePanelEnter}
      >
        <div className="overflow-hidden">
        {/* Thin divider line */}
        <div className={`mx-[62px] border-t ${isLight ? 'border-dark/[0.08]' : 'border-white/[0.12]'}`} />

        {/* Panel content */}
        {panel && (
          <div
            className={`max-w-[1440px] mx-auto px-[62px] py-[32px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-4 blur-[8px]'
            }`}
          >
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: panel.cols.length === 1 ? '1fr 320px' : `repeat(${panel.cols.length}, 1fr) 320px`,
              }}
            >
              {/* Columns */}
              {panel.cols.map((col, ci) => (
                <div
                  key={col.label}
                  className={ci > 0 ? `pl-[32px] border-l ${isLight ? 'border-dark/[0.08]' : 'border-white/[0.08]'}` : ''}
                  style={{ paddingRight: 32 }}
                >
                  <div className={`font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase mb-[16px] ${isLight ? 'text-dark/40' : 'text-white/40'}`}>
                    {col.label}
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    {col.items.map((item) => {
                      const inner = (
                        <>
                          <div className={`relative font-sans text-[14px] font-semibold mb-[2px] w-fit ${isLight ? 'text-dark' : 'text-white/90'}`}>
                            {item.title}
                            <span className={`absolute bottom-[-2px] left-0 right-0 border-b border-dashed ${isLight ? 'border-dark/30' : 'border-white/50'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                          </div>
                          <div className={`font-sans text-[12px] leading-[1.45] ${isLight ? 'text-dark/40' : 'text-white/35'}`}>
                            {item.desc}
                          </div>
                        </>
                      )
                      const cls = `block px-[12px] py-[10px] rounded-[8px] transition-colors no-underline group ${isLight ? 'hover:bg-dark/[0.04]' : 'hover:bg-white/[0.06]'}`
                      if ('href' in item && item.href) {
                        return (
                          <Link key={item.title} to={item.href} className={cls} onClick={() => setOpenPanel(null)}>
                            {inner}
                          </Link>
                        )
                      }
                      return (
                        <a key={item.title} href="#" className={cls}>
                          {inner}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Featured card */}
              <div className={`pl-[32px] border-l ${isLight ? 'border-dark/[0.08]' : 'border-white/[0.08]'} flex flex-col`}>
                <div className={`rounded-[8px] aspect-[16/10] mb-[16px] flex items-center justify-center border ${isLight ? 'bg-dark/[0.04] border-dark/[0.08]' : 'bg-white/[0.06] border-white/[0.08]'}`}>
                  <span className={`font-grotesk font-medium text-[10px] tracking-[1px] uppercase px-[8px] py-[2px] rounded-[3px] ${isLight ? 'text-dark/40 bg-dark/[0.06] border border-dark/[0.1]' : 'text-white/40 bg-white/[0.08] border border-white/[0.1]'}`}>
                    {panel.featured.badge}
                  </span>
                </div>
                <div className={`font-sans text-[14px] font-semibold mb-[6px] ${isLight ? 'text-dark' : 'text-white/90'}`}>
                  {panel.featured.title}
                </div>
                <div className={`font-sans text-[12px] leading-[1.5] mb-[14px] ${isLight ? 'text-dark/40' : 'text-white/40'}`}>
                  {panel.featured.desc}
                </div>
                <a href="#" className={`font-sans text-[12px] font-medium flex items-center gap-[4px] transition-colors no-underline mt-auto ${isLight ? 'text-dark/50 hover:text-dark' : 'text-white/50 hover:text-white'}`}>
                  {panel.featured.link} <span>→</span>
                </a>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}
