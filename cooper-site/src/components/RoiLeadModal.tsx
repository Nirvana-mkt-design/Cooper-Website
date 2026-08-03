/* ──────────────────────────────────────────────────────────────
   ROI gate — the form behind "Reveal full results".

   Harvey's equivalent is a Marketo modal that pushes the visitor's
   computed ROI onto the lead record, so sales opens the record already
   knowing the number the prospect was looking at. We do the same thing
   through the existing demo-request pipeline: `captureLead` posts to
   /send-code/ with defer_sms, which writes the lead to Zapier without
   texting anybody.

   The figures ride along in `attribution`, which is a free-form
   dict[str, str] on the API, so none of this needs a backend change.
   `form_source` is set there too and never overwrites real campaign
   params — a visitor who arrived on a Google ad keeps their utm_source
   and gains a marker saying which form converted them.
─────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { LockSimpleOpen } from '@phosphor-icons/react'
import ModalShell from './ModalShell'
import Turnstile from './Turnstile'
import { captureLead, isWorkEmail, TURNSTILE_SITE_KEY, USE_TURNSTILE } from '../lib/leads'

interface RoiSnapshot {
  monthlyValue: number
  monthlyHours: number
  firstYearValue: number
  /** The three inputs behind the estimate, as one readable line. */
  profile: string
}

const FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Jordan Reyes' },
  { id: 'email', label: 'Work email', type: 'email', autoComplete: 'email', placeholder: 'jordan@agency.com' },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', placeholder: 'Reyes Insurance Group' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '(555) 123-4567' },
] as const

type FieldId = (typeof FIELDS)[number]['id']

export default function RoiLeadModal({
  snapshot,
  onClose,
  onUnlock,
}: {
  snapshot: RoiSnapshot
  onClose: () => void
  onUnlock: () => void
}) {
  const [values, setValues] = useState<Record<FieldId, string>>({ name: '', email: '', company: '', phone: '' })
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0)
  const firstField = useRef<HTMLInputElement>(null)

  // ModalShell owns Escape and the scroll lock; the gate only adds autofocus.
  // Empty deps so a parent re-render cannot yank the caret back to field one.
  useEffect(() => { firstField.current?.focus() }, [])

  const set = (id: FieldId, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  function validate() {
    const next: Partial<Record<FieldId, string>> = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email.'
    else if (!isWorkEmail(values.email)) next.email = 'Please use your work email.'
    if (!values.company.trim()) next.company = 'Please enter your company.'
    if (!isValidPhoneNumber(values.phone, 'US')) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (USE_TURNSTILE && !token) {
      setError('Please complete the verification check.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await captureLead({
        full_name: values.name,
        email: values.email,
        company: values.company,
        phone: values.phone,
        turnstile_token: token,
        source: {
          roi_profile: snapshot.profile,
          form_source: 'roi-calculator',
          roi_monthly_value: String(Math.round(snapshot.monthlyValue)),
          roi_monthly_hours: String(Math.round(snapshot.monthlyHours)),
          roi_first_year_value: String(Math.round(snapshot.firstYearValue)),
        },
      })
      onUnlock()
    } catch (err) {
      setBusy(false)
      setError(
        (err as { status?: number }).status === 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : 'Something went wrong. Please try again, or email us at contact@askcooper.ai.'
      )
      // Turnstile tokens are single-use — mint a fresh one for the retry.
      if (USE_TURNSTILE) { setToken(''); setCaptchaKey((k) => k + 1) }
    }
  }

  return (
    <ModalShell onClose={onClose} labelledBy="roi-gate-title" maxWidth={480} scroll>
        <form onSubmit={handleSubmit} className="p-[28px] sm:p-[34px]" noValidate>
          <span className="inline-flex items-center gap-[7px] font-grotesk text-[11.5px] font-medium uppercase tracking-[1.2px] text-accent-orange">
            <LockSimpleOpen size={14} weight="bold" /> Full results
          </span>
          <h2 id="roi-gate-title" className="mt-[10px] font-serif text-[26px] leading-[1.15] text-dark">
            See what this adds up to
          </h2>
          <p className="mt-[10px] font-sans text-[14.5px] leading-[1.55] text-dark/55">
            You're seeing the monthly figure. Unlock the 12-month and 3-year totals, and we'll follow up to walk through them on your own book.
          </p>

          <div className="mt-[22px] flex flex-col gap-[14px]">
            {FIELDS.map((f, i) => (
              <div key={f.id}>
                <label htmlFor={`roi-${f.id}`} className="mb-[6px] block font-sans text-[13.5px] font-medium text-dark">
                  {f.label}
                </label>
                <input
                  ref={i === 0 ? firstField : undefined}
                  id={`roi-${f.id}`}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  value={values[f.id]}
                  disabled={busy}
                  aria-invalid={Boolean(errors[f.id])}
                  aria-describedby={errors[f.id] ? `roi-${f.id}-err` : undefined}
                  onChange={(e) => set(f.id, e.target.value)}
                  className={`w-full rounded-[8px] border bg-white/70 px-[13px] py-[11px] font-sans text-[16px] text-dark md:text-[15px] outline-none transition-colors disabled:opacity-60 ${
                    errors[f.id] ? 'border-accent-red' : 'border-dark/[0.14] focus:border-accent-orange'
                  }`}
                />
                {errors[f.id] && (
                  <p id={`roi-${f.id}-err`} className="mt-[5px] font-sans text-[12.5px] text-accent-red">
                    {errors[f.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {USE_TURNSTILE && TURNSTILE_SITE_KEY && (
            <Turnstile
              key={captchaKey}
              siteKey={TURNSTILE_SITE_KEY}
              onToken={setToken}
              onExpire={() => setToken('')}
              className="mt-[16px]"
            />
          )}

          {error && (
            <p role="alert" className="mt-[14px] font-sans text-[13.5px] leading-[1.5] text-accent-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-[20px] w-full rounded-[7px] bg-dark px-[24px] py-[13px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy ? 'Unlocking…' : 'Reveal full results'}
          </button>
          <p className="mt-[12px] text-center font-sans text-[12px] leading-[1.5] text-dark/40">
            We'll only use this to follow up about Cooper. No spam, and no text messages from this form.
          </p>
        </form>
    </ModalShell>
  )
}
