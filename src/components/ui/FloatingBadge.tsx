import type { ReactNode } from 'react'

interface FloatingBadgeProps {
  icon: ReactNode
  text: string
  animationClass: 'float-a' | 'float-b' | 'float-c'
  variant?: 'default' | 'violet'
  style?: React.CSSProperties
  className?: string
}

export function FloatingBadge({
  icon,
  text,
  animationClass,
  variant = 'default',
  style,
  className = '',
}: FloatingBadgeProps) {
  const isViolet = variant === 'violet'

  return (
    <div
      className={`${animationClass} absolute flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-[11px] text-[13px] font-medium backdrop-blur-xl ${className}`}
      style={{
        background: isViolet ? 'rgba(112,0,255,0.10)' : 'rgba(255,255,255,0.045)',
        border: `1px solid ${isViolet ? 'rgba(112,0,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
        color: isViolet ? 'rgba(195,150,255,0.85)' : 'rgba(237,237,237,0.72)',
        boxShadow: isViolet
          ? '0 4px 24px rgba(112,0,255,0.12)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        ...style,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          color: isViolet ? 'rgba(160,100,255,0.7)' : 'rgba(255,255,255,0.45)',
        }}
      >
        {icon}
      </span>
      {text}
    </div>
  )
}
