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
    '/images/persona/persona-retail-1.webp',
    '/images/persona/persona-retail-2.webp',
    '/images/persona/persona-retail-3.webp',
    '/images/persona/persona-retail-1.webp',
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
    { value: '700+', label: 'carrier portal tasks submitted autonomously' },
    { value: '3+ hrs', label: 'of producer time saved, every week' },
    { value: '90%', label: 'faster ACORD and portal submissions' },
  ],
}

export const getHeroImage = (slug: string) => heroImages[slug] ?? heroImages[RETAIL]
export const getFeatureImages = (slug: string) => featureImages[slug] ?? featureImages[RETAIL]
export const getStatsBand = (slug: string) => statsBands[slug] ?? statsBands[RETAIL]
