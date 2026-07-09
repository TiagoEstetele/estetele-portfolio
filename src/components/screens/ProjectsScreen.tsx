import { PROJECTS } from '@/lib/projects-data'
import { ScreenEyebrow } from './ScreenEyebrow'
import type { ProjectsTranslations } from '@/types'

export function ProjectsScreen({ t }: { t: ProjectsTranslations }) {
  return (
    <div>
      <ScreenEyebrow page="projects" label={t.pill} className="term-in mb-6" />

      <div className="term-in term-in-1 flex flex-col gap-2.5">
        {PROJECTS.map((project, index) => (
          <a
            key={project.url}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="term-project"
          >
            <div className="min-w-[200px] flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[16px] font-semibold">{project.name}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--term-text-trace)' }}>
                  {project.domain}
                </span>
              </div>
              <div
                className="mt-[5px] text-[13px]"
                style={{ lineHeight: 1.55, color: 'var(--term-text-soft)' }}
              >
                {t.descriptions[index]}
              </div>
            </div>
            <span
              className="font-mono text-[12px]"
              style={{ color: 'var(--color-accent)' }}
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
