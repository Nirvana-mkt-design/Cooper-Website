import Navbar from './Navbar'
import Footer from './Footer'

const sections = [
  { id: 'commitment', label: 'Our Security Commitment' },
  { id: 'compliance', label: 'Compliance and Audits' },
  { id: 'data-protection', label: 'Data Protection' },
  { id: 'app-security', label: 'Application Security' },
  { id: 'infra-security', label: 'Infrastructure Security' },
  { id: 'ops-security', label: 'Operational Security' },
  { id: 'people', label: 'People' },
  { id: 'reporting', label: 'Reporting a Vulnerability' },
  { id: 'contact', label: 'Contact' },
]

const linkCls = 'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'
const sectionCls = 'scroll-mt-[100px] mt-[48px] pt-[20px] border-t border-dark/[0.08]'
const h2Cls = 'font-serif text-[22px] md:text-[26px] text-dark mb-[20px]'
const h3Cls = 'font-sans font-semibold text-[16px] text-dark mb-[12px] mt-[28px]'
const ulCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px] pl-[20px] list-disc space-y-[6px]'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="light" />

      {/* Hero */}
      <section className="bg-cream pt-[120px] pb-[64px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px]">
          <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-accent-orange mb-[12px] block animate-fade-blur-in">
            Legal
          </span>
          <h1
            className="font-serif text-[40px] md:text-[52px] leading-[1.1] tracking-[-1px] text-dark mb-[20px] animate-fade-blur-in"
            style={{ animationDelay: '0.05s' }}
          >
            Security
          </h1>
          <div
            className="flex flex-wrap gap-x-[24px] gap-y-[6px] font-sans text-[14px] text-dark/40 animate-fade-blur-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span>Effective: January 8, 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[64px] lg:py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-[48px] lg:gap-[80px] items-start">

          {/* Sidebar TOC */}
          <nav className="hidden lg:block sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="font-grotesk font-medium text-[10px] tracking-[1.4px] uppercase text-dark/30 mb-[10px] px-[12px]">
              Contents
            </p>
            <ul className="flex flex-col">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-[7px] pl-[12px] font-sans text-[13px] text-dark/45 hover:text-dark/75 border-l-2 border-transparent hover:border-accent-orange/40 transition-all no-underline leading-[1.4]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Article */}
          <article>
            {/* Commitment */}
            <section id="commitment" className="scroll-mt-[100px]">
              <h2 className={h2Cls}>Our Security Commitment</h2>
              <p className={pCls}>
                Cooper AI Tech, Inc. ("Cooper") provides software that handles sensitive insurance workflow data on
                behalf of brokers, carriers, and their customers. We treat the security of that data as a
                foundational requirement of our service. This page summarizes the controls we operate, the
                certifications we are pursuing, and how to reach our security team.
              </p>
            </section>

            {/* Compliance */}
            <section id="compliance" className={sectionCls}>
              <h2 className={h2Cls}>Compliance and Audits</h2>
              <p className={pCls}>
                Cooper is in the process of completing a SOC 2 Type 1 attestation. Our compliance program is run on
                Vanta and continuously monitors our environment against the AICPA Trust Services Criteria.
              </p>
              <p className={pCls}>
                For the latest status of our compliance program, including a copy of our most recent report once
                available, please contact{' '}
                <a href="mailto:security@askcooper.ai" className={linkCls}>security@askcooper.ai</a>.
              </p>
            </section>

            {/* Data Protection */}
            <section id="data-protection" className={sectionCls}>
              <h2 className={h2Cls}>Data Protection</h2>

              <h3 className={h3Cls}>Encryption</h3>
              <ul className={ulCls}>
                <li>All data sent to Cooper is encrypted in transit using TLS 1.2 or higher.</li>
                <li>Customer data and document attachments are encrypted at rest with AES-256.</li>
                <li>Database backups, application logs, and secrets are encrypted with KMS-managed keys.</li>
              </ul>

              <h3 className={h3Cls}>Hosting and Data Residency</h3>
              <ul className={ulCls}>
                <li>Cooper's production environment runs on Amazon Web Services in the United States (us-east-2).</li>
                <li>Document attachments are stored in encrypted Amazon S3 buckets with public access blocked.</li>
                <li>We do not replicate customer data outside the United States.</li>
              </ul>

              <h3 className={h3Cls}>Access Controls</h3>
              <ul className={ulCls}>
                <li>Access to production systems is granted on a least-privilege basis and is tied to named individuals.</li>
                <li>All access changes are logged and reviewed quarterly by the VP of Engineering &amp; Product.</li>
                <li>Multi-factor authentication is required for every administrative account.</li>
                <li>Production secrets are stored in AWS Secrets Manager and never committed to source code.</li>
              </ul>

              <h3 className={h3Cls}>Subprocessors</h3>
              <p className={pCls}>
                We rely on a limited set of vendors to deliver the Service. The current list, including each
                subprocessor's role and location, is published at{' '}
                <a href="/subprocessors" className={linkCls}>/subprocessors</a>.
              </p>
            </section>

            {/* Application Security */}
            <section id="app-security" className={sectionCls}>
              <h2 className={h2Cls}>Application Security</h2>
              <ul className={ulCls}>
                <li>Code is reviewed by at least one engineer before it can be merged.</li>
                <li>Continuous integration runs linting, type checking, and an automated test suite on every change.</li>
                <li>Dependencies are continuously monitored for known vulnerabilities.</li>
                <li>Production deploys are gated through a hardened pipeline that requires explicit confirmation before reaching production.</li>
                <li>Pre-commit hooks scan for secrets and credentials.</li>
              </ul>
            </section>

            {/* Infrastructure Security */}
            <section id="infra-security" className={sectionCls}>
              <h2 className={h2Cls}>Infrastructure Security</h2>
              <ul className={ulCls}>
                <li>Production resources run inside private VPCs with no public ingress except through our load balancer and CDN.</li>
                <li>Network traffic between services is isolated by per-service security groups.</li>
                <li>Threat detection runs continuously through AWS GuardDuty, with findings routed to engineering on-call within 15 minutes.</li>
                <li>All AWS API activity is recorded in AWS CloudTrail with log file validation and stored in an encrypted, versioned audit bucket.</li>
                <li>VPC Flow Logs are retained for 365 days for forensic analysis.</li>
                <li>Administrative access uses AWS IAM-authenticated ECS Exec. Cooper does not operate SSH-able bastions in production.</li>
              </ul>
            </section>

            {/* Operational Security */}
            <section id="ops-security" className={sectionCls}>
              <h2 className={h2Cls}>Operational Security</h2>
              <ul className={ulCls}>
                <li>Engineering on-call monitors production health 24/7.</li>
                <li>Customer-impacting incidents are tracked in a written incident channel and post-mortemed within five business days.</li>
                <li>Backups are taken automatically by Amazon RDS and tested as part of disaster recovery exercises.</li>
              </ul>
            </section>

            {/* People */}
            <section id="people" className={sectionCls}>
              <h2 className={h2Cls}>People</h2>
              <ul className={ulCls}>
                <li>All employees and contractors sign confidentiality agreements at hire.</li>
                <li>Background checks are completed prior to start.</li>
                <li>Security awareness training is required at onboarding and annually thereafter.</li>
                <li>Access is fully revoked within 24 hours of separation per our Employee Termination Security Policy.</li>
              </ul>
            </section>

            {/* Reporting */}
            <section id="reporting" className={sectionCls}>
              <h2 className={h2Cls}>Reporting a Vulnerability</h2>
              <p className={pCls}>
                If you believe you have found a security vulnerability in Cooper, please email{' '}
                <a href="mailto:security@askcooper.ai" className={linkCls}>security@askcooper.ai</a>. We will
                acknowledge receipt within two business days and work with you on a remediation timeline. We ask
                that you allow us a reasonable period to address the issue before public disclosure.
              </p>
              <p className={pCls}>
                We do not currently operate a paid bug bounty program, but we recognize and credit researchers who
                report responsibly.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className={sectionCls}>
              <h2 className={h2Cls}>Contact</h2>
              <ul className="font-sans text-[15px] leading-[1.75] text-dark/60 space-y-[10px]">
                <li>
                  <strong className="font-medium text-dark/80">General security inquiries:</strong>{' '}
                  <a href="mailto:security@askcooper.ai" className={linkCls}>security@askcooper.ai</a>
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Privacy inquiries:</strong>{' '}
                  <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a>
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Customer support:</strong>{' '}
                  <a href="mailto:support@askcooper.ai" className={linkCls}>support@askcooper.ai</a>
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  )
}
