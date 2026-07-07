/* ──────────────────────────────────────────────────────────────
   Ashby Posting API — read-only helpers for the Careers pages.
   Key has read-only access to published job postings.
─────────────────────────────────────────────────────────────── */

const ORG = 'cooper-ai'
// Read-only Ashby Posting API key. Provided via env (VITE_ASHBY_POSTING_API_KEY)
// so it isn't hardcoded in source. Note: VITE_ vars are still embedded in the
// client bundle at build time — this is for rotation/hygiene, not true secrecy.
const API_KEY = import.meta.env.VITE_ASHBY_POSTING_API_KEY
const BASE = 'https://api.ashbyhq.com/posting-api'
const HEADERS = { 'ashby-api-key': API_KEY }

export interface AshbyJob {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  isRemote: boolean | null
  workplaceType: string
  jobUrl: string
  applyUrl: string
  publishedAt: string
  isListed: boolean
  descriptionHtml: string
  descriptionPlain: string
}

// Alias kept for compatibility
export type AshbyJobDetail = AshbyJob

/** Map Ashby internal dept names to display labels */
export function deptLabel(dept: string): string {
  switch (dept) {
    case 'R&D': return 'Engineering'
    case 'Sales and Marketing': return 'Sales & Marketing'
    case 'G&A': return 'Operations'
    default: return dept
  }
}

/** Format Ashby employment type to human-readable */
export function employmentLabel(type: string): string {
  switch (type) {
    case 'FullTime': return 'Full-time'
    case 'PartTime': return 'Part-time'
    case 'Contract': return 'Contract'
    case 'Intern': return 'Internship'
    default: return type
  }
}

/** Location string: city + remote tag if applicable */
export function locationLabel(job: Pick<AshbyJob, 'location' | 'isRemote' | 'workplaceType'>): string {
  if (job.workplaceType === 'Remote') return 'Remote'
  if (job.workplaceType === 'Hybrid') return `${job.location} / Remote`
  return job.location
}

export async function fetchJobs(): Promise<AshbyJob[]> {
  const res = await fetch(`${BASE}/job-board/${ORG}`, { headers: HEADERS })
  if (!res.ok) throw new Error('Failed to fetch jobs from Ashby')
  const data = await res.json()
  return (data.jobs as AshbyJob[]).filter((j) => j.isListed)
}

/** Find a single job by ID — reuses the full job-board fetch (descriptionHtml is included). */
export async function fetchJob(id: string): Promise<AshbyJobDetail> {
  const jobs = await fetchJobs()
  const job = jobs.find((j) => j.id === id)
  if (!job) throw new Error(`Job ${id} not found`)
  return job
}
