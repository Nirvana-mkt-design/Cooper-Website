/* ──────────────────────────────────────────────────────────────
   CarrierWall — "Cooper works with all of your trusted carriers".
   Left copy card + a grid of carrier logos. Individual cells
   randomly swap to a different logo with a fade transition,
   creating a living, breathing logo cloud. All carriers render
   as monochrome grey logo images.
─────────────────────────────────────────────────────────────── */
import { useCallback, useEffect, useRef, useState } from 'react'

type Carrier = { name: string; src: string }

const ALL_CARRIERS: Carrier[] = [
  { name: 'The Hartford', src: '/images/carriers/the-hartford.png' },
  { name: 'Liberty Mutual', src: '/images/carriers/liberty-mutual.png' },
  { name: 'Zurich', src: '/images/carriers/zurich.png' },
  { name: 'Travelers', src: '/images/carriers/travelers.png' },
  { name: 'Chubb', src: '/images/carriers/chubb.png' },
  { name: 'CNA', src: '/images/carriers/cna.png' },
  { name: 'Markel', src: '/images/carriers/markel.png' },
  { name: 'AIG', src: '/images/carriers/aig.png' },
  { name: 'Berkley', src: '/images/carriers/berkley.png' },
  { name: 'Cincinnati', src: '/images/carriers/cincinnati.png' },
  { name: 'The Hanover', src: '/images/carriers/hanover.png' },
  { name: 'Hiscox', src: '/images/carriers/hiscox.png' },
  { name: 'AXA', src: '/images/carriers/axa.png' },
  { name: 'Allianz', src: '/images/carriers/allianz.png' },
  { name: 'Allstate', src: '/images/carriers/allstate.png' },
  { name: 'Erie', src: '/images/carriers/erie.png' },
  { name: 'GEICO', src: '/images/carriers/geico.png' },
  { name: 'MetLife', src: '/images/carriers/metlife.png' },
  { name: 'State Farm', src: '/images/carriers/statefarm.png' },
]

const GRID_SIZE = 12
const SWAP_INTERVAL = 2200 // ms between individual cell swaps
const FADE = 500           // ms fade duration per cell

/* Pick `count` random items from `pool`, excluding items in `exclude` */
function pickRandom(pool: Carrier[], count: number, exclude: Set<string>): Carrier[] {
  const available = pool.filter((c) => !exclude.has(c.name))
  const result: Carrier[] = []
  const used = new Set(exclude)
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length)
    result.push(available[idx])
    used.add(available[idx].name)
    available.splice(idx, 1)
  }
  return result
}

/* Build initial grid: first GRID_SIZE unique carriers */
function buildInitialGrid(): Carrier[] {
  const shuffled = [...ALL_CARRIERS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, GRID_SIZE)
}

export default function CarrierWall() {
  const [grid, setGrid] = useState<Carrier[]>(buildInitialGrid)
  const [fadingCell, setFadingCell] = useState<number | null>(null)
  const gridRef = useRef(grid)
  gridRef.current = grid

  const swapRandomCell = useCallback(() => {
    const currentNames = new Set(gridRef.current.map((c) => c.name))
    const candidates = pickRandom(ALL_CARRIERS, 1, currentNames)
    if (candidates.length === 0) return

    const cellIdx = Math.floor(Math.random() * GRID_SIZE)
    const newCarrier = candidates[0]

    // Fade out the cell
    setFadingCell(cellIdx)

    // After fade-out, swap the logo and fade back in
    setTimeout(() => {
      setGrid((prev) => {
        const next = [...prev]
        next[cellIdx] = newCarrier
        return next
      })
      setFadingCell(null)
    }, FADE)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const interval = setInterval(swapRandomCell, SWAP_INTERVAL)
    return () => clearInterval(interval)
  }, [swapRandomCell])

  return (
    <div className="mt-[24px] grid grid-cols-1 items-stretch gap-[24px] overflow-hidden rounded-[16px] border border-dark/[0.08] bg-cream-light p-[14px] md:grid-cols-[1fr_2fr]">
      {/* copy card */}
      <div className="flex flex-col justify-center rounded-[14px] bg-cream/50 p-[28px]">
        <p className="font-serif text-[24px] leading-[1.3] text-dark">
          Cooper works with all of your trusted carriers
        </p>
      </div>

      {/* logo grid — individual cells fade out/in when swapping */}
      <div className="grid grid-cols-2 gap-[1px] overflow-hidden rounded-[14px] bg-dark/[0.06] sm:grid-cols-3 lg:grid-cols-6">
        {grid.map((carrier, cell) => (
          <div key={cell} className={`relative grid place-items-center bg-cream-light min-h-[90px] lg:min-h-[110px] ${cell >= 10 ? 'hidden sm:grid' : ''}`}>
            <div
              className="flex items-center justify-center px-[8%] transition-[opacity,filter] ease-out"
              style={{
                transitionDuration: `${FADE}ms`,
                opacity: fadingCell === cell ? 0 : 1,
                filter: fadingCell === cell ? 'blur(3px)' : 'blur(0px)',
              }}
            >
              <img
                src={carrier.src}
                alt={carrier.name}
                loading="lazy"
                className="max-h-[44px] w-auto max-w-[78%] object-contain opacity-[0.5] grayscale"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
