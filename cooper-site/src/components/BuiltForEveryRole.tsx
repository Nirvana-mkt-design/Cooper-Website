import { Link } from 'react-router-dom'

const roles = [
  {
    tag: 'Retail Agencies',
    slug: 'retail-agencies',
    title: 'From inbox to application,\nwithout the busywork',
    desc: 'Cooper pulls submissions out of your inbox and turns them into clean applications, then shows how each carrier\'s coverage compares in plain terms. It keeps an eye on renewals too, so none slip your mind.',
  },
  {
    tag: 'Wholesale Brokers',
    slug: 'wholesale-brokers',
    title: 'Place more\nbusiness faster',
    desc: 'Submissions arrive in every format imaginable. Cooper cleans them up, steers each risk to the markets likely to write it, then lines up quotes so you can respond while the deal\'s still warm.',
  },
  {
    tag: 'MGA & Insurers',
    slug: 'mgas-insurers',
    title: 'Scale underwriting\nwithout scaling headcount',
    desc: 'Cooper runs each risk against the program\'s guidelines and flags anything outside appetite before it binds. When bordereaux are due, it pulls them together, so a lean team can cover more programs.',
  },
  {
    tag: 'Claims TPA',
    slug: 'claims-tpas',
    title: 'Streamline claims from\nintake to reporting',
    desc: 'When a claim comes in, Cooper captures the details, checks them against the policy, and gives adjusters what they need to make the call. Loss runs are ready whenever a carrier asks.',
  },
]

function RoleCard({ tag, slug, title, desc }: { tag: string; slug: string; title: string; desc: string }) {
  return (
    <Link to={`/personas/${slug}`} className="px-6 md:px-10 lg:px-[52px] py-[32px] md:py-[40px] lg:py-[44px] flex flex-col gap-[31px] cursor-pointer group relative transition-colors duration-300 hover:bg-dark/[0.02] no-underline">
      {/* Hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      <p className="font-grotesk font-medium text-[14px] tracking-[1.4px] uppercase text-accent-orange leading-[1.5]">
        {tag}
      </p>
      <h3 className="font-serif text-[20px] lg:text-[24px] leading-[1.2] text-dark whitespace-pre-line group-hover:translate-x-[4px] transition-transform duration-300">{title}</h3>
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
    </Link>
  )
}

export default function BuiltForEveryRole() {
  return (
    <section className="bg-cream-light py-[48px] md:py-[64px] lg:py-[80px] px-4 md:px-6 lg:px-[40px]">
      <div className="max-w-[1440px] mx-auto bg-cream rounded-[4px] px-4 md:px-6 lg:px-[40px] py-[40px] md:py-[48px] lg:py-[60px]">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start lg:gap-0 mb-[32px] md:mb-[48px]">
          <div>
            <p className="font-grotesk font-medium text-[18px] tracking-[1.8px] uppercase text-dark mb-[16px]">
              Built for every role
            </p>
            <h2 className="font-serif text-[36px] md:text-[34px] lg:text-[38px] leading-[1.2] text-dark">
              Cooper adapts to your workflow
            </h2>
          </div>
          <p className="font-sans text-[16px] leading-[1.5] text-dark/70 max-w-full lg:max-w-[452px] pt-0 lg:pt-[24px]">
            Whether you're a retail agency, wholesale broker, MGA, insurer, or claims TPA, Cooper works the way you already work.
          </p>
        </div>

        {/* Cards container, single border wrapper. Four roles in a 2x2 grid:
            one column stacked on mobile, two columns from sm up. Dividers adapt
            to the collapsing grid (horizontal between stacked cards, vertical
            between columns once they exist). */}
        <div className="border border-dark">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {roles.map((role, i) => {
              const cls = [
                'border-dark',
                i === 0 && 'border-b sm:border-r',
                i === 1 && 'border-b',
                i === 2 && 'border-b sm:border-b-0 sm:border-r',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <div key={role.tag} className={cls}>
                  <RoleCard {...role} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
