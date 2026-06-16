const badges = [
  { label: 'SOC 2 Type ii', icon: '/images/icon-soc2.png' },
  { label: 'HIPAA Compliant', icon: '/images/icon-hipaa.png' },
  { label: 'No model training', icon: '/images/icon-no-training.png' },
  { label: 'SSO & MFA', icon: '/images/icon-sso-mfa.png' },
  { label: 'RBAC & audit logs', icon: '/images/icon-audit.png' },
]

export default function SecurityCompliance() {
  return (
    <section className="bg-dark py-[80px] px-[62px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center gap-[80px]">
          {/* Left heading */}
          <h2 className="font-serif text-[48px] leading-[1.2] text-cream-light/40 shrink-0">
            Security<br />& compliance
          </h2>

          {/* Right badges */}
          <div className="flex gap-0 border border-cream-light/10 rounded-[4px] overflow-hidden flex-1">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex-1 flex flex-col items-center justify-center py-[28px] px-[16px] border-r border-cream-light/10 last:border-r-0"
              >
                <img
                  src={badge.icon}
                  alt=""
                  className="w-[48px] h-[48px] object-contain mb-[16px] opacity-30"
                />
                <span className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-cream-light/30 text-center">
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
