export default function CooperLogo({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/cooper-logo-full.svg"
        alt="Cooper"
        width={154}
        height={36}
        className="h-[22px] w-auto transition-transform duration-300"
        style={dark ? { filter: 'brightness(0)' } : { filter: 'brightness(0) invert(1)' }}
      />
    </div>
  )
}
