const ROW_SPACING = 44
const SHAPE_SIZE = 21
const CELL_SIZE = 31
const ROWS = 12

// Shifted grid right: icon is now at col 3, with only 2 cols after it visible
const COLUMNS: [number, number, boolean][] = [
  [0,    0.08, false],
  [72,   0.10, true],
  [144,  0.08, false],
  [216,  0.15, true],
  [288,  0.12, false],
  [360,  0.25, true],
  [432,  0.20, false],
  [504,  0.40, true],
  [576,  0.35, false],
  [648,  0.55, true],
  [720,  1.0,  false],  // icon column (col 10)
  [792,  0.70, true],
  [864,  1.0,  false],
  [936,  0.70, true],
  [1008, 0.40, false],
  [1080, 0.70, true],
  [1152, 0.40, false],
]

const ICON_COL_IDX = 10
const ICON_ROW_IDX = 5 // vertically centered with section

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

function AnimatedColumn({ colDef, colIdx }: { colDef: [number, number, boolean]; colIdx: number }) {
  const [x, opacity, startsCircle] = colDef
  const isIconCol = colIdx === ICON_COL_IDX
  const animClass = colIdx % 2 === 0 ? 'animate-shapes-up' : 'animate-shapes-down'

  const shapes = Array.from({ length: ROWS }, (_, rowIdx) => {
    const isCircle = startsCircle ? rowIdx % 2 === 0 : rowIdx % 2 !== 0
    // Only hide the exact icon row in the icon column — blur covers the rest
    if (isIconCol && rowIdx === ICON_ROW_IDX) {
      return <div key={rowIdx} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
    }
    return <Shape key={rowIdx} isCircle={isCircle} opacity={opacity} />
  })

  // Total height of one set of shapes
  const totalHeight = ROWS * ROW_SPACING

  return (
    <div className="absolute top-0" style={{ left: x, height: totalHeight * 2 }}>
      <div
        className={`${animClass}`}
        style={{ willChange: 'transform' }}
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
  // Center icon vertically with the section (442px height + 46px offset)
  const sectionCenter = (442 + 46) / 2
  const iconY = sectionCenter

  return (
    <section className="relative bg-cream-light overflow-hidden" style={{ height: 442 }}>
      {/* Top edge fade — full width, above shapes but below text */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] z-25 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--color-cream) 45%, transparent 100%)',
        }}
      />

      {/* Text content — above everything */}
      <div className="absolute inset-0 z-30 flex items-center px-[62px]">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-[480px]">
            <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/50 mb-[28px]">
              How Cooper helps
            </p>
            <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[28px]">
              Your AI agent for the{'\n'}entire insurance workflow
            </h2>
            <p className="font-sans text-[17.8px] leading-[1.5] text-dark/50">
              From the moment a submission lands in your inbox to the final bound  policy — Cooper handles the manual work across every step. Your team  focuses on decisions, relationships, and growing the book.
            </p>
          </div>
        </div>
      </div>

      {/* Shape grid — right side, shifted so icon is near right edge */}
      <div
        className="absolute top-[-46px] bottom-0 overflow-hidden"
        style={{ left: '36%', right: 0 }}
      >
        {COLUMNS.map((colDef, i) => (
          <AnimatedColumn key={i} colDef={colDef} colIdx={i} />
        ))}

        {/* Radial blur behind icon — covers nearby shapes */}
        <div
          className="absolute z-[5] rounded-full pointer-events-none"
          style={{
            width: 120,
            height: 120,
            left: iconX - 60,
            top: iconY - 60,
            background: 'radial-gradient(circle, var(--color-cream-light) 35%, var(--color-cream-light) 45%, transparent 70%)',
          }}
        />

        {/* Cooper icon — fixed */}
        <div
          className="absolute z-10"
          style={{
            left: iconX - 32,
            top: iconY - 32,
          }}
        >
          <img src="/images/cooper-icon.svg" alt="" className="w-[64px] h-[64px]" />
        </div>

        {/* Left fade gradient — covers text area fully */}
        <div
          className="absolute inset-y-0 left-0 w-[420px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, var(--color-cream-light) 0%, var(--color-cream-light) 40%, transparent 100%)',
          }}
        />

        {/* Top fade handled at section level */}

        {/* Bottom fade — stronger */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[100px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--color-cream-light) 20%, transparent 100%)',
          }}
        />
      </div>
    </section>
  )
}
