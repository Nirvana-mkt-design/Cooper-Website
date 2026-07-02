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
    { value: '84%', label: 'less ACORD & portal data-entry time' },
    { value: '2.6×', label: 'more submissions per producer' },
    { value: '97%', label: 'carrier tasks completed autonomously' },
  ],
  'wholesale-brokers': [
    { value: '78%', label: 'less submission-to-proposal time' },
    { value: '3.4×', label: 'market submissions match accuracy' },
  ],
  'mgas-insurers': [
    { value: '71%', label: 'less underwriting decision time' },
    { value: '2.8×', label: 'premium per underwriter, no new hires' },
    { value: '23%', label: 'less pre-audit leakage' },
  ],
  'claims-tpas': [
    { value: '60%', label: 'less FNOL-to-assignment time' },
    { value: '48%', label: 'more claims handled per adjuster' },
  ],
  reinsurers: [
    { value: '85%', label: 'less bordereaux normalization time' },
    { value: '2.4×', label: 'treaties renewed per analyst' },
    { value: '99%', label: 'treaty term & accumulation accuracy' },
  ],
}

export const getHeroImage = (slug: string) => heroImages[slug] ?? heroImages[RETAIL]
export const getFeatureImages = (slug: string) => featureImages[slug] ?? featureImages[RETAIL]
export const getStatsBand = (slug: string) => statsBands[slug] ?? []
