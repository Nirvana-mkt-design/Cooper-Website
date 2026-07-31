import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'
import { useMetaPixel } from '../hooks/use-meta-pixel'
import { useGoogleAds } from '../hooks/use-google-ads'
import { EMPLOYEE_COUNTS, BOOK_OF_BUSINESS_BUCKETS, SOFTWARE_BUDGET_BUCKETS } from '../lib/conversions'
import Turnstile from './Turnstile'
// Demo requests post to the Cooper API, which verifies the Turnstile token,
// rate-limits, and enqueues a POST to our Zapier lead webhook (see
// backend/apps/core/demo_requests). The origin, captcha config, work-email
// rule and E.164 helper are shared with the ROI calculator's gate — see
// src/lib/leads.ts.
import { API_ORIGIN, TURNSTILE_SITE_KEY, USE_TURNSTILE, isWorkEmail, leadPayload } from '../lib/leads'

// Twilio Verify (SMS phone verification). When 'true', the form runs a two-step
// flow: send an SMS code, then verify it on submit. The backend enforces it when
// Twilio is configured server-side. Unset (dev) → single step, no code.
const USE_PHONE_VERIFICATION = import.meta.env.VITE_PHONE_VERIFICATION === 'true'

// Qualification-question dropdown options are defined in `conversions.ts`
// so the lead-value lookup table can be exhaustively typed on them.
const BOOK_OF_BUSINESS = BOOK_OF_BUSINESS_BUCKETS
const SOFTWARE_BUDGET = SOFTWARE_BUDGET_BUCKETS

const HEAR_ABOUT_US = [
  'Facebook/Instagram',
  'LinkedIn',
  'Google Search',
  'Referral',
  'Event/Conferences',
  'Press/News Article',
  'Other',
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
  { value: '$65M+', label: 'in premiums processed' },
  { value: '4×', label: 'faster to first quote' },
  { value: '99.2%', label: 'form fill accuracy' },
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
  const { trackGoogleLead } = useGoogleAds()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [bookOfBusiness, setBookOfBusiness] = useState('')
  const [softwareBudget, setSoftwareBudget] = useState('')
  const [bookOfBusinessError, setBookOfBusinessError] = useState('')
  const [softwareBudgetError, setSoftwareBudgetError] = useState('')
  const [phone, setPhone] = useState('')
  const [hearAbout, setHearAbout] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [companyError, setCompanyError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  // Bumping this key remounts the widget to mint a fresh (single-use) token after a failed submit.
  const [captchaKey, setCaptchaKey] = useState(0)
  // Form is a multi-step flow. 'details' is always shown; 'qualify' is a
  // follow-up shown only to small/unknown prospects (see needsQualifying below)
  // that captures book of business + software budget before we complete the
  // submission; 'verify' collects the SMS code and is only reached under
  // USE_PHONE_VERIFICATION.
  const [step, setStep] = useState<'details' | 'qualify' | 'verify'>('details')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  // Meta Lead event id — minted once per form session (not per submit attempt).
  // If a submit enqueues the lead but the response is lost, the user retries and
  // must reuse the same id: the server-side CAPI copy dedupes against the pixel
  // Lead fire on event_id, and a fresh id per attempt would count two conversions
  // (the email rate limit permits the retry; Meta has no email-based fallback).
  const eventIdRef = useRef<string>(crypto.randomUUID())

  // When the step changes, jump the viewport back to the top so the new step's
  // first field is visible — otherwise on mobile the user lands mid-page at
  // wherever the previous step's submit button was.
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [step])

  function handleNameBlur() {
    setNameError(!name.trim() ? 'Please enter your name.' : '')
  }

  function handleEmailBlur() {
    setEmailError(email && !isWorkEmail(email) ? 'Please use a work email address.' : '')
  }

  function handleCompanyBlur() {
    setCompanyError(!company.trim() ? 'Please enter your company name.' : '')
  }

  function handlePhoneBlur() {
    setPhoneError(phone && !isValidPhoneNumber(phone, 'US') ? 'Please enter a valid phone number.' : '')
  }

  // Only ask book-of-business / software-budget when the prospect is small or
  // didn't tell us their headcount. Larger orgs (11+) skip the qualifying step
  // so we don't add friction where it doesn't help sales prioritize.
  const needsQualifying = !employeeCount || employeeCount === '1-5' || employeeCount === '6-10'

  // Both qualifying questions are required once the qualify step is shown.
  function validateQualify(): boolean {
    let valid = true
    if (!bookOfBusiness) { setBookOfBusinessError('Please select an option.'); valid = false }
    if (!softwareBudget) { setSoftwareBudgetError('Please select an option.'); valid = false }
    return valid
  }

  function validateDetails(): boolean {
    let valid = true
    if (!name.trim()) { setNameError('Please enter your name.'); valid = false }
    if (!isWorkEmail(email)) { setEmailError('Please use a work email address.'); valid = false }
    if (!company.trim()) { setCompanyError('Please enter your company name.'); valid = false }
    if (!isValidPhoneNumber(phone, 'US')) { setPhoneError('Please enter a valid phone number.'); valid = false }
    return valid
  }

  // The lead fields shared by both requests. Sent to /send-code/ too, so the
  // backend captures the lead (flagged unverified) before the prospect verifies —
  // abandoned leads aren't lost. Marketing attribution (utm_* + ad click IDs) is
  // best-effort, absent when the visitor arrived without campaign params.
  // leadPayload owns the shape every lead shares (trim, E.164, attribution,
  // Meta cookies); the qualification answers below are demo-form-only.
  function collectLeadFields() {
    return {
      ...leadPayload({ full_name: name, email, company, phone }),
      number_of_employees: employeeCount,
      annual_book_of_business: bookOfBusiness,
      annual_software_budget: softwareBudget,
      how_heard_about_us: hearAbout,
    }
  }

  // Single-use Turnstile tokens are consumed by every /send-code/ POST, so any
  // step-transition that leaves a step which still needs a captcha must mint a
  // fresh one. Centralised so no back button forgets it.
  function resetCaptcha() {
    if (!USE_TURNSTILE) return
    setCaptchaToken('')
    setCaptchaKey((k) => k + 1)
  }

  // Step 1 (phone-verification flow): capture the lead in Zapier and — unless
  // we're deferring the SMS to the qualify step — text the code. The captcha is
  // verified server-side here; send-code is the bot gate since it writes the
  // (unverified) lead and can trigger the SMS.
  //
  // For small/unknown prospects (needsQualifying) we call send-code twice:
  //   1. details submit → defer_sms=true: fires Zap with the (partial) lead
  //      but doesn't text yet, so we don't SMS someone who's about to answer
  //      qualifying questions.
  //   2. qualify submit → defer_sms=false: fires Zap again with the qualifying
  //      answers included and finally sends the SMS.
  // Larger prospects skip the qualify step and get the SMS immediately at
  // details submit. Turnstile tokens are single-use, so the widget is remounted
  // between the two calls (see showTurnstile below).
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    let valid = true
    if (step === 'details' && !validateDetails()) valid = false
    if (step === 'qualify' && !validateQualify()) valid = false
    if (USE_TURNSTILE && !captchaToken) {
      setCaptchaError('Please complete the verification below.')
      valid = false
    }
    if (!valid) return
    setNameError(''); setEmailError(''); setCompanyError(''); setPhoneError(''); setCaptchaError('')
    setBookOfBusinessError(''); setSoftwareBudgetError('')

    // Details submit for small/unknown prospects: capture the lead but hold the
    // SMS until they finish qualifying.
    const deferSms = step === 'details' && needsQualifying

    setFormState('submitting')
    setErrorMsg('')
    try {
      const res = await fetch(`${API_ORIGIN}/api/v1/demo-requests/send-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collectLeadFields(),
          turnstile_token: captchaToken,
          defer_sms: deferSms,
        }),
      })
      if (!res.ok) {
        // Distinct copy for rate limits so a 429 doesn't blame the phone number.
        if (res.status === 429) {
          setFormState('error')
          setErrorMsg('You\u2019ve made too many attempts. Please wait a bit and try again.')
          resetCaptcha()
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }
      setStep(deferSms ? 'qualify' : 'verify')
      setFormState('idle')
      // Only remount when the next step needs a fresh token (details → qualify).
      // Advancing to verify doesn't POST anything else until completion, and the
      // completion request skips Turnstile once the SMS code has been checked,
      // so clearing the token there would strand USE_PHONE_VERIFICATION-only
      // deploys (Twilio unset) with a permanently-empty token on the final POST.
      if (deferSms) resetCaptcha()
    } catch {
      setFormState('error')
      setErrorMsg(deferSms
        ? 'Something went wrong. Please try again.'
        : 'Could not send the verification code. Check the number and try again.')
      // Retry needs a fresh single-use token either way.
      resetCaptcha()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Single-step flow: on the details step, gate on qualify first for small/
    // unknown prospects — same shape as handleSendCode's detailsToQualify hop.
    const detailsToQualify = !USE_PHONE_VERIFICATION && step === 'details' && needsQualifying
    let valid = true
    // In the single-step flow, details are validated here; in the two-step flow
    // they were already validated before the code was sent.
    if (!USE_PHONE_VERIFICATION && step === 'details' && !validateDetails()) valid = false
    if (!USE_PHONE_VERIFICATION && step === 'qualify' && !validateQualify()) valid = false
    if (USE_PHONE_VERIFICATION && !code.trim()) { setCodeError('Enter the code we texted you.'); valid = false }
    // Two-step flow solves the captcha at step 1 (send-code); only the single-step
    // flow needs a token here. The details→qualify hop is client-side, so no token
    // is required until the qualify step.
    if (USE_TURNSTILE && !USE_PHONE_VERIFICATION && !detailsToQualify && !captchaToken) { setCaptchaError('Please complete the verification below.'); valid = false }
    if (!valid) return

    setNameError(''); setEmailError(''); setCompanyError(''); setPhoneError(''); setCaptchaError(''); setCodeError('')
    setBookOfBusinessError(''); setSoftwareBudgetError('')
    if (detailsToQualify) {
      setStep('qualify')
      return
    }
    setFormState('submitting')
    setErrorMsg('')

    const eventId = eventIdRef.current
    // The API verifies the Turnstile token + SMS code, then forwards the lead to
    // our Zapier webhook (which owns qualification/dedupe and the CRM write).
    const payload = {
      ...collectLeadFields(),
      turnstile_token: captchaToken,
      code: code.trim(),
      // Same UUID as the Meta Pixel Lead fire below, so Meta dedupes the
      // browser pixel event against the server-side CAPI event the backend
      // fires from the demo-request workflow.
      event_id: eventId,
    }

    try {
      const res = await fetch(`${API_ORIGIN}/api/v1/demo-requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        // Invalid/expired SMS code — let them fix it without losing the form.
        if (USE_PHONE_VERIFICATION && res.status === 422) {
          setFormState('idle')
          setCodeError('That code is invalid or expired. Try again or resend it.')
          if (USE_TURNSTILE) { setCaptchaToken(''); setCaptchaKey((k) => k + 1) }
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }
      setFormState('success')
      trackLead(eventId, employeeCount, bookOfBusiness, softwareBudget)
      trackOpenAiLead(employeeCount, bookOfBusiness, softwareBudget)
      trackGoogleLead({
        employeeCount,
        bookOfBusiness,
        softwareBudget,
        email,
        phone: payload.phone,
        eventId,
      })
    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again or email us at contact@askcooper.ai.')
      // Turnstile tokens are single-use — mint a fresh one for the retry.
      if (USE_TURNSTILE) {
        setCaptchaToken('')
        setCaptchaKey((k) => k + 1)
      }
    }
  }

  const showDetails = step === 'details'
  const showQualify = step === 'qualify'
  const showVerify = USE_PHONE_VERIFICATION && step === 'verify'
  // Captcha lives on every step that POSTs to the API:
  // - two-step flow: details always (send-code fires there for everyone) and
  //   qualify for small prospects (a second send-code fires there, this time
  //   actually sending the SMS — tokens are single-use so we need a fresh one)
  // - single-step flow: details if the user is skipping qualify, otherwise
  //   qualify (that's the final pre-submit screen)
  // - never on verify (SMS is the second factor)
  const showTurnstile =
    USE_TURNSTILE &&
    (USE_PHONE_VERIFICATION
      ? showDetails || showQualify
      : showQualify || (showDetails && !needsQualifying))
  // Non-terminal buttons (details → qualify hop for small prospects, and the
  // qualify → verify hop in the two-step flow) advance the flow rather than
  // submitting the lead — label them "Continue" so users don't think they're
  // done. The final-submit label depends on flow (single-step vs SMS).
  const isFinalSubmit =
    showVerify || (!needsQualifying && showDetails) || (!USE_PHONE_VERIFICATION && showQualify)
  const submitLabel = showVerify
    ? 'Verify'
    : !isFinalSubmit
      ? 'Continue'
      : USE_PHONE_VERIFICATION
        ? 'Submit'
        : 'Book a demo'
  // Consent notice belongs next to the button that actually POSTs the lead —
  // hiding it on qualify was correct for the two-step flow (SMS is the real
  // send there and the consent line moves to the verify step) but wrong for
  // the single-step flow, where qualify IS the submitting step.
  // Consent notice belongs next to the button that actually POSTs the lead —
  // details (initial capture), and qualify when it's the terminal submit in
  // the single-step flow. The verify step is just entering an SMS code, no new
  // form data leaves the browser, so the notice would be misleading there.
  const showConsent = showDetails || (!USE_PHONE_VERIFICATION && showQualify)

  return (
    <div className="min-h-dvh bg-cream-light flex flex-col lg:flex-row overflow-x-hidden [padding-bottom:env(safe-area-inset-bottom)]">
      {/* ── Left side: Form ── (centered on tablet so it isn't jammed left with an empty right third) */}
      <div className="w-full max-w-full md:max-w-[560px] md:mx-auto lg:max-w-[680px] lg:mx-0 lg:flex-1 flex flex-col px-5 md:px-12 lg:px-[80px] pt-[24px] pb-[32px] md:py-[48px]">
        {/* Logo + back */}
        <div className="flex items-center gap-[16px] mb-[16px] lg:mb-[32px]">
          <Link to="/" className="flex items-center no-underline">
            <img src="/images/cooper-logo-full.svg" alt="Cooper" width={154} height={36} className="h-[26px] w-auto" />
          </Link>
          <span className="text-dark/20">|</span>
          <Link to="/" className="font-sans text-[14px] text-dark/40 hover:text-dark/70 no-underline transition-colors">
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col">
          {formState !== 'success' ? (
            <>
              {/* Subtitle sits above the form on desktop, but drops below it on mobile
                  (order-3) so the fields are the first thing a phone user sees. */}
              <h1 className="order-1 font-serif text-[24px] md:text-[34px] lg:text-[36px] leading-[1.2] text-dark mb-[8px] lg:mb-[12px]">
                Book a Cooper demo
              </h1>
              {!showQualify && (
                <p className="order-3 lg:order-2 font-sans text-[15px] md:text-[16px] leading-[1.55] text-dark/60 mt-[20px] mb-0 lg:mt-0 lg:mb-[24px] max-w-[520px]">
                  Schedule a 1:1 session with an insurance AI expert from our team. We'll show you Cooper with your own workflows, no generic demo.
                </p>
              )}

              {/* On desktop the detail fields are laid out in a 2-column grid so the
                  submit button lands close to the fold; on mobile they stay single-column. */}
              <form onSubmit={USE_PHONE_VERIFICATION && step !== 'verify' ? handleSendCode : handleSubmit} noValidate className="order-2 lg:order-3 flex flex-col gap-[16px] w-full lg:max-w-[560px]">
                {showDetails && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[16px] gap-y-[12px] lg:gap-y-[16px]">
                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    placeholder="Jane Smith"
                    required
                    className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                  {nameError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{nameError}</p>}
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                    onBlur={handleEmailBlur}
                    placeholder="jane@company.com"
                    required
                    className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                  {emailError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{emailError}</p>}
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Mobile Phone</label>
                  <div className="flex items-center w-full bg-white border border-dark/[0.12] rounded-[8px] transition-all focus-within:border-accent-orange/50 focus-within:ring-2 focus-within:ring-accent-orange/10">
                    <span className="font-sans text-[16px] md:text-[15px] font-semibold text-dark/70 pl-[14px] pr-[6px] select-none">+1</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError('') }}
                      onBlur={handlePhoneBlur}
                      placeholder="(555) 000-0000"
                      required
                      autoComplete="tel"
                      className="flex-1 min-w-0 font-sans text-[16px] md:text-[15px] text-dark bg-transparent border-0 rounded-r-[8px] pl-0 pr-[14px] py-[12px] outline-none placeholder:text-dark/25"
                    />
                  </div>
                  {phoneError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{phoneError}</p>}
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => { setCompany(e.target.value); if (companyError) setCompanyError('') }}
                    onBlur={handleCompanyBlur}
                    placeholder="Acme Insurance"
                    required
                    autoComplete="organization"
                    className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25"
                  />
                  {companyError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{companyError}</p>}
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Number of employees <span className="text-dark/60">(optional)</span></label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="">Select one…</option>
                    {EMPLOYEE_COUNTS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">How did you hear about us? <span className="text-dark/60">(optional)</span></label>
                  <select
                    value={hearAbout}
                    onChange={(e) => setHearAbout(e.target.value)}
                    className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="" disabled>Select one…</option>
                    {HEAR_ABOUT_US.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                  </div>
                )}

                {showQualify && (
                  <div className="flex flex-col gap-[16px]">
                    <p className="font-sans text-[14px] text-dark/70 leading-[1.5]">
                      Two more quick questions.
                    </p>
                    <div>
                      <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Annual commercial book of business</label>
                      <select
                        value={bookOfBusiness}
                        onChange={(e) => { setBookOfBusiness(e.target.value); if (bookOfBusinessError) setBookOfBusinessError('') }}
                        className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                      >
                        <option value="">Select one…</option>
                        {BOOK_OF_BUSINESS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      {bookOfBusinessError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{bookOfBusinessError}</p>}
                    </div>
                    <div>
                      <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Annual budget for AI software</label>
                      <select
                        value={softwareBudget}
                        onChange={(e) => { setSoftwareBudget(e.target.value); if (softwareBudgetError) setSoftwareBudgetError('') }}
                        className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231e1a15' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                      >
                        <option value="">Select one…</option>
                        {SOFTWARE_BUDGET.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      {softwareBudgetError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{softwareBudgetError}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Match the verify back button: reset the (possibly
                        // spent) captcha and clear stale error banners so the
                        // details step doesn't render a red 429/network message
                        // from a previous qualify submit.
                        setStep('details')
                        setBookOfBusinessError(''); setSoftwareBudgetError('')
                        setFormState('idle'); setErrorMsg('')
                        resetCaptcha()
                      }}
                      className="self-start font-sans text-[13px] text-dark/40 hover:text-dark/70 underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      ← Edit details
                    </button>
                  </div>
                )}

                {showVerify && (
                  <div>
                    <label className="font-sans text-[13px] font-medium text-dark/70 mb-[4px] lg:mb-[6px] block">Verification code</label>
                    <p className="font-sans text-[13px] text-dark/60 mb-[8px]">We texted a code to {phone}.</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(e) => { setCode(e.target.value); if (codeError) setCodeError('') }}
                      placeholder="123456"
                      className="w-full font-sans text-[16px] md:text-[15px] text-dark bg-white border border-dark/[0.12] rounded-[8px] px-[14px] py-[12px] outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/10 transition-all placeholder:text-dark/25 tracking-[4px]"
                    />
                    {codeError && <p className="font-sans text-[12px] text-red-500 mt-[4px]">{codeError}</p>}
                    <button
                      type="button"
                      onClick={() => { setStep('details'); setCode(''); setCodeError(''); setFormState('idle'); setErrorMsg(''); resetCaptcha() }}
                      className="font-sans text-[13px] text-dark/40 hover:text-dark/70 mt-[8px] underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      ← Edit details or resend code
                    </button>
                  </div>
                )}

                {showTurnstile && TURNSTILE_SITE_KEY && (
                  <div>
                    <Turnstile
                      key={captchaKey}
                      siteKey={TURNSTILE_SITE_KEY}
                      onToken={(t) => { setCaptchaToken(t); setCaptchaError('') }}
                      onExpire={() => setCaptchaToken('')}
                      // Every step still POSTs to /send-code/ (or /demo-requests/)
                      // and the backend requires a Turnstile token, but we
                      // render invisibly so the form stays clean. Cloudflare
                      // only surfaces a challenge if the visitor looks
                      // suspicious.
                      appearance="interaction-only"
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
                  className="w-full font-sans font-medium text-[15px] text-cream-light bg-accent-orange-deep rounded-[8px] px-[24px] py-[14px] mt-[8px] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {formState === 'submitting' ? 'Sending...' : submitLabel}
                </button>

                {showConsent && (
                  <p className="font-sans text-[12px] text-dark/60 leading-[1.5]">
                    By submitting this form you agree to our{' '}
                    <Link to="/privacy" className="underline">Privacy Policy</Link>
                    . We'll reach out within 1-2 business days.
                  </p>
                )}
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
              <p className="font-sans text-[16px] text-dark/60 mb-[32px] max-w-[380px]">
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
