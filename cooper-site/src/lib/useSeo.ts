import { useEffect } from 'react'
import { absoluteUrl } from './site'

export interface SeoOptions {
  /** Document <title>. */
  title: string
  /** Meta description for the SERP snippet. */
  description?: string
  /** Root-relative path for the canonical URL, e.g. "/personas/retail-agencies". */
  canonicalPath?: string
  /** When true, adds <meta name="robots" content="noindex, follow">. */
  noindex?: boolean
  /** JSON-LD structured data (single object or an array). Injected as a script tag. */
  jsonLd?: object | object[]
}

/** Upsert a <meta> by name/property and return a restore callback. */
function upsertMeta(key: 'name' | 'property', value: string, content: string | undefined) {
  if (content == null) return () => {}
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`)
  const created = !el
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  const prev = el.getAttribute('content')
  el.setAttribute('content', content)
  return () => {
    if (created) el!.remove()
    else if (prev != null) el!.setAttribute('content', prev)
  }
}

function upsertCanonical(href: string | undefined) {
  if (!href) return () => {}
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const created = !el
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  const prev = el.getAttribute('href')
  el.setAttribute('href', href)
  return () => {
    if (created) el!.remove()
    else if (prev != null) el!.setAttribute('href', prev)
  }
}

/**
 * Client-side SEO for the SPA: sets per-route title, description, canonical,
 * robots, Open Graph fields, and injects JSON-LD. Everything is restored on
 * unmount so navigating back to a route without useSeo (e.g. the Home page,
 * whose tags live statically in index.html) returns to the default head.
 *
 * Google renders the app before indexing, so these client-set tags are read.
 */
export function useSeo({ title, description, canonicalPath, noindex, jsonLd }: SeoOptions) {
  // Serialize jsonLd so the effect re-runs only when its content changes.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const canonical = canonicalPath ? absoluteUrl(canonicalPath) : undefined

    const prevTitle = document.title
    document.title = title

    const restores = [
      upsertMeta('name', 'description', description),
      upsertCanonical(canonical),
      upsertMeta('property', 'og:title', title),
      upsertMeta('property', 'og:description', description),
      upsertMeta('property', 'og:url', canonical),
      upsertMeta('name', 'twitter:title', title),
      upsertMeta('name', 'twitter:description', description),
      noindex ? upsertMeta('name', 'robots', 'noindex, follow') : () => {},
    ]

    let script: HTMLScriptElement | undefined
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'route')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.title = prevTitle
      restores.forEach((restore) => restore())
      script?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonicalPath, noindex, jsonLdKey])
}
