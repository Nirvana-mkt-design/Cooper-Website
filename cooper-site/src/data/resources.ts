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

export const RESOURCES: Resource[] = [
  {
    to: '/integrations',
    title: 'Integrations',
    desc: 'Every system Cooper connects to, and how the data moves.',
    icon: Plugs,
  },
  {
    to: '/resources/roi-calculator',
    title: 'ROI Calculator',
    desc: 'Size the hours and revenue Cooper returns to your team.',
    icon: Calculator,
  },
  {
    to: '/resources/white-paper',
    title: 'White Paper',
    desc: 'How AI is changing the commercial submission workflow.',
    icon: FileText,
  },
]
