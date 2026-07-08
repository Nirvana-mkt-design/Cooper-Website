/* Media + stat content for the persona pages (redesigned hero/sections).
   Only Retail has real Figma assets/stats so far — other personas fall back
   to the Retail set as placeholders until their own assets land. */

export type Stat = { value: string; label: string }

const RETAIL = 'retail-agencies'

export const heroImages: Record<string, string> = {
  'retail-agencies': '/images/persona/persona-retail-hero.webp',
  'wholesale-brokers': '/images/persona/persona-wholesale-hero.webp',
  'mgas-insurers': '/images/persona/persona-mgas-hero.webp',
  'claims-tpas': '/images/persona/persona-claims-hero.webp',
  reinsurers: '/images/persona/persona-reinsurers-hero.webp',
}

export const featureImages: Record<string, string[]> = {
  'retail-agencies': [
    '/images/persona/persona-retail-1.jpg',
    '/images/persona/persona-retail-2.jpg',
    '/images/persona/persona-retail-3.jpg',
    '/images/persona/persona-retail-1.jpg',
  ],
  'wholesale-brokers': [
    '/images/persona/persona-wholesale-1.webp',
    '/images/persona/persona-wholesale-2.webp',
    '/images/persona/persona-wholesale-3.webp',
    '/images/persona/persona-wholesale-1.webp',
  ],
  'mgas-insurers': [
    '/images/persona/persona-mgas-1.webp',
    '/images/persona/persona-mgas-2.webp',
    '/images/persona/persona-mgas-3.webp',
    '/images/persona/persona-mgas-1.webp',
  ],
  'claims-tpas': [
    '/images/persona/persona-claims-1.webp',
    '/images/persona/persona-claims-2.webp',
    '/images/persona/persona-claims-3.webp',
    '/images/persona/persona-claims-1.webp',
  ],
  reinsurers: [
    '/images/persona/persona-reinsurers-1.webp',
    '/images/persona/persona-reinsurers-2.webp',
    '/images/persona/persona-reinsurers-3.webp',
    '/images/persona/persona-reinsurers-1.webp',
  ],
}

export const statsBands: Record<string, Stat[]> = {
  'retail-agencies': [
    { value: '3×', label: 'more submissions per producer' },
    { value: '97%', label: 'carrier tasks completed autonomously' },
    { value: '4×', label: 'faster to first quote' },
  ],
  'wholesale-brokers': [
    { value: '3×', label: 'more markets reached per risk' },
    { value: '91%', label: 'of risks matched to a writing market' },
    { value: '2 hrs', label: 'to proposal back to the retailer' },
  ],
  'mgas-insurers': [
    { value: '99.2%', label: 'guideline adherence on bound policies' },
    { value: '2×', label: 'premium per underwriter' },
    { value: '83%', label: 'of pre-audit leakage caught before it binds' },
  ],
  'claims-tpas': [
    { value: '38%', label: 'faster cycle time' },
    { value: '4 days', label: 'to first payout' },
    { value: '0', label: 'claims left unassigned' },
  ],
  reinsurers: [
    { value: '85%', label: 'less bordereaux normalization time' },
    { value: '3×', label: 'treaties renewed per analyst' },
    { value: '99%', label: 'treaty term & accumulation accuracy' },
  ],
}

export const getHeroImage = (slug: string) => heroImages[slug] ?? heroImages[RETAIL]
export const getFeatureImages = (slug: string) => featureImages[slug] ?? featureImages[RETAIL]
export const getStatsBand = (slug: string) => statsBands[slug] ?? []
