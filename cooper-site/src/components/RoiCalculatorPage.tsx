/* ──────────────────────────────────────────────────────────────
   ROI Calculator — /resources/roi-calculator

   Structured after Harvey's law-firm calculator, which does three
   things worth copying:
     · A short input rail (they ask three questions, not eight).
     · A single headline number, then a Year 1 / Year 2 / Year 3 /
       Total table underneath.
     · Year 1 is legible; the rest is blurred behind one "Reveal full
       results" button, so the visitor sees enough to want the rest.

   The model itself is Cooper's: per-workflow before/after benchmarks
   from Akhilesh's "Cooper Effect" brief (src/data/cooperEffect.ts)
   rather than an abstract "% automated" slider. A broker recognises
   "process a submission: 45 min → 4 min" in a way they do not
   recognise "65% automation".

   Read the source note in cooperEffect.ts before changing any of the
   claim-bearing copy on this page.
─────────────────────────────────────────────────────────────── */

import { lazy, Suspense, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Calculator, LockSimple, Clock, TrendUp, UsersThree } from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'
import { WORKFLOWS, BLENDED_HOURLY_COST, FTE_HOURS, RAMP, REFERENCE_ACCOUNTS, REFERENCE_HEADCOUNT, PERSONAL_LINES_FACTOR, BIND_RATE, REVENUE_PER_POLICY, NEW_ACCOUNTS_PER_PERSON, HOURS_TO_WIN_AN_ACCOUNT, PERSONAL_REVENUE_FACTOR, HOURS_REALIZATION, minutesSaved, speedMultiple } from '../data/cooperEffect'

// The gate only mounts on a click, and it drags in libphonenumber-js (~125 kB)
// for the phone field. Static-importing it made a direct visit to this page
// download roughly six times the JS it needs to render.
const RoiLeadModal = lazy(() => import('./RoiLeadModal'))

export const ROI_TITLE = 'ROI Calculator — Cooper'
export const ROI_DESCRIPTION =
  'Estimate what Cooper returns to your team. Pick the workflows you run, put in your monthly volume, and see the hours and cost each one gives back over three years.'

// Built once. This page re-renders on every keystroke across sixteen inputs,
// and constructing an Intl formatter costs orders of magnitude more than
// formatting with one that already exists.
const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const PLAIN = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const ONE_DP = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

const usd = (n: number) => USD.format(n)
const num = (n: number, digits: 0 | 1 = 0) => (digits ? ONE_DP : PLAIN).format(n)

/**
 * Round down to a figure someone would say out loud, and mark it as a floor.
 *
 * The estimate is built on unmeasured benchmarks, so "671 hours" claims a
 * precision the model does not have — and a number that exact invites an
 * argument about the last digit instead of the size of the prize. Rounding
 * down rather than to nearest keeps the "+" honest. The table stays exact: a
 * table of figures should be figures.
 */
function approx(n: number): string {
  const step = n >= 1000 ? 100 : n >= 200 ? 50 : n >= 50 ? 10 : n >= 10 ? 5 : 1
  return `${PLAIN.format(Math.floor(n / step) * step)}+`
}

/*
 * Minutes of manual work a single commercial account carries, derived from the
 * workflow table so the two cannot drift. Weighted by how often each workflow
 * runs per account, which is what the reference volumes encode.
 */
/*
 * Team-size stops rather than an even step: dense between 5 and 50 where most
 * agencies actually sit, coarse above it, where the difference between 180 and
 * 190 people changes nothing about the estimate.
 */
const HEADCOUNT_STOPS = [
  1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  60, 75, 100, 150, 200, 250,
]
const DEFAULT_HEADCOUNT_INDEX = HEADCOUNT_STOPS.indexOf(REFERENCE_HEADCOUNT)

const COMMERCIAL_MINUTES_PER_ACCOUNT =
  WORKFLOWS.reduce((sum, w) => sum + minutesSaved(w) * (w.defaultVolume ?? 0), 0) / REFERENCE_ACCOUNTS

/** Speed-up weighted the same way, so the headline multiple matches the mix. */
const BLENDED_SPEED_MULTIPLE =
  WORKFLOWS.reduce((sum, w) => sum + speedMultiple(w) * minutesSaved(w) * (w.defaultVolume ?? 0), 0) /
  WORKFLOWS.reduce((sum, w) => sum + minutesSaved(w) * (w.defaultVolume ?? 0), 0)

/* One line under the controls, not three.

   It used to explain the model — what it counts, how it counts, that the
   sliders move. That is the machinery, and the machinery is not the reason
   anyone is on this page. This says what the machinery is for. */
const RAIL_NOTE = 'Cooper frees up your time to bind more policies instead of re-entering data'

interface Inputs {
  accounts: number
  /** Share of accounts that are commercial lines, 0-100. */
  commercialShare: number
  headcount: number
}

function calculate({ accounts, commercialShare, headcount }: Inputs) {
  // Monthly is the base unit: an agency principal budgets by the month, so
  // that is the number they can act on. Longer horizons derive from it.
  const commercial = commercialShare / 100
  // Personal-lines accounts carry less paperwork, so they cost less to run.
  const mixWork = commercial + (1 - commercial) * PERSONAL_LINES_FACTOR
  const minutesPerAccount = COMMERCIAL_MINUTES_PER_ACCOUNT * mixWork

  const monthlyHours = (accounts * minutesPerAccount) / 60
  // Gross hours value. A real component of the answer, but not what the page
  // leads with — see HOURS_REALIZATION.
  const monthlyHoursValue = monthlyHours * BLENDED_HOURLY_COST

  // The revenue chain: freed hours buy capacity, capacity quotes more
  // submissions, a share of those bind.
  // Two limits on new business, and the smaller one wins.
  //   1. Freed time: each new account still costs human hours to win and
  //      service, so the hours Cooper gives back buy a finite number of them.
  //   2. Team size: a person can only chase so much new business a month,
  //      however much time they have.
  // Both are modelled because either alone leaves a slider inert.
  const timeCapacity = monthlyHours / (HOURS_TO_WIN_AN_ACCOUNT * mixWork)
  // A lighter book means each person can carry more accounts.
  const peopleCapacity = (headcount * NEW_ACCOUNTS_PER_PERSON) / mixWork
  const extraAccounts = Math.min(timeCapacity, peopleCapacity)
  const cappedByPeople = peopleCapacity < timeCapacity

  const extraBound = extraAccounts * BIND_RATE
  // A personal-lines policy earns a fraction of a commercial one, so shifting
  // personal adds accounts but takes revenue off each.
  const mixRevenue = commercial + (1 - commercial) * PERSONAL_REVENUE_FACTOR
  const monthlyRevenue = extraBound * REVENUE_PER_POLICY * mixRevenue

  // RAMP discounts year one for rollout; years two and three run at full rate.
  const yearHours = RAMP.map((factor) => monthlyHours * 12 * factor)
  const threeYearHours = yearHours.reduce((a, b) => a + b, 0)

  /* Value created: the new business in full, plus only the share of the freed
     hours an agency actually converts into money. The headline is the steady
     rate, not year one — it answers "what is this worth to us", and a rollout
     discount buried inside that number makes the answer depend on when you
     happen to be reading. The ramp still applies to the year-one column, where
     the horizon is stated. */
  const monthlyValue = monthlyRevenue + monthlyHoursValue * HOURS_REALIZATION
  const annualValue = monthlyValue * 12
  const firstYearValue = annualValue * RAMP[0]
  const threeYearValue = monthlyValue * 12 * RAMP.reduce((a, b) => a + b, 0)

  return {
    monthlyHours,
    monthlyHoursValue,
    monthlyValue,
    annualValue,
    firstYearHours: yearHours[0],
    firstYearValue,
    threeYearHours,
    threeYearValue,
    fte: (monthlyHours * 12) / FTE_HOURS,
    blendedMultiple: BLENDED_SPEED_MULTIPLE,
    extraAccounts,
    extraBound,
    monthlyRevenue,
    cappedByPeople,
    firstYearRevenue: monthlyRevenue * 12 * RAMP[0],
    threeYearRevenue: monthlyRevenue * 12 * RAMP.reduce((a, b) => a + b, 0),
    accountsPerPerson: accounts / Math.max(1, headcount),
    accountsPerPersonAfter: (accounts + extraAccounts) / Math.max(1, headcount),
  }
}

/* ══════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════ */

/** Blurs its children until unlocked — Harvey's teaser mechanic.
 *
 *  Lighter than the blur over the tiles, because this covers 15px figures
 *  rather than 27px ones. A radius that reads as depth of field on a headline
 *  erases a table cell down to a grey dash, and a row of dashes reads as a
 *  rendering fault rather than as something withheld. */
function Locked({ locked, children }: { locked: boolean; children: ReactNode }) {
  if (!locked) return <>{children}</>
  return <span className="pointer-events-none select-none blur-[5px] saturate-50">{children}</span>
}

function Slider({
  id, label, caption, value, display, min, max, step, onChange,
}: {
  id: string; label: string; caption?: string; value: number; display: string
  min: number; max: number; step: number; onChange: (n: number) => void
}) {
  // Where the orange stops and the grey starts. WebKit has no progress
  // pseudo-element, so the track's gradient reads this instead. Unitless,
  // because the stop is a calc against the knob's travel rather than a plain
  // percentage of the track. See the .range-slider block in index.css.
  const frac = max > min ? (value - min) / (max - min) : 0

  return (
    <div className="border-b border-dark/[0.07] py-[14px] last:border-b-0">
      <div className="flex items-baseline justify-between gap-[12px]">
        <label htmlFor={id} className="font-sans text-[14px] font-medium text-dark">{label}</label>
        <span className="shrink-0 font-grotesk text-[15px] font-medium tabular-nums text-accent-orange">{display}</span>
      </div>
      {caption && (
        <span className="mt-[2px] block font-grotesk text-[11.5px] tracking-[0.3px] text-dark/45">{caption}</span>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--range-frac': frac } as CSSProperties}
        className="range-slider mt-[10px] h-[24px] w-full cursor-pointer"
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function RoiCalculatorPage() {
  useSeo({
    title: ROI_TITLE,
    description: ROI_DESCRIPTION,
    canonicalPath: '/resources/roi-calculator',
    jsonLd: pageJsonLd({
      name: 'ROI Calculator',
      path: '/resources/roi-calculator',
      description: 'Estimate the hours and cost Cooper returns to an insurance team.',
    }),
  })

  const [accounts, setAccounts] = useState(REFERENCE_ACCOUNTS)
  const [commercialShare, setCommercialShare] = useState(100)
  const [headcountIndex, setHeadcountIndex] = useState(DEFAULT_HEADCOUNT_INDEX)
  const headcount = HEADCOUNT_STOPS[headcountIndex]
  const [unlocked, setUnlocked] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  const r = useMemo(
    () => calculate({ accounts, commercialShare, headcount }),
    [accounts, commercialShare, headcount]
  )

  const tiles = [
    { icon: Clock, label: 'Hours a month', value: `${num(r.monthlyHours)} hrs`, sub: `Across ${num(accounts)} accounts a month.` },
    {
      icon: TrendUp, label: 'Submissions per person', value: `${num(r.accountsPerPerson, 1)} → ${num(r.accountsPerPersonAfter, 1)}`,
      sub: `Each of your ${num(headcount)} people carries more without working longer.`,
    },
    {
      icon: UsersThree, label: 'More policies bound', value: `${num(r.extraBound)}/mo`,
      sub: `At a ${Math.round(BIND_RATE * 100)}% bind rate${r.cappedByPeople ? `, limited by ${num(headcount)} people rather than by hours` : ''}.`,
    },
  ]

  const tableRows = [
    { label: 'Value created', cells: [usd(r.monthlyValue), usd(r.firstYearValue), usd(r.threeYearValue)] },
    { label: 'Hours returned', cells: [num(r.monthlyHours), num(r.firstYearHours), num(r.threeYearHours)] },
  ]

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ══════════════ HERO ══════════════

          Headline left, the photograph right, and a standing figure under the
          copy. The figure is a constant, not the calculator's live output: the
          hero used to float the monthly cost-avoided tile over the photograph,
          wired to the same state as the panel below, so dragging a slider moved
          a number two screens away from the slider. The calculator answers
          inside the calculator; the hero states a fact about the model and
          stops there.

          Top-aligned rather than centred. Against a 460px square photograph,
          centring pushed the whole column down to float in the middle of the
          frame with nothing above it.

          The photograph follows the imagery direction in the Cooper design
          system: golden hour, seen from behind with no face, warm oak, and the
          amber reeded-glass signature down the right. ══════════════ */}
      <section className="px-5 pb-[36px] pt-[120px] md:px-10 lg:px-[62px] lg:pt-[140px]">
        <div className="mx-auto grid max-w-[1180px] gap-[36px] lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-[64px]">
          <div>
            {/* The white paper's kicker, matched piece for piece: icon, label,
                a double slash, then a qualifier the muted container colours
                down. See WhitePaperReport.tsx.

                The qualifier is a date rather than a claim. A page that turns
                estimates into a dollar figure should say how old the estimates
                are, and these come from Akhilesh's brief of 29 July 2026 — the
                source note in cooperEffect.ts. "Benchmarks" was the other
                candidate and is the wrong word: that note is explicit that
                these are internal estimates, not measured customer averages.

                It dates the same way the white paper's edition does. Whoever
                revises the workflow times moves this string too. */}
            <div className="mb-[18px] flex items-center gap-[8px] font-sans text-[14px] text-dark/45">
              <Calculator size={16} weight="regular" className="shrink-0 text-dark" />
              <span className="font-medium text-dark">ROI calculator</span>
              <span aria-hidden>//</span>
              <span>Updated July 2026</span>
            </div>
            <h1 className="font-serif text-[38px] leading-[1.06] tracking-[-1px] text-dark md:text-[46px] lg:text-[52px]">
              See Cooper's impact on your team
            </h1>
            <p className="mt-[20px] max-w-[480px] font-sans text-[16.5px] leading-[1.6] text-dark/60">
              Cooper is your AI coworker for the busywork, from intake to renewal. Tell us
              the shape of your book and this estimates the value Cooper can generate for
              you every month.
            </p>

          </div>

          <div>
            <img
              src="/images/roi-hero.jpg"
              alt=""
              aria-hidden
              width={1100}
              height={1473}
              /* Square corners, like every other photograph on this site: the
                 persona heroes, the team photo, the home hero. The 18px this
                 carried was the only instance of that radius in the codebase
                 outside the white paper cover, where the rounding is a book's
                 fore edge and means something. Here it meant nothing. */
              className="block aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════ CALCULATOR ══════════════

          The band stays the page's cream, so the hero runs into the calculator
          without a seam. The card is then plain white on it, and the lifting is
          left to the shadow and the border alone — the same two the home page's
          spotlight card uses, at the same values, minus the darker surround it
          gets to sit on. See OnePlatform.tsx. ══════════════ */}
      <section className="px-5 pb-[64px] pt-[56px] md:px-10 lg:px-[62px] lg:pb-[88px] lg:pt-[72px]">
        {/* Square, no radius, matching the home page's spotlight card and the
            hero photograph above it.

            White throughout. The input rail used to carry the page's cream to
            set it apart from the answer, which only worked while the band
            behind was darker; on cream it would have dissolved into the page.
            The rule between the two columns tells them apart now. */}
        <div
          className="mx-auto grid max-w-[1180px] border-4 border-black/[0.02] bg-white lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]"
          style={{ boxShadow: '0px 7.5px 69.6px -20px rgba(0,0,0,0.33)' }}
        >
          {/* ── Inputs ──
              Static. The column ran short against the answer beside it, and
              the slack was briefly given to a sticky block that followed the
              scroll; the three notes at its foot fill the column instead, so
              there is no longer much slack to travel through and nothing left
              for the sticky to buy. */}
          <div className="border-b border-dark/[0.1] p-[24px] lg:border-b-0 lg:border-r lg:p-[28px]">
            <h2 className="font-grotesk text-[12px] font-medium uppercase tracking-[1.3px] text-dark/45">
              Your team
            </h2>

            <Slider
              id="accounts"
              label="Accounts a month"
              caption="New business and renewals your team handles"
              value={accounts}
              display={num(accounts)}
              min={0}
              max={1000}
              step={5}
              onChange={setAccounts}
            />
            <Slider
              id="commercialShare"
              label="Commercial vs personal"
              caption={
                commercialShare === 100 ? 'All commercial'
                  : commercialShare === 0 ? 'All personal'
                  : `${commercialShare}% commercial, ${100 - commercialShare}% personal`
              }
              value={commercialShare}
              display={`${commercialShare}% commercial`}
              min={0}
              max={100}
              step={25}
              onChange={setCommercialShare}
            />
            <Slider
              id="headcount"
              label="People doing this work"
              value={headcountIndex}
              display={num(headcount)}
              min={0}
              max={HEADCOUNT_STOPS.length - 1}
              step={1}
              onChange={setHeadcountIndex}
            />


            <p className="mt-[20px] border-t border-dark/[0.08] pt-[20px] font-sans text-[13.5px] leading-[1.55] text-dark/55">
              {RAIL_NOTE}
            </p>

            {/* Last in the column, and last in the order of things to do: set
                the three sliders, read what the estimate covers, then open the
                rest. Full width because the column is narrow, and set off from
                the notes by more than their own spacing so it reads as the
                step after them rather than a fourth item in the list. */}
            {!unlocked && (
              <button
                type="button"
                onClick={() => setGateOpen(true)}
                className="mt-[38px] inline-flex w-full items-center justify-center gap-[8px] rounded-[6px] bg-dark px-[20px] py-[13px] font-sans text-[14.5px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02]"
              >
                <LockSimple size={15} weight="bold" /> Reveal full results
              </button>
            )}
          </div>

          {/* ── Results ──
              White, not Cooper's dark. The dark fill came from the reference
              layout, where a filled answer panel separates the side you type
              into from the side that answers. It cost more than it bought:
              #1e1a15 is a warm near-black, and at this size it stops reading as
              "dark" and starts reading as a brown field, which is not a colour
              in this palette.

              The two sides are still told apart, by surface rather than by
              fill: the input rail is the page's warm cream, the answer is
              plain white, and the rule between them already exists. The type
              inside is dark throughout — the fill and the type are one change,
              and a past rebase that moved one without the other put pale text
              on a pale panel and made the whole answer invisible. */}
          <div className="min-w-0 bg-white p-[24px] text-dark lg:p-[32px]">
            <>
                {/* Headline. The gate button used to sit to its right; it is
                    in the input column now. */}
                <div>
                  <span className="font-grotesk text-[11.5px] font-medium uppercase tracking-[1.3px] text-dark/45">
                    Additional value created a year
                  </span>
                  <div className="mt-[8px] font-serif text-[44px] leading-[1] tabular-nums text-dark lg:text-[58px]">
                    {usd(r.annualValue)}
                  </div>
                  {/* Says what the money is, rather than narrating the
                      mechanics that produced it. */}
                  <p className="mt-[8px] max-w-[430px] font-sans text-[14px] leading-[1.5] text-dark/55">
                    {accounts === 0
                      ? 'Set your monthly accounts to see what the freed capacity is worth.'
                      : `${approx(r.extraBound)} more policies bound a month, and ${approx(r.monthlyHours)} hours your team stops spending on paperwork.`}
                  </p>
                </div>

                {/* Year-one tiles, behind the gate — the coverage Amar shipped
                    in 2419038.

                    They also had his colours back: a light card carrying dark
                    type. A later commit filled the panel dark and moved the
                    type to cream without moving the card, which is what left
                    the figures invisible once the gate opened. */}
                <div className={`mt-[26px] grid gap-[12px] sm:grid-cols-2 ${
                  unlocked ? '' : 'pointer-events-none select-none blur-[6px] saturate-50'
                }`}>
                  {tiles.map((t) => {
                    const Icon = t.icon
                    return (
                      <div key={t.label} className="border border-[#E2D9CF] bg-cream-light p-[18px]">
                        <div className="mb-[10px] flex items-center gap-[9px]">
                          <span className="grid h-[30px] w-[30px] place-items-center rounded-[6px] bg-accent-orange/10 text-accent-orange">
                            <Icon size={16} weight="regular" />
                          </span>
                          <span className="font-grotesk text-[11px] font-medium uppercase tracking-[1.1px] text-dark/45">
                            {t.label}
                          </span>
                        </div>
                        <div className="font-serif text-[27px] leading-[1.05] tabular-nums text-dark">{t.value}</div>
                        <p className="mt-[6px] font-sans text-[12.5px] leading-[1.4] text-dark/55">{t.sub}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Year table — year one open, the rest behind the gate */}
                <div className="mt-[26px] overflow-x-auto">
                  <table className="w-full min-w-[400px] border-collapse">
                    <thead>
                      <tr className="border-b border-dark/[0.12]">
                        <th className="pb-[10px] text-left">&nbsp;</th>
                        {/* Headers gated with their columns, as Amar had them. */}
                        {['Per month', 'First 12 months', 'Over 3 years'].map((h, i) => (
                          <th
                            key={h}
                            className="pb-[10px] text-right font-grotesk text-[11px] font-medium uppercase tracking-[1.1px] text-dark/40"
                          >
                            <Locked locked={!unlocked && i > 0}>{h}</Locked>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.label} className="border-b border-dark/[0.08] last:border-b-0">
                          <td className="py-[14px] font-sans text-[14px] text-dark/70">{row.label}</td>
                          {row.cells.map((c, i) => (
                            <td key={i} className="py-[14px] text-right font-sans text-[15px] font-medium tabular-nums text-dark">
                              <Locked locked={!unlocked && i > 0}>{c}</Locked>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


            </>
          </div>
        </div>
      </section>

      <Footer />

      {gateOpen && (
        <Suspense fallback={null}>
          <RoiLeadModal
          snapshot={{
            monthlyValue: r.monthlyValue,
            monthlyHours: r.monthlyHours,
            firstYearValue: r.firstYearValue,
            // The three inputs behind the estimate, so sales opens the record
            // already knowing the shape of the shop.
            profile: `${accounts} accounts/mo · ${commercialShare}% commercial · ${headcount} people`,
          }}
            onClose={() => setGateOpen(false)}
            onUnlock={() => { setUnlocked(true); setGateOpen(false) }}
          />
        </Suspense>
      )}
    </div>
  )
}
