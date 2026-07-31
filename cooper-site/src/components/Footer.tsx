import { Link } from 'react-router-dom'
import { RESOURCES } from '../data/resources'

const resourceLinks = RESOURCES.map((r) => ({ label: r.title, to: r.to }))

const useCases = [
  { label: 'Retail Agencies', to: '/product/retail-agencies' },
  { label: 'Wholesale Brokers', to: '/product/wholesale-brokers' },
  { label: 'MGA & Insurers', to: '/product/mgas-insurers' },
  { label: 'Claims TPA', to: '/product/claims-tpas' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Request a Demo', to: '/demo' },
]

/* Inline single-path brand marks (currentColor) — keeps the site-wide footer
   free of an icon-library import and lets the logos inherit the link colour. */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ask-cooper/', Icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/ask.cooper/', Icon: InstagramIcon },
]

export default function Footer() {
  return (
    <footer className="bg-cream-light py-[64px] px-5 md:px-10 lg:px-[62px] border-t border-dark/[0.06]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-[40px] mb-[48px] pb-[48px] border-b border-dark/[0.06]">
          {/* Brand column */}
          <div>
            {/* Logo — full Cooper logo, large */}
            <div className="mb-[28px]">
              <img src="/images/cooper-logo-full.svg" alt="Cooper" width={154} height={36} className="h-[44px] lg:h-[56px] w-auto" />
            </div>
            <p className="font-sans text-[15px] leading-[1.6] text-dark/60 max-w-[280px]">
              Your AI coworker for insurance, from intake to renewal.
            </p>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Use Cases
            </h3>
            <div className="flex flex-col gap-[14px]">
              {useCases.map((link) => (
                <Link key={link.to} to={link.to} className="inline-flex items-center min-h-[40px] font-sans text-[15px] text-dark/60 hover:text-dark transition-colors no-underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Resources
            </h3>
            <div className="flex flex-col gap-[14px]">
              {resourceLinks.map((link) => (
                <Link key={link.to} to={link.to} className="inline-flex items-center min-h-[40px] font-sans text-[15px] text-dark/60 hover:text-dark transition-colors no-underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Company
            </h3>
            <div className="flex flex-col gap-[14px]">
              {companyLinks.map((link) => (
                <Link key={link.to} to={link.to} className="inline-flex items-center min-h-[40px] font-sans text-[15px] text-dark/60 hover:text-dark transition-colors no-underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h3 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Follow
            </h3>
            <div className="flex flex-col gap-[14px]">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[10px] min-h-[40px] font-sans text-[15px] text-dark/60 hover:text-dark transition-colors no-underline"
                >
                  <Icon />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0 sm:justify-between items-center">
          <span className="font-sans text-[13px] text-dark/60">© 2026 Cooper. All rights reserved.</span>
          <div className="flex gap-[12px] items-center -mr-[8px]">
            <button
              onClick={() => window.Cookiebot?.renew()}
              className="inline-flex items-center justify-center min-h-[40px] px-[8px] font-sans text-[13px] text-dark/60 hover:text-dark transition-colors cursor-pointer bg-transparent border-none py-0"
            >
              Manage Cookies
            </button>
            <Link to="/privacy" className="inline-flex items-center justify-center min-h-[40px] px-[8px] font-sans text-[13px] text-dark/60 hover:text-dark transition-colors no-underline">Privacy</Link>
            <Link to="/terms" className="inline-flex items-center justify-center min-h-[40px] px-[8px] font-sans text-[13px] text-dark/60 hover:text-dark transition-colors no-underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
