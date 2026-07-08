import { useState, useEffect, useRef, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import CooperLogo from './CooperLogo'
import {
  Storefront, Handshake, Buildings, ClipboardText,
  UsersThree, ChartBar, ShieldCheck,
  Info, Envelope,
  Newspaper, Package, Monitor,
  List, X, CaretDown,
} from '@phosphor-icons/react'

/* ── Panel data ── */
interface NavItem {
  title: string
  desc: string
  href?: string
  icon?: ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular'; className?: string }>
}

interface NavPanel {
  cols: { label: string; items: NavItem[] }[]
  featured: { badge: string; title: string; desc: string; link: string; image: string }
}

const productPanel: NavPanel = {
  cols: [
    /* Capabilities column hidden for now — will be used later
    {
      label: 'Capabilities',
      items: [
        { title: 'Intelligent Intake', desc: 'Submissions processed in seconds, any format, any carrier.', icon: Tray },
        { title: 'Deep Insights', desc: 'Coverage gaps, policy changes, red flags, caught before they cost money.', icon: MagnifyingGlass },
        { title: 'Workflow Automation', desc: 'Guidelines, correspondence, reports, your process at machine speed.', icon: Lightning },
      ],
    },
    */
    {
      label: 'By role',
      items: [
        { title: 'Retail Agencies', desc: 'Get the first quote back and win the account.', href: '/personas/retail-agencies', icon: Storefront },
        { title: 'Wholesale Brokers', desc: 'Point every risk at the market that will write it.', href: '/personas/wholesale-brokers', icon: Handshake },
        { title: 'MGA & Insurers', desc: 'Underwrite by your guidelines, at scale.', href: '/personas/mgas-insurers', icon: Buildings },
        { title: 'Claims TPA', desc: 'Faster cycle times, from first notice to close.', href: '/personas/claims-tpas', icon: ClipboardText },
      ],
    },
  ],
  featured: {
    badge: 'Featured',
    title: 'Cooper for Submissions',
    desc: 'See how teams process submissions 12x faster, from intake to bound policy, fully automated.',
    link: 'Learn more',
    image: '/images/persona/persona-retail-1.webp',
  },
}

const customersPanel: NavPanel = {
  cols: [
    {
      label: 'Customer stories',
      items: [
        { title: 'All Stories', desc: 'How insurance teams are using Cooper to work faster.', icon: UsersThree },
        { title: 'Case Studies', desc: 'Detailed results and outcomes from real teams.', icon: ChartBar },
        { title: 'Security & Compliance', desc: 'SOC 2 Type II, HIPAA, audit logs, and more.', icon: ShieldCheck },
      ],
    },
  ],
  featured: {
    badge: 'Case study',
    title: 'Nirvana Insurance',
    desc: '"What took hours now takes seconds." See how Nirvana transformed their submission process.',
    link: 'Read the story',
    image: '/images/persona/persona-retail-2.webp',
  },
}

const aboutPanel: NavPanel = {
  cols: [
    {
      label: 'Company',
      items: [
        { title: 'About Cooper', desc: 'Our mission, team, and why we\'re building for insurance.', icon: Info },
        { title: 'Contact', desc: 'Get in touch with our team.', icon: Envelope },
      ],
    },
    {
      label: 'News & Press',
      items: [
        { title: 'Newsroom', desc: 'Latest announcements, launches, and company updates.', icon: Newspaper },
        { title: 'Press Kit', desc: 'Logos, brand assets, and media resources.', icon: Package },
        { title: 'In the Media', desc: 'Cooper in industry publications and coverage.', icon: Monitor },
      ],
    },
  ],
  featured: {
    badge: 'Announcement',
    title: 'Latest from Cooper',
    desc: 'Placeholder for the latest company announcement, funding round, or product launch.',
    link: 'Read more',
    image: '/images/persona/persona-retail-3.webp',
  },
}

const panels: Record<string, NavPanel> = {
  Product: productPanel,
  /* Customers and About dropdowns hidden for now — registered but not triggered
     (navLinks below don't enable their dropdowns, so these never render) */
  Customers: customersPanel,
  About: aboutPanel,
}

const navLinks = [
  { label: 'Product', hasDropdown: true },
  // { label: 'Customers', hasDropdown: false },
  { label: 'About', hasDropdown: false, href: '/about' },
  /* Blog hidden for now — will be used later */
  // { label: 'Blog', hasDropdown: false },
  { label: 'Careers', hasDropdown: false, href: '/careers', badge: "We're hiring" },
]

export default function Navbar({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light'
  const [scrolled, setScrolled] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open, close it on Escape, and
  // close it if the viewport grows to desktop width.
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [mobileOpen])

  const closeMobile = () => { setMobileOpen(false); setMobileSub(null) }

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
      {mobileOpen ? (
        <div className="absolute inset-0 bg-cream-light" />
      ) : isLight ? (
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
      <div className="relative z-10 max-w-[1440px] mx-auto flex items-center justify-between h-[72px] px-5 md:px-10 lg:px-[62px]">
        <Link to="/" className="no-underline" onClick={closeMobile}>
          <CooperLogo dark={isLight || mobileOpen} className={`origin-left transition-transform duration-300 ${scrolled || isLight || mobileOpen ? 'scale-100' : 'scale-[1.3] sm:scale-[1.5] lg:scale-[1.8]'}`} />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const cls = `group relative flex items-center gap-1.5 px-3 py-1.5 font-sans transition-colors cursor-pointer text-[16px] no-underline ${
              isLight
                ? `text-dark/70 hover:text-dark ${openPanel === link.label ? 'text-dark' : ''}`
                : `text-white/90 hover:text-white ${openPanel === link.label ? 'text-white' : ''}`
            }`
            const content = (
              <>
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 border-b border-dashed ${isLight ? 'border-dark/30' : 'border-white/50'} transition-opacity duration-200 ${
                    openPanel === link.label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
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
              </>
            )
            if ('href' in link && link.href) {
              return (
                <Link key={link.label} to={link.href} className={cls} onMouseEnter={() => setOpenPanel(null)}>
                  {content}
                </Link>
              )
            }
            return (
              <button key={link.label} className={cls} onMouseEnter={() => link.hasDropdown ? handleEnter(link.label) : setOpenPanel(null)}>
                {content}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/demo" className={`hidden sm:inline-flex font-sans text-[16px] rounded-[5px] px-5 py-2.5 transition-colors cursor-pointer no-underline ${isLight ? 'text-cream-light bg-dark hover:bg-dark/90 border border-dark' : 'text-white border border-white/40 bg-white/10 hover:bg-white/20'}`}>
            Request a Demo
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-[6px] transition-colors ${isLight || mobileOpen ? 'text-dark hover:bg-dark/5' : 'text-white hover:bg-white/10'}`}
          >
            {mobileOpen ? <X size={26} weight="light" /> : <List size={26} weight="light" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-cream-light overflow-y-auto animate-fade-in">
          <div className="px-5 py-4 flex flex-col">
            {navLinks.map((link) => {
              const sub = link.hasDropdown ? panels[link.label] : null
              if (sub) {
                const open = mobileSub === link.label
                return (
                  <div key={link.label} className="border-b border-dark/10">
                    <button
                      type="button"
                      onClick={() => setMobileSub(open ? null : link.label)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between py-4 font-sans text-[22px] text-dark"
                    >
                      {link.label}
                      <CaretDown size={20} weight="light" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col pb-3">
                          {sub.cols.flatMap((c) => c.items).map((item) => {
                            const Icon = item.icon
                            const row = (
                              <div className="flex items-start gap-3 py-2.5">
                                {Icon && <span className="mt-[2px] shrink-0 text-dark/40"><Icon size={20} weight="thin" /></span>}
                                <span>
                                  <span className="block font-sans text-[16px] font-semibold text-dark">{item.title}</span>
                                  <span className="block font-sans text-[13px] leading-snug text-dark/45">{item.desc}</span>
                                </span>
                              </div>
                            )
                            return 'href' in item && item.href ? (
                              <Link key={item.title} to={item.href} className="no-underline pl-1" onClick={closeMobile}>{row}</Link>
                            ) : (
                              <a key={item.title} href="#" className="no-underline pl-1" onClick={closeMobile}>{row}</a>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={link.label}
                  to={'href' in link && link.href ? link.href : '#'}
                  onClick={closeMobile}
                  className="flex items-center gap-2 py-4 border-b border-dark/10 font-sans text-[22px] text-dark no-underline"
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[11px] font-semibold tracking-[0.36px] rounded-full px-2 py-0.5 uppercase border border-dark/20 bg-dark/5 text-dark/70">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            <Link
              to="/demo"
              onClick={closeMobile}
              className="mt-6 inline-flex items-center justify-center font-sans text-[16px] rounded-[6px] px-5 py-3.5 bg-dark text-cream-light no-underline"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      )}

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
                gridTemplateColumns: panel.cols.length === 1 ? '1fr' : `repeat(${panel.cols.length}, 1fr)`,
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
                  <div className={`${panel.cols.length === 1 ? 'grid grid-cols-3 gap-x-[16px] gap-y-[2px]' : 'flex flex-col gap-[2px]'}`}>
                    {col.items.map((item) => {
                      const Icon = item.icon
                      const inner = (
                        <div className="flex items-start gap-[12px]">
                          {Icon && (
                            <div className={`mt-[2px] shrink-0 ${isLight ? 'text-dark/40' : 'text-white/40'}`}>
                              <Icon size={20} weight="thin" />
                            </div>
                          )}
                          <div>
                            <div className={`relative font-sans text-[14px] font-semibold mb-[2px] w-fit ${isLight ? 'text-dark' : 'text-white/90'}`}>
                              {item.title}
                              <span className={`absolute bottom-[-2px] left-0 right-0 border-b border-dashed ${isLight ? 'border-dark/30' : 'border-white/50'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                            </div>
                            <div className={`font-sans text-[12px] leading-[1.45] ${isLight ? 'text-dark/40' : 'text-white/35'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
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
            </div>
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}
