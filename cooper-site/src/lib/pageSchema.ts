import { SITE_ORIGIN, absoluteUrl } from './site'

/**
 * Generic WebPage + BreadcrumbList (Home › {name}) for standalone pages
 * (About, Demo, etc.). Ties the page to the site's WebSite entity and gives
 * Google a breadcrumb, which is eligible for the breadcrumb SERP rich result.
 */
export function pageJsonLd({
  name,
  path,
  description,
}: {
  name: string
  path: string
  description?: string
}) {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        ...(description ? { description } : {}),
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  }
}
