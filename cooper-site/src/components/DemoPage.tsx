import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'
import { useMetaPixel } from '../hooks/use-meta-pixel'
import Turnstile from './Turnstile'

// Anti-spam + stopgap lead store.
// When both env vars are set, the form posts to the Cloudflare Worker
// (Turnstile-verified) instead of the team's API. Leave them empty and the
// form keeps posting to api.askcooper.ai exactly as before, so a deploy without
// the env vars never breaks the live form.
const DEMO_ENDPOINT = import.meta.env.VITE_DEMO_ENDPOINT as string | undefined
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
const USE_WORKER = Boolean(DEMO_ENDPOINT && TURNSTILE_SITE_KEY)

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

const reasons = [
  'Explore Cooper for my team',
  'See a specific use case',
  'Evaluate Cooper Enterprise',
  'Request professional services',
]

const testimonials = [
  {
    quote: 'Cooper is literally a magic wand.',
    name: 'Claims Examiner',
    role: 'Boutique claims TPA',
  },
  {
    quote: 'The coverage analysis is amazing, I absolutely love it. If we were to do that on our own, it would probably take five hours in itself.',
    name: 'Commercial Lines Account Manager',
    role: 'Independent retail agency',
  },
]

const stats = [
  { value: '18 hrs/wk', label: 'back to the team to sell' },
  { value: '93%', label: 'fewer re-entry errors' },
  { value: '4×', label: 'faster to first quote' },
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function DemoPage() {
  useSeo({
    title: 'Request a Demo — Cooper',
    description:
      'See Cooper in action with your own data. Book a personalized demo for your insurance team.',
    canonicalPath: '/demo',
    jsonLd: pageJsonLd({
      name: 'Request a Demo',
      path: '/demo',
      description: 'Book a personalized Cooper demo for your insurance team.',
    }),
  })

  const { trackLead, trackOpenAiLead } = useMetaPixel()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [reason, setReason] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  // Bumping this key remounts the widget to mint a fresh (single-use) token after a failed submit.
  const [captchaKey, setCaptchaKey] = useState(0)

  function handleNameBlur() {
    setNameError(!name.trim() ? 'Please enter your name.' : '')
  }

  function handleEmailBlur() {
    setEmailError(email && !isWorkEmail(email) ? 'Please use a work email address.' : '')
  }

  function handlePhoneBlur() {
    setPhoneError(phone && !isValidPhoneNumber(phone, 'US') ? 'Please enter a valid phone number.' : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true
    if (!name.trim()) { setNameError('Please enter your name.'); valid = false }
    if (!isWorkEmail(email)) { setEmailError('Please use a work email address.'); valid = false }
    if (!isValidPhoneNumber(phone, 'US')) { setPhoneError('Please enter a valid phone number.'); valid = false }
    if (USE_WORKER && !captchaToken) { setCaptchaError('Please complete the verification below.'); valid = false }
    if (!valid) return

    setNameError(''); setEmailError(''); setPhoneError(''); setCaptchaError('')
    setFormState('submitting')
    setErrorMsg('')

    const nameParts = name.trim().split(/\s+/)
    const noteParts: string[] = []
    if (company) noteParts.push(`Company: ${company}`)
    if (reason) noteParts.push(`Reason for demo: ${reason}`)

    // Extract GA4 client_id from _ga cookie (format: GA1.1.XXXXXXXXXX.XXXXXXXXXX)
    const gaCookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('_ga='))
    const gaParts = gaCookie?.split('=')[1]?.split('.')
    const gaClientId = gaParts && gaParts.length >= 4 ? `${gaParts[2]}.${gaParts[3]}` : ''

    const adParams = (() => {
      try { return JSON.parse(sessionStorage.getItem('cooper_ad_params') ?? '{}') as Record<string, string> } catch { return {} }
    })()

    // Click IDs — append to notes for Salesforce visibility (no dedicated SF fields yet)
    const CLICK_ID_KEYS = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id', 'twclid']
    const clickIds = CLICK_ID_KEYS.filter(k => adParams[k]).map(k => `${k}=${adParams[k]}`).join(' | ')
    if (clickIds) noteParts.push(`[Click IDs: ${clickIds}]`)

    const eventId = crypto.randomUUID()
    const payload = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(' '),
      email,
      phone,
      message: noteParts.join('\n\n'),
      event_id: eventId,
      event_source_url: window.location.href,
      ga_client_id: gaClientId,
      utm_source: adParams.utm_source ?? '',
      utm_medium: adParams.utm_medium ?? '',
      utm_campaign: adParams.utm_campaign ?? '',
      utm_term: adParams.utm_term ?? '',
      utm_content: adParams.utm_content ?? '',
      gclid: adParams.gclid ?? '',
      fbclid: adParams.fbclid ?? '',
      msclkid: adParams.msclkid ?? '',
      ttclid: adParams.ttclid ?? '',
      li_fat_id: adParams.li_fat_id ?? '',
      twclid: adParams.twclid ?? '',
    }

    try {
      let res: Response
      if (USE_WORKER) {
        // Stopgap: Turnstile-verified Cloudflare Worker → D1.
        res = await fetch(DEMO_ENDPOINT as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, turnstile_token: captchaToken }),
        })
      } else {
        // Default: post straight to the team's API (original behavior).
        res = await fetch(`https://api.askcooper.ai/api/v1/demo-requests/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFormState('success')
      trackLead(eventId)
      trackOpenAiLead()
    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again or email us at contact@askcooper.ai.')
      // Turnstile tokens are single-use — mint a fresh one for the retry.
      if (USE_WORKER) {
        setCaptchaToken('')
        setCaptchaKey((k) => k + 1)
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream-light flex flex-col lg:flex-row">
      {/* ── Left side: Form ── (centered on tablet so it isn't jammed left with an empty right third) */}
      <div className="w-full max-w-full md:max-w-[560px] md:mx-auto lg:max-w-[680px] lg:mx-0 lg:flex-1 flex flex-col px-5 md:px-12 lg:px-[80px] py-[48px]">
        {/* Logo + back */}
        <div className="flex items-center gap-[16px] mb-[60px]">
          <Link to="/" className="flex items-center no-underline">
            <img src="/images/cooper-logo-full.svg" alt="Cooper" className="h-[26px] w-auto" />
          </Link>
          <span className="text-dark/20">|</span>
          <Link to="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1">
          {formState !== 'success' ? (
            <>
              <h1 className="font-serif text-[26px] md:text-[34px] lg:text-[36px] leading-[1.2] text-dark mb-[12px]">
                Book a Cooper demo
              </h1>
              <p className="font-sans text-[16px] leading-[1.6] text-dark/50 mb-[40px] max-w-[440px]">
                Schedule a 1:1 session with an insurance AI expert from our team. We'll show you Cooper with your own workflows, no generic demo.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[20px] max-w-[440px]">
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
                  {nameError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{nameError}</p>}
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
                  {emailError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{emailError}</p>}
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
                  {phoneError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{phoneError}</p>}
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Insurance"
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[6px] block">Reason for demo</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full font-sans text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="" disabled>Select a reason...</option>
                    {reasons.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {USE_WORKER && TURNSTILE_SITE_KEY && (
                  <div>
                    <Turnstile
                      key={captchaKey}
                      siteKey={TURNSTILE_SITE_KEY}
                      onToken={(t) => { setCaptchaToken(t); setCaptchaError('') }}
                      onExpire={() => setCaptchaToken('')}
                    />
                    {captchaError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{captchaError}</p>}
                  </div>
                )}

                {formState === 'error' && (
                  <p className="font-sans text-[13px] text-red-500">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full font-sans font-medium text-[15px] text-cream-light bg-accent-orange rounded-[8px] px-[24px] py-[14px] mt-[8px] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {formState === 'submitting' ? 'Sending...' : 'Book a demo'}
                </button>

                <p className="font-sans text-[12px] text-dark/30 leading-[1.5]">
                  By submitting this form you agree to our{' '}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>
                  . We'll reach out within 1-2 business days.
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
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="font-sans text-[13px] font-medium text-dark">{t.name}</div>
                <div className="font-sans text-[12px] text-dark/40">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Security badges — same seals as the desktop Security & compliance section */}
        <div className="flex flex-wrap gap-[12px]">
          {[
            { label: 'SOC 2', icon: '/images/icon-soc2.webp' },
            { label: 'HIPAA', icon: '/images/icon-hipaa.webp' },
          ].map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-[10px] font-grotesk text-[12px] tracking-[1px] uppercase text-dark/40 border border-dark/[0.08] rounded-[8px] px-[14px] py-[8px]"
            >
              <img src={badge.icon} alt="" className="h-[40px] w-[40px] object-contain opacity-70" />
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
