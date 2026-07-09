import { ScreenEyebrow } from './ScreenEyebrow'
import type { ExperienceTranslations } from '@/types'

export function ExperienceScreen({ t }: { t: ExperienceTranslations }) {
  return (
    <div>
      <ScreenEyebrow page="experience" label="experience" className="term-in mb-6" />

      <ol className="term-in term-in-1 flex flex-col">
        {t.items.map((item) => (
          <li
            key={`${item.company}-${item.period}`}
            className="grid gap-4 pb-7"
            style={{ gridTemplateColumns: '20px 1fr' }}
          >
            {/* timeline rail */}
            <div className="flex flex-col items-center" aria-hidden="true">
              <span
                className="mt-[5px] h-[9px] w-[9px] flex-shrink-0 rounded-full"
                style={{ border: '2px solid var(--color-accent)', background: '#050505' }}
              />
              <span className="mt-1.5 w-px flex-1" style={{ background: 'var(--term-border)' }} />
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-[16px] font-semibold">{item.role}</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--color-accent)' }}>
                  {item.company}
                </span>
                <span
                  className="ml-auto font-mono text-[10px]"
                  style={{ color: 'var(--term-text-trace)' }}
                >
                  {item.period}
                </span>
              </div>
              <p
                className="mt-1.5 max-w-[540px] text-[13px]"
                style={{ lineHeight: 1.6, color: 'var(--term-text-soft)' }}
              >
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
