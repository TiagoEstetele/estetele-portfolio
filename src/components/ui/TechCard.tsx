import type { ReactNode } from 'react'
import type { TechCategory } from '@/types'

interface TechCardProps {
  category: TechCategory
  name: string
  subtitle: string
  icon: ReactNode
}

const accentGlowMap: Record<NonNullable<TechCategory['accentVariant']>, string> = {
  violet: 'rgba(112,0,255,0.10)',
  tangerine: 'rgba(255,92,0,0.09)',
  green: 'rgba(0,200,120,0.07)',
  yellow: 'rgba(255,200,0,0.06)',
  default: 'rgba(255,255,255,0.04)',
}

const glowPositionMap: Record<NonNullable<TechCategory['accentVariant']>, React.CSSProperties> = {
  violet: { top: '-50px', right: '-50px' },
  tangerine: { top: '-30px', right: '-30px' },
  green: { top: '-30px', right: '-30px' },
  yellow: { bottom: '-20px', right: '-20px' },
  default: { top: '-20px', right: '-20px' },
}

export function TechCard({ category, name, subtitle, icon }: TechCardProps) {
  const accentColor = accentGlowMap[category.accentVariant ?? 'default']
  const glowPos = glowPositionMap[category.accentVariant ?? 'default']
  const isAiCard = category.id === 'ai'

  return (
    <div
      className={`glass-card group relative overflow-hidden p-6 hover:-translate-y-0.5 hover:border-white/15 sm:p-8 md:p-[38px]${category.gridSpan === 2 ? ' lg:col-span-2' : ''}`}
    >
      {/* Ambient glow */}
      {isAiCard ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '220px',
            background:
              'radial-gradient(ellipse, rgba(112,0,255,0.11) 0%, rgba(255,92,0,0.05) 50%, transparent 70%)',
            filter: 'blur(35px)',
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-40 w-40"
          style={{
            ...glowPos,
            background: `radial-gradient(ellipse, ${accentColor} 0%, transparent 70%)`,
            filter: 'blur(24px)',
          }}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px]"
          style={{
            background: isAiCard ? 'rgba(112,0,255,0.14)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isAiCard ? 'rgba(112,0,255,0.28)' : 'rgba(255,255,255,0.1)'}`,
            color: isAiCard ? 'rgba(185,130,255,0.9)' : 'rgba(255,255,255,0.65)',
          }}
        >
          {icon}
        </div>
        <div>
          <h3
            className="text-base font-semibold tracking-[-0.02em]"
            style={{ color: '#ededed' }}
            id={`tech-cat-${category.id}`}
          >
            {name}
          </h3>
          <p className="mt-[3px] text-[13px] font-normal" style={{ color: 'var(--muted-sm)' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Tags */}
      <ul className="flex flex-wrap gap-2" aria-labelledby={`tech-cat-${category.id}`}>
        {category.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full px-[15px] py-[6px] text-[13px] font-medium"
            style={{
              background:
                category.tagVariant === 'violet'
                  ? 'rgba(112,0,255,0.09)'
                  : 'rgba(255,255,255,0.05)',
              border: `1px solid ${category.tagVariant === 'violet' ? 'rgba(112,0,255,0.22)' : 'rgba(255,255,255,0.08)'}`,
              color:
                category.tagVariant === 'violet'
                  ? 'rgba(195,155,255,0.82)'
                  : 'rgba(237,237,237,0.68)',
            }}
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
