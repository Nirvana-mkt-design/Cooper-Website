/* ──────────────────────────────────────────────────────────────
   The gate's inputs, captcha and submit — the part every presentation
   of the white paper form has in common.

   The state, validation and request are in lib/whitePaperGate.ts; this
   is only what they look like. Layout A frames it as a card in the rail
   and as a modal, layout B as a panel at the foot of the page.

   `idPrefix` is per presentation and not optional: two of these can be
   mounted at once, and duplicate ids would break every label-to-input
   association on the page.
─────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react'
import Turnstile from './Turnstile'
import { TURNSTILE_SITE_KEY, USE_TURNSTILE } from '../lib/leads'
import { GATE_FIELDS, type GateState } from '../lib/whitePaperGate'

export default function GateFields({
  gate,
  idPrefix,
  submitLabel,
  columns = false,
  children,
}: {
  gate: GateState
  idPrefix: string
  submitLabel: string
  /** Four fields on a 2×2 grid. The panel needs it to stay short enough to sit
      in a viewport; the rail and the modal are narrow, so they stack. */
  columns?: boolean
  /** Icon rendered inside the submit button, before the label. */
  children?: ReactNode
}) {
  const { values, errors, busy, error, captchaKey, set, setToken, handleSubmit } = gate

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={columns ? 'grid gap-x-[14px] gap-y-[13px] sm:grid-cols-2' : 'flex flex-col gap-[13px]'}>
        {GATE_FIELDS.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={`${idPrefix}-${f.id}`}
              className="mb-[5px] block text-left font-sans text-[13px] font-medium text-dark"
            >
              {f.label}
            </label>
            <input
              id={`${idPrefix}-${f.id}`}
              type={f.type}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.id]}
              disabled={busy}
              aria-invalid={Boolean(errors[f.id])}
              aria-describedby={errors[f.id] ? `${idPrefix}-${f.id}-err` : undefined}
              onChange={(e) => set(f.id, e.target.value)}
              /* 16px on mobile: anything smaller and iOS Safari zooms the
                 viewport on focus, which inside a panel pinned to the foot of
                 the screen is genuinely disorienting. */
              className={`w-full rounded-[8px] border bg-cream-light/80 px-[12px] py-[10px] font-sans text-[16px] text-dark md:text-[14.5px] outline-none transition-colors disabled:opacity-60 ${
                errors[f.id] ? 'border-accent-red' : 'border-dark/[0.14] focus:border-accent-orange'
              }`}
            />
            {errors[f.id] && (
              <p id={`${idPrefix}-${f.id}-err`} className="mt-[4px] text-left font-sans text-[12px] text-accent-red">
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
          className="mt-[14px] flex justify-center"
        />
      )}

      {error && (
        <p role="alert" className="mt-[12px] font-sans text-[13px] leading-[1.5] text-accent-red">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-[16px] inline-flex w-full items-center justify-center gap-[8px] rounded-[7px] bg-dark px-[24px] py-[12px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
      >
        {busy ? 'Unlocking…' : <>{children}{submitLabel}</>}
      </button>
      <p className="mt-[10px] text-center font-sans text-[11.5px] leading-[1.5] text-dark/40">
        We'll only use this to follow up about Cooper. No spam, and no text messages from this form.
      </p>
    </form>
  )
}
