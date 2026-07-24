import { useSeo } from '../lib/useSeo'
import LegalDocPage from './LegalDocPage'
import content from '../content/legal/data-processing-addendum.md?raw'

export default function DataProcessingAddendumPage() {
  useSeo({
    title: 'Data Processing Addendum — Cooper',
    description: "Cooper's Data Processing Addendum for data protection compliance.",
    canonicalPath: '/data-processing-addendum',
  })

  return <LegalDocPage title="Data Processing Addendum" effectiveDate="January 2026" content={content} />
}
