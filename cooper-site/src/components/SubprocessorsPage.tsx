import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'

const linkCls = 'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'

const subprocessors = [
  {
    name: 'Amazon Web Services (AWS)',
    location: 'United States',
    activities: 'Cloud infrastructure, hosting, database services (RDS), container orchestration (ECS), object storage (S3), content delivery (CloudFront), and secrets management',
  },
  {
    name: 'Google Cloud Platform',
    location: 'United States',
    activities: 'AI and language model services (Gemini), Google OAuth sign-in, and Gmail API for inbound email',
  },
  {
    name: 'Microsoft',
    location: 'United States',
    activities: 'Microsoft OAuth sign-in and Microsoft Graph API for Outlook email',
  },
  {
    name: 'Anthropic',
    location: 'United States',
    activities: 'AI and language model services (Claude)',
  },
  {
    name: 'E2B',
    location: 'United States',
    activities: 'Cloud sandbox environments for agent code execution',
  },
  {
    name: 'Kernel',
    location: 'United States',
    activities: 'Cloud browser automation for agent features',
  },
  {
    name: 'Mem0',
    location: 'United States',
    activities: 'Long-term memory storage for agent features',
  },
  {
    name: 'Resend',
    location: 'United States',
    activities: 'Transactional email delivery',
  },
  {
    name: 'PostHog',
    location: 'United States',
    activities: 'Product analytics and feature flags',
  },
]

export default function SubprocessorsPage() {
  useSeo({
    title: 'Subprocessors — Cooper',
    description: 'The third-party subprocessors Cooper uses to deliver its services.',
    canonicalPath: '/subprocessors',
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* Hero */}
      <section className="bg-cream pt-[120px] pb-[64px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px]">
          {/* Breadcrumb back to Security */}
          <nav className="flex items-center gap-[8px] mb-[28px] animate-fade-blur-in">
            <Link
              to="/security"
              className="font-sans text-[13px] text-dark/40 hover:text-dark/70 no-underline transition-colors"
            >
              Security
            </Link>
            <span className="font-sans text-[13px] text-dark/20">/</span>
            <span className="font-sans text-[13px] text-dark/70">Subprocessors</span>
          </nav>

          <h1
            className="font-serif text-[40px] md:text-[52px] leading-[1.1] tracking-[-1px] text-dark mb-[20px] animate-fade-blur-in"
            style={{ animationDelay: '0.05s' }}
          >
            Subprocessors
          </h1>
          <div
            className="flex flex-wrap gap-x-[24px] gap-y-[6px] font-sans text-[14px] text-dark/40 animate-fade-blur-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span>Effective: December 2025</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[64px] lg:py-[80px]">
        <div className="max-w-[900px]">
          <p className={pCls}>
            Cooper AI Tech, Inc. ("<strong className="font-medium text-dark/80">Cooper AI</strong>") uses the
            following subprocessors to process Customer Personal Data in connection with the Services. This list is
            maintained pursuant to the{' '}
            <a href="mailto:support@askcooper.ai" className={linkCls}>
              Data Processing Addendum
            </a>
            .
          </p>
          <p className={pCls}>
            To be notified about changes to this list, please email{' '}
            <a href="mailto:support@askcooper.ai" className={linkCls}>
              support@askcooper.ai
            </a>
            .
          </p>

          <h2 className="font-serif text-[22px] md:text-[26px] text-dark mt-[40px] mb-[28px]">
            Current Subprocessors
          </h2>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr className="border-b border-dark/[0.10]">
                  <th className="font-grotesk font-medium text-[11px] tracking-[1.2px] uppercase text-dark/40 text-left pb-[12px] pr-[24px] w-[200px]">
                    Subprocessor
                  </th>
                  <th className="font-grotesk font-medium text-[11px] tracking-[1.2px] uppercase text-dark/40 text-left pb-[12px] pr-[24px] w-[140px]">
                    Location
                  </th>
                  <th className="font-grotesk font-medium text-[11px] tracking-[1.2px] uppercase text-dark/40 text-left pb-[12px]">
                    Processing Activities
                  </th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((sp, i) => (
                  <tr
                    key={sp.name}
                    className={`border-b border-dark/[0.06] ${i % 2 === 0 ? 'bg-dark/[0.02]' : ''}`}
                  >
                    <td className="font-sans text-[14px] text-dark/75 py-[16px] pr-[24px] align-top leading-[1.5]">
                      {sp.name}
                    </td>
                    <td className="font-sans text-[14px] text-dark/55 py-[16px] pr-[24px] align-top leading-[1.5]">
                      {sp.location}
                    </td>
                    <td className="font-sans text-[14px] text-dark/55 py-[16px] align-top leading-[1.6]">
                      {sp.activities}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[13px] text-dark/35 mt-[32px]">
            This list is updated periodically. Last revised: December 2025.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
