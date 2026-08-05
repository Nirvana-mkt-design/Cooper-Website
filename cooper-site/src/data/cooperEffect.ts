/**
 * "The Cooper Effect" workflow benchmarks — before/after minutes per task.
 *
 * SOURCE: Akhilesh's #proj-growth brief, 29 Jul 2026. His words: these are
 * "reasonable enough for campaign development" and "should ultimately be
 * replaced with observed customer benchmarks." They are internal estimates,
 * NOT measured customer averages.
 *
 * That distinction is load-bearing here. An ad that says "44× faster" is a
 * claim about a product; a calculator that turns the same number into a dollar
 * figure a prospect takes into a budget meeting is a claim about their
 * business. Do not describe these as observed results anywhere on the page
 * until they are — the copy in RoiCalculatorPage is worded accordingly.
 *
 * The $85/hr blended cost is Akhilesh's standard for the campaign, kept here so
 * the ads and the calculator cannot drift apart.
 */

/* Fully loaded hourly cost of the people doing this work.
   A licensed commercial CSR or account manager runs $55-70k salary; loaded with
   benefits, tax and overhead that is $75-95k, or $42-53 an hour over 1,800
   hours. The old $85 only held if producers were blended in, which overstated
   the cost of the work Cooper actually removes. $60 sits at the top of the
   CSR/AM band and is defensible without appealing to producer time. */
export const BLENDED_HOURLY_COST = 60

/**
 * Calculator assumptions, as opposed to the benchmarks above. These are ours,
 * not Akhilesh's — the source note applies to the workflow times only.
 *
 * FTE_HOURS: working hours in a year, net of PTO and holidays, behind the
 * "equivalent to N people" figure.
 * RAMP: year one is partial because a rollout takes a quarter or two to reach
 * every desk; years two and three run at the full rate. Stated on the page
 * rather than buried, since it is the assumption that most moves the total.
 */
export const FTE_HOURS = 1_800

/**
 * Volumes in the calculator scale off book size, anchored here: a book this
 * large runs roughly the `defaultVolume` on each workflow below. It is a
 * sizing convention, not a measurement — every derived volume stays editable,
 * and the page says so.
 */
export const REFERENCE_BOOK = 50_000_000

/** Reference team size that the volumes above describe. */
export const REFERENCE_HEADCOUNT = 25

/**
 * Accounts a month the reference volumes describe, so the calculator can work
 * from a single "how many accounts" number instead of fifteen volumes.
 */
export const REFERENCE_ACCOUNTS = 120

/**
 * ASSUMPTION, NOT A MEASUREMENT. A personal-lines account carries far less
 * paperwork than a commercial one: no supplementals, no carrier-portal
 * marketing across a panel, a much shorter application. This is the share of a
 * commercial account's manual work that a personal one costs.
 *
 * Nobody has measured this. It is the single least-supported number in the
 * model — correct it before this page carries any weight in a deal.
 */
export const PERSONAL_LINES_FACTOR = 0.35

/*
 * ────────────────────────────────────────────────────────────────
 * REVENUE ASSUMPTIONS — all three are unmeasured.
 *
 * The page's headline is now additional revenue, and it is the product of
 * these three numbers. That makes them the most consequential figures in the
 * codebase: change BIND_RATE from 22% to 30% and the headline moves 36%.
 * Get real values from the pilot data before this page goes in front of a
 * prospect.
 * ────────────────────────────────────────────────────────────────
 */

/** Share of quoted submissions that bind. */
export const BIND_RATE = 0.22

/** Commission or fee retained on an average bound policy. */
export const REVENUE_PER_POLICY = 2_500

/**
 * New accounts one person can realistically add per month.
 *
 * Freed hours alone imply enormous growth, because a submission costs a
 * fraction of what it used to once Cooper does the assembly — the raw ops
 * capacity works out to several hundred extra accounts a month, which no
 * broker would believe. The real limit is people: someone still has to source
 * the business, talk to the client, and service what gets bound.
 *
 * Expressing that limit per person rather than as a share of current volume is
 * what makes team size actually move the estimate.
 */
export const NEW_ACCOUNTS_PER_PERSON = 1

/**
 * Human hours a new account costs regardless of Cooper: sourcing it, the
 * client conversations, servicing what gets bound. This is the second limit,
 * and it is the one that scales with the freed hours.
 *
 * Both limits have to be modelled or one slider silently stops mattering:
 * bound only by people and volume is inert, bound only by hours and team size
 * is inert. Which one binds depends on the inputs, and the page says which.
 */
export const HOURS_TO_WIN_AN_ACCOUNT = 32

/**
 * What a personal-lines policy is worth against a commercial one. Personal
 * lines carry far smaller commissions, so a book that shifts personal takes on
 * more accounts but earns less per account. Unmeasured, like the rest.
 */
export const PERSONAL_REVENUE_FACTOR = 0.15

/* Retained for reference; the calculator no longer applies it. Discounting year
   one meant the page showed two different annual figures at once — the headline
   and the first-12-months column — which cost more in credibility than the
   conservatism bought. */
export const RAMP = [0.6, 1, 1] as const

export interface Workflow {
  id: string
  label: string
  /** Minutes per task without Cooper. */
  before: number
  /** Minutes per task with Cooper. */
  after: number
  /** Present means the calculator pre-ticks it at this many tasks per month. */
  defaultVolume?: number
}

/* Ordered as Akhilesh listed them: submission-flow work first, then claims. */
export const WORKFLOWS: Workflow[] = [
  { id: 'proposal', label: 'Create a proposal', before: 132, after: 3, defaultVolume: 30 },
  { id: 'submission', label: 'Process a submission', before: 45, after: 4, defaultVolume: 120 },
  { id: 'application', label: 'Complete an application', before: 90, after: 7, defaultVolume: 60 },
  { id: 'portal', label: 'Enter data into carrier portals', before: 150, after: 12, defaultVolume: 60 },
  { id: 'quotes', label: 'Compare quotes', before: 60, after: 5, defaultVolume: 40 },
  { id: 'client-proposal', label: 'Build a client proposal from quotes', before: 90, after: 6, defaultVolume: 30 },
  { id: 'renewal', label: 'Prepare a renewal', before: 180, after: 15, defaultVolume: 25 },
  { id: 'loss-runs', label: 'Review loss runs', before: 45, after: 4, defaultVolume: 60 },
  { id: 'policy-check', label: 'Check a policy', before: 120, after: 10, defaultVolume: 30 },
  { id: 'supplemental', label: 'Complete a supplemental', before: 75, after: 6, defaultVolume: 40 },
  { id: 'ams-update', label: 'Update AMS/CRM from email', before: 15, after: 1, defaultVolume: 200 },
  { id: 'fnol', label: 'Process an FNOL', before: 30, after: 3, defaultVolume: 50 },
  { id: 'claim-docs', label: 'Review claim documents', before: 45, after: 5, defaultVolume: 60 },
  { id: 'claim-status', label: 'Prepare a claim status update', before: 20, after: 2, defaultVolume: 80 },
  { id: 'bordereaux', label: 'Process a bordereaux', before: 240, after: 20, defaultVolume: 4 },
]

/** Minutes returned per task. */
export const minutesSaved = (w: Workflow) => w.before - w.after

/** "44× faster" — the headline multiple Akhilesh standardised on. */
export const speedMultiple = (w: Workflow) => w.before / w.after

/*
 * ────────────────────────────────────────────────────────────────
 * WHAT "VALUE CREATED" MEANS.
 *
 * One number, one multiplication: the hours Cooper removes from an account,
 * priced at what those hours cost, halved.
 *
 * The halving is the honest part. An agency does not bank freed hours — they
 * are money only once they turn into business the team had no time to write, or
 * a hire that stops being necessary. Reporting the gross figure as "value" is
 * the easiest way to lose the argument in a budget meeting, because the first
 * question is whose salary goes away.
 *
 * This replaced a model with eight constants, two capacity ceilings and a
 * bind-rate chain. That model produced a number within a few percent of this
 * one across the whole slider range, so all it bought was a result nobody could
 * explain without a diagram. The bind-rate chain below still drives the tiles,
 * where it says something concrete; it no longer feeds the headline.
 *
 * Half is a stated haircut, not a tuned constant — which is the point. It can
 * be argued with directly, and pilot data can replace it.
 * ────────────────────────────────────────────────────────────────
 */
export const HOURS_REALIZATION = 0.5

/** Annual price at the reference volume, for sanity-checking the model. */
export const REFERENCE_ANNUAL_PRICE = 50_000
