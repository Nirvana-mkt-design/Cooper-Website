import { useState } from 'react'
import { Link } from 'react-router-dom'

const reasons = [
  'Explore Cooper for my team',
  'See a specific use case',
  'Evaluate Cooper Enterprise',
  'Request professional services',
]

const testimonials = [
  {
    quote: 'The policy comparison alone saves us 15 hours a week. Cooper reads every document and gives us clean side-by-side breakdowns.',
    name: 'James Mitchell',
    role: 'Head of Underwriting, Trident MGA',
    photo: '/images/testimonial-james.webp',
  },
  {
    quote: 'Cooper caught coverage gaps we had been missing for months. Our loss ratio improved and our clients noticed immediately.',
    name: 'Maria Santos',
    role: 'Managing Director, Lighthouse Re',
    photo: '/images/testimonial-maria.webp',
  },
]

const stats = [
  { value: '8.5 hrs', label: 'Selling time back per producer' },
  { value: '95%', label: 'Fewer manual re-entry errors' },
  { value: '12×', label: 'Faster submission-to-market' },
]

export default function DemoPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream-light flex flex-col lg:flex-row">
      {/* ── Left side: Form ── */}
      <div className="w-full lg:flex-1 flex flex-col px-5 md:px-12 lg:px-[80px] py-[48px] max-w-full lg:max-w-[680px]">
        {/* Logo + back */}
        <div className="flex items-center gap-[16px] mb-[60px]">
          <Link to="/" className="flex items-center gap-[8px] no-underline">
            <img src="/images/cooper-icon.svg" alt="" className="w-[32px] h-[32px]" />
            <span className="font-serif text-[22px] text-dark">Cooper</span>
          </Link>
          <span className="text-dark/20">|</span>
          <Link to="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1">
          {!submitted ? (
            <>
              <h1 className="font-serif text-[26px] md:text-[34px] lg:text-[36px] leading-[1.2] text-dark mb-[12px]">
                Book a Cooper demo
              </h1>
              <p className="font-sans text-[16px] leading-[1.6] text-dark/50 mb-[40px] max-w-[440px]">
                Schedule a 1:1 session with an insurance AI expert from our team. We'll show you Cooper with your own workflows, no generic demo.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] max-w-[440px]">
                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Insurance"
                    required
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Reason for demo</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="" disabled>Select a reason...</option>
                    {reasons.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full font-sans font-medium text-[15px] text-cream-light bg-accent-orange rounded-[8px] px-[24px] py-[14px] mt-[8px] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Book a demo
                </button>

                <p className="font-sans text-[12px] text-dark/30 leading-[1.5]">
                  By submitting this form, you agree to our privacy policy and consent to receiving communications from Cooper.
                </p>
              </form>
            </>
          ) : (
            /* Success state — Calendly embed placeholder */
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-accent-orange/10 flex items-center justify-center mb-[24px]">
                <svg viewBox="0 0 24 24" className="w-[28px] h-[28px] text-accent-orange" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <h2 className="font-serif text-[22px] md:text-[28px] text-dark mb-[12px]">You're all set, {name.split(' ')[0]}!</h2>
              <p className="font-sans text-[16px] text-dark/50 mb-[32px] max-w-[380px]">
                We'll reach out to <strong className="text-dark/70">{email}</strong> shortly to schedule your personalized demo.
              </p>
              <div className="w-full max-w-[440px] bg-white border border-dark/[0.08] rounded-[12px] p-[32px] text-left">
                <p className="font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase text-dark/40 mb-[16px]">
                  What happens next
                </p>
                <div className="flex flex-col gap-[16px]">
                  {['Our team reviews your request', 'We match you with an insurance AI expert', 'You get a personalized demo with your workflows'].map((step, i) => (
                    <div key={i} className="flex items-start gap-[12px]">
                      <div className="w-[24px] h-[24px] rounded-full bg-accent-orange/10 flex items-center justify-center shrink-0 mt-[1px]">
                        <span className="font-sans text-[12px] font-medium text-accent-orange">{i + 1}</span>
                      </div>
                      <span className="font-sans text-[14px] text-dark/70">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 mt-[24px] no-underline transition-colors">
                ← Back to home
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Right side: Social proof ── */}
      <div className="w-full lg:flex-1 bg-cream relative overflow-hidden flex flex-col justify-center px-5 md:px-10 lg:px-[60px] py-[48px]">
        {/* Decorative accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-accent-orange" />

        {/* Stats */}
        <div className="mb-[48px]">
          <p className="font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase text-dark/40 mb-[24px]">
            Impact
          </p>
          <div className="flex flex-wrap gap-6 md:gap-[40px]">
            {stats.map((s) => (
              <div key={s.value}>
                <div className="font-serif text-[28px] md:text-[36px] text-dark leading-[1]">{s.value}</div>
                <div className="font-sans text-[13px] text-dark/40 mt-[6px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex flex-col gap-[24px] mb-[48px]">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-cream-light border border-dark/[0.08] rounded-[12px] p-[24px]"
            >
              <p className="font-serif text-[16px] leading-[1.5] text-dark/80 mb-[16px] italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-[12px]">
                <img
                  src={t.photo}
                  alt=""
                  className="w-[36px] h-[36px] rounded-full object-cover"
                  style={{ filter: 'grayscale(40%)' }}
                />
                <div>
                  <div className="font-sans text-[13px] font-medium text-dark">{t.name}</div>
                  <div className="font-sans text-[12px] text-dark/40">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div className="flex gap-[16px]">
          {['SOC 2', 'HIPAA'].map((badge) => (
            <span
              key={badge}
              className="font-grotesk text-[10px] tracking-[1px] uppercase text-dark/30 border border-dark/[0.08] rounded-[4px] px-[10px] py-[4px]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
