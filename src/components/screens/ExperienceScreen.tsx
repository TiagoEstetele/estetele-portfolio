'use client'

import { Fragment, useState, useSyncExternalStore } from 'react'
import { COMPANIES, EXPERIENCE } from '@/lib/experience-data'
import { currentMonth, formatDuration, formatPeriod, monthIndex, yearOf } from '@/lib/format-period'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { CompanyId, ExperienceTranslations, Locale } from '@/types'

interface ExperienceScreenProps {
  t: ExperienceTranslations
  locale: Locale
  /**
   * Month index the server rendered with. The page can be prerendered, so on the client
   * the real current month takes over after hydration and durations keep counting.
   */
  serverMonth: number
}

/**
 * Re-reads the clock once a minute. The snapshot is a month index, so React only
 * re-renders when the month actually turns: a tab left open across the 1st still
 * ticks `2 mos` over to `3 mos`.
 */
const subscribeToClock = (onChange: () => void) => {
  const id = window.setInterval(onChange, 60_000)
  return () => clearInterval(id)
}

/** The timeline starts with the first job. */
const TIMELINE_START = Math.min(...EXPERIENCE.map((entry) => monthIndex(entry.start)))

const percent = (value: number) => `${Math.max(0, Math.min(100, value)).toFixed(2)}%`

/** `Brivia | The Creative Smartech · 11 mos` when the company spans several roles. */
function companyLabel(company: CompanyId, now: number, locale: Locale) {
  const roles = EXPERIENCE.filter((entry) => entry.company === company)
  if (roles.length < 2) return COMPANIES[company]

  const start = Math.min(...roles.map((entry) => monthIndex(entry.start)))
  const stop = Math.max(...roles.map((entry) => (entry.end ? monthIndex(entry.end) : now)))
  return `${COMPANIES[company]} · ${formatDuration(stop - start + 1, locale)}`
}

/**
 * `tig --career`: the career as a commit log. Each row is a role with a bar on a
 * proportional timeline; clicking one opens its `git show` below. The current role is
 * under NDA, so its `show` is a redacted `--stat` instead of a description.
 */
export function ExperienceScreen({ t, locale, serverMonth }: ExperienceScreenProps) {
  const now = useSyncExternalStore(
    subscribeToClock,
    () => currentMonth(),
    () => serverMonth,
  )
  const [selected, setSelected] = useState(0)

  const end = now + 1
  const span = Math.max(1, end - TIMELINE_START)
  const offset = (index: number) => ((index - TIMELINE_START) / span) * 100

  const ticks: number[] = []
  for (let year = yearOf(TIMELINE_START) + 1; year <= yearOf(now); year++) ticks.push(year)

  const entry = EXPERIENCE[selected]
  const text = t.items[selected]
  const decoration = entry.deco ? `(${entry.deco})` : ''
  const position = `commit ${selected + 1} ${locale === 'pt' ? 'de' : 'of'} ${EXPERIENCE.length}`

  return (
    <div className="term-screen term-screen--wide">
      <div className="term-block">
        <ShellCommand path="~/experience" command="tig --career" at={0.08} />

        <div className="term-tig" style={reveal(0.52)}>
          <div className="term-tig-log">
            <div className="term-tig-axis" aria-hidden="true">
              <span />
              <span className="term-tig-ticks">
                {ticks.map((year) => (
                  <span key={year} style={{ left: percent(offset(year * 12)) }}>
                    {year}
                  </span>
                ))}
              </span>
            </div>

            {EXPERIENCE.map((role, index) => {
              const start = monthIndex(role.start)
              const stop = role.end ? monthIndex(role.end) + 1 : end
              const [year, month] = role.start

              return (
                <button
                  key={role.sha}
                  type="button"
                  className="term-tig-row"
                  data-selected={index === selected || undefined}
                  data-head={index === 0 || undefined}
                  aria-pressed={index === selected}
                  onClick={() => setSelected(index)}
                >
                  <span className="term-tig-commit">
                    <span className="term-tig-date">{`${year}-${String(month).padStart(2, '0')}`}</span>
                    <span className="term-tig-node" aria-hidden="true" />
                    <span className="term-tig-sha">{role.sha}</span>
                    <span className="term-tig-subject">
                      {role.deco && <span className="term-tig-deco">({role.deco}) </span>}
                      {t.items[index].role}
                    </span>
                  </span>
                  <span className="term-tig-track" aria-hidden="true">
                    <span
                      className="term-tig-bar"
                      style={{
                        left: percent(offset(start)),
                        width: percent(Math.max(1.5, ((stop - start) / span) * 100)),
                      }}
                    />
                  </span>
                </button>
              )
            })}
          </div>

          <div className="term-tig-status">
            <span>
              [main] <b>{entry.sha}</b> · {position}
            </span>
            <span className="term-tig-hint">{t.hint}</span>
          </div>

          {/* Keyed by commit so each `show` fades in fresh. */}
          <div key={entry.sha} className="term-tig-show">
            <div className="term-tig-show-commit">
              commit {entry.sha} <span>{decoration}</span>
            </div>
            <dl className="term-tig-meta">
              <dt>Org:</dt>
              <dd>{companyLabel(entry.company, now, locale)}</dd>
              <dt>Date:</dt>
              <dd>{formatPeriod(entry.start, entry.end, now, locale)}</dd>
              <dt>Where:</dt>
              <dd>{text.where}</dd>
            </dl>

            <div className="term-tig-body">
              <div className="term-tig-role">{text.role}</div>
              {text.desc.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {entry.nda && <RedactedStat sha={entry.sha} error={t.ndaErr} note={t.ndaNote} />}
            </div>

            <ul className="term-tig-skills">
              {entry.skills.map((skill) => (
                <li key={skill}>+ {skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Three changed files, names and counts blacked out. */
const REDACTED_FILES = [
  { path: 'src/█████████/███████.js', count: '██', add: '++++++++++', del: '' },
  { path: 'api/███████████.php', count: '███', add: '++++++', del: '--' },
  { path: 'styles/██████/█████.scss', count: '██', add: '++++', del: '-' },
]

function RedactedStat({ sha, error, note }: { sha: string; error: string; note: string }) {
  return (
    <div className="term-nda">
      <div className="term-nda-redacted">$ git show {sha} --stat</div>
      <div className="term-nda-del">{error}</div>
      <div className="term-nda-stat">
        {REDACTED_FILES.map((file) => (
          <Fragment key={file.path}>
            <span className="term-nda-file">{file.path}</span>
            <span className="term-nda-pipe">|</span>
            <span className="term-nda-count">
              <span className="term-nda-redacted">{file.count}</span>{' '}
              <span className="term-nda-add">{file.add}</span>
              <span className="term-nda-del">{file.del}</span>
            </span>
          </Fragment>
        ))}
      </div>
      <div className="term-nda-summary">
        3 files changed, <span className="term-nda-redacted">███</span> insertions(+),{' '}
        <span className="term-nda-redacted">██</span> deletions(-)
      </div>
      <div className="term-nda-note">{note}</div>
    </div>
  )
}
