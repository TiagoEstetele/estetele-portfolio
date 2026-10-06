import { EDUCATION } from '@/lib/education-data'
import { MdTitle } from './shell/MdTitle'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { AboutTranslations } from '@/types'

/** `cat about.md`, then `tree ./education`. */
export function AboutScreen({ t }: { t: AboutTranslations }) {
  return (
    <div className="term-screen">
      <div className="term-block">
        <ShellCommand path="~/about" command="cat about.md" at={0.08} />
        <div className="term-block" style={reveal(0.52)}>
          <MdTitle>{t.title}</MdTitle>
          <p className="term-lead">{t.p1}</p>
          <p className="term-copy">{t.p2}</p>
        </div>
      </div>

      <div className="term-block">
        <ShellCommand path="~/about" command="tree ./education" at={0.8} showAt={0.72} />
        <div className="term-tree" style={reveal(1.36)}>
          <div className="term-tree-root">./education</div>
          {EDUCATION.map((entry, index) => {
            const { course, tags } = t.education[index]
            const last = index === EDUCATION.length - 1
            const trunk = last ? '    ' : '│   '

            return (
              <div key={entry.dir}>
                <TreeLine branch={last ? '└── ' : '├── '}>
                  <span className="term-tree-head">
                    <span className="term-tree-dir">{entry.dir}</span>
                    <span className="term-tree-period">{entry.period}</span>
                  </span>
                </TreeLine>
                <TreeLine branch={`${trunk}├── `}>
                  <span className="term-tree-course">{course}</span>
                </TreeLine>
                <TreeLine branch={`${trunk}└── `}>
                  <span className="term-tree-tags">{tags.join(' · ')}</span>
                </TreeLine>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TreeLine({ branch, children }: { branch: string; children: React.ReactNode }) {
  return (
    <div className="term-tree-line">
      <span className="term-tree-branch" aria-hidden="true">
        {branch}
      </span>
      {children}
    </div>
  )
}
