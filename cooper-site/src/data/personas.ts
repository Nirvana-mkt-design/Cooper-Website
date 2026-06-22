export interface Feature {
  title: string
  description: string
}

export interface Persona {
  slug: string
  name: string
  label: string
  headline: string
  subtitle: string
  features: Feature[]
  testimonialQuote: string
  testimonialAuthor: string
  testimonialRole: string
  ctaText: string
}

export const personas: Persona[] = [
  {
    slug: 'retail-agencies',
    name: 'Retail Agencies',
    label: 'RETAIL AGENCIES',
    headline: 'Your producers should be selling, not typing',
    subtitle:
      'Cooper is built for both account managers and producers. It automates the data entry, submissions, renewals, and certificate work that keeps your team buried, so they can focus on clients and revenue.',
    features: [
      {
        title: 'Stop typing the same data twice',
        description:
          'Cooper reads your dec pages, loss runs, and emails, then writes the details straight into Applied Epic, AMS360, HawkSoft, or whatever system you use, and into every carrier portal. You review instead of retype.',
      },
      {
        title: 'Walk into every meeting quote-ready',
        description:
          'Cooper builds submissions from what you already have on the account, spots coverage gaps worth a conversation, and fills out each carrier\'s application automatically. Your producers sell instead of doing paperwork.',
      },
      {
        title: 'Never miss a renewal or a coverage change',
        description:
          'Cooper tracks every renewal date, reads the actual policy forms, and flags the sublimit or exclusion changes that matter. You get a plain-language comparison drafted and ready for your client.',
      },
      {
        title: 'Certificates that check themselves',
        description:
          'Cooper verifies every COI and endorsement against the bound policy before it goes out. Routine requests ship automatically, only the real exceptions land on your desk.',
      },
    ],
    testimonialQuote:
      'We used to spend half the day re-keying data. Now our producers actually have time to sell.',
    testimonialAuthor: 'Agency Principal',
    testimonialRole: 'Regional P&C Agency',
    ctaText: 'See how Cooper works for your agency',
  },
  {
    slug: 'wholesale-brokers',
    name: 'Wholesale Brokers',
    label: 'WHOLESALE BROKERS',
    headline: 'The first quote back wins. Make sure it\'s yours.',
    subtitle:
      'Cooper triages submissions, matches risks to markets, and gets proposals out while the deal is still warm. Your brokers place more business, faster.',
    features: [
      {
        title: 'Know which submissions are worth your time',
        description:
          'Cooper reads every attachment, clears each risk against your book, and tells the retailer exactly what\'s missing. You see only complete, in-appetite submissions worth working.',
      },
      {
        title: 'Match risks to markets automatically',
        description:
          'Cooper learns from your carriers\' guidelines and your own quoting history, then points each risk at the markets most likely to write it competitively instantly with the reasoning shown.',
      },
      {
        title: 'Respond first and win the deal',
        description:
          'Cooper normalizes every carrier\'s quote into one clean comparison, drafts the proposal in your style, and gets it back to the retailer while the deal is still warm.',
      },
      {
        title: 'Placement and compliance, together',
        description:
          'Cooper tracks binding authority, pre-fills binders and invoices, and prepares each state\'s surplus-lines filing on time. Now, placement and compliance move together instead of one waiting on the other.',
      },
    ],
    testimonialQuote:
      'The first quote back usually wins. Cooper makes sure that\'s us.',
    testimonialAuthor: 'VP of Brokerage',
    testimonialRole: 'National Wholesale Broker',
    ctaText: 'See how Cooper places business faster',
  },
  {
    slug: 'mgas-insurers',
    name: 'MGAs & Insurers',
    label: 'MGAS & INSURERS',
    headline: 'Scale underwriting without scaling headcount',
    subtitle:
      'Cooper enforces your guidelines, prices risks consistently, and keeps every program audit-ready, so you grow your book without growing your team.',
    features: [
      {
        title: 'Underwrite by your guidelines, every time',
        description:
          'Cooper checks each risk against your program\'s own guidelines and referral rules, then clears, refers, or declines with the reason attached. Every decision lines up with the authority you were given.',
      },
      {
        title: 'Price risks consistently at scale',
        description:
          'Cooper pulls exposure and prior-loss detail, applies your rating logic, and benchmarks against similar accounts you\'ve already written. Underwriters spend time on judgment, not assembly.',
      },
      {
        title: 'Catch leakage before the audit does',
        description:
          'Cooper applies the right rates, rules, and forms for each program automatically and flags anything drifting outside authority, so you stay audit-ready with a full trail behind every bind.',
      },
      {
        title: 'Bordereaux that build themselves',
        description:
          'Cooper assembles each carrier\'s bordereaux in their exact format, reconciled against your bound policies. Reporting ties out and goes out on time, no more rebuilding spreadsheets.',
      },
    ],
    testimonialQuote:
      'We doubled our program count without adding a single underwriter.',
    testimonialAuthor: 'Chief Underwriting Officer',
    testimonialRole: 'Specialty MGA',
    ctaText: 'See how Cooper scales your underwriting',
  },
  {
    slug: 'claims-tpas',
    name: 'Claims TPAs',
    label: 'CLAIMS TPAS',
    headline: 'Handle more claims without missing a beat',
    subtitle:
      'Cooper takes care of intake, coverage checks, and reporting, so your adjusters focus on the files that need real judgment.',
    features: [
      {
        title: 'Every claim starts clean',
        description:
          'Cooper takes the loss notice from any channel (phone, email, portal, fax), organizes it into a clean file, matches it to the right policy, and acknowledges within your client\'s SLA window.',
      },
      {
        title: 'Spot recovery and fraud signals early',
        description:
          'Cooper reads each new loss for subrogation potential and fraud patterns, flags the files worth a referral, and shows what it found, so dollars that belong back in the file don\'t get written off.',
      },
      {
        title: 'Coverage calls backed by the actual policy',
        description:
          'Cooper reads the specific policy against the facts of each loss, lays out limits, deductibles, and exclusions that apply, and shows the contract language, so adjusters make the right call, fast.',
      },
      {
        title: 'Reporting that\'s always ready',
        description:
          'Cooper keeps file notes and diaries current, suggests reserves based on your claims history, and produces loss runs and large-loss reports on demand. Nothing goes stale.',
      },
    ],
    testimonialQuote:
      'Our adjusters handle 40% more files and our SLA compliance has never been better.',
    testimonialAuthor: 'VP of Claims Operations',
    testimonialRole: 'National Claims TPA',
    ctaText: 'See how Cooper streamlines your claims',
  },
  {
    slug: 'reinsurers',
    name: 'Reinsurers',
    label: 'REINSURERS',
    headline: 'Walk into renewal season prepared, not scrambling',
    subtitle:
      'Cooper cleans cedent data, tracks accumulation, enforces treaty terms, and assembles renewal files, so your team focuses on pricing and relationships.',
    features: [
      {
        title: 'Clean cedent data from day one',
        description:
          'Cooper maps each cedent\'s file into your standard format, flags gaps and inconsistencies, and delivers clean, usable data, so your analysts start working instead of cleaning.',
      },
      {
        title: 'See concentration before it\'s a problem',
        description:
          'Cooper aggregates exposure by peril, geography, and insured across your entire portfolio and checks it against your tolerances, so you spot accumulation building well ahead of time.',
      },
      {
        title: 'Hold cedents to the terms you negotiated',
        description:
          'Cooper reads your treaty and facultative wordings, checks cedent statements and claims against the right contract, and flags anything off-contract, so the terms actually stick.',
      },
      {
        title: 'Renewal season on prepared files',
        description:
          'Cooper assembles experience and exposure history for each renewing treaty, lines it up with your modeled output, and drafts the pricing view, so the season runs on prepared files, not scrambles.',
      },
    ],
    testimonialQuote:
      'Renewal season used to mean three weeks of spreadsheet hell. Now we walk in prepared.',
    testimonialAuthor: 'Treaty Underwriter',
    testimonialRole: 'Global Reinsurer',
    ctaText: 'See how Cooper prepares your renewals',
  },
]

export function getPersonaBySlug(slug: string): Persona | undefined {
  return personas.find((p) => p.slug === slug)
}
