import { TECH_CATEGORIES } from '@/lib/tech-data'
import { ScreenEyebrow } from './ScreenEyebrow'
import type { StackTranslations } from '@/types'

export function StackScreen({ t }: { t: StackTranslations }) {
  return (
    <div>
      <ScreenEyebrow page="stack" label={t.pill} className="mb-2" />

      <p
        className="mb-6 max-w-[480px] font-mono text-[12px]"
        style={{ color: 'var(--term-text-faint)', lineHeight: 1.7 }}
      >
        {t.subtext}
      </p>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
      >
        {TECH_CATEGORIES.map((category) => (
          <div key={category.id} className="term-card">
            <div className="term-card-head">
              <span
                className="font-mono text-[12px] font-medium"
                style={{ color: 'var(--term-text-dim)' }}
              >
                {category.dir}
              </span>
              <span className="font-mono text-[9px]" style={{ color: 'var(--term-text-trace)' }}>
                {t.categories[category.id].sub}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-3.5 py-3">
              {category.tags.map((tag) => (
                <span key={tag} className="term-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
