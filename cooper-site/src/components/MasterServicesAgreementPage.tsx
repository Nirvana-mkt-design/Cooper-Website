import { useSeo } from '../lib/useSeo'
import LegalDocPage from './LegalDocPage'
import content from '../content/legal/master-services-agreement.md?raw'

export default function MasterServicesAgreementPage() {
  useSeo({
    title: 'Master Services Agreement — Cooper',
    description: "Cooper's Master Services Agreement governing the use of our platform.",
    canonicalPath: '/master-services-agreement',
  })

  return <LegalDocPage title="Master Services Agreement" effectiveDate="January 8, 2026" content={content} />
}
