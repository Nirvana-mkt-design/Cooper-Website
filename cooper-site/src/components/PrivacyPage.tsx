import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'

const sections = [
  { id: 'scope', label: 'Scope and Roles' },
  { id: 's01', label: '01. Personal Information We Collect' },
  { id: 's02', label: '02. How We Use Personal Information' },
  { id: 's03', label: '03. How We Share Personal Information' },
  { id: 's04', label: '04. How Long We Keep Your Information' },
  { id: 's05', label: '05. Your Privacy Rights' },
  { id: 's06', label: '06. Other Important Information' },
  { id: 's07', label: '07. California Privacy Notice' },
  { id: 's08', label: '08. Other State Privacy Rights' },
  { id: 's09', label: '09. Google API Services User Data' },
  { id: 's10', label: '10. Contact Us' },
]

const linkCls = 'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'
const sectionCls = 'scroll-mt-[100px] mt-[48px] pt-[20px] border-t border-dark/[0.08]'
const h2Cls = 'font-serif text-[22px] md:text-[26px] text-dark mb-[20px]'
const h3Cls = 'font-sans font-semibold text-[16px] text-dark mb-[12px] mt-[28px]'
const ulCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px] pl-[20px] list-disc space-y-[6px]'
const numLabelCls = 'font-grotesk text-[11px] font-medium tracking-[1.2px] uppercase text-accent-orange block mb-[6px]'

export default function PrivacyPage() {
  useSeo({
    title: 'Privacy Policy — Cooper',
    description: 'How Cooper collects, uses, shares, and protects your personal information.',
    canonicalPath: '/privacy',
  })

  return (
    <div className="min-h-screen bg-cream-light">
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
            Privacy Policy
          </h1>
          <div
            className="flex flex-wrap gap-x-[24px] gap-y-[6px] font-sans text-[14px] text-dark/40 animate-fade-blur-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span>Last Updated: July 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[64px] lg:py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-[48px] lg:gap-[80px] items-start">

          {/* Sidebar TOC */}
          <nav className="hidden lg:block sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="font-grotesk font-medium text-[10px] tracking-[1.4px] uppercase text-dark/60 mb-[10px] px-[12px]">
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
          <article className="max-w-[720px]">
            <p className={pCls}>
              Cooper AI Tech, Inc., and/or its affiliates and subsidiaries ("we," "our," or "us") provide a software
              platform, including our AI copilot that automates manual processes for insurance brokers and companies
              (the "Services"). This Privacy Policy describes how we collect, use, disclose and protect personal
              information of individuals who use the Services as or on behalf of insurance brokers, insurance
              companies, or other businesses ("User" or "you(r)"). It also explains our handling of data related to
              any persons whose information might be processed as part of our Services, including protected health
              information ("PHI") where the Health Insurance Portability and Accountability Act of 1996 and its
              implementing regulations ("HIPAA") apply.
            </p>

            {/* Scope */}
            <section id="scope" className={sectionCls}>
              <h2 className={h2Cls}>Scope and Roles</h2>
              <p className={pCls}>
                Our Services are intended for insurance brokers and insurance companies to automate and streamline
                their internal operations, analytics and reporting with respect to handling insurance policy quotes,
                applications, claims management, and others.
              </p>
              <p className={pCls}>This Privacy Policy applies to:</p>
              <ul className={ulCls}>
                <li>
                  Personal information we collect and use as a "business" or "controller," for example about website
                  visitors and business contacts.
                </li>
                <li>
                  Personal information we process as a "service provider", "processor", "business associate", or
                  "subcontractor business associate" to our customers, for example information contained in requests
                  for quotes, insurance policies, claims, eligibility files, underwriting materials, or other
                  customer-provided records. In those cases, our customers' privacy policies and notices govern, and we
                  process information according to our contracts, any applicable business associate agreement, and
                  customers' instructions.
                </li>
              </ul>
              <p className={pCls}>
                If we are acting as a service provider/processor or business associate/subcontractor business
                associate, we will process such information pursuant to a data processing addendum, business associate
                agreement, or other applicable agreement that we enter into with our customer. We will not sell or
                share that personal information or PHI, use it for targeted advertising, or use it for purposes
                unrelated to the contracted services, except as permitted by law, HIPAA where applicable, our
                agreements, and our customer instructions.
              </p>
              <p className={pCls}>
                Where customer data includes PHI, we use and disclose PHI only as permitted by HIPAA, the applicable
                business associate agreement, our services agreement, and the customer's documented instructions,
                including to provide, secure, support, and maintain the Services; comply with law; and engage approved
                subcontractors.
              </p>
              <p className={pCls}>
                Customers are responsible for determining whether information submitted to the Services is PHI and for
                providing any required notices, consents, authorizations, and instructions before submitting PHI or
                directing us to process PHI.
              </p>
              <p className={pCls}>
                To the extent this Privacy Policy conflicts with an applicable business associate agreement regarding
                PHI, the business associate agreement controls.
              </p>
            </section>

            {/* 01 */}
            <section id="s01" className={sectionCls}>
              <span className={numLabelCls}>01.</span>
              <h2 className={h2Cls}>Personal Information We Collect</h2>
              <p className={pCls}>
                The categories of personal information we collect as business/controller may include the following:
              </p>

              <h3 className={h3Cls}>1.1. Information You Provide Directly</h3>
              <ul className={ulCls}>
                <li>
                  <strong className="font-medium text-dark/80">Identifiers and contact information:</strong> Name,
                  business email address, business phone number, employer, job title, and business mailing address.
                  We collect this directly from you, your employer or colleagues, from our service providers, from
                  publicly available sources, and from our website or event interactions. We use it to provide and
                  support the Services; manage customer and vendor relationships; respond to inquiries; send service
                  communications; authenticate users; and comply with legal obligations. Retention generally aligns to
                  the duration of your business relationship with us plus a reasonable period to comply with legal,
                  tax, and audit requirements.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Commercial and transactional information:</strong>{' '}
                  Account history, configuration choices, and records of interactions with us. We use it to operate,
                  maintain, secure, and improve the Services; provide support; and for billing, audit, and compliance.
                  Retention corresponds to contractual and legal requirements.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Payment information:</strong> Information necessary to
                  complete billing transactions, including your full name, credit card information, and a billing
                  address, which may be your personal address or the address of the company you are associated with. We
                  use third parties to process our payments and to collect payment data. We use it to operate,
                  maintain, secure, and improve the Services; provide support; and for billing, audit, and compliance.
                  Retention corresponds to contractual and legal requirements.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Professional or employment-related information:</strong>{' '}
                  Work address, employer information, role, and business contact details. We use this for recruiting,
                  hiring, HR administration, compliance, and workforce safety. Retention follows applicable employment
                  and recordkeeping laws.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Audio, electronic or similar information:</strong>{' '}
                  Recordings or transcriptions of calls placed or received by our Services when enabled by a customer
                  and permitted by law. We use this to enable automated scheduling, quality assurance, and support. We
                  provide required recording notices and obtain or rely on customer consents as applicable. Retention
                  is limited to the purpose and duration necessary for operations, quality, dispute resolution, or
                  compliance.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Sensitive Information:</strong> Geolocation data,
                  driver's license numbers or other identifying documents provided for insurance information, which may
                  include residential address, age, date of birth, and gender. We do not intend to collect sensitive
                  personal information except where necessary for lawful and disclosed purposes (for example, HR
                  compliance). We will not use sensitive personal information for additional purposes without notice
                  and, where required, consent. We will offer the ability to limit certain uses as required by law.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Feedback or Support Information:</strong> Personal
                  information included in your communications with us, such as surveys, customer support
                  communications, or inquiries. This may include your name, contact information, voice recording, and
                  any other content or communication that you send to or share with us. We use this to provide you with
                  customer support, and to solicit feedback to improve our products and services. Retention is limited
                  to the purpose and duration necessary for operations, quality, dispute resolution, or compliance.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">User-Generated Content:</strong> The Services may
                  allow you to submit free-form content (either manually or automatically through integrations),
                  including emails, and all information in that free-form content will be processed by the Services. We
                  use the information to provide you with the Services you request. If you enable this feature, you
                  should ensure that any User Generated Content you submit is authorized for submission to the Services
                  and does not include sensitive personal information, PHI, or other personal information unless your
                  organization has directed or authorized that submission under its agreement with us, and, where
                  applicable, a business associate agreement. We do not pre-screen User-Generated Content before it is
                  input into the Services.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Inferences:</strong> We may derive personal
                  information about you in the form of inferences, which are derivations of information, data,
                  assumptions, or conclusions from facts, evidence or other sources of information or data about you. We
                  use this to improve and provide the Services to you. Retention is limited to the purpose and duration
                  necessary for operations, quality, dispute resolution, or compliance.
                </li>
              </ul>
              <p className={pCls}>
                By voluntarily providing us with personal information, you represent that the personal information you
                provide is true, accurate, current, and complete, and that you are authorized to provide it to us.
              </p>

              <h3 className={h3Cls}>1.2. Information We Collect Automatically</h3>
              <p className={pCls}>
                When you use our Services, some information is collected automatically and is not provided directly by
                you:
              </p>
              <ul className={ulCls}>
                <li>
                  <strong className="font-medium text-dark/80">Internet or Other Network Activity:</strong> IP
                  addresses, device information, browser type, operating system, website usage patterns, and
                  interaction data, including the content, features, and activities that you access, and the time,
                  frequency, and duration of those activities, collected through cookies and similar technologies when
                  you use our platform. We use it for security, to analyze performance, to improve the Services, to
                  remember preferences, and for fraud prevention. Retention varies by signal type and is typically
                  short for security logs unless needed to investigate or comply with law.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Third-Party Product Integrations:</strong> At your
                  direction or your instruction, our Services may be integrated with third-party products and services.
                  The Services may collect information about you through these integrations, including usage data,
                  account settings and preferences, data that you've submitted to those third-party products and
                  services for processing, and other associated information. This information may be combined with
                  other information that we have on you to create more accurate data so that we can improve the quality
                  and performance of our Services to you. Where an integration transmits PHI, we process it only to
                  provide the requested functionality and as permitted by the applicable business associate agreement
                  and customer instructions.
                </li>
              </ul>

              <h3 className={h3Cls}>1.3. Information You Send to Us About Others</h3>
              <p className={pCls}>
                Through your use of the Services, you may provide us with data, including personal information, and,
                where applicable, PHI, you collect from your customers, prospects, drivers, members, patients, or
                other individuals who interact directly or indirectly with our Services. You are responsible for
                collecting any and all notices, consents, authorizations and instructions required by applicable law,
                including HIPAA where applicable, before you share such end-user's personal information or PHI with us
                through the Services.
              </p>

              <h3 className={h3Cls}>1.4. Cookies and Other Technologies</h3>
              <p className={pCls}>
                We use cookies and similar technologies for functionality and security purposes, such as remembering
                your preferences, analytics, and where applicable, targeted advertising. You can manage or disable
                cookies directly through your browser settings, which may allow you to block or delete cookies. Please
                note, however, that if you disable cookies, certain features of the Services may not function properly.
                Please be aware that third parties, such as companies displaying advertisements on the Service or
                providers of third-party websites and services that may be accessible from links on our Services, may
                also set cookies or use other tracking technologies to collect information about your use of their
                services, websites, or content. Except as otherwise described in this Privacy Policy, we do not control
                or have access to these third-party cookies or tracking technologies.
              </p>
              <p className={pCls}>
                For more information about our use of cookies and similar technologies, please refer to our{' '}
                <a href="/cookie-policy" className={linkCls}>Cookie Policy</a>.
              </p>
              <p className={pCls}>
                We do not knowingly use cookies, pixels, SDKs, or similar technologies to collect PHI, and we do not
                use PHI collected through or associated with the Services for targeted advertising or cross-context
                behavioral advertising.
              </p>
            </section>

            {/* 02 */}
            <section id="s02" className={sectionCls}>
              <span className={numLabelCls}>02.</span>
              <h2 className={h2Cls}>How We Use Personal Information</h2>
              <p className={pCls}>We use personal information for the following business purposes:</p>
              <ul className={ulCls}>
                <li><strong className="font-medium text-dark/80">Providing Services:</strong> To deliver, improve, and support our Services, and for billing, audit and compliance.</li>
                <li><strong className="font-medium text-dark/80">Account Management:</strong> To create and manage user accounts, process transactions, and provide customer support.</li>
                <li><strong className="font-medium text-dark/80">Communication:</strong> To communicate with you about your account, services, updates, and respond to inquiries, or to solicit feedback.</li>
                <li><strong className="font-medium text-dark/80">Compliance with Legal Obligations:</strong> To comply with applicable state and federal laws, including insurance regulations, safety requirements, and financial services compliance, or to respond to legal, government, or regulatory requests.</li>
                <li><strong className="font-medium text-dark/80">Analytics and Improvement:</strong> To analyze usage patterns, improve our Services, develop new features, and enhance user experiences, excluding PHI except as permitted by HIPAA, an applicable business associate agreement, and our customers' instructions.</li>
                <li><strong className="font-medium text-dark/80">Security and Fraud Prevention:</strong> To protect our Services, detect and prevent fraud, and maintain the security of our systems and data.</li>
                <li><strong className="font-medium text-dark/80">Marketing:</strong> To provide information about our Services to business prospects and existing customers, including industry insights and product updates, and to display personalized or targeted content, including to display targeted advertising on third-party websites where permitted by law. We do not use PHI or customer data processed as a service provider/processor for marketing or targeted advertising.</li>
                <li><strong className="font-medium text-dark/80">Machine Learning:</strong> To develop, train, and improve AI and machine learning models for service enhancements. We do not use customer data or PHI for AI training purposes. We may use aggregated, anonymized, or de-identified data that cannot reasonably be re-identified or attributed to a customer or individual. If the source data includes PHI, we will use only information de-identified in accordance with HIPAA.</li>
                <li><strong className="font-medium text-dark/80">Research and Development:</strong> For internal product development purposes to conduct testing and research, to develop new products and services, and to improve existing ones.</li>
                <li><strong className="font-medium text-dark/80">Analytics:</strong> To conduct analytics, including to better understand you and our other users, user needs, and usage trends, including to generate industry benchmarks, safety reports, and predictive models. We do not include PHI in analytics, benchmarking, or predictive models except to provide, secure, support, maintain, or troubleshoot the Services for the applicable customer as permitted by HIPAA, an applicable business associate agreement, and customer instructions; we use de-identified information where feasible.</li>
                <li><strong className="font-medium text-dark/80">Exercise Our Rights:</strong> To prevent or take action against activities that are, or may be, in violation of our Terms, MSA, or applicable law, or to investigate disputes and claims related to our Services.</li>
              </ul>
              <p className={pCls}>
                When you communicate with us using one of the methods described in this Privacy Policy, we may also
                keep a record of the time and date of any correspondence and organize this correspondence in one or
                more electronic filing systems, an email system, or a customer relationship management system.
              </p>

              <h3 className={h3Cls}>Automated Decision-Making and AI</h3>
              <p className={pCls}>
                The Services include automation to assist with data entry, processing, comparing quotes, tracking, and
                document processing. Where this involves profiling or automated decision-making about individuals with
                legal or similarly significant effects, we will provide required disclosures, human-in-the-loop review
                where appropriate, and mechanisms to exercise applicable rights. We do not use personal data, customer
                data, or PHI to train large language models. We may use aggregated, anonymized, or de-identified data
                only where it cannot be re-identified or otherwise be attributed to a customer or individual, and any
                data derived from PHI will be de-identified in accordance with HIPAA before use for model improvement,
                analytics, or similar secondary purposes.
              </p>
            </section>

            {/* 03 */}
            <section id="s03" className={sectionCls}>
              <span className={numLabelCls}>03.</span>
              <h2 className={h2Cls}>How We Share Personal Information</h2>
              <p className={pCls}>We share personal information in the following circumstances:</p>
              <ul className={ulCls}>
                <li><strong className="font-medium text-dark/80">Customers:</strong> We share personal information with our customers when we are processing information on their behalf. These entities enter into agreements directly with consumers or business entities, and their processing of personal information is governed by their own privacy policies.</li>
                <li><strong className="font-medium text-dark/80">Service Providers:</strong> We share personal information with third-party service providers who perform functions on our behalf, including cloud hosting, data analytics, payment processing, customer support, and technology services. These providers are contractually required to protect your information and use it only for the specific services they provide to us. Where a service provider creates, receives, maintains, or transmits PHI on our behalf, we require it to act as a HIPAA subcontractor and enter into a written business associate or subcontractor agreement as required by HIPAA.</li>
                <li><strong className="font-medium text-dark/80">Integration Partners:</strong> We may share personal information as requested or directed by you to enable a requested functionality.</li>
                <li><strong className="font-medium text-dark/80">Corporate Affiliates:</strong> We may disclose personal information to our corporate affiliates for centralized operations, HR, finance, compliance, security, and product support, consistent with this Privacy Policy and applicable law.</li>
                <li><strong className="font-medium text-dark/80">Government Authorities:</strong> We may disclose personal information to regulatory bodies, law enforcement, or other government entities when required by law, to comply with legal process, or to protect our rights and the safety of others.</li>
                <li><strong className="font-medium text-dark/80">Corporate Transactions:</strong> Information about our users, including personal information, may be disclosed and otherwise transferred to an acquirer, successor, or assignee as part of any merger, acquisition, debt financing, sale of company assets, or similar transaction, as well as in the event of an insolvency, bankruptcy, or receivership in which personal information is transferred to one or more third parties as one of our business assets.</li>
                <li><strong className="font-medium text-dark/80">Legal and Compliance:</strong> We also disclose personal information if we believe that doing so is legally required, or is in our interest to protect our property or other legal rights (including, but not limited to, enforcement of our agreements) or the rights or property of others, or otherwise to help protect the safety or security of our Services and other users of the Services.</li>
                <li><strong className="font-medium text-dark/80">PHI Disclosures:</strong> We disclose PHI only as permitted by HIPAA, an applicable business associate agreement, our customer agreements, and customer instructions, including for treatment, payment, or health care operations when directed by a customer, to approved subcontractors, as required by law, to respond to permitted legal process, or to prevent or lessen a serious and imminent threat to health or safety where permitted by law.</li>
              </ul>
              <p className={pCls}>
                We may share personal information for other purposes with your explicit consent or at your direction.
                We do not sell personal information to third parties. We may share personal information, such as
                identifiers and online activity collected through cookies and pixels, with advertising platforms to
                deliver targeted advertising, which may constitute "sharing" or "targeted advertising" under applicable
                state laws. You may opt out as described in "Your Privacy Rights." We do not use PHI, or customer data
                we process as a service provider/processor, for targeted advertising or cross-context behavioral
                advertising.
              </p>
              <p className={pCls}>
                We may create and use de-identified or aggregated information for analytics, service improvement, and
                other lawful purposes. We take reasonable measures to ensure that de-identified information cannot be
                associated with a particular individual and we maintain information as de-identified and do not attempt
                to re-identify it, except as permitted by law to test our processes. Where de-identified information is
                derived from PHI, we will de-identify the information in accordance with HIPAA and will not use or
                disclose it in a manner that would identify the individual or customer.
              </p>
            </section>

            {/* 04 */}
            <section id="s04" className={sectionCls}>
              <span className={numLabelCls}>04.</span>
              <h2 className={h2Cls}>How Long Do We Keep Your Personal Information For?</h2>
              <p className={pCls}>
                We retain each category of personal information for no longer than is reasonably necessary and
                proportionate to achieve the purposes for which the information was collected or processed, or for
                other disclosed, compatible purposes. We determine retention periods based on factors such as the
                minimum data needed to provide and improve our Services, for security and fraud-prevention needs, to
                meet legal obligations, and recordkeeping requirements. Where we process PHI, we retain and delete PHI
                in accordance with the applicable business associate agreement, customer instructions, HIPAA
                documentation obligations, and applicable law.
              </p>
            </section>

            {/* 05 */}
            <section id="s05" className={sectionCls}>
              <span className={numLabelCls}>05.</span>
              <h2 className={h2Cls}>Your Privacy Rights</h2>
              <p className={pCls}>Depending on your state of residence, you may have the following data rights:</p>
              <ul className={ulCls}>
                <li><strong className="font-medium text-dark/80">Right to Know/Access:</strong> Request information about our collection, use, and disclosure of your personal information and obtain a copy in a portable format.</li>
                <li><strong className="font-medium text-dark/80">Correct:</strong> Request that we correct inaccuracies in your personal information.</li>
                <li><strong className="font-medium text-dark/80">Delete:</strong> Request that we delete personal information, subject to legal exceptions.</li>
                <li><strong className="font-medium text-dark/80">Opt Out:</strong> Opt out of the sale of your personal information and the sharing or processing of personal information for cross-context behavioral advertising or targeted advertising, as applicable. You may exercise these rights by clicking the "Do Not Sell or Share My Personal Information" link on our homepage or by following the steps provided below.</li>
                <li><strong className="font-medium text-dark/80">Portability:</strong> Obtain a copy of your personal information in a portable, and to the extent technically feasible, readily usable format.</li>
                <li><strong className="font-medium text-dark/80">Appeal:</strong> In states that provide an appeal right, appeal our decision if we decline to act on your request.</li>
                <li><strong className="font-medium text-dark/80">Non-Discrimination:</strong> We will not unlawfully discriminate against you for exercising your rights.</li>
              </ul>
              <p className={pCls}>
                You may submit a request by emailing{' '}
                <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a>. We will verify
                your identity consistent with applicable law before fulfilling a request. You may designate an
                authorized agent to make a request on your behalf, subject to verification and authorization
                requirements. If we deny your request, you may appeal by contacting{' '}
                <a href="mailto:legal@askcooper.ai" className={linkCls}>legal@askcooper.ai</a>; we will provide a
                written explanation of our decision and how you may contact your state attorney general if you remain
                unsatisfied.
              </p>
              <p className={pCls}>
                For requests relating to personal information we process solely as a service provider/processor for a
                customer, including PHI we process as a business associate or subcontractor business associate, please
                direct your request to that Customer or other applicable covered entity. We will support Customer in
                responding to your request as required by our agreement, any applicable business associate agreement,
                and applicable law.
              </p>
            </section>

            {/* 06 */}
            <section id="s06" className={sectionCls}>
              <span className={numLabelCls}>06.</span>
              <h2 className={h2Cls}>Other Important Information</h2>

              <h3 className={h3Cls}>6.1. Children</h3>
              <p className={pCls}>
                We do not collect personal information of children under 16. Our Services are not directed to users
                under the age of 16. If we learn that we have collected personal information from a child under the
                age of 16 on our Services, we will delete that information as quickly as possible. If you believe
                that we may have collected any such personal information on our Services, please notify us at{' '}
                <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a>.
              </p>

              <h3 className={h3Cls}>6.2. Jurisdiction; Data Transfers</h3>
              <p className={pCls}>
                The Services are hosted and intended solely for customers and users in the United States. All Personal
                Information is stored on servers in the United States and is subject to United States law. While we
                have offices and employees in India and Chile, no personal information is transferred to or processed
                in these locations. All data processing activities occur within the United States using U.S.-based
                infrastructure and services.
              </p>
              <p className={pCls}>
                If you are visiting the Services from the European Union or other regions with laws governing data
                collection and use, please note that you are agreeing to the transfer of your information to the
                United States and the global processing of such information. By providing your Personal Information,
                you consent to any transfer and processing in accordance with this Privacy Policy.
              </p>

              <h3 className={h3Cls}>6.3. Third-Party Products</h3>
              <p className={pCls}>
                This Privacy Policy applies only to the Services. The Services may be integrated with other websites,
                products and services provided or operated by entities not affiliated with or related to Cooper AI
                ("Third-Party Products"). The policies and procedures we described here do not apply to Third-Party
                Products. The integrations do not imply that Cooper AI endorses or has reviewed the Third-Party
                Products. We suggest contacting those providers directly for information on their privacy policies.
              </p>

              <h3 className={h3Cls}>6.4. Data Security</h3>
              <p className={pCls}>
                We employ administrative, technical, and physical safeguards designed to protect personal information
                against unauthorized access, disclosure, alteration, and destruction. These measures include access
                controls, encryption in transit and at rest where appropriate, network and application security,
                logging and monitoring, personnel training, and vendor due diligence. No security program is perfect;
                we regularly evaluate and enhance our controls.
              </p>

              <h3 className={h3Cls}>6.5. Changes to this Privacy Policy</h3>
              <p className={pCls}>
                We may update this Privacy Policy periodically to reflect changes in our practices, Services, or
                legal requirements. We will post updates with a new effective date and take additional steps where
                required by law.
              </p>
            </section>

            {/* 07 */}
            <section id="s07" className={sectionCls}>
              <span className={numLabelCls}>07.</span>
              <h2 className={h2Cls}>California Privacy Notice</h2>
              <p className={pCls}>
                This section describes how we collect, use, and share the Personal Information of California
                residents in our capacity as a "business" under the California Consumer Privacy Act, as amended by
                the California Privacy Rights Act (collectively, "CCPA") and the rights these users may have with
                respect to their Personal Information.
              </p>
              <p className={pCls}>
                For purposes of this section, the term 'Personal Information' has the meaning given in the CCPA and
                does not include information exempted from the scope of the CCPA, including PHI and other medical
                information regulated by HIPAA to the extent exempt under the CCPA. This section does not apply to our
                collection, use, and sharing of personal information of our internal staff.
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Categories of personal information we collect and disclose:</strong>{' '}
                We are a new company and may not have collected all of the categories of personal information as
                provided in this Privacy Policy. See "What information do we collect" for more information.
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Sensitive Personal Information:</strong> We do not
                collect or process sensitive personal information for purposes of inferring characteristics about
                consumers, and we do not use or disclose sensitive personal information for purposes other than those
                permitted by the CCPA regulations. PHI is handled as described above and, where HIPAA applies, in
                accordance with the applicable business associate agreement. Accordingly, the consumers' "Right to
                Limit" under the CCPA does not apply to our current practices. If that changes, we will provide a
                Notice of Right to Limit and honor requests as required by law.
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Sales and Sharing:</strong> Under the CCPA, 'sales' and
                'sharing' are broadly defined, respectively, and include disclosing or making available personal
                information in exchange for monetary or other valuable consideration or for purposes of cross-context
                behavioral advertising. We do not sell your personal information, but we may share your personal
                information as such term is defined by the CCPA. California residents may opt out of this sharing by
                clicking the "Do Not Sell or Share My Personal Information" link on our homepage or by following the
                steps provided below. We do not sell PHI or share PHI for cross-context behavioral advertising or
                targeted advertising, and we do not have actual knowledge that we sell or share personal information of
                consumers under 16 years old.
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Recordkeeping:</strong> We maintain records of consumer
                requests and our responses as required by law and will implement any additional requirements that
                become effective under forthcoming California regulations.
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Automated Decisionmaking Technology (ADMT):</strong> We
                do not currently use ADMT to make significant decisions about consumers. If we begin doing so, we
                will provide a pre-use notice as required by law.
              </p>

              <h3 className={h3Cls}>California Shine the Light</h3>
              <p className={pCls}>
                A California resident who has provided personal information to a business with whom he/she has
                established a business relationship for personal, family, or household purposes ("California
                Customer") is entitled to request information about whether the business has disclosed personal
                information to any third parties for the third parties' direct marketing purposes, subject to certain
                exceptions, as defined in California Civil Code Sec. 1798.83. We do not share Personal Information
                with third parties for the third parties' direct marketing purposes.
              </p>
            </section>

            {/* 08 */}
            <section id="s08" className={sectionCls}>
              <span className={numLabelCls}>08.</span>
              <h2 className={h2Cls}>Other State Privacy Rights</h2>
              <p className={pCls}>
                Residents of states with comprehensive privacy laws (including Virginia, Colorado, Connecticut, Utah,
                Texas, Oregon, Montana, Tennessee, Indiana, Iowa, Delaware, and others as they become effective) may
                have rights similar to those described above. Where these laws impose additional or different
                requirements, e.g., consent for certain sensitive data, data protection assessments for targeted
                advertising or profiling, or disclosures about automated decision-making, we will comply and provide
                state-specific supplements as necessary.
              </p>
              <p className={pCls}>
                To the extent we process de-identified personal information, we will maintain and use it in a
                de-identified form and will not attempt to re-identify it unless permitted by applicable law.
              </p>
            </section>

            {/* 09 */}
            <section id="s09" className={sectionCls}>
              <span className={numLabelCls}>09.</span>
              <h2 className={h2Cls}>Google API Services User Data</h2>
              <p className={pCls}>
                Cooper uses Google API Services to provide email functionality within the platform. Our use and
                transfer to any other app of information received from Google APIs adheres to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements. For full details on what Google data we access, how we use
                it, our prohibited uses, human access restrictions, and data retention practices, please see our
                dedicated{' '}
                <a href="/google-api-disclosure" className={linkCls}>
                  Google API Services Usage Disclosure
                </a>
                .
              </p>
            </section>

            {/* 10 */}
            <section id="s10" className={sectionCls}>
              <span className={numLabelCls}>10.</span>
              <h2 className={h2Cls}>Contact Us</h2>
              <p className={pCls}>For privacy-related questions, requests, or complaints, please contact:</p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Email:</strong>{' '}
                <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a>
              </p>
              <p className={pCls}>
                <strong className="font-medium text-dark/80">Address:</strong> Cooper AI Tech, Inc., PO Box 190326,
                San Francisco, CA 94119
              </p>
              <p className={pCls}>
                For privacy rights requests, please use the subject line "Privacy Rights Request" in your email.
              </p>
              <p className={pCls}>
                <em className="italic">Response Time:</em> We will acknowledge receipt of your inquiry within 5
                business days and provide a substantive response within 45 days (or as otherwise required by
                applicable law).
              </p>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  )
}
