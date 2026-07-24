import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 's01', label: '01. These Terms May Change' },
  { id: 's02', label: '02. Customer Accounts' },
  { id: 's03', label: '03. Use of the Site' },
  { id: 's04', label: '04. Communication' },
  { id: 's05', label: '05. Failure to Comply; Termination' },
  { id: 's06', label: '06. Legal Provisions' },
]

const linkCls = 'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'
const sectionCls = 'scroll-mt-[100px] mt-[48px] pt-[20px] border-t border-dark/[0.08]'
const h2Cls = 'font-serif text-[22px] md:text-[26px] text-dark mb-[20px]'
const h3Cls = 'font-sans font-semibold text-[16px] text-dark mb-[12px] mt-[28px]'
const ulCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px] pl-[20px] list-disc space-y-[6px]'
const numLabelCls = 'font-grotesk text-[11px] font-medium tracking-[1.2px] uppercase text-accent-orange block mb-[6px]'
const capsBoxCls = 'font-sans text-[13px] leading-[1.7] text-dark/55 mb-[16px] bg-dark/[0.03] rounded-[8px] p-[16px]'

export default function TermsPage() {
  useSeo({
    title: 'Terms of Service — Cooper',
    description: 'The terms governing your use of Cooper and its services.',
    canonicalPath: '/terms',
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
            Terms of Use Agreement
          </h1>
          <div
            className="flex flex-wrap gap-x-[24px] gap-y-[6px] font-sans text-[14px] text-dark/40 animate-fade-blur-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span>Effective: July 2026</span>
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
            {/* Intro */}
            <section id="intro" className="scroll-mt-[100px]">
              <p className={pCls}>
                Your access to and use of our website at askcooper.ai and any of its subdomains, and any other
                websites owned and hosted by Cooper AI Tech, Inc. (together, our "Site") is governed by these terms
                and conditions ("Terms"), our <a href="/cookie-policy" className={linkCls}>Cookie Policy</a>, and our
                Privacy Policy, each of which is incorporated by reference into these Terms. Please read them carefully.
              </p>
              <div className={capsBoxCls}>
                BY ACCESSING, BROWSING, OR OTHERWISE USING THE SITE, YOU AFFIRM THAT: (I) YOU HAVE READ, UNDERSTAND
                AND AGREE TO THESE TERMS; (II) YOU ARE MORE THAN 18 YEARS OF AGE, OR AN EMANCIPATED MINOR, OR
                POSSESS LEGAL PARENTAL OR GUARDIAN CONSENT, AND ARE FULLY ABLE AND COMPETENT TO AGREE TO AND ABIDE
                BY AND COMPLY WITH THESE TERMS; AND (III) YOU HAVE THE AUTHORITY TO ENTER INTO THESE TERMS
                PERSONALLY OR ON BEHALF OF THE ENTITY YOU REPRESENT. IF YOU DO NOT MEET THESE CRITERIA OR DO NOT
                AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SITE.
              </div>
              <p className={pCls}>
                Your use of any current or future products and services offered by Cooper AI Tech, Inc. ("Cooper AI"
                or "we"), technical services, support, or other ancillary service or content provided by or on behalf
                of Cooper AI (the "Services") may also be subject to additional agreements, such as the Master
                Services Agreement and any applicable Order Form (together, "MSA"). If there is a conflict between
                these Terms and the MSA, the MSA will govern your access to and use of the Services.
              </p>
            </section>

            {/* 01 */}
            <section id="s01" className={sectionCls}>
              <span className={numLabelCls}>01.</span>
              <h2 className={h2Cls}>These Terms May Change</h2>
              <p className={pCls}>
                We may update and amend these Terms from time to time in our sole discretion, including by adding,
                deleting or modifying terms. If the changes to these Terms materially modify your rights or
                obligations, they will be effective on the earlier of the date upon which you consent to them or
                thirty (30) days from the date on which we notify you of the updates. If the changes do not
                materially modify your rights or obligations, they will be effective when posted on any part of the
                Site, and your continued use of the Site after the posting of any changes to these Terms will mean
                that you accept and agree to the changes. Every time you wish to use the Site, please check these
                Terms to ensure you understand the terms that apply to you at that time.
              </p>
            </section>

            {/* 02 */}
            <section id="s02" className={sectionCls}>
              <span className={numLabelCls}>02.</span>
              <h2 className={h2Cls}>Customer Accounts</h2>
              <p className={pCls}>
                In order to access or use any of our Services, you may be required to log in and create an account
                either as a user or on behalf of your company as the Customer ("Account"). As part of the Account
                registration process, you may be asked to provide information such as your name, email address, job
                role, as well as select a username and password.
              </p>
              <p className={pCls}>
                Cooper AI may refuse to grant you a username for any reason at our sole discretion, including if
                Cooper AI determines that such username impersonates someone else, is illegal, vulgar, or otherwise
                offensive, or is protected by trademark or other proprietary rights law, or otherwise may cause
                confusion.
              </p>
              <p className={pCls}>
                You are responsible for maintaining the security of the login credentials for your Account. Your
                Account may include personal and sensitive information, including payment information, and you should
                treat your login credentials, such as your name, username or password as confidential. You may not
                allow others to use your Account; which includes furnishing your username and password to third-party
                developed applications to connect to your Account, unless authorized by the applicable MSA or by
                Cooper AI. You are responsible for all activity that occurs under your Account, including any
                activity by unauthorized users. If you become aware of unauthorized access to your Account, change
                your password and notify us immediately at{' '}
                <a href="mailto:support@askcooper.ai" className={linkCls}>support@askcooper.ai</a>.
              </p>
              <p className={pCls}>
                You certify that the information you provide to us at any point, including in connection with the
                registration process of your Account or with the use of the Site, is true, accurate, current, and
                complete. You agree that you will maintain and update such information regularly.
              </p>
            </section>

            {/* 03 */}
            <section id="s03" className={sectionCls}>
              <span className={numLabelCls}>03.</span>
              <h2 className={h2Cls}>Use of the Site</h2>

              <h3 className={h3Cls}>3.1. Limited License</h3>
              <p className={pCls}>
                Subject to these Terms, you are granted a limited license to use the Site to learn about Cooper AI
                and the Services. You may copy, display, and use the functionality, materials, features, and services
                provided by the Site solely for your personal, non-commercial use, provided that you do not remove
                copyright or proprietary notice language and do not make other modifications, representations or
                warranties regarding the same. Notwithstanding anything herein to the contrary, Cooper AI may revoke
                any of the foregoing rights and/or your access to the Site, or any part thereof, including the
                blocking of your internet protocol (IP) address, at any time without prior notice.
              </p>

              <h3 className={h3Cls}>3.2. Intellectual Property Ownership</h3>
              <p className={pCls}>
                Other than the limited license provided above, all text, content, user interfaces, illustrations,
                artwork, videos, sound, music, software, documents, names, logos, trademarks, service marks, brand
                identities, characters, trade names, graphics, designs, computer code and any other works appearing
                on the Site (together, "Cooper AI Materials"), including the design, organization, compilation, and
                "look and feel" and arrangement of such Cooper AI Materials, is owned, controlled or licensed by or
                to Cooper AI and/or its affiliates, and is protected by copyright, trademark, trade dress, patent
                and/or other intellectual property rights and unfair competition laws. All rights are reserved.
              </p>
              <p className={pCls}>
                In particular, the word "Cooper AI" "Ask Cooper AI" and the Cooper AI logos, and other marks, logos
                and titles are registered and/or common law trade names, trademarks or service marks of Cooper AI
                and/or its affiliates, for which all usage rights are reserved.
              </p>

              <h3 className={h3Cls}>3.3. Feedback</h3>
              <p className={pCls}>
                You may submit to Cooper AI feedback, comments, ideas, or suggestions regarding Cooper AI's Services
                or new products and services ("Feedback"). Cooper AI may, but has no obligation to, in its
                discretion and for any purpose, (a) use, modify, and incorporate Feedback into Cooper AI's products
                and services, and (b) license, sublicense, or distribute the Feedback without obligation or
                compensation to you. All Feedback to the Site shall be deemed non-confidential and non-proprietary.
              </p>

              <h3 className={h3Cls}>3.4. Restrictions</h3>
              <p className={pCls}>
                Except as expressly provided in these Terms or as otherwise expressly approved in writing by Cooper
                AI, you may not, and may not assist or enable any others to:
              </p>
              <ul className={ulCls}>
                <li>Violate these Terms or the MSA or any other terms that may apply to your use of the Site and the Services;</li>
                <li>Breach any applicable laws or regulations, third-party rights or agreements with us, including these Terms;</li>
                <li>Perform any fraudulent activity, including accessing the accounts of other users without permission, impersonating any person or entity, claiming false affiliations, or falsifying your identity or any information about you, including age or date of birth;</li>
                <li>Provide false, inaccurate or misleading information to us or any of our third-party partners;</li>
                <li>Avoid, bypass, remove, deactivate, impair, descramble, or otherwise circumvent any technological measure implemented by Cooper AI or any of our service providers or any other third party to protect the Site or the Services;</li>
                <li>Frame the Site or otherwise make any Cooper AI Materials available on another website;</li>
                <li>Reuse, re-post, distribute, transmit, disseminate, broadcast, circulate, perform, or otherwise display and/or commercially exploit the Cooper AI Materials, in whole or in part;</li>
                <li>Copy, modify, translate, alter or create any derivative works from the Cooper AI Materials;</li>
                <li>Alter, remove or obscure any copyright notice, digital watermarks, proprietary legends or any other notice included in the Cooper AI Materials;</li>
                <li>Disassemble, decompile, reverse compile or reverse engineer any part of the Site or the Cooper AI Materials, or engage in mystery shopping;</li>
                <li>Use any manual or automated software, devices or other processes (including but not limited to spiders, robots, scrapers, crawlers, avatars, data mining tools or the like) to "scrape", "deep-link", copy, monitor or download any portion of the Site or Cooper AI Materials;</li>
                <li>Interfere with or damage the Site or Cooper AI Materials, including without limitation, through the use of viruses, cancel bots, Trojan horses, harmful code, flood pings, denial-of-service attacks, packet or IP spoofing, forged routing or electronic mail address information, or similar methods or technology;</li>
                <li>Disrupt, overburden, or aid or assist in the disruption or overburdening of any computer or server used to offer or support the Site;</li>
                <li>Probe, scan, or test the vulnerability of this Site or network or breach security or authentication measures without proper written authorization from Cooper AI;</li>
                <li>Upload any content to the Site that infringes any patent, trademark, trade secret, copyright, right of publicity, or other right of any person or entity, or that is unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another's privacy, tortious, obscene, offensive or profane; or</li>
                <li>Engage in any chain letters, contests, junk email, pyramid schemes, spamming, surveys, or other duplicative or unsolicited messages (commercial or otherwise).</li>
              </ul>

              <h3 className={h3Cls}>3.5. Third-Party Links and Integrations</h3>
              <p className={pCls}>
                The Site may contain links allowing you to leave the Site for other sites that are not under Cooper
                AI's control ("Third-Party Sites"). Cooper AI provides the Third-Party Sites to you only as a
                convenience and does not endorse any Third-Party Site. Cooper AI is not responsible for the contents
                or transmission of any Third-Party Site or any link contained in or accessible through a Third-Party
                Site or for ensuring that the Third-Party Site contains no errors or viruses. Your interactions with
                the Third-Party Site and the third-party provider of that site are solely between you and the third
                party. Your access and use of such Third-Party Site are also subject to the terms and conditions and
                privacy policies of the third-party provider, and not these Terms.
              </p>
            </section>

            {/* 04 */}
            <section id="s04" className={sectionCls}>
              <span className={numLabelCls}>04.</span>
              <h2 className={h2Cls}>Communication</h2>
              <p className={pCls}>
                If you opt into marketing calls and text messages, you agree to receive phone calls and text messages
                from us, and from our affiliates, agents, representatives, assigns, successors, and service
                providers, for marketing purposes related to Cooper AI's products and services. Consent is not a
                condition of any purchase. You understand that Cooper AI and the Messaging Parties may also contact
                you via calls and text messages for transactional reasons (e.g. account communications/invoicing).
                You understand that you may be contacted through use of automated telephone dialing systems,
                artificial or prerecorded voice message systems and text messaging systems.
              </p>
              <p className={pCls}>
                You can opt out of receiving calls and text messages at any time. To opt out of receiving calls and
                text messages, send us an email through{' '}
                <a href="mailto:support@askcooper.ai" className={linkCls}>support@askcooper.ai</a>; or, to stop text
                messages, reply "STOP". We will send you one final message to confirm that you have been
                unsubscribed and will process your request within a reasonable time after receipt, in accordance with
                applicable laws. Carriers are not liable for delayed or undelivered messages. Message frequency
                varies. Message and data rates may apply.
              </p>
              <p className={pCls}>
                You can unsubscribe from promotional email communications at any time by following the unsubscribe
                instructions in the email messages you receive from us. Note that you will continue to receive
                transaction-related emails regarding products or services you have requested.
              </p>
            </section>

            {/* 05 */}
            <section id="s05" className={sectionCls}>
              <span className={numLabelCls}>05.</span>
              <h2 className={h2Cls}>Failure to Comply with Terms; Termination</h2>
              <p className={pCls}>
                We may suspend or terminate your Account, and/or deny you access to the Site or your Account,
                without prior notice, if you engage in any conduct that we believe, in our sole discretion, (1)
                violates any part of these Terms, (2) violates our rights or those of third parties, (3) fails to
                comply with any laws or regulations, or (4) is inappropriate. These Terms will continue to apply
                even if you are suspended or terminated.
              </p>
              <p className={pCls}>
                If you do not otherwise have an MSA with us or an active Order Form for Services, we may also
                suspend or terminate your Account for lack of activity. In this case, you also have the right to
                terminate these Terms by reaching out to us at{' '}
                <a href="mailto:support@askcooper.ai" className={linkCls}>support@askcooper.ai</a> to deactivate
                your Account. Please note that there may be prerequisites to your ability to terminate depending on
                which Services you have accessed or used. See your MSA for more information.
              </p>
            </section>

            {/* 06 */}
            <section id="s06" className={sectionCls}>
              <span className={numLabelCls}>06.</span>
              <h2 className={h2Cls}>Legal Provisions</h2>

              <h3 className={h3Cls}>6.1. Disclaimer of Warranties</h3>
              <div className={capsBoxCls}>
                YOUR USE OF THE SITE IS AT YOUR OWN RISK. THE SITE, COOPER AI MATERIALS AND ALL OTHER FEATURES AND
                INFORMATION OFFERED VIA THE SITE, ALONG WITH ANY ADVICE OR INFORMATION (WHETHER ORAL OR WRITTEN)
                OBTAINED BY YOU FROM COOPER AI, ITS EMPLOYEES, AGENTS, SERVICE PROVIDERS, PARTNERS OR ANY OTHER
                PERSONS, ARE PROVIDED "AS IS," AND DOES NOT CREATE OR RESULT IN ANY WARRANTIES, EXPRESS OR IMPLIED,
                STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, TITLE, FITNESS
                FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. COOPER AI DOES NOT WARRANT THAT THE SITE WILL BE
                UNINTERRUPTED OR ERROR-FREE. COOPER AI RESERVES THE RIGHT TO CHANGE ANY PART OF THE SITE AT ANY
                TIME WITHOUT NOTICE.
              </div>

              <h3 className={h3Cls}>6.2. Indemnification</h3>
              <p className={pCls}>
                Except to the extent prohibited under applicable law, you agree to defend, indemnify, and hold
                harmless Cooper AI, its affiliates, third-party partners, and any of our or their respective
                officers, directors, employees, agents, subsidiaries, affiliates, and successors in interest against
                any and all claims, losses, costs and expenses (including reasonable attorneys' fees) by a third
                party arising from or relating to your use of the Site and/or Cooper AI Materials. You may not
                settle any such claim or matter without the prior written consent of Cooper AI.
              </p>

              <h3 className={h3Cls}>6.3. Limitation of Liabilities</h3>
              <div className={capsBoxCls}>
                EXCEPT WHERE PROHIBITED BY LAW, NEITHER COOPER AI, NOR ITS AFFILIATES, NOR EACH OF ITS OR THEIR
                RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, CONTRACTORS, SUCCESSORS OR ASSIGNS OF EACH,
                SHALL BE LIABLE TO YOU FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL OR PUNITIVE DAMAGES,
                INCLUDING LOST PROFITS, EVEN IF COOPER AI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                UNLESS OTHERWISE EXPRESSLY SET FORTH IN A WRITTEN AGREEMENT WITH YOU, OUR MAXIMUM LIABILITY FOR ALL
                CLAIMS ARISING OUT OF OR RELATING TO THE SITE OR COOPER AI MATERIALS, WHETHER IN CONTRACT, TORT OR
                OTHERWISE SHALL BE LIMITED TO ONE HUNDRED DOLLARS ($100).
              </div>
              <p className={pCls}>
                Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of
                liability for incidental or consequential damages. In such states, liability is limited to the extent
                permitted by law. To the extent that one or any aspect of the limitations set out above does not
                apply, all remaining aspects survive.
              </p>

              <h3 className={h3Cls}>6.4. Governing Law; Venue</h3>
              <p className={pCls}>
                These Terms and any dispute or claim arising out of, or related to, them or the Site will be
                governed by and construed in accordance with the laws of the State of California and the United
                States without regard to conflicts of law provisions thereof, and without regard to the United
                Nations Convention on Contracts for the International Sale of Goods. The jurisdiction and venue for
                actions related to the subject matter hereof will be the state and federal courts located in San
                Francisco, California, and both parties submit to the personal jurisdiction of such courts.
              </p>
              <div className={capsBoxCls}>
                BY AGREEING TO THESE TERMS AND USING THE SITE, YOU ALSO WAIVE THE RIGHT TO PARTICIPATE IN A CLASS
                ACTION IN CONNECTION WITH THE SITE OR COOPER AI MATERIALS. THE PARTIES AGREE THAT EACH MAY BRING
                CLAIMS AGAINST THE OTHER ONLY IN ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN
                ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </div>

              <h3 className={h3Cls}>6.5. Assignment</h3>
              <p className={pCls}>
                These Terms, and any rights and licenses granted hereunder, may not be transferred or assigned by
                you, but may be assigned by Cooper AI without restriction.
              </p>

              <h3 className={h3Cls}>6.6. Miscellaneous</h3>
              <p className={pCls}>
                Cooper AI's failure to enforce any provision of these Terms shall not be deemed a waiver of such
                provision nor of the right to enforce such provision. If any part of these Terms is determined to be
                invalid or unenforceable pursuant to applicable law, including, but not limited to, the warranty
                disclaimers and liability limitations set forth above, then the invalid or unenforceable provision
                will be deemed superseded by a valid, enforceable provision that most closely matches the intent of
                the original provision and the remainder of these Terms shall continue in effect.
              </p>
              <p className={pCls}>
                These Terms are the final, complete and exclusive agreement of the parties with respect to the
                subject matter hereof and supersedes and merges all prior discussions between the parties with
                respect to such subject matter, except that, as indicated above, in the event of a conflict between
                these Terms and the terms governing your use of the Services, the terms governing your use of the
                Services will prevail.
              </p>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  )
}
