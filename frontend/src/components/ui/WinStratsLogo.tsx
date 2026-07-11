interface WinStratsLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
}

const sizes = {
  sm: { img: 'h-8 w-8', name: 'text-base', tag: 'text-[9px]' },
  md: { img: 'h-10 w-10', name: 'text-lg', tag: 'text-[10px]' },
  lg: { img: 'h-14 w-14', name: 'text-2xl', tag: 'text-xs' },
}

export function WinStratsLogo({
  size = 'md',
  showTagline = false,
  className = '',
}: WinStratsLogoProps) {
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="WinStrats"
        className={`${s.img} rounded-full object-cover ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/20`}
      />
      <div className="leading-tight">
        <span className={`${s.name} font-black tracking-tight text-amber-400`}>
          Win<span className="text-teal-300">Strats</span>
        </span>
        {showTagline && (
          <p className={`${s.tag} font-semibold uppercase tracking-[0.14em] text-teal-400/80`}>
            Train. Achieve. Win.
          </p>
        )}
      </div>
    </div>
  )
}
