import { useEffect, useRef } from 'react'

interface TurnstileOptions {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  appearance?: 'always' | 'execute' | 'interaction-only'
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileOptions) => string
      remove: (id: string) => void
      reset: (id?: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

// Load the Turnstile script once per page, regardless of how many widgets mount.
function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

interface TurnstileProps {
  siteKey: string
  onToken: (token: string) => void
  onExpire?: () => void
  className?: string
  // 'always' shows the classic Turnstile box.
  // 'interaction-only' keeps the widget invisible unless Cloudflare decides the
  // visitor needs to solve a challenge — use it on steps where we still need a
  // token but don't want a captcha widget cluttering the UI.
  appearance?: 'always' | 'execute' | 'interaction-only'
}

export default function Turnstile({ siteKey, onToken, onExpire, className, appearance = 'always' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Hold the latest callbacks in refs so the widget never re-renders just because
  // the parent passed a new inline function. Updated in an effect (not during
  // render) so the render stays pure.
  const onTokenRef = useRef(onToken)
  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onTokenRef.current = onToken
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    let cancelled = false
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': () => onExpireRef.current?.(),
          theme: 'light',
          appearance,
        })
      })
      .catch(() => {
        /* network/script failure — the form still blocks submit without a token */
      })

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch {
          /* widget already gone */
        }
        widgetId.current = null
      }
    }
  }, [siteKey, appearance])

  return <div ref={containerRef} className={className} />
}
