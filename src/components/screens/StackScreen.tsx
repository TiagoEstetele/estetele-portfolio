import { TECH_CATEGORIES } from '@/lib/tech-data'
import { MdTitle } from './shell/MdTitle'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { StackTranslations } from '@/types'

/** `cat README.md`, then `ls -la ./stack`: one directory per area, its tools as files. */
export function StackScreen({ t }: { t: StackTranslations }) {
  return (
    <div className="term-screen">
      <div className="term-block">
        <ShellCommand path="~/stack" command="cat README.md" at={0.08} />
        <div className="term-block" style={reveal(0.55)}>
          <MdTitle>{t.pill}</MdTitle>
          <p className="term-copy">{t.subtext}</p>
        </div>
      </div>

      <div className="term-block">
        <ShellCommand path="~/stack" command="ls -la ./stack" at={0.8} showAt={0.72} />
        <div className="term-ls" style={reveal(1.3)}>
          <div className="term-ls-total">total {TECH_CATEGORIES.length}</div>
          {TECH_CATEGORIES.map((category) => (
            <div key={category.id} className="term-ls-row">
              <span className="term-ls-meta">
                <span className="term-ls-perm">drwxr-xr-x</span>
                <span className="term-ls-count">{category.tags.length}</span>
                <span className="term-ls-dir">{category.dir}</span>
              </span>
              <span className="term-ls-files">
                {category.tags.map((tag) => (
                  <span key={tag} className="term-ls-file">
                    {tag}
                  </span>
                ))}
                <span className="term-ls-note"># {t.categories[category.id].sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
