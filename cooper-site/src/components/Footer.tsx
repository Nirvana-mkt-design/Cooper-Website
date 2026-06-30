import { Link } from 'react-router-dom'

const personaSlugs: Record<string, string> = {
  'Retail Agencies': '/personas/retail-agencies',
  'Wholesale Brokers': '/personas/wholesale-brokers',
  'MGAs & Insurers': '/personas/mgas-insurers',
  'Claims TPAs': '/personas/claims-tpas',
  'Reinsurers': '/personas/reinsurers',
}

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Security'],
  },
  {
    title: 'Use Cases',
    links: ['Retail Agencies', 'Wholesale Brokers', 'MGAs & Insurers', 'Claims TPAs', 'Reinsurers'],
  },
  {
    title: 'Resource',
    links: ['Blog', 'Customer Stories'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Newsroom', 'Press Kit'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-cream-light py-[64px] px-5 md:px-10 lg:px-[62px] border-t border-dark/[0.06]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-[40px] mb-[48px] pb-[48px] border-b border-dark/[0.06]">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            {/* Logo — full Cooper logo, large */}
            <div className="mb-[28px]">
              <img src="/images/cooper-logo-full.svg" alt="Cooper" className="h-[44px] lg:h-[56px] w-auto" />
            </div>
            <p className="font-sans text-[15px] leading-[1.6] text-dark/50 max-w-[280px]">
              AI agent for insurance professionals.
              <br />
              Your workflows, automated.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h5 className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark mb-[20px]">
                {col.title}
              </h5>
              <div className="flex flex-col gap-[14px]">
                {col.links.map((link) => {
                  const personaPath = personaSlugs[link]
                  if (personaPath) {
                    return (
                      <Link key={link} to={personaPath} className="font-sans text-[15px] text-dark/50 hover:text-dark transition-colors no-underline">
                        {link}
                      </Link>
                    )
                  }
                  return (
                    <a key={link} href="#" className="font-sans text-[15px] text-dark/50 hover:text-dark transition-colors no-underline">
                      {link}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-0 sm:justify-between items-center">
          <span className="font-sans text-[13px] text-dark/30">© 2026 Cooper. All rights reserved.</span>
          <div className="flex gap-[20px]">
            <a href="#" className="font-sans text-[13px] text-dark/30 hover:text-dark/50 transition-colors no-underline">Privacy</a>
            <a href="#" className="font-sans text-[13px] text-dark/30 hover:text-dark/50 transition-colors no-underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
