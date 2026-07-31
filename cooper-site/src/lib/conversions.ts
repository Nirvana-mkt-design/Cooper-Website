// Conversion value reported to every ad platform (Google Ads, Meta, OpenAI)
// for a demo/lead. Larger prospects are worth more to us, so we weight the
// value the ad networks optimize for accordingly. Change values in one place
// here.
//
// Two shapes of value:
//
// 1. For 11+-employee prospects, headcount alone is a strong-enough signal —
//    the demo form skips the qualify step for them, so book-of-business /
//    AI-budget aren't collected — and we use LEAD_VALUE_BY_EMPLOYEE_COUNT.
//
// 2. For 1-5- and 6-10-employee prospects and prospects who left headcount
//    blank, the demo form requires both qualifying answers (annual book of
//    business, annual AI-software budget), and we look the value up in a
//    4x4 joint table on those two answers instead — a small boutique with a
//    $25M+ book and a $25K+ budget is worth much more to us than a small
//    shop with no book and no budget. 6-10 prospects use a separate table
//    (QUALIFYING_LEAD_VALUE_6_10) with strictly higher values than the
//    1-5/unknown table (QUALIFYING_LEAD_VALUE_1_5_OR_UNKNOWN) — a qualified
//    6-10 shop with real book and budget can even exceed the flat 11-25
//    value, since we trust the qualifying signal more than raw headcount.
//
// Bucket lists and the joint table are typed as `Record<Bucket, ...>` so
// adding/renaming a bucket without giving it a value is a compile error
// rather than a silent fallback to the default.

export const EMPLOYEE_COUNTS = ['1-5', '6-10', '11-25', '26-50', '51-99', '100+'] as const

export type EmployeeCount = (typeof EMPLOYEE_COUNTS)[number]

// Kept in sync by hand with the backend allowlists
// (BOOK_OF_BUSINESS_BUCKETS / SOFTWARE_BUDGET_BUCKETS in
// backend/apps/core/demo_requests/schemas.py). Same en-dash character (–) in
// both places — hyphen vs en-dash would fail the server validator and drop
// the value silently.
export const BOOK_OF_BUSINESS_BUCKETS = [
  'Under $5M',
  '$5M – $10M',
  '$10M – $25M',
  '$25M+',
] as const

export type BookOfBusiness = (typeof BOOK_OF_BUSINESS_BUCKETS)[number]

export const SOFTWARE_BUDGET_BUCKETS = [
  'Under $5K',
  '$5K – $10K',
  '$10K – $25K',
  '$25K+',
] as const

export type SoftwareBudget = (typeof SOFTWARE_BUDGET_BUCKETS)[number]

// Lookup for prospects large enough to skip the qualify step (11+ employees).
const LEAD_VALUE_BY_EMPLOYEE_COUNT: Record<EmployeeCount, number> = {
  // 1-5 and 6-10 are present so the map is exhaustive, but they're not read:
  // both go through QUALIFYING_LEAD_VALUE instead. Kept in sync so moving a
  // bucket between the qualifying and headcount paths is a one-line change.
  '1-5': 50,
  '6-10': 100,
  '11-25': 250,
  '26-50': 500,
  '51-99': 1000,
  '100+': 2000,
}

// Joint value table for 1-5-employee and blank-headcount prospects, indexed
// by [book of business][annual AI-software budget]. Both axes ascend from
// smallest to largest bucket; values are USD.
const QUALIFYING_LEAD_VALUE_1_5_OR_UNKNOWN: Record<BookOfBusiness, Record<SoftwareBudget, number>> = {
  'Under $5M':   { 'Under $5K': 1,  '$5K – $10K': 5,  '$10K – $25K': 25,  '$25K+': 50  },
  '$5M – $10M':  { 'Under $5K': 5,  '$5K – $10K': 25, '$10K – $25K': 50,  '$25K+': 50  },
  '$10M – $25M': { 'Under $5K': 25, '$5K – $10K': 50, '$10K – $25K': 75,  '$25K+': 100 },
  '$25M+':       { 'Under $5K': 50, '$5K – $10K': 75, '$10K – $25K': 150, '$25K+': 200 },
}

// Joint value table for 6-10-employee prospects. Same shape as the 1-5 table,
// stepped up in every cell — a 6-10 shop with real book and budget is a
// meaningfully stronger signal than a 1-5 shop. The top-right corner is
// allowed to exceed the flat 11-25 value ($250 in LEAD_VALUE_BY_EMPLOYEE_COUNT)
// because a fully-qualified 6-10 lead beats an unqualified 11-25 lead — the
// qualifying answers are a better signal than raw headcount at this size.
const QUALIFYING_LEAD_VALUE_6_10: Record<BookOfBusiness, Record<SoftwareBudget, number>> = {
  'Under $5M':   { 'Under $5K': 5,  '$5K – $10K': 15,  '$10K – $25K': 50,  '$25K+': 75  },
  '$5M – $10M':  { 'Under $5K': 15, '$5K – $10K': 50,  '$10K – $25K': 100, '$25K+': 150 },
  '$10M – $25M': { 'Under $5K': 50, '$5K – $10K': 100, '$10K – $25K': 200, '$25K+': 300 },
  '$25M+':       { 'Under $5K': 75, '$5K – $10K': 150, '$10K – $25K': 300, '$25K+': 400 },
}

// Fallback for a small/unknown-headcount prospect that somehow reaches the
// trackers without both qualifying answers (the form validates them, so this
// shouldn't happen in practice). 1-5/unknown drops to $1 — the weakest
// possible signal, matching the smallest cell of the 1-5 table. 6-10 gets a
// slightly higher floor: we still know they're a bit larger than 1-5.
const QUALIFYING_FALLBACK_USD_1_5_OR_UNKNOWN = 1
const QUALIFYING_FALLBACK_USD_6_10 = 5

// True when the prospect goes through the qualifying step in the demo form
// (see needsQualifying in DemoPage) and their lead value comes from a
// (BoB, AI budget) joint table rather than the headcount map.
function usesQualifyingLookup(employeeCount: string | undefined | null): boolean {
  return !employeeCount || employeeCount === '1-5' || employeeCount === '6-10'
}

export function leadValueUsd(
  employeeCount: string | undefined | null,
  bookOfBusiness: string | undefined | null,
  softwareBudget: string | undefined | null,
): number {
  if (usesQualifyingLookup(employeeCount)) {
    const table =
      employeeCount === '6-10' ? QUALIFYING_LEAD_VALUE_6_10 : QUALIFYING_LEAD_VALUE_1_5_OR_UNKNOWN
    const fallback =
      employeeCount === '6-10' ? QUALIFYING_FALLBACK_USD_6_10 : QUALIFYING_FALLBACK_USD_1_5_OR_UNKNOWN
    const row = table[bookOfBusiness as BookOfBusiness]
    const value = row?.[softwareBudget as SoftwareBudget]
    return value ?? fallback
  }
  return (
    LEAD_VALUE_BY_EMPLOYEE_COUNT[employeeCount as EmployeeCount] ??
    QUALIFYING_FALLBACK_USD_1_5_OR_UNKNOWN
  )
}

// OpenAI's pixel takes `amount` in the currency's minor units (integer),
// e.g. $250.00 → 25000.
export function leadValueUsdMinor(
  employeeCount: string | undefined | null,
  bookOfBusiness: string | undefined | null,
  softwareBudget: string | undefined | null,
): number {
  return leadValueUsd(employeeCount, bookOfBusiness, softwareBudget) * 100
}
