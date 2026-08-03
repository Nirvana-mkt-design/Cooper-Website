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

import { lazy, Suspense, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LockSimple, Clock, CurrencyDollar, TrendUp, UsersThree } from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'
import { WORKFLOWS, BLENDED_HOURLY_COST, FTE_HOURS, RAMP, REFERENCE_ACCOUNTS, REFERENCE_HEADCOUNT, PERSONAL_LINES_FACTOR, BIND_RATE, REVENUE_PER_POLICY, NEW_ACCOUNTS_PER_PERSON, HOURS_TO_WIN_AN_ACCOUNT, PERSONAL_REVENUE_FACTOR, minutesSaved, speedMultiple } from '../data/cooperEffect'

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
  const monthlyValue = monthlyHours * BLENDED_HOURLY_COST

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

  return {
    monthlyHours,
    monthlyValue,
    firstYearHours: yearHours[0],
    firstYearValue: yearHours[0] * BLENDED_HOURLY_COST,
    threeYearHours,
    threeYearValue: threeYearHours * BLENDED_HOURLY_COST,
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

/** Blurs its children until unlocked — Harvey's teaser mechanic. */
function Locked({ locked, children }: { locked: boolean; children: ReactNode }) {
  if (!locked) return <>{children}</>
  return <span className="pointer-events-none select-none blur-[7px] saturate-50">{children}</span>
}

function Slider({
  id, label, caption, value, display, min, max, step, onChange,
}: {
  id: string; label: string; caption?: string; value: number; display: string
  min: number; max: number; step: number; onChange: (n: number) => void
}) {
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
    { icon: CurrencyDollar, label: 'Cost avoided', value: `${usd(r.monthlyValue)}/mo`, sub: `Those hours at a ${usd(BLENDED_HOURLY_COST)} blended rate.` },
  ]

  /* The figure the hero floats over the photograph. Picked out of the same
     array the results panel renders, so there is one definition of it. */
  const heroTile = tiles.find((t) => t.label === 'Cost avoided')

  const tableRows = [
    { label: 'Additional revenue', cells: [usd(r.monthlyRevenue), usd(r.firstYearRevenue), usd(r.threeYearRevenue)] },
    { label: 'Hours returned', cells: [num(r.monthlyHours), num(r.firstYearHours), num(r.threeYearHours)] },
    { label: 'Cost avoided', cells: [usd(r.monthlyValue), usd(r.firstYearValue), usd(r.threeYearValue)] },
  ]

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ══════════════ HERO ══════════════

          Headline left, the photograph right, a figure floating over its lower
          corner. The figure is the live one rather than a decorative screenshot:
          it is the same monthly number the calculator below computes, from the
          same state, so moving a slider moves it. A hero that shows a made-up
          result next to a calculator that shows a real one teaches the reader
          not to trust either.

          The photograph follows the imagery direction in the Cooper design
          system: golden hour, seen from behind with no face, warm oak, and the
          amber reeded-glass signature down the right. ══════════════ */}
      <section className="px-5 pb-[36px] pt-[120px] md:px-10 lg:px-[62px] lg:pt-[140px]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-[36px] lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-[64px]">
          <div>
            <span className="mb-[20px] inline-flex items-center rounded-full border border-dark/15 px-[13px] py-[5px] font-grotesk text-[11.5px] font-medium uppercase tracking-[1.2px] text-dark/60">
              ROI calculator
            </span>
            <h1 className="font-serif text-[38px] leading-[1.06] tracking-[-1px] text-dark md:text-[46px] lg:text-[52px]">
              See Cooper's impact on your team
            </h1>
            <p className="mt-[20px] max-w-[480px] font-sans text-[16.5px] leading-[1.6] text-dark/60">
              Cooper is your AI coworker for the busywork, from intake to renewal. Tell us
              the shape of your book and this estimates the value Cooper can generate for
              you every month.
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/roi-hero.jpg"
              alt=""
              aria-hidden
              width={1100}
              height={1473}
              className="block w-full rounded-[18px] object-cover lg:aspect-[4/5]"
            />
            {/* Sits over the calm lower corner the frame was composed to leave.
                It renders one of the tiles the calculator already builds rather
                than restating it, so the hero cannot carry a number, a label or
                a wording the results below disagree with. */}
            {heroTile && (
              <div className="absolute bottom-[18px] left-[18px] rounded-[14px] bg-cream-light/95 px-[20px] py-[16px] shadow-[0_20px_44px_-20px_rgba(30,26,21,0.5)] backdrop-blur-[2px]">
                <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[1.2px] text-dark/45">
                  {heroTile.label}
                </p>
                <p className="mt-[6px] font-serif text-[30px] leading-none text-dark">
                  {heroTile.value}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ CALCULATOR ══════════════ */}
      <section className="px-5 pb-[64px] md:px-10 lg:px-[62px] lg:pb-[88px]">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[20px] border border-dark/[0.1] bg-white/50 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* ── Inputs ── */}
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

            <p className="mt-[18px] border-t border-dark/[0.08] pt-[16px] font-sans text-[12.5px] leading-[1.5] text-dark/45">
              Priced at a {usd(BLENDED_HOURLY_COST)} blended hourly rate. A personal-lines account counts as about a third of a commercial one.
            </p>
          </div>

          {/* ── Results ── */}
          <div className="p-[24px] lg:p-[32px]">
            <>
                {/* Headline + gate */}
                <div className="flex flex-wrap items-start justify-between gap-[16px]">
                  <div>
                    <span className="font-grotesk text-[11.5px] font-medium uppercase tracking-[1.3px] text-cream-light/45">
                      Additional revenue a month
                    </span>
                    <div className="mt-[8px] font-serif text-[44px] leading-[1] tabular-nums text-cream-light lg:text-[58px]">
                      {usd(r.monthlyRevenue)}
                    </div>
                    <p className="mt-[8px] max-w-[420px] font-sans text-[14px] leading-[1.5] text-cream-light/50">
                      {accounts === 0
                        ? 'Set your monthly accounts to see what the freed capacity is worth.'
                        : `${num(r.monthlyHours)} hours back a month buys ${num(r.extraAccounts)} more submissions, and ${num(r.extraBound)} of them bind.`}
                    </p>
                  </div>
                  {!unlocked && (
                    <button
                      type="button"
                      onClick={() => setGateOpen(true)}
                      className="inline-flex shrink-0 items-center gap-[8px] rounded-[7px] bg-cream-light px-[20px] py-[12px] font-sans text-[14.5px] font-medium text-dark transition-all duration-200 hover:scale-[1.03]"
                    >
                      <LockSimple size={15} weight="bold" /> Reveal full results
                    </button>
                  )}
                </div>

                {/* Year-one tiles — always legible, this is the teaser */}
                <div className={`mt-[26px] grid gap-[12px] sm:grid-cols-2 ${
                  unlocked ? '' : 'pointer-events-none select-none blur-[7px] saturate-50'
                }`}>
                  {tiles.map((t) => {
                    const Icon = t.icon
                    return (
                      <div key={t.label} className="rounded-[14px] border border-dark/[0.09] bg-cream-light/70 p-[18px]">
                        <div className="mb-[10px] flex items-center gap-[9px]">
                          <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-accent-orange/10 text-accent-orange">
                            <Icon size={16} weight="regular" />
                          </span>
                          <span className="font-grotesk text-[11px] font-medium uppercase tracking-[1.1px] text-dark/45">
                            {t.label}
                          </span>
                        </div>
                        <div className="font-serif text-[27px] leading-[1.05] tabular-nums text-cream-light">{t.value}</div>
                        <p className="mt-[6px] font-sans text-[12.5px] leading-[1.4] text-cream-light/50">{t.sub}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Year table — year one open, the rest behind the gate */}
                <div className="mt-[26px] overflow-x-auto">
                  <table className="w-full min-w-[400px] border-collapse">
                    <thead>
                      <tr className="border-b border-cream-light/[0.16]">
                        <th className="pb-[10px] text-left">&nbsp;</th>
                        {['Per month', 'First 12 months', 'Over 3 years'].map((h, i) => (
                          <th
                            key={h}
                            className="pb-[10px] text-right font-grotesk text-[11px] font-medium uppercase tracking-[1.1px] text-cream-light/40"
                          >
                            <Locked locked={!unlocked && i > 0}>{h}</Locked>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.label} className="border-b border-cream-light/[0.09] last:border-b-0">
                          <td className="py-[14px] font-sans text-[14px] text-cream-light/70">{row.label}</td>
                          {row.cells.map((c, i) => (
                            <td key={i} className="py-[14px] text-right font-sans text-[15px] font-medium tabular-nums text-cream-light">
                              <Locked locked={!unlocked && i > 0}>{c}</Locked>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-[16px] font-sans text-[12.5px] leading-[1.5] text-cream-light/45">
                  The monthly figure is the steady rate. The 12-month total runs at {Math.round(RAMP[0] * 100)}% of it, because a rollout takes a month or two to reach every desk.
                </p>

                {/* CTA */}
                <div className="mt-[24px] flex flex-col gap-[14px] rounded-[14px] border border-accent-orange/25 bg-accent-orange/[0.06] p-[20px] sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[400px] font-sans text-[14px] leading-[1.55] text-cream-light/70">
                    {unlocked
                      ? 'Bring a real submission and we will run it through Cooper live, so you can check these numbers against your own file.'
                      : 'Want these numbers on your own workflows? We will walk through them with you.'}
                  </p>
                  <Link
                    to="/demo?utm_content=roi-calculator"
                    className="inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[6px] bg-dark px-[22px] py-[12px] font-sans text-[14.5px] font-medium text-cream-light no-underline transition-all duration-200 hover:scale-[1.03]"
                  >
                    Request a Demo <ArrowRight size={15} weight="bold" />
                  </Link>
                </div>
            </>
          </div>
        </div>
      </section>

      {/* ══════════════ METHOD ══════════════ */}
      <section className="bg-dark px-5 py-[64px] md:px-10 lg:px-[62px] lg:py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="mb-[16px] font-grotesk text-[13px] font-medium uppercase tracking-[1.6px] text-accent-orange">
              The method
            </p>
            <h2 className="max-w-[680px] font-serif text-[30px] leading-[1.14] text-cream-light md:text-[38px]">
              How this is calculated
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-[36px] grid gap-[16px] md:grid-cols-3">
              {[
                {
                  n: '01',
                  title: 'Per workflow, not per seat',
                  body: 'Each workflow carries a before and after time. Your monthly volume times the minutes returned is the hours that workflow gives back each month. Nothing is assumed about work Cooper does not touch.',
                },
                {
                  n: '02',
                  title: 'Hours priced at your cost',
                  body: `Monthly hours times your fully loaded hourly cost. The ${usd(BLENDED_HOURLY_COST)} default is a blended rate for the people doing this work; change it to yours.`,
                },
                {
                  n: '03',
                  title: 'Where the times come from',
                  body: "The before and after times are Cooper's internal estimates of how these workflows run in practice. They are not audited customer averages, and your mix will differ.",
                },
              ].map((s) => (
                <div key={s.n} className="rounded-[16px] border border-cream-light/10 bg-cream-light/[0.03] p-[26px]">
                  <span className="font-grotesk text-[13px] font-medium text-cream-light/30">{s.n}</span>
                  <h3 className="mb-[10px] mt-[14px] font-serif text-[21px] text-cream-light">{s.title}</h3>
                  <p className="font-sans text-[14.5px] leading-[1.55] text-cream-light/50">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-[28px] max-w-[760px] font-sans text-[13.5px] leading-[1.6] text-cream-light/40">
              These are estimates for discussion, not a quote or a guarantee. Cooper does not promise any particular amount of time saved or cost avoided. Actual results depend on your book, your systems, and how your team adopts Cooper.
            </p>
          </Reveal>
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
