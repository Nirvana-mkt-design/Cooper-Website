const badges = [
  { label: 'SOC 2 Type ii', icon: '/images/icon-soc2.webp' },
  { label: 'HIPAA Compliant', icon: '/images/icon-hipaa.webp' },
  { label: 'No model training', icon: '/images/icon-no-training.webp' },
  { label: 'SSO & MFA', icon: '/images/icon-sso-mfa.webp' },
  { label: 'RBAC & audit logs', icon: '/images/icon-audit.webp' },
]

export default function SecurityCompliance() {
  return (
    <section className="bg-dark py-[80px] px-5 md:px-10 lg:px-[62px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:gap-[80px]">
          {/* Left heading */}
          <h2 className="font-serif text-[36px] leading-[1.2] text-cream-light/40 shrink-0 text-center sm:text-left md:text-[44px] lg:text-[48px]">
            Security<br />& compliance
          </h2>

          {/* Right badges */}
          <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto lg:flex-1 lg:flex-nowrap lg:gap-0 lg:border lg:border-cream-light/10 lg:rounded-[4px] lg:overflow-hidden">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center justify-center py-[28px] px-[16px] min-w-[130px] lg:min-w-0 lg:flex-1 lg:border-r lg:border-cream-light/10 lg:last:border-r-0"
              >
                <img
                  src={badge.icon}
                  alt=""
                  className="w-[56px] h-[56px] object-contain mb-[16px] opacity-90"
                />
                <span className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-cream-light/80 text-center">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
