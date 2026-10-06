'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { PROJECTS } from '@/lib/projects-data'
import { MdTitle } from './shell/MdTitle'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { ProjectsTranslations } from '@/types'

/** Hovering past a row on the way to another shouldn't start loading it. */
const SELECT_DEBOUNCE_MS = 160
/** A framed site that still hasn't loaded after this long falls back to its screenshot. */
const LOAD_TIMEOUT_MS = 10_000

const noopSubscribe = () => () => {}

/** Set updater that adds `index`, keeping the same object when it is already there. */
const withIndex = (index: number) => (current: ReadonlySet<number>) =>
  current.has(index) ? current : new Set(current).add(index)

/**
 * `ls ./projects --preview`: the project list on the left, a live, scaled-down iframe
 * of the selected site on the right. Hovering (or focusing) a row selects it; clicking
 * opens the site.
 *
 * Sites that refuse to be framed, and framed ones that never finish loading, show a
 * screenshot instead, behind the same `connecting to …` overlay, so every row still
 * previews something. The status line says `snapshot` rather than `live` for those.
 *
 * Previews are only ever mounted on the client. A frame in the server HTML would start
 * loading before hydration, its `load` event would fire with no React handler attached
 * yet, and the overlay would sit there until the timeout.
 */
export function ProjectsScreen({ t }: { t: ProjectsTranslations }) {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  const [selected, setSelected] = useState(0)
  // Frames stay mounted once visited, so going back to a site is instant.
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]))
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set())
  const [timedOut, setTimedOut] = useState<ReadonlySet<number>>(() => new Set())

  const debounce = useRef<number | undefined>(undefined)
  // One pending timeout per framed site, cleared the moment that frame loads.
  const timeouts = useRef(new Map<number, number>())

  const showsSnapshot = (index: number) => !PROJECTS[index].embeddable || timedOut.has(index)

  const markLoaded = (index: number) => {
    clearTimeout(timeouts.current.get(index))
    setLoaded(withIndex(index))
  }

  const select = (index: number) => {
    setSelected(index)
    clearTimeout(debounce.current)
    debounce.current = window.setTimeout(() => {
      setVisited(withIndex(index))
      if (PROJECTS[index].embeddable && !timeouts.current.has(index)) {
        const fallBack = () => setTimedOut(withIndex(index))
        timeouts.current.set(index, window.setTimeout(fallBack, LOAD_TIMEOUT_MS))
      }
    }, SELECT_DEBOUNCE_MS)
  }

  // The first project's preview mounts with the screen, so its timeout starts here too.
  useEffect(() => {
    const pending = timeouts.current
    if (PROJECTS[0].embeddable) {
      pending.set(0, window.setTimeout(() => setTimedOut(withIndex(0)), LOAD_TIMEOUT_MS))
    }
    return () => {
      clearTimeout(debounce.current)
      pending.forEach((id) => clearTimeout(id))
    }
  }, [])

  const active = PROJECTS[selected]
  const ready = loaded.has(selected)
  const status = !ready ? t.loading : showsSnapshot(selected) ? t.snapshot : t.live

  return (
    <div className="term-projects">
      <div className="term-projects-main">
        <div className="term-block">
          <ShellCommand path="~/projects" command="cat README.md" at={0.08} />
          <div className="term-block" style={reveal(0.55)}>
            <MdTitle>{t.pill}</MdTitle>
            <p className="term-copy">{t.sub}</p>
          </div>
        </div>

        <div className="term-block">
          <ShellCommand path="~/projects" command="ls ./projects --preview" at={0.8} showAt={0.72} />
          <div className="term-project-list" style={reveal(1.57)}>
            {PROJECTS.map((project, index) => (
              <a
                key={project.url}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="term-project-row"
                data-selected={index === selected || undefined}
                onMouseEnter={() => select(index)}
                onFocus={() => select(index)}
              >
                <span className="term-menu-ptr" aria-hidden="true">
                  &gt;
                </span>
                <span className="term-project-idx term-menu-sub">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="term-project-info">
                  <span className="term-project-title">
                    <span className="term-project-name">{project.name}</span>
                    <span className="term-project-domain term-menu-sub">{project.domain}</span>
                  </span>
                  <span className="term-project-desc term-menu-sub">{t.descriptions[index]}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <aside className="term-preview" style={reveal(0.55)}>
        <div className="term-preview-head">
          <span className="term-preview-title">
            preview · <span>{active.domain}</span>
          </span>
          <span className="term-preview-status" data-live={ready || undefined}>
            {status}
          </span>
        </div>

        <a
          className="term-preview-frame"
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={active.name}
        >
          {hydrated &&
            PROJECTS.map((project, index) => {
              if (!visited.has(index)) return null
              const style = { opacity: index === selected ? 1 : 0, zIndex: index === selected ? 2 : 1 }

              return showsSnapshot(index) ? (
                <Image
                  key={`${project.url}#snapshot`}
                  src={project.screenshot}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  onLoad={() => markLoaded(index)}
                  style={style}
                />
              ) : (
                <iframe
                  key={project.url}
                  src={project.url}
                  title={project.name}
                  sandbox="allow-scripts allow-same-origin"
                  tabIndex={-1}
                  onLoad={() => markLoaded(index)}
                  style={style}
                />
              )
            })}
          {!ready && (
            // Keyed by domain so the load bar restarts for each site.
            <div key={active.domain} className="term-preview-loading">
              <span className="term-preview-loading-cmd">$ preview {active.url}</span>
              <span>connecting to {active.domain}…</span>
              <span className="term-preview-bar" />
            </div>
          )}
        </a>

        <div className="term-preview-foot">
          <span>{t.hint}</span>
          <a href={active.url} target="_blank" rel="noopener noreferrer">
            open ↗
          </a>
        </div>
      </aside>
    </div>
  )
}
