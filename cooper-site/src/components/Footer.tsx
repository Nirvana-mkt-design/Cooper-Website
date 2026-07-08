import { Link } from 'react-router-dom'

const useCasesCol1 = [
  { label: 'Retail Agencies', to: '/personas/retail-agencies' },
  { label: 'Wholesale Brokers', to: '/personas/wholesale-brokers' },
  { label: 'MGAs & Insurers', to: '/personas/mgas-insurers' },
]

const useCasesCol2 = [
  { label: 'Claims TPAs', to: '/personas/claims-tpas' },
  { label: 'Reinsurers', to: '/personas/reinsurers' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Request a Demo', to: '/demo' },
]

export default function Footer() {
  return (
    <footer className="bg-cream-light py-[64px] px-5 md:px-10 lg:px-[62px] border-t border-dark/[0.06]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.4fr_1fr] gap-10 lg:gap-[40px] mb-[48px] pb-[48px] border-b border-dark/[0.06]">
          {/* Brand column */}
          <div>
            {/* Logo — full Cooper logo, large */}
            <div className="mb-[28px]">
              <img src="/images/cooper-logo-full.svg" alt="Cooper" className="h-[44px] lg:h-[56px] w-auto" />
            </div>
            <p className="font-sans text-[15px] leading-[1.6] text-dark/50 max-w-[280px]">
              Your AI coworker for insurance, from intake to renewal.
            </p>
          </div>

          {/* Use Cases — two sub-columns */}
          <div>
            <h5 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Use Cases
            </h5>
            <div className="flex flex-col gap-[14px] lg:flex-row lg:gap-[24px]">
              <div className="flex flex-col gap-[14px]">
                {useCasesCol1.map((link) => (
                  <Link key={link.to} to={link.to} className="font-sans text-[15px] text-dark/50 hover:text-dark transition-colors no-underline">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-[14px]">
                {useCasesCol2.map((link) => (
                  <Link key={link.to} to={link.to} className="font-sans text-[15px] text-dark/50 hover:text-dark transition-colors no-underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
              Company
            </h5>
            <div className="flex flex-col gap-[14px]">
              {companyLinks.map((link) => (
                <Link key={link.to} to={link.to} className="font-sans text-[15px] text-dark/50 hover:text-dark transition-colors no-underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0 sm:justify-between items-center">
          <span className="font-sans text-[13px] text-dark/30">© 2026 Cooper. All rights reserved.</span>
          <div className="flex gap-[20px] items-center">
            <button
              onClick={() => window.Cookiebot?.renew()}
              className="font-sans text-[13px] text-dark/30 hover:text-dark/50 transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Manage Cookies
            </button>
            <Link to="/privacy" className="font-sans text-[13px] text-dark/30 hover:text-dark/50 transition-colors no-underline">Privacy</Link>
            <Link to="/terms" className="font-sans text-[13px] text-dark/30 hover:text-dark/50 transition-colors no-underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
