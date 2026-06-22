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

function Shape({ isCircle, opacity }: { isCircle: boolean; opacity: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: CELL_SIZE, height: CELL_SIZE }}>
      <div
        className={`rotate-45 ${isCircle ? 'rounded-full' : ''}`}
        style={{
          width: SHAPE_SIZE,
          height: SHAPE_SIZE,
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

export default function HowCooperHelps() {
  const iconX = COLUMNS[ICON_COL_IDX][0] + CELL_SIZE / 2
  const sectionHeight = 560
  const iconVOffset = COLUMNS[ICON_COL_IDX][3]
  const iconY = iconVOffset + ICON_ROW_IDX * ROW_SPACING + CELL_SIZE / 2 + 25

  return (
    <section className="relative bg-cream-light overflow-hidden" style={{ height: sectionHeight }}>
      {/* Diagonal fade — triangular mask from top-left to bottom-right */}
      <div
        className="absolute inset-0 z-25 pointer-events-none"
        style={{
          background: `
            linear-gradient(125deg, var(--color-cream-light) 46%, transparent 61%),
            linear-gradient(to bottom, var(--color-cream-light) 15%, transparent 55%),
            linear-gradient(160deg, var(--color-cream-light) 45%, transparent 62%)
          `,
        }}
      />

      {/* Text content — above everything */}
      <div className="absolute inset-0 z-30 flex items-center px-[62px]">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[640px]">
            <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/50 mb-[28px]">
              How Cooper helps
            </p>
            <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[28px]">
              Your AI coworker for the<br />entire insurance workflow
            </h2>
            <p className="font-sans text-[17.8px] leading-[1.5] text-dark/50" style={{ maxWidth: 620 }}>
              From the moment a submission lands in your inbox to the final bound policy, Cooper handles the manual work across every step. Your team focuses on decisions, relationships, and growing the book.
            </p>
          </div>
        </div>
      </div>

      {/* Shape grid — right side, shifted so icon is near right edge */}
      <div
        className="absolute top-[20px] bottom-0 overflow-hidden"
        style={{ left: '46%', right: '-60px' }}
      >
        {COLUMNS.map((colDef, i) => (
          <AnimatedColumn key={i} colDef={colDef} colIdx={i} />
        ))}

        {/* Radial blur behind icon — covers nearby shapes */}
        <div
          className="absolute z-[5] rounded-full pointer-events-none"
          style={{
            width: 150,
            height: 150,
            left: iconX - 75,
            top: iconY - 75,
            background: 'radial-gradient(circle, var(--color-cream-light) 35%, var(--color-cream-light) 45%, transparent 70%)',
          }}
        />

        {/* Cooper icon — fixed */}
        <div
          className="absolute z-10"
          style={{
            left: iconX - 39,
            top: iconY - 39,
          }}
        >
          <img src="/images/cooper-icon.svg" alt="" className="w-[78px] h-[78px]" />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[140px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--color-cream-light) 20%, transparent 100%)',
          }}
        />
      </div>
    </section>
  )
}
