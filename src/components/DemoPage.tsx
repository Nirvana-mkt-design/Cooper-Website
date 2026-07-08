import { useState } from 'react'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useMetaPixel } from '../hooks/use-meta-pixel'

declare global {
  interface Window {
    oaiq?: ((...args: unknown[]) => void) & { q?: unknown[] }
  }
}

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'mail.com', 'gmx.com', 'gmx.net', 'inbox.com',
])

function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

type FormState = 'idle' | 'sending_code' | 'code_sent' | 'submitting' | 'success' | 'error'

const testimonials = [
  {
    quote: 'Cooper transformed how we process submissions. What took hours now takes minutes.',
    name: 'Rushil Goel',
    role: 'CEO, Nirvana Insurance',
    photo: '/images/testimonial-rushil.png',
  },
  {
    quote: 'Our producers doubled their submission volume without adding headcount.',
    name: 'Sarah Chen',
    role: 'VP Operations, Apex Brokerage',
    photo: '/images/testimonial-sarah.jpg',
  },
]

const stats = [
  { value: '25h', label: 'saved monthly per producer' },
  { value: '17%', label: 'more bound premium' },
  { value: '3x', label: 'faster submissions' },
]

const trustedBy = ['Hartford', 'Travelers', 'Chubb', 'Zurich', 'Nationwide']

const HEAR_ABOUT_US = [
  'Facebook/Instagram',
  'LinkedIn',
  'Google Search',
  'Referral',
  'Event/Conferences',
  'Press/News Article',
  'Other',
]

export default function DemoPage() {
  const { trackLead } = useMetaPixel()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [hearAbout, setHearAbout] = useState('')
  const [code, setCode] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  function handleNameBlur() {
    setNameError(!name.trim() ? 'Please enter your name.' : '')
  }

  function handleEmailBlur() {
    setEmailError(email && !isWorkEmail(email) ? 'Please use a work email address.' : '')
  }

  function handlePhoneBlur() {
    setPhoneError(phone && !isValidPhoneNumber(phone) ? 'Please enter a valid phone number with country code (e.g. +1 555 000 0000).' : '')
  }

  const apiOrigin = 'https://api.askcooper.ai'

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    let valid = true
    if (!name.trim()) { setNameError('Please enter your name.'); valid = false }
    if (!isWorkEmail(email)) { setEmailError('Please use a work email address.'); valid = false }
    if (!isValidPhoneNumber(phone)) { setPhoneError('Please enter a valid phone number with country code (e.g. +1 555 000 0000).'); valid = false }
    if (!valid) return
    setNameError(''); setEmailError(''); setPhoneError('')
    setFormState('sending_code')
    setErrorMsg('')
    try {
      const res = await fetch(`${apiOrigin}/api/v1/demo-requests/send-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFormState('code_sent')
    } catch {
      setFormState('idle')
      setErrorMsg('Failed to send verification code. Please try again.')
    }
  }

  async function handleVerifyAndSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setFormState('submitting')
    setErrorMsg('')

    const nameParts = name.trim().split(/\s+/)
    const noteParts: string[] = []
    if (hearAbout) noteParts.push(`How did you hear about us: ${hearAbout}`)
    const adParamsRaw = sessionStorage.getItem('cooper_ad_params')
    if (adParamsRaw) {
      try {
        const adParams = JSON.parse(adParamsRaw) as Record<string, string>
        noteParts.push(`[Ad attribution: ${Object.entries(adParams).map(([k, v]) => `${k}=${v}`).join(' | ')}]`)
      } catch { /* ignore */ }
    }

    const eventId = crypto.randomUUID()
    try {
      const res = await fetch(`${apiOrigin}/api/v1/demo-requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: nameParts[0],
          last_name: nameParts.slice(1).join(' '),
          email,
          phone,
          code,
          message: noteParts.join('\n\n'),
        }),
      })
      if (!res.ok) {
        if (res.status === 422) {
          setFormState('code_sent')
          setErrorMsg('Invalid or expired code. Please check and try again.')
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }
      setFormState('success')
      trackLead(eventId)
      window.oaiq?.('measure', 'lead_created', { type: 'customer_action' })
    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again or email us at contact@askcooper.ai.')
    }
  }

  return (
    <div className="min-h-screen bg-cream-light flex">
      {/* ── Left side: Form ── */}
      <div className="flex-1 flex flex-col px-[80px] py-[48px] max-w-[680px]">
        {/* Logo + back */}
        <div className="flex items-center gap-[16px] mb-[60px]">
          <a href="/" className="flex items-center gap-[8px] no-underline">
            <img src="/images/cooper-icon.svg" alt="" className="w-[32px] h-[32px]" />
            <span className="font-serif text-[22px] text-dark">Cooper</span>
          </a>
          <span className="text-dark/20">|</span>
          <a href="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            ← Back to home
          </a>
        </div>

        {/* Form area */}
        <div className="flex-1">
          {formState !== 'success' ? (
            <>
              <h1 className="font-serif text-[36px] leading-[1.2] text-dark mb-[12px]">
                Book a Cooper demo
              </h1>
              <p className="font-sans text-[16px] leading-[1.6] text-dark/50 mb-[40px] max-w-[440px]">
                Schedule a 1:1 session with an insurance AI expert from our team. We'll show you Cooper with your own workflows - no generic demo.
              </p>

              {formState === 'code_sent' || formState === 'submitting' ? (
                /* Step 2: verify code */
                <form onSubmit={handleVerifyAndSubmit} noValidate className="flex flex-col gap-[20px] max-w-[440px]">
                  <p className="font-sans text-[15px] text-dark/60 leading-[1.6]">
                    We sent a 6-digit code to <strong className="text-dark">{phone}</strong>. Enter it below to confirm your number.
                  </p>
                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Verification code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      required
                      autoComplete="one-time-code"
                      className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                    />
                  </div>
                  {errorMsg && <p className="font-sans text-[13px] text-accent-red">{errorMsg}</p>}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full font-sans font-medium text-[15px] text-cream-light bg-accent-orange rounded-[8px] px-[24px] py-[14px] mt-[8px] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {formState === 'submitting' ? 'Submitting…' : 'Verify and submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormState('idle'); setCode(''); setErrorMsg('') }}
                    className="font-sans text-[13px] text-dark/40 hover:text-dark/70 underline bg-none border-none cursor-pointer transition-colors"
                  >
                    Edit details or resend code
                  </button>
                </form>
              ) : (
                /* Step 1: collect details */
                <form onSubmit={handleSendCode} noValidate className="flex flex-col gap-[20px] max-w-[440px]">
                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleNameBlur}
                      placeholder="Jane Smith"
                      required
                      className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                    />
                    {nameError && <p className="font-sans text-[12px] text-accent-red mt-[4px]">{nameError}</p>}
                  </div>

                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Work email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                      onBlur={handleEmailBlur}
                      placeholder="jane@company.com"
                      required
                      className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                    />
                    {emailError && <p className="font-sans text-[12px] text-accent-red mt-[4px]">{emailError}</p>}
                  </div>

                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError('') }}
                      onBlur={handlePhoneBlur}
                      placeholder="+1 (555) 000-0000"
                      required
                      autoComplete="tel"
                      className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                    />
                    {phoneError && <p className="font-sans text-[12px] text-accent-red mt-[4px]">{phoneError}</p>}
                  </div>

                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">
                      How did you hear about us? <span className="font-normal text-dark/30">(optional)</span>
                    </label>
                    <select
                      value={hearAbout}
                      onChange={(e) => setHearAbout(e.target.value)}
                      className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                    >
                      <option value="">Select one...</option>
                      {HEAR_ABOUT_US.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {errorMsg && (
                    <p className="font-sans text-[13px] text-accent-red">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'sending_code'}
                    className="w-full font-sans font-medium text-[15px] text-cream-light bg-accent-orange rounded-[8px] px-[24px] py-[14px] mt-[8px] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {formState === 'sending_code' ? 'Sending code…' : 'Continue'}
                  </button>

                  <p className="font-sans text-[12px] text-dark/30 leading-[1.5]">
                    By submitting this form, you agree to our privacy policy and consent to receiving communications from Cooper.
                  </p>
                </form>
              )}
            </>
          ) : (
            /* Success state — Calendly embed placeholder */
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-accent-orange/10 flex items-center justify-center mb-[24px]">
                <svg viewBox="0 0 24 24" className="w-[28px] h-[28px] text-accent-orange" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <h2 className="font-serif text-[28px] text-dark mb-[12px]">You're all set, {name.split(' ')[0]}!</h2>
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
              <a href="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 mt-[24px] no-underline transition-colors">
                ← Back to home
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Right side: Social proof ── */}
      <div className="flex-1 bg-cream relative overflow-hidden flex flex-col justify-center px-[60px] py-[48px]">
        {/* Decorative accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-accent-orange" />

        {/* Stats */}
        <div className="mb-[48px]">
          <p className="font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase text-dark/40 mb-[24px]">
            Impact
          </p>
          <div className="flex gap-[40px]">
            {stats.map((s) => (
              <div key={s.value}>
                <div className="font-serif text-[36px] text-dark leading-[1]">{s.value}</div>
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

        {/* Trusted by */}
        <div>
          <p className="font-grotesk font-medium text-[11px] tracking-[1.1px] uppercase text-dark/40 mb-[14px]">
            Trusted by leading carriers
          </p>
          <div className="flex gap-[20px] flex-wrap">
            {trustedBy.map((name) => (
              <span key={name} className="font-sans text-[14px] text-dark/30 font-medium">{name}</span>
            ))}
          </div>
        </div>

        {/* Security badges */}
        <div className="flex gap-[16px] mt-[32px]">
          {['SOC 2', 'HIPAA', 'SSO'].map((badge) => (
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
