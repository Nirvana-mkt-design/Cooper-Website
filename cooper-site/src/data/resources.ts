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

/* ── The ROI calculator is a draft again.
   #78 published it, but its value model was rebuilt afterwards and "The method"
   section — which carried the only disclaimer on the page — was removed with
   it. Until a disclaimer is back, it stays out of production: this list, the
   route and dynamic import in App.tsx, and the prerender list.

   Spread in conditionally rather than filtered afterwards. A filter runs at
   runtime, so the title and path would ship in the bundle and merely be hidden;
   the conditional spread lets a production build drop them.

   Its figures come from Akhilesh's brief rather than from measured customer
   results, and the page says so in "The method". Read the source note at the
   top of src/data/cooperEffect.ts before touching any number on it. */
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
