import { useSeo } from '../lib/useSeo'
import LegalDocPage from './LegalDocPage'
import content from '../content/legal/master-services-agreement-hipaa.md?raw'

export default function MasterServicesAgreementHipaaPage() {
  useSeo({
    title: 'Master Services Agreement (HIPAA) — Cooper',
    description:
      "Cooper's Master Services Agreement for customers that receive or handle Protected Health Information.",
    canonicalPath: '/master-services-agreement-hipaa',
  })

  return (
    <LegalDocPage
      title="Master Services Agreement"
      subtitle="For customers that receive or handle Protected Health Information"
      effectiveDate="July 2026"
      content={content}
    />
  )
}
