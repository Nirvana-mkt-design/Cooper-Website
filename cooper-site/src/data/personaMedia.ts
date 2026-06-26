/* Media + stat content for the persona pages (redesigned hero/sections).
   Only Retail has real Figma assets/stats so far — other personas fall back
   to the Retail set as placeholders until their own assets land. */

export type Stat = { value: string; label: string }

const RETAIL = 'retail-agencies'

export const heroImages: Record<string, string> = {
  'retail-agencies': '/images/persona/persona-retail-hero.webp',
}

export const featureImages: Record<string, string[]> = {
  'retail-agencies': [
    '/images/persona/persona-retail-1.webp',
    '/images/persona/persona-retail-2.webp',
    '/images/persona/persona-retail-3.webp',
    '/images/persona/persona-retail-1.webp',
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
