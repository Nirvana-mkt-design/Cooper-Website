/**
 * The white paper gate's state, validation and submit.
 *
 * Three things present this form: the card in the rail and the modal over the
 * blur (layout A), and the panel that rises from the bottom of the page (layout
 * B). They differ in chrome and in nothing else — same fields, same rules, same
 * request.
 *
 * A third hand-copied form is how one of them quietly stops requiring a work
 * email, or keeps sending a captcha token that has already been spent, months
 * after the other two were fixed. So this lives once, here, and each
 * presentation supplies its own frame around WhitePaperGateFields.
 *
 * Separate from that component rather than beside it because a module that
 * exports both a hook and a component breaks fast refresh.
 */

import { useState, type FormEvent } from 'react'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { unlockWhitePaper, isWorkEmail, USE_TURNSTILE } from './leads'

export const GATE_FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Jordan Reyes' },
  { id: 'email', label: 'Work email', type: 'email', autoComplete: 'email', placeholder: 'jordan@agency.com' },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', placeholder: 'Reyes Insurance Group' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '(555) 123-4567' },
] as const

export type GateFieldId = (typeof GATE_FIELDS)[number]['id']

/** Which presentation converted, so the CRM can tell the layouts apart. */
export type GateVariant = 'rail' | 'modal' | 'sheet' | 'report'

export function useWhitePaperGate({
  variant,
  onUnlock,
}: {
  variant: GateVariant
  onUnlock: (body: string) => void
}) {
  const [values, setValues] = useState<Record<GateFieldId, string>>({ name: '', email: '', company: '', phone: '' })
  const [errors, setErrors] = useState<Partial<Record<GateFieldId, string>>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0)

  const set = (id: GateFieldId, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  function validate() {
    const next: Partial<Record<GateFieldId, string>> = {}
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
      onUnlock(
        await unlockWhitePaper({
          full_name: values.name,
          email: values.email,
          company: values.company,
          phone: values.phone,
          turnstile_token: token,
          variant,
        })
      )
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

  return { values, errors, busy, error, token, captchaKey, set, setToken, handleSubmit }
}

export type GateState = ReturnType<typeof useWhitePaperGate>
