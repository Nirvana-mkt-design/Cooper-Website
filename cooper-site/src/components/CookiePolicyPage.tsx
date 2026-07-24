import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what', label: 'What are cookies?' },
  { id: 'how', label: 'How and why do we use cookies?' },
  { id: 'hipaa', label: 'HIPAA & PHI-Specific Controls' },
  { id: 'preferences', label: 'Cookie Preferences' },
  { id: 'storage', label: 'Local Storage' },
  { id: 'updates', label: 'Updates to the Cookie Policy' },
  { id: 'contact', label: 'Contact Us' },
]

const linkCls = 'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'
const sectionCls = 'scroll-mt-[100px] mt-[48px] pt-[20px] border-t border-dark/[0.08]'
const h2Cls = 'font-serif text-[22px] md:text-[26px] text-dark mb-[20px]'
const ulCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px] pl-[20px] list-disc space-y-[6px]'

export default function CookiePolicyPage() {
  useSeo({
    title: 'Cookie Policy — Cooper',
    description: 'How Cooper uses cookies and similar technologies, and how you can control them.',
    canonicalPath: '/cookie-policy',
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
            Cookie Policy
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
          <article>
            {/* Intro */}
            <section id="intro" className="scroll-mt-[100px]">
              <p className={pCls}>
                Cooper AI Tech, Inc., and/or its affiliates and subsidiaries ("we," "our," or "us") operate this
                website, askcooper.ai, and its subdomains (together, the "Site") and we provide a software platform,
                including our AI copilot that automates manual processes for insurance brokers and companies (the
                "Services"). This Cookie Policy is intended to tell users ("User" or "you(r)") about how we use cookies,
                pixels, and any similar technologies ("cookies") through our Site, and the rights you have to control
                their use. This Cookie Policy is incorporated into our{' '}
                <a href="/privacy" className={linkCls}>Privacy Policy</a> and{' '}
                <a href="/terms" className={linkCls}>Terms of Service</a> by reference.
              </p>
              <p className={pCls}>
                As used in this Cookie Policy, "HIPAA" means the Health Insurance Portability and Accountability Act of
                1996, as amended, and its implementing regulations. "Protected Health Information" or "PHI" means
                individually identifiable health information, as defined under HIPAA, that we create, receive, maintain,
                or transmit on behalf of our customers who are covered entities or business associates under HIPAA.
                Where our Services are used in connection with PHI, or where Site interactions may involve PHI, our use
                of cookies and similar technologies is also subject to the HIPAA-specific restrictions described in
                this Cookie Policy and, where applicable, our customer agreements and business associate agreements.
              </p>
            </section>

            {/* What are cookies? */}
            <section id="what" className={sectionCls}>
              <h2 className={h2Cls}>What are cookies?</h2>
              <p className={pCls}>
                We receive and store certain types of information whenever you interact with our Site or our Services. A
                "cookie" is a data file that is created and stored on your computer's hard drive, memory, or web browser
                to enable our systems to recognize your browser or equipment and to provide convenience and other
                features to you when you visit our Services. Some cookies collect/contain personal information, some do
                not.
              </p>
              <p className={pCls}>
                Cookies set by us, the operators of the Site, are "first-party cookies." Cookies set by parties other
                than us are "third-party cookies." Third-party cookies enable third party features or functionality to
                be provided on or through the Site (for example advertising, interactive content, interaction with
                social media sites, and analytics). The parties that set these third-party cookies can recognize your
                computer or mobile device both when you visit our Site, and also when you visit certain other websites.
              </p>
            </section>

            {/* How and why do we use cookies? */}
            <section id="how" className={sectionCls}>
              <h2 className={h2Cls}>How and why do we use cookies?</h2>
              <p className={pCls}>
                We use cookies and other tracking technologies to track how our users access and use our Services, to
                learn when and how users visit the Services, to make personalized features and other services available
                to users, to learn which terms are used, to learn which websites direct users to our Services, to
                compile and analyze aggregate statistics and trends, and to otherwise help administer and improve the
                Services. We do not use cookies, pixels, advertising tools, analytics tags, or other tracking
                technologies to collect, disclose, or target advertising based on PHI, and we limit tracking
                technologies in HIPAA-regulated contexts to uses permitted by applicable law and our customer
                agreements.
              </p>
              <p className={pCls}>
                We also use tracking technologies to help display certain information on the Services and to improve
                your enjoyment and convenience when using or visiting our Services; for example, by remembering your
                contact, login, and other information when you access or use the Services. We configure these
                technologies so that PHI should not be included in cookie values, pixel payloads, analytics events,
                URLs, page titles, referrer strings, advertising audiences, or similar tracking fields. For more
                information on how we use the information we gather from our users' activity on the Services, please see
                our <a href="/privacy" className={linkCls}>Privacy Policy</a>.
              </p>
              <ul className={ulCls}>
                <li>
                  <strong className="font-medium text-dark/80">Strictly Necessary Cookies.</strong> These cookies are
                  necessary for the website to function and cannot be switched off in our systems. They are usually set
                  in response to actions made by you which amount to a request for services, such as setting your
                  privacy preferences, logging in or filling in forms. You can set your browser to block or alert you
                  about these cookies, but doing so will cause some parts of our Site and our Services not to function
                  properly. These cookies are designed to store the minimum information needed for the requested
                  function and are not intended to store PHI or other sensitive personal information.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Functional Cookies.</strong> These cookies enable the
                  Site to provide enhanced functionality and personalization. They may be set by us or by third party
                  providers whose services we have added to our pages. We do not enable functional cookies or
                  third-party functionality in portions of the Site or Services that may involve PHI unless they are
                  necessary, configured to minimize data collection, and subject to appropriate contractual and security
                  safeguards. If you do not allow these cookies, then some or all of these Services or portions of the
                  Site may not function properly.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Analytics and Performance Cookies.</strong> These cookies
                  allow us to count visits and traffic sources, e.g., Google Analytics. They help us to know which pages
                  are the most and least popular and see how users move around the Site and Services. All information
                  these cookies collect is anonymized and aggregated. In HIPAA-regulated contexts, we use analytics
                  technologies only with de-identified, aggregated, or otherwise HIPAA-permitted information and do not
                  configure analytics events to include PHI in URLs, form fields, page titles, event names, event
                  parameters, user IDs, or similar fields. If you do not allow these cookies, then we will not know when
                  you have visited our Site and/or Services, and we will not be able to monitor its performance.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Advertising and Targeting Cookies.</strong> These
                  cookies are used to build a profile of your interests and display relevant advertising to you on our
                  Site and on third-party sites. They work by uniquely identifying your browser or device. We do not use
                  advertising or targeting cookies, pixels, or tags on authenticated Services, customer portals, request
                  forms, landing pages, or other pages where PHI may be entered or inferred unless permitted by HIPAA
                  and supported by appropriate contractual safeguards. We do not use PHI to create, enrich, or target
                  advertising audiences or to retarget users based on health status, claims, coverage, care, or other
                  HIPAA-regulated interactions.
                </li>
              </ul>
              <p className={pCls}>
                Please be advised that this Cookie Policy does not govern the use of third-party websites or services or
                providers of third-party websites or services. We do not authorize third parties to use cookies or
                similar technologies to collect PHI for their own purposes. Any third party that receives PHI through a
                cookie, pixel, analytics tag, or similar technology must be authorized to do so under applicable law
                and, where required, be bound by a business associate agreement or other appropriate contractual
                restrictions.
              </p>
            </section>

            {/* HIPAA and PHI-Specific Tracking Controls */}
            <section id="hipaa" className={sectionCls}>
              <h2 className={h2Cls}>HIPAA and PHI-Specific Tracking Controls</h2>
              <p className={pCls}>
                We apply additional controls where cookies, pixels, analytics scripts, advertising technologies, or
                other tracking technologies could interact with PHI or with pages, workflows, or communications that are
                subject to HIPAA.
              </p>
              <ul className={ulCls}>
                <li>
                  <strong className="font-medium text-dark/80">No PHI in tracking payloads.</strong> We do not
                  intentionally place PHI in cookie values, local storage, pixels, analytics events, advertising tags,
                  URLs, page names, referrer strings, custom dimensions, audience segments, or similar tracking fields.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Restricted deployment.</strong> We do not deploy
                  advertising, retargeting, social media, or cross-context behavioral advertising technologies in
                  authenticated Services, customer environments, customer portals, or pages/forms where PHI may be
                  collected, submitted, accessed, or inferred, unless the use is permitted by HIPAA and supported by
                  appropriate contractual safeguards.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Analytics safeguards.</strong> Where analytics are used
                  in HIPAA-regulated contexts, we configure them to minimize data collection, disable or limit features
                  that identify users or enable cross-site tracking where feasible, use de-identified or aggregated
                  reporting where appropriate, and restrict vendor use of data to Cooper AI's permitted purposes.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Vendor controls.</strong> We require third-party
                  providers that may receive PHI through tracking technologies to be bound by appropriate contractual
                  terms, including a business associate agreement where required, and we do not allow those providers to
                  use PHI for their own advertising, profiling, product improvement, or unrelated purposes.
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Review and change management.</strong> We review new or
                  materially changed cookies, pixels, analytics tools, advertising tools, tags, SDKs, and local storage
                  uses before deployment to assess whether they may involve PHI, HIPAA-regulated contexts, or sensitive
                  information, and we update this Cookie Policy and our cookie inventory as appropriate.
                </li>
              </ul>
            </section>

            {/* Cookie Preferences */}
            <section id="preferences" className={sectionCls}>
              <h2 className={h2Cls}>Cookie Preferences</h2>
              <p className={pCls}>
                You may be able to choose to have your browser refuse cookies and other tracking technologies. On most
                web browsers, you will find a "help" section on the toolbar. Please refer to this section for
                information on how to receive notifications when you are receiving a new cookie and on how to turn
                cookies off. Some browsers and browser extensions support the Global Privacy Control ("GPC") that can
                send a signal to the websites you visit indicating your choice to opt out from certain types of data
                processing, including sharing for targeted advertising purposes. In certain territories, when we detect
                such a signal, we will make reasonable efforts to respect your choices indicated by a GPC setting as
                required by applicable law.
              </p>
              <p className={pCls}>Most browsers allow you to refuse or delete cookies. The following links provide instructions for major browsers:</p>
              <ul className={ulCls}>
                <li>
                  <a href="http://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={linkCls}>Google Chrome</a>
                </li>
                <li>
                  <a href="http://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className={linkCls}>Mozilla Firefox</a>
                </li>
                <li>
                  <a href="http://support.apple.com/guide/safari/manage-cookies-sfri11471/ma" target="_blank" rel="noopener noreferrer" className={linkCls}>Apple Safari</a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className={linkCls}>Microsoft Edge</a>
                </li>
              </ul>
              <p className={pCls}>
                Please be aware that if you choose to have your browser refuse cookies, it is possible that some areas of
                the Services will not function properly when you use them. The instructions for these vary from browser
                to browser and they may change from time to time as new versions are released.
              </p>
              <p className={pCls}>
                We permit third parties to use cookies and similar technologies on our digital properties to gather
                information to provide us insights about the use and engagement of our websites and emails. In some
                cases, the third parties may use the information they collect for their own purposes in accordance with
                their privacy policies. The third parties can include common digital social and advertising platform
                providers, including Google and Facebook. In HIPAA-regulated contexts, we do not permit advertising or
                social media pixels to collect PHI, and we restrict analytics providers to de-identified, aggregated, or
                otherwise permitted data and to use only for our permitted purposes. Except as otherwise described in
                this Cookie Policy, we do not control or have access to these third-party cookies or tracking
                technologies.
              </p>
              <ul className={ulCls}>
                <li>
                  <strong className="font-medium text-dark/80">Google Analytics.</strong> We use Google Analytics
                  cookies for data analytics purposes. We do not use Google Analytics to collect PHI and do not
                  intentionally send PHI to Google Analytics. In HIPAA-regulated contexts, we use Google Analytics only
                  where configured and permitted so that PHI is not disclosed through analytics events, URLs, page
                  titles, referrer strings, user IDs, or similar fields. You can find more information on how Google uses
                  data from these cookies at{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={linkCls}>https://policies.google.com/privacy</a>. You may choose to opt out of Google Analytics by installing their opt
                  out browser add on at:{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout/" target="_blank" rel="noopener noreferrer" className={linkCls}>https://tools.google.com/dlpage/gaoptout/</a>
                </li>
                <li>
                  <strong className="font-medium text-dark/80">Facebook:</strong> We use Facebook advertising tools to
                  collect information about your activity on our Site to help us deliver targeted advertisement on
                  Facebook and Instagram. We do not use Facebook advertising tools in HIPAA-regulated portions of the
                  Site or Services, or to collect, disclose, or target advertising based on PHI. For more information on
                  how Meta uses data, please visit{' '}
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className={linkCls}>https://www.facebook.com/privacy/policy</a>. To opt out of having such information sent to Meta, please visit:{' '}
                  <a href="https://www.facebook.com/off-facebook-activity" target="_blank" rel="noopener noreferrer" className={linkCls}>https://www.facebook.com/off-facebook-activity</a>.
                </li>
              </ul>
              <p className={pCls}>
                In addition, you have the right to opt out of the sale of your information to third parties and the
                sharing of your personal information for targeted advertising purposes. To opt out, you can either click
                the "Do Not Sell or Share My Personal Information" link in the footer of our homepage, or you can email{' '}
                <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a>.
              </p>
              <p className={pCls}>
                Please note that our Site currently does not respond to "Do not Track" ("DNT") signals and operates as
                described in this Cookie Policy, whether or not a DNT signal is received.
              </p>
            </section>

            {/* Local Storage */}
            <section id="storage" className={sectionCls}>
              <h2 className={h2Cls}>Local Storage</h2>
              <p className={pCls}>
                Cookies are not the only way to store information on your computer or mobile device. We may store
                additional information that is essential to the functionality of the Services in local storage. Local
                storage is similar to the storage of information in cookies, but never expires until our Services delete
                this information, or you delete it yourself. We do not intentionally store PHI in local storage, and in
                HIPAA-regulated contexts, we limit local storage to data necessary for functionality or security and
                apply appropriate safeguards. Please refer to the instructions specific to the type of browser you are
                using, or the specific mobile phone operating system you are using for instructions on how to delete
                local storage.
              </p>
            </section>

            {/* Updates to the Cookie Policy */}
            <section id="updates" className={sectionCls}>
              <h2 className={h2Cls}>Updates to the Cookie Policy</h2>
              <p className={pCls}>
                We reserve the right to modify and update this Cookie Policy at any time by posting an amended version
                of the statement on our Site. Please refer to this policy regularly. The date at the top of the Cookie
                Policy indicates when it was last updated.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className={sectionCls}>
              <h2 className={h2Cls}>Contact Us</h2>
              <p className={pCls}>
                If you have any questions or concerns about our use of cookies and other tracking technologies, please
                email us at <a href="mailto:privacy@askcooper.ai" className={linkCls}>privacy@askcooper.ai</a> or see
                our <a href="/privacy" className={linkCls}>Privacy Policy</a> for more information.
              </p>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  )
}
