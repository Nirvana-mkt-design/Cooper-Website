import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from './Navbar'
import Footer from './Footer'

const linkCls =
  'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors break-words'
const pCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px]'
const h2Cls = 'font-serif text-[22px] md:text-[26px] text-dark mt-[40px] mb-[20px]'
const h3Cls = 'font-sans font-semibold text-[16px] text-dark mb-[12px] mt-[28px]'
const listCls = 'font-sans text-[15px] leading-[1.75] text-dark/60 mb-[16px] pl-[22px] space-y-[6px]'

interface LegalDocPageProps {
  /** Eyebrow label above the title. */
  eyebrow?: string
  title: string
  /** Optional qualifier shown under the title (e.g. a scope note). */
  subtitle?: string
  effectiveDate: string
  /** Raw markdown string (imported with Vite's `?raw` suffix). */
  content: string
}

export default function LegalDocPage({ eyebrow = 'Legal', title, subtitle, effectiveDate, content }: LegalDocPageProps) {
  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* Hero */}
      <section className="bg-cream pt-[120px] pb-[64px]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px]">
          <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-accent-orange mb-[12px] block animate-fade-blur-in">
            {eyebrow}
          </span>
          <h1
            className="font-serif text-[40px] md:text-[52px] leading-[1.1] tracking-[-1px] text-dark mb-[20px] animate-fade-blur-in"
            style={{ animationDelay: '0.05s' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="font-sans text-[16px] leading-[1.5] text-dark/60 mb-[16px] max-w-[640px] animate-fade-blur-in"
              style={{ animationDelay: '0.08s' }}
            >
              {subtitle}
            </p>
          )}
          <div
            className="font-sans text-[14px] text-dark/40 animate-fade-blur-in"
            style={{ animationDelay: '0.1s' }}
          >
            Effective: {effectiveDate}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 lg:px-[85px] py-[64px] lg:py-[80px]">
        <article className="max-w-[900px]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
              h2: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
              h3: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
              h4: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
              p: ({ children }) => <p className={pCls}>{children}</p>,
              ul: ({ children }) => <ul className={`${listCls} list-disc`}>{children}</ul>,
              ol: ({ children }) => <ol className={`${listCls} list-decimal`}>{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-medium text-dark/80">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              a: ({ href, children }) => (
                <a href={href} className={linkCls}>
                  {children}
                </a>
              ),
              hr: () => <hr className="my-[32px] border-dark/[0.08]" />,
              table: ({ children }) => (
                <div className="w-full overflow-x-auto my-[24px]">
                  <table className="w-full min-w-[580px] border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead>{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-dark/[0.08]">{children}</tr>,
              th: ({ children }) => (
                <th className="font-grotesk text-[11px] font-medium tracking-[1px] uppercase text-dark/60 text-left px-[16px] py-[12px]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="font-sans text-[14px] text-dark/70 align-top px-[16px] py-[12px]">{children}</td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>

      <Footer />
    </div>
  )
}
