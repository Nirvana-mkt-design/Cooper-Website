/* ──────────────────────────────────────────────────────────────
   CarrierWall — "Trusted by forward-thinking insurance teams".
   Left copy card + a grid of carrier logos. The whole grid fades
   out together, swaps to a different set of carriers, then fades
   back in (Mercury-style logo cloud — set A ↔ set B), looping.
   Logos render in a uniform monochrome grey. A few carriers have
   no clean SVG source, so they render as typographic wordmarks —
   visually consistent under the grey wash.
─────────────────────────────────────────────────────────────── */
import { useEffect, useState } from 'react'

type Carrier =
  | { name: string; src: string }
  | { name: string; word: true }

/* Set A — the carriers shown in the design (Hygor's approved set).
   Shown first (and as the static state when motion is reduced). */
const SET_A: Carrier[] = [
  { name: 'Nationwide', src: '/images/carriers/nationwide.png' },
  { name: 'The Hartford', src: '/images/carriers/the-hartford.png' },
  { name: 'Liberty Mutual', src: '/images/carriers/liberty-mutual.png' },
  { name: 'Zurich', src: '/images/carriers/zurich.png' },
  { name: 'Travelers', src: '/images/carriers/travelers.png' },
  { name: 'Chubb', src: '/images/carriers/chubb.png' },
  { name: 'Great American', word: true },
  { name: 'Nautilus', word: true },
  { name: 'CNA', src: '/images/carriers/cna.png' },
  { name: 'Markel', src: '/images/carriers/markel.png' },
  { name: 'AmTrust', word: true },
  { name: 'Progressive', src: '/images/carriers/progressive.png' },
]

/* Set B — a second wave of commercial P&C carriers that swaps in. */
const SET_B: Carrier[] = [
  { name: 'AIG', src: '/images/carriers/aig.png' },
  { name: 'Berkley', src: '/images/carriers/berkley.png' },
  { name: 'Cincinnati', src: '/images/carriers/cincinnati.png' },
  { name: 'The Hanover', src: '/images/carriers/hanover.png' },
  { name: 'Hiscox', src: '/images/carriers/hiscox.png' },
  { name: 'AXA', src: '/images/carriers/axa.png' },
  { name: 'Allianz', src: '/images/carriers/allianz.png' },
  { name: 'Philadelphia', word: true },
  { name: 'Starr', word: true },
  { name: 'RLI', word: true },
  { name: 'Tokio Marine', word: true },
  { name: 'Employers', word: true },
  { name: 'Acuity', word: true },
  { name: 'Auto-Owners', word: true },
  { name: 'Selective', word: true },
  { name: 'Sentry', word: true },
  { name: 'RSUI', word: true },
  { name: 'Donegal', word: true },
]

const SETS: Carrier[][] = [SET_A, SET_B]
const HOLD = 3000 // ms a set stays fully visible
const FADE = 600 // ms fade-out / fade-in duration

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduce(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduce
}

function Logo({ carrier }: { carrier: Carrier }) {
  if ('src' in carrier) {
    return (
      <img
        src={carrier.src}
        alt={carrier.name}
        loading="lazy"
        className="max-h-[44px] w-auto max-w-[78%] object-contain opacity-[0.5] grayscale"
      />
    )
  }
  return (
    <span className="font-grotesk text-[16px] font-medium tracking-[0.2px] text-dark/35">
      {carrier.name}
    </span>
  )
}

export default function CarrierWall() {
  const reduce = usePrefersReducedMotion()
  const [page, setPage] = useState(0)
  const [out, setOut] = useState(false)

  useEffect(() => {
    if (reduce || SETS.length < 2) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const after = (ms: number, fn: () => void) => {
      const t = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timers.push(t)
    }
    const loop = () => {
      setOut(true) // fade the whole grid out
      after(FADE, () => {
        setPage((p) => (p + 1) % SETS.length) // swap the set while invisible
        setOut(false) // fade the new set in
        after(HOLD + FADE, loop) // hold, then repeat
      })
    }
    after(HOLD, loop)
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  const current = SETS[page]

  return (
    <div className="mt-[24px] grid grid-cols-1 items-stretch gap-[24px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light p-[14px] md:grid-cols-[1fr_2fr]">
      {/* copy card */}
      <div className="flex flex-col justify-center rounded-[14px] bg-cream/50 p-[28px]">
        <p className="font-serif text-[24px] leading-[1.3] text-dark">
          Cooper works with all of your trusted carriers
        </p>
      </div>

      {/* logo grid — the cells and dividers stay put; only the
          logos inside fade out / in together as the set swaps */}
      <div className="grid grid-cols-2 gap-[1px] overflow-hidden rounded-[14px] bg-dark/[0.06] sm:grid-cols-3 lg:grid-cols-6">
        {current.map((carrier, cell) => (
          <div key={cell} className={`relative grid place-items-center bg-cream-light min-h-[90px] lg:min-h-[110px] ${cell >= 10 ? 'hidden sm:grid' : ''}`}>
            <div
              className="flex items-center justify-center px-[8%] transition-[opacity,filter] ease-out"
              style={{
                transitionDuration: `${FADE}ms`,
                opacity: out ? 0 : 1,
                filter: out ? 'blur(3px)' : 'blur(0px)',
              }}
            >
              <Logo carrier={carrier} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
