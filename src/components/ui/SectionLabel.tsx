interface SectionLabelProps {
  text: string
  withDot?: boolean
  className?: string
}

export function SectionLabel({ text, withDot = false, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full px-[18px] py-[7px] text-xs font-semibold uppercase tracking-[0.09em] ${className}`}
      style={{
        background: 'var(--pill-surface)',
        border: '1px solid var(--pill-border)',
        color: 'var(--muted-sm)',
      }}
    >
      {withDot && (
        <span
          className="dot-pulse inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: '#7000ff', boxShadow: '0 0 10px rgba(112,0,255,0.9)' }}
          aria-hidden="true"
        />
      )}
      {text}
    </div>
  )
}
