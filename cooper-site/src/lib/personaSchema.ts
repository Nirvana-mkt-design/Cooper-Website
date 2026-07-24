import type { Persona } from '../data/personas'
import { SITE_ORIGIN, absoluteUrl } from './site'

/**
 * Structured data for a persona ("product") page.
 *
 * - WebPage        → the page itself, tied to the site + Cooper software entity,
 *                    with the target audience (this role) attached.
 * - BreadcrumbList  → Home › {Role}. Eligible for the breadcrumb SERP rich result.
 * - SoftwareApplication → Cooper as a product entity (shared @id across pages so
 *                    Google consolidates it). No fabricated price/rating, so it
 *                    carries entity signal without claiming a rich result it
 *                    can't back up.
 *
 * Organization + WebSite are defined once statically in index.html and referenced
 * here by @id, so Google merges everything into one graph for the site.
 */
export function personaJsonLd(persona: Persona) {
  const pageUrl = absoluteUrl(`/product/${persona.slug}`)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Cooper for ${persona.name}`,
        description: persona.subtitle,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#cooper` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        audience: { '@type': 'Audience', audienceType: persona.name },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: persona.name, item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_ORIGIN}/#cooper`,
        name: 'Cooper',
        url: `${SITE_ORIGIN}/`,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Insurance Workflow Automation',
        operatingSystem: 'Web',
        description:
          'Cooper is an AI platform built for insurance professionals. It automates submissions, renewals, coverage checks, certificates, and reporting for agencies, brokers, MGAs, insurers, claims TPAs, and reinsurers.',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
    ],
  }
}
