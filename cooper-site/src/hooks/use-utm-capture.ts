import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY = 'cooper_ad_params'

// Standard UTM params
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

// Platform click IDs — used for conversion matching on each ad platform
const CLICK_ID_KEYS = [
  'gclid',      // Google Ads
  'fbclid',     // Meta (Facebook / Instagram)
  'msclkid',    // Microsoft / Bing Ads
  'ttclid',     // TikTok Ads
  'li_fat_id',  // LinkedIn Ads
  'twclid',     // X (Twitter) Ads
  'igshid',     // Instagram (organic shares, sometimes present on paid)
  'sscid',      // ShareASale / affiliate
]

// Reads UTM params and platform click IDs from the URL on first visit and persists them for the session.
// Existing values are never overwritten so the original acquisition source is preserved.
export function useUtmCapture() {
  const { search } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const found: Record<string, string> = {}
    for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
      const val = params.get(key)
      if (val) found[key] = val
    }
    if (Object.keys(found).length === 0) return

    // Merge with whatever is already stored — first touch wins per key.
    const existing = (() => {
      try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
    })()
    const merged = { ...found, ...existing }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  }, [search])
}
