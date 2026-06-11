const row1 = [
  { name: 'Google', icon: '🔍' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Meta', icon: '∞' },
  { name: 'McKinsey', icon: '◆' },
  { name: 'AIG', icon: '▲' },
  { name: 'Marsh', icon: '■' },
]

const row2 = [
  { name: 'Salesforce', icon: '☁' },
  { name: 'Amazon', icon: '⬡' },
  { name: 'Deloitte', icon: '●' },
  { name: 'Chubb', icon: '◈' },
  { name: 'Google', icon: '🔍' },
  { name: 'Liberty Mutual', icon: '▶' },
]

const row3 = [
  { name: 'McKinsey', icon: '◆' },
  { name: 'Travelers', icon: '◎' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Zurich', icon: '◇' },
  { name: 'Meta', icon: '∞' },
  { name: 'Hartford', icon: '★' },
]

const row4 = [
  { name: 'AIG', icon: '▲' },
  { name: 'Salesforce', icon: '☁' },
  { name: 'Marsh', icon: '■' },
  { name: 'Amazon', icon: '⬡' },
  { name: 'Deloitte', icon: '●' },
  { name: 'Chubb', icon: '◈' },
]

function Pill({ name, icon }: { name: string; icon: string }) {
  return (
    <div
      className="flex items-center gap-[10px] px-[20px] py-[10px] rounded-[30px] border border-dark/30 bg-cream-light shrink-0 relative overflow-hidden"
      style={{ boxShadow: '0px 4px 40px -12px rgba(30,26,21,0.15)' }}
    >
      <span className="text-[18px] leading-none opacity-50">{icon}</span>
      <span className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/70 whitespace-nowrap">
        {name}
      </span>
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ boxShadow: 'inset 5px 4px 18px 0px rgba(30,26,21,0.06)' }}
      />
    </div>
  )
}

function MarqueeRow({ items, direction, speed }: { items: typeof row1; direction: 'left' | 'right'; speed: number }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div className="flex gap-[14px] w-max" style={{
      animation: `marquee-${direction} ${speed}s linear infinite`,
    }}>
      {doubled.map((item, i) => (
        <Pill key={`${item.name}-${i}`} {...item} />
      ))}
    </div>
  )
}

export default function TeamSection() {
  return (
    <section className="bg-cream-light py-[100px] px-[62px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-[1.1fr_1fr] gap-[60px] items-center">
          {/* Left text */}
          <div>
            <p className="font-grotesk font-medium text-[14.5px] tracking-[1.45px] uppercase text-dark/40 mb-[20px]">
              How Cooper helps
            </p>
            <h2 className="font-serif text-[48px] leading-[1.2] text-dark">
              Built by people from Insurance operators, engineers, and specialists who've built products at scale.
            </h2>
          </div>

          {/* Right — animated marquee pills */}
          <div
            className="relative overflow-hidden py-[10px]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 55% at 50% 50%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 55% at 50% 50%, black 30%, transparent 80%)',
            }}
          >
            <div className="flex flex-col gap-[14px]">
              <MarqueeRow items={row1} direction="left" speed={55} />
              <MarqueeRow items={row2} direction="right" speed={60} />
              <MarqueeRow items={row3} direction="left" speed={50} />
              <MarqueeRow items={row4} direction="right" speed={58} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
