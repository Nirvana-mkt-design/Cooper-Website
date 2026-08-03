import type { ComponentType } from 'react'
import { Plugs, FileText, Calculator } from '@phosphor-icons/react'

/**
 * The Resources catalog — one list behind the Resources nav dropdown and the
 * footer column, so a new resource is added once and appears in both.
 *
 * There is no /resources hub page; each entry is its own route.
 */
export interface Resource {
  to: string
  title: string
  /** One line, shown under the title in the nav dropdown. */
  desc: string
  icon: ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular'; className?: string }>
}

/* ── Drafts.

   The ROI calculator is built but not published. It runs on a dev server and
   is absent from production entirely: no nav entry, no route — App.tsx gates
   it the same way, so a direct URL 404s rather than half-loading a page nobody
   linked — no prerendered page, and nothing in the sitemap.

   Spread in conditionally rather than filtered out afterwards. A filter runs
   at runtime, which means the title and the path ship in the bundle and are
   merely hidden; the conditional spread lets a production build drop them.

   Publishing it is three edits, all marked: move it out of the conditional
   below, restore the route in App.tsx, and add it back to the list in
   scripts/prerender.cjs. ── */
const roiCalculator: Resource = {
  to: '/resources/roi-calculator',
  title: 'ROI Calculator',
  desc: 'Size the hours and revenue Cooper returns to your team.',
  icon: Calculator,
}

export const RESOURCES: Resource[] = [
  {
    to: '/integrations',
    title: 'Integrations',
    desc: 'Every system Cooper connects to, and how the data moves.',
    icon: Plugs,
  },
  ...(import.meta.env.DEV ? [roiCalculator] : []),
  {
    to: '/resources/white-paper',
    title: 'White Paper',
    desc: 'How AI is changing the commercial submission workflow.',
    icon: FileText,
  },
]
