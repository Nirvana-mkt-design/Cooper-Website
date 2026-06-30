/* ──────────────────────────────────────────────────────────────
   InvestorStrip — "Backed by category-defining investors".
   A slim, centered logo strip. Logos render in a muted monochrome
   wash and reveal their true brand color on hover. Each links out
   to the firm's site. Official assets live in /images/investors.
─────────────────────────────────────────────────────────────── */

type Investor = { name: string; src: string; href: string; className: string }

const investors: Investor[] = [
  {
    name: 'Lightspeed Venture Partners',
    src: '/images/investors/lightspeed.svg',
    href: 'https://lsvp.com/',
    className: 'h-[24px]',
  },
  {
    name: 'General Catalyst',
    src: '/images/investors/general-catalyst.svg',
    href: 'https://www.generalcatalyst.com/',
    className: 'h-[20px]',
  },
  {
    name: 'Valor Equity Partners',
    src: '/images/investors/valor.svg',
    href: 'https://www.valorep.com/',
    className: 'h-[46px]',
  },
]

export default function InvestorStrip() {
  return (
    <section className="bg-cream-light py-[80px]">
      <div className="mx-auto max-w-[1440px] px-[62px]">
        <p className="mb-[44px] text-center font-grotesk text-[14.5px] font-medium uppercase tracking-[1.45px] text-dark/45">
          Backed by category-defining investors
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-[88px] gap-y-[40px]">
          {investors.map((inv) => (
            <a
              key={inv.name}
              href={inv.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={inv.name}
              className="group grid place-items-center"
            >
              <img
                src={inv.src}
                alt={inv.name}
                className={`w-auto object-contain opacity-60 grayscale brightness-[0.35] transition duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 ${inv.className}`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
