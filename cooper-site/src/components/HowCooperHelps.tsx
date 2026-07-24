const ROW_SPACING = 60
const SHAPE_SIZE = 28
const CELL_SIZE = 41
const ROWS = 14

const COL_GAP = 97
// [x, opacity, startsCircle, verticalOffset]
const COLUMNS: [number, number, boolean, number][] = [
  [COL_GAP * 0,  0.06, false, 240],
  [COL_GAP * 1,  0.10, true,  200],
  [COL_GAP * 2,  0.15, false, 160],
  [COL_GAP * 3,  0.25, true,  120],
  [COL_GAP * 4,  0.35, false, 80],
  [COL_GAP * 5,  0.50, true,  40],
  [COL_GAP * 6,  1.0,  false, 0],   // icon column
  [COL_GAP * 7,  0.60, true,  -20],
  [COL_GAP * 8,  0.75, false, -40],
]

const ICON_COL_IDX = 6
const ICON_ROW_IDX = 4

// ── Mobile grid config ──────────────────────────────────────────
const MOB_ROW_SPACING = 56
const MOB_SHAPE_SIZE = 25
const MOB_CELL_SIZE = 38
const MOB_ROWS = 10
const MOB_COL_GAP = 64

// [x, opacity, startsCircle, verticalOffset]
const MOB_COLUMNS: [number, number, boolean, number][] = [
  [MOB_COL_GAP * 0, 0.07, false, 100],
  [MOB_COL_GAP * 1, 0.13, true,  70],
  [MOB_COL_GAP * 2, 0.25, false, 40],
  [MOB_COL_GAP * 3, 1.0,  true,  10],  // icon column (center)
  [MOB_COL_GAP * 4, 0.25, false, 40],
  [MOB_COL_GAP * 5, 0.13, true,  70],
  [MOB_COL_GAP * 6, 0.07, false, 100],
]
const MOB_ICON_COL_IDX = 3
const MOB_ICON_ROW_IDX = 2

function Shape({ isCircle, opacity, cellSize = CELL_SIZE, shapeSize = SHAPE_SIZE }: { isCircle: boolean; opacity: number; cellSize?: number; shapeSize?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: cellSize, height: cellSize }}>
      <div
        className={`rotate-45 ${isCircle ? 'rounded-full' : ''}`}
        style={{
          width: shapeSize,
          height: shapeSize,
          backgroundColor: `rgba(29, 26, 23, ${opacity})`,
        }}
      />
    </div>
  )
}

function AnimatedColumn({ colDef, colIdx }: { colDef: [number, number, boolean, number]; colIdx: number }) {
  const [x, opacity, startsCircle, vOffset] = colDef
  const animClass = colIdx % 2 === 0 ? 'animate-shapes-up' : 'animate-shapes-down'

  const shapes = Array.from({ length: ROWS }, (_, rowIdx) => {
    const isCircle = startsCircle ? rowIdx % 2 === 0 : rowIdx % 2 !== 0
    return <Shape key={rowIdx} isCircle={isCircle} opacity={opacity} />
  })

  const totalHeight = ROWS * ROW_SPACING

  return (
    <div className="absolute" style={{ left: x, top: vOffset, height: totalHeight * 2 }}>
      <div
        className={animClass}
        style={{ willChange: 'transform', height: totalHeight * 2 }}
      >
        {/* First copy */}
        {shapes.map((shape, i) => (
          <div key={`a-${i}`} style={{ position: 'absolute', top: i * ROW_SPACING }}>
            {shape}
          </div>
        ))}
        {/* Second copy for seamless loop */}
        {shapes.map((shape, i) => (
          <div key={`b-${i}`} style={{ position: 'absolute', top: (ROWS + i) * ROW_SPACING }}>
            {shape}
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileAnimatedColumn({ colDef, colIdx }: { colDef: [number, number, boolean, number]; colIdx: number }) {
  const [x, opacity, startsCircle, vOffset] = colDef
  const animClass = colIdx % 2 === 0 ? 'animate-shapes-up' : 'animate-shapes-down'
  const totalHeight = MOB_ROWS * MOB_ROW_SPACING

  const shapes = Array.from({ length: MOB_ROWS }, (_, rowIdx) => {
    const isCircle = startsCircle ? rowIdx % 2 === 0 : rowIdx % 2 !== 0
    return <Shape key={rowIdx} isCircle={isCircle} opacity={opacity} cellSize={MOB_CELL_SIZE} shapeSize={MOB_SHAPE_SIZE} />
  })

  return (
    <div className="absolute" style={{ left: x, top: vOffset, height: totalHeight * 2 }}>
      <div className={animClass} style={{ willChange: 'transform', height: totalHeight * 2 }}>
        {shapes.map((shape, i) => (
          <div key={`a-${i}`} style={{ position: 'absolute', top: i * MOB_ROW_SPACING }}>{shape}</div>
        ))}
        {shapes.map((shape, i) => (
          <div key={`b-${i}`} style={{ position: 'absolute', top: (MOB_ROWS + i) * MOB_ROW_SPACING }}>{shape}</div>
        ))}
      </div>
    </div>
  )
}

export default function HowCooperHelps() {
  const iconX = COLUMNS[ICON_COL_IDX][0] + CELL_SIZE / 2
  const iconVOffset = COLUMNS[ICON_COL_IDX][3]
  const iconY = iconVOffset + ICON_ROW_IDX * ROW_SPACING + CELL_SIZE / 2 + 25

  const mobIconX = MOB_COLUMNS[MOB_ICON_COL_IDX][0] + MOB_CELL_SIZE / 2
  const mobIconVOffset = MOB_COLUMNS[MOB_ICON_COL_IDX][3]
  const mobIconY = mobIconVOffset + MOB_ICON_ROW_IDX * MOB_ROW_SPACING + MOB_CELL_SIZE / 2

  return (
    <section className="relative bg-cream-light overflow-hidden h-auto lg:py-0 lg:h-[560px]">
      {/* Diagonal fade — desktop only */}
      <div
        className="hidden lg:block absolute inset-0 z-25 pointer-events-none"
        style={{
          background: `
            linear-gradient(125deg, var(--color-cream-light) 46%, transparent 61%),
            linear-gradient(to bottom, var(--color-cream-light) 15%, transparent 55%),
            linear-gradient(160deg, var(--color-cream-light) 45%, transparent 62%)
          `,
        }}
      />

      {/* Text content */}
      <div className="relative lg:absolute lg:inset-0 z-30 flex items-center px-5 md:px-10 lg:px-[62px] pt-[64px] md:pt-[80px] lg:pt-0">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[640px]">
            <p className="font-grotesk font-medium text-[15px] tracking-[1.45px] uppercase text-dark/60 mb-[24px]">
              How Cooper helps
            </p>
            <h2 className="font-serif text-[36px] lg:text-[38px] leading-[1.15] text-dark mb-[24px]">
              Your AI coworker for the<br className="hidden lg:inline" /> entire insurance workflow
            </h2>
            <p className="font-sans text-[18px] leading-[1.5] text-dark/60" style={{ maxWidth: 620 }}>
              From the moment a submission lands in your inbox to the final bound policy, Cooper handles the manual work across every step. Your team focuses on decisions, relationships, and growing the book.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile shape grid — below text */}
      <div className="lg:hidden relative overflow-hidden mt-[48px]" style={{ height: 340 }}>
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-[80px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--color-cream-light) 20%, transparent 100%)' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[80px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--color-cream-light) 20%, transparent 100%)' }} />
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-[40px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-cream-light), transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-[40px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-cream-light), transparent)' }} />

        {/* Center the grid horizontally */}
        <div className="absolute inset-0" style={{ transform: `translateX(calc(50% - ${MOB_COLUMNS[MOB_ICON_COL_IDX][0] + MOB_CELL_SIZE / 2}px))` }}>
          {MOB_COLUMNS.map((colDef, i) => (
            <MobileAnimatedColumn key={i} colDef={colDef} colIdx={i} />
          ))}

          {/* Radial blur behind icon */}
          <div className="absolute z-[5] rounded-full pointer-events-none"
            style={{
              width: 140, height: 140,
              left: mobIconX - 70, top: mobIconY - 70,
              background: 'radial-gradient(circle, var(--color-cream-light) 35%, var(--color-cream-light) 45%, transparent 70%)',
            }}
          />

          {/* Cooper icon */}
          <div className="absolute z-10" style={{ left: mobIconX - 24, top: mobIconY - 24 }}>
            <img src="/images/cooper-icon.svg" alt="" className="w-[48px] h-[48px]" />
          </div>
        </div>
      </div>

      {/* Desktop shape grid — right side */}
      <div
        className="hidden lg:block absolute top-[20px] bottom-0 overflow-hidden"
        style={{ left: '46%', right: '-60px' }}
      >
        {COLUMNS.map((colDef, i) => (
          <AnimatedColumn key={i} colDef={colDef} colIdx={i} />
        ))}

        <div
          className="absolute z-[5] rounded-full pointer-events-none"
          style={{
            width: 150, height: 150,
            left: iconX - 75, top: iconY - 75,
            background: 'radial-gradient(circle, var(--color-cream-light) 35%, var(--color-cream-light) 45%, transparent 70%)',
          }}
        />

        <div className="absolute z-10" style={{ left: iconX - 30, top: iconY - 30 }}>
          <img src="/images/cooper-icon.svg" alt="" className="w-[60px] h-[60px]" />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[140px] z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--color-cream-light) 20%, transparent 100%)' }}
        />
      </div>
    </section>
  )
}
