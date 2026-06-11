const topRoles = [
  {
    tag: 'Retail Brokers',
    title: 'Cooper adapts\nto your workflow',
    desc: 'Instant submission processing, policy comparison in plain language, and renewal management that never misses a window.',
  },
  {
    tag: 'Wholesale Brokers',
    title: 'Place more\nbusiness faster',
    desc: 'Intelligent market matching, submission standardization, and side-by-side quote comparison — respond before the competition.',
  },
  {
    tag: 'Insurers & MGAs',
    title: 'Scale underwriting without scaling headcount',
    desc: 'Multi-program management, guideline compliance verification, and carrier reporting — all automated.',
  },
]

const bottomRoles = [
  {
    tag: 'Reinsurers',
    title: 'Optimize treaties and\nrisk at portfolio scale',
    desc: 'Treaty compliance monitoring, exposure analysis, and cedent reporting validation — in a fraction of the time.',
  },
  {
    tag: 'Claims TPAs',
    title: 'Streamline claims from\nintake to reporting',
    desc: 'Automated claims intake, coverage verification, adjudication support, and loss runs — accurate and fast.',
  },
]

function RoleCard({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="px-[52px] py-[44px] flex flex-col gap-[31px] cursor-pointer group relative transition-colors duration-300 hover:bg-dark/[0.02]">
      {/* Hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      <p className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange leading-[1.5]">
        {tag}
      </p>
      <h3 className="font-serif text-[24px] leading-[1.2] text-dark whitespace-pre-line group-hover:translate-x-[4px] transition-transform duration-300">{title}</h3>
      <p className="font-sans text-[16px] leading-[1.5] text-dark/50 group-hover:text-dark/70 transition-colors duration-300">{desc}</p>
      <span
        className="font-sans text-[16px] text-[#46433d] w-fit group-hover:text-accent-orange transition-colors duration-300"
        style={{
          borderBottom: '1.2px dashed #46433d',
          paddingBottom: '2px',
        }}
      >
        Learn More
      </span>
    </div>
  )
}

export default function BuiltForEveryRole() {
  return (
    <section className="bg-cream py-[100px] px-[62px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-[48px]">
          <div>
            <p className="font-grotesk font-medium text-[18px] tracking-[1.8px] uppercase text-dark mb-[16px]">
              Built for every role
            </p>
            <h2 className="font-serif text-[38px] leading-[1.2] text-dark">
              Cooper adapts to your workflow
            </h2>
          </div>
          <p className="font-sans text-[16px] leading-[1.5] text-dark/70 max-w-[452px] pt-[24px]">
            Whether you're a retail broker, wholesale underwriter, or claims adjuster — Cooper works the way you already work.
          </p>
        </div>

        {/* Cards container — single border wrapper */}
        <div className="border border-dark">
          {/* Top row - 3 cards */}
          <div className="grid grid-cols-3">
            {topRoles.map((role, i) => (
              <div key={role.tag} className={i < 2 ? 'border-r border-dark' : ''}>
                <RoleCard {...role} />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-dark" />

          {/* Bottom row - 2 cards */}
          <div className="grid grid-cols-2">
            {bottomRoles.map((role, i) => (
              <div key={role.tag} className={i === 0 ? 'border-r border-dark' : ''}>
                <RoleCard {...role} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
