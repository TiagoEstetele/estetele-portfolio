import { EDUCATION } from '@/lib/education-data'
import { ScreenEyebrow } from './ScreenEyebrow'
import type { AboutTranslations } from '@/types'

export function AboutScreen({ t }: { t: AboutTranslations }) {
  return (
    <div>
      <ScreenEyebrow page="about" label="about" className="term-in mb-6" />

      <p
        className="term-in term-in-1 max-w-[640px] text-[21px]"
        style={{ lineHeight: 1.6, color: '#c9c9c3', letterSpacing: '-0.01em' }}
      >
        {t.p1}
      </p>

      <p
        className="term-in term-in-2 mt-5 max-w-[640px] text-[16px]"
        style={{ lineHeight: 1.7, color: 'var(--term-text-soft)' }}
      >
        {t.p2}
      </p>

      <section className="term-in term-in-3 mt-11 max-w-[640px]">
        <h2 className="term-edu-title">{t.eduTitle}</h2>

        <div className="flex flex-col gap-3.5">
          {EDUCATION.map((edu, index) => {
            const detail = t.education[index]
            return (
              <article key={edu.mark} className="term-edu-card">
                <span
                  className="term-edu-mark"
                  style={{ background: edu.color }}
                  aria-hidden="true"
                >
                  {edu.mark}
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[15px] font-semibold"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {edu.school}
                  </div>
                  <div
                    className="mt-[3px] text-[13px]"
                    style={{ lineHeight: 1.5, color: 'var(--term-text-muted)' }}
                  >
                    {detail.course}
                  </div>
                  <div
                    className="mt-1.5 font-mono text-[10px]"
                    style={{ color: 'var(--term-text-ghost)' }}
                  >
                    {detail.period}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {detail.tags.map((tag) => (
                      <span key={tag} className="term-edu-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
