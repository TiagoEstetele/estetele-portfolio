'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { LiveClock } from '@/components/ui/LiveClock'
import { Uptime } from '@/components/ui/Uptime'
import { commitToGraph } from '@/lib/git-graph'
import { PAGES, TAB_LABELS, hrefFor, isPageId, pageFromPathname } from '@/lib/pages'
import { BUILD, SHELL_USER } from '@/lib/site'
import { HelpPanel } from './HelpPanel'
import { TerminalLink } from './TerminalLink'
import { TerminalNavContext } from './terminal-nav'
import type { Locale, PageId, TerminalTranslations } from '@/types'

interface TerminalShellProps {
  locale: Locale
  t: TerminalTranslations
  children: ReactNode
}

const BOOT_LINES = [
  'boot sequence initialized',
  'mounting /dev/portfolio',
  'loading modules: react · next · typescript',
  'connecting to estetele.dev ... 200',
  'env: remote · brazil · utc-3',
]
const BOOT_COMMAND = './portfolio --start'

/**
 * `label` is what the switcher prints. Portuguese is served under `/pt` (pt-BR), but the
 * terminal calls it `br`, the way a Brazilian would type it.
 */
const LOCALES = [
  { code: 'en', label: 'en', hrefLang: 'en', name: 'English' },
  { code: 'pt', label: 'br', hrefLang: 'pt-BR', name: 'Português' },
] as const

const OUTPUT_INFO = 'var(--term-text-muted)'
const OUTPUT_ERROR = 'var(--color-danger)'
const OUTPUT_QUIET = 'var(--term-text-faint)'

/** Per-character delay of the fake `cd ~/<page>` the tabs type out. */
const TYPE_INTERVAL_MS = 42
/** Beat between the command finishing and the content starting to leave. */
const TYPE_SETTLE_MS = 220
/** Must stay in step with `.term-viewport`'s opacity transition. */
const CONTENT_FADE_MS = 240

const BOOT_FIRST_LINE_MS = 650
const BOOT_LINE_BASE_MS = 170
const BOOT_LINE_JITTER_MS = 200
/** Pause after the log, and again after `./portfolio --start` is typed. */
const BOOT_PAUSE_MS = 380
const BOOT_TYPE_MS = 38

/**
 * Survives client-side navigation (including a locale switch, which remounts this
 * subtree because the `[locale]` segment changes) but resets on a hard reload.
 * That is exactly when the boot log should replay: once per document, not once per
 * route. Module scope rather than state, so remounting cannot resurrect the boot.
 */
let hasBooted = false

// Read as an external store rather than in an effect: setting state from an effect
// body to hide the boot log would cost a cascading render (and React lints against it).
// The server snapshot is `false`, so the boot markup is server-rendered and hydration
// agrees; React then re-renders once if the user actually prefers reduced motion.
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
let reducedMotionQuery: MediaQueryList | null = null
const getReducedMotionQuery = () => (reducedMotionQuery ??= window.matchMedia(REDUCED_MOTION))

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = getReducedMotionQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function TerminalShell({ locale, t, children }: TerminalShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const page = pageFromPathname(pathname)

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => getReducedMotionQuery().matches,
    () => false,
  )

  // Read once on the first render of this mount. On the server (and during hydration)
  // `hasBooted` is false, so the markup and the first client render always agree.
  const [entering] = useState(() => !hasBooted)
  const [booting, setBooting] = useState(() => !hasBooted)
  const [bootStep, setBootStep] = useState(0)
  const [bootTyped, setBootTyped] = useState<string | null>(null)

  const showBoot = booting && !prefersReducedMotion

  const [contentIn, setContentIn] = useState(true)
  const [typed, setTyped] = useState('')
  const [output, setOutput] = useState('')
  const [outputColor, setOutputColor] = useState(OUTPUT_QUIET)
  const [busy, setBusy] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  // Bumped on every keystroke; keys the prompt cursor so its blink restarts, like a
  // real terminal's does while you type.
  const [keystrokes, setKeystrokes] = useState(0)

  /** Commands entered this session, oldest first, and where ↑/↓ currently sits in it. */
  const history = useRef<string[]>([])
  const historyIndex = useRef(-1)

  const viewport = useRef<HTMLDivElement>(null)
  const timeouts = useRef<number[]>([])
  const typer = useRef<number | null>(null)

  const clearPending = useCallback(() => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    if (typer.current !== null) {
      clearInterval(typer.current)
      typer.current = null
    }
  }, [])

  const later = useCallback((ms: number, run: () => void) => {
    timeouts.current.push(window.setTimeout(run, ms))
  }, [])

  useEffect(() => clearPending, [clearPending])

  // ── Boot log ──────────────────────────────────────────────────────────────
  // Its own timers, not `later`: a route change mid-boot runs `clearPending`, and that
  // must not strand the window with the boot log up forever.
  useEffect(() => {
    if (hasBooted) return

    const timers: number[] = []
    let typing: number | undefined
    const wait = (ms: number, run: () => void) => timers.push(window.setTimeout(run, ms))

    const finish = () => {
      hasBooted = true
      // Dropping `data-booting` is what fades the screen in and starts its session.
      setBooting(false)
    }

    if (prefersReducedMotion) {
      // Nothing to animate: hand over straight away. Deferred a tick because setting
      // state synchronously in an effect body costs a cascading render.
      wait(0, finish)
      return () => timers.forEach(clearTimeout)
    }

    const typeCommand = () => {
      let index = 0
      setBootTyped('')
      typing = window.setInterval(() => {
        index += 1
        setBootTyped(BOOT_COMMAND.slice(0, index))
        if (index < BOOT_COMMAND.length) return
        clearInterval(typing)
        wait(BOOT_PAUSE_MS, finish)
      }, BOOT_TYPE_MS)
    }

    let step = 0
    const advance = () => {
      step += 1
      setBootStep(step)
      if (step < BOOT_LINES.length) wait(BOOT_LINE_BASE_MS + Math.random() * BOOT_LINE_JITTER_MS, advance)
      else wait(BOOT_PAUSE_MS, typeCommand)
    }

    wait(BOOT_FIRST_LINE_MS, advance)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(typing)
    }
  }, [prefersReducedMotion])

  // ── Route arrival: the new screen has rendered, so bring it back in ────────
  const lastPathname = useRef(pathname)
  useEffect(() => {
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname

    clearPending()
    setTyped('')
    setOutput('')
    setBusy(false)
    setContentIn(true)
    if (viewport.current) viewport.current.scrollTop = 0
  }, [pathname, clearPending])

  /** Fade out, push, and let the arrival effect above fade the new screen in. */
  const leaveTo = useCallback(
    (href: string) => {
      setBusy(true)
      setContentIn(false)
      later(CONTENT_FADE_MS, () => router.push(href))
    },
    [later, router],
  )

  /** `cd` onto the screen we're already on: no route change, just a re-entry. */
  const refade = useCallback(() => {
    setContentIn(false)
    later(CONTENT_FADE_MS, () => setContentIn(true))
  }, [later])

  // ── Tab / CTA navigation: type the command, then travel ───────────────────
  const navigate = useCallback(
    (target: PageId) => {
      if (busy || target === page) return

      clearPending()
      setBusy(true)
      setTyped('')
      setOutput('')

      const command = `cd ~/${target}`
      commitToGraph(command)
      let index = 0

      typer.current = window.setInterval(() => {
        index += 1
        setTyped(command.slice(0, index))
        if (index < command.length) return

        clearInterval(typer.current!)
        typer.current = null
        later(TYPE_SETTLE_MS, () => {
          setContentIn(false)
          later(CONTENT_FADE_MS, () => router.push(hrefFor(target)))
        })
      }, TYPE_INTERVAL_MS)
    },
    [busy, page, clearPending, later, router],
  )

  // ── Commands typed at the prompt ──────────────────────────────────────────
  const execute = useCallback(
    (raw: string) => {
      const input = raw.trim()
      if (!input) return

      const words = input.split(/\s+/)
      const command = words[0].toLowerCase()
      const arg = (words[1] ?? '').toLowerCase().replace(/^~\//, '').replace(/^\//, '')

      const say = (text: string, color: string) => {
        setTyped('')
        setOutput(text)
        setOutputColor(color)
      }

      switch (command) {
        case 'cd': {
          // Directory names only. Anything else collapses to a miss, which lands on
          // the real 404 route rather than a fabricated in-place screen.
          const target = arg === '' || arg === '~' ? 'home' : arg.replace(/[^a-z0-9-_]/g, '')
          const href = target === '' || target === 'home' ? '/' : `/${target}`
          if (isPageId(target)) commitToGraph(`cd ~/${target}`)

          setTyped('')
          setOutput('')
          if (href === pathname) refade()
          else leaveTo(href)
          return
        }

        case 'ls':
          say(PAGES.map((entry) => `${entry}/`).join('  '), OUTPUT_INFO)
          return

        case 'pwd':
          say(`/home/tiago/${page}`, OUTPUT_INFO)
          return

        case 'date':
          say(new Date().toString(), OUTPUT_INFO)
          return

        case 'history':
          say(history.current.length ? history.current.join('\n') : t.historyEmpty, OUTPUT_INFO)
          return

        case 'echo':
          // Echo what was typed, in the case it was typed.
          say(input.slice(words[0].length).trim(), OUTPUT_INFO)
          return

        case 'man':
          setTyped('')
          setOutput('')
          setHelpOpen(true)
          return

        case 'help':
          say(t.help, OUTPUT_INFO)
          return

        case 'whoami':
          say(t.whoami, OUTPUT_INFO)
          return

        case 'lang': {
          // The switcher calls Portuguese `br`; the route is `pt` (served as pt-BR).
          const next = arg === 'br' ? 'pt' : arg
          if (next !== 'en' && next !== 'pt') {
            say(t.langUsage, OUTPUT_ERROR)
            return
          }
          setTyped('')
          setOutput('')
          if (next !== locale) router.replace(pathname, { locale: next })
          return
        }

        case 'clear':
          setTyped('')
          setOutput('')
          return

        case 'sudo':
          say(t.sudo, OUTPUT_ERROR)
          return

        default:
          say(t.commandNotFound.replace('{cmd}', command), OUTPUT_ERROR)
      }
    },
    [locale, page, pathname, refade, leaveTo, router, t],
  )

  // ── Keyboard: the whole window is the input ───────────────────────────────
  // The listener attaches once; this ref keeps it looking at fresh state.
  const latest = useRef({ busy, typed, execute })
  useEffect(() => {
    latest.current = { busy, typed, execute }
  })

  useEffect(() => {
    /** Step through `history` with ↑/↓, the way a shell recalls past commands. */
    const recall = (direction: -1 | 1) => {
      const entries = history.current
      const index = historyIndex.current
      if (direction === -1) {
        if (!entries.length) return false
        historyIndex.current = index === -1 ? entries.length - 1 : Math.max(0, index - 1)
      } else {
        if (index === -1) return false
        historyIndex.current = index + 1 >= entries.length ? -1 : index + 1
      }
      setTyped(historyIndex.current === -1 ? '' : entries[historyIndex.current])
      return true
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const active = document.activeElement
      if (active instanceof HTMLElement) {
        if (active.isContentEditable) return
        if (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT'
        )
          return
        // Let Enter/Space activate a focused tab or button instead of reaching the prompt.
        const activating = event.key === 'Enter' || event.key === ' '
        if (activating && (active.tagName === 'A' || active.tagName === 'BUTTON')) return
      }

      if (latest.current.busy) return
      setKeystrokes((count) => count + 1)

      if (event.key === 'Enter') {
        const command = latest.current.typed.trim()
        // Run first, record after: `history` lists what came before it.
        latest.current.execute(command)
        if (command) history.current.push(command)
        historyIndex.current = -1
        return
      }
      // Only swallow the arrows when there is history to walk, so they still scroll
      // the screen otherwise.
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (recall(event.key === 'ArrowUp' ? -1 : 1)) event.preventDefault()
        return
      }
      if (event.key === 'Backspace') {
        setTyped((current) => current.slice(0, -1))
        event.preventDefault()
        return
      }
      if (event.key.length === 1) {
        setTyped((current) => current + event.key)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggleHelp = useCallback(() => setHelpOpen((open) => !open), [])

  return (
    <TerminalNavContext.Provider value={navigate}>
      <div className="term-stage">
        {/* Each branch spells out the full class list. A template literal with a
            leading-space fragment (`term-window${' term-window--entering'}`) gets its
            space eaten by prettier-plugin-tailwindcss, silently welding the two names
            into one that matches no rule. */}
        <div
          className={entering ? 'term-window term-window--entering' : 'term-window'}
          data-booting={showBoot || undefined}
        >
          {/* titlebar */}
          <div className="term-titlebar">
            <div className="flex flex-shrink-0 items-center gap-1.5" aria-hidden="true">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot term-dot--live" />
            </div>
            <span className="term-title">{`${SHELL_USER}:~/${page} · zsh`}</span>
            <span className="term-clock tnum">
              <LiveClock />
            </span>
          </div>

          {/* tabs + locale, held back until the boot log hands over */}
          <div className="term-nav" inert={showBoot}>
            <nav className="term-tabs" aria-label={t.navLabel}>
              {PAGES.map((entry) => (
                <TerminalLink
                  key={entry}
                  page={entry}
                  className="term-tab"
                  aria-current={entry === page ? 'page' : undefined}
                >
                  {TAB_LABELS[entry]}
                </TerminalLink>
              ))}
            </nav>

            <div className="term-lang">
              {LOCALES.map(({ code, label, hrefLang, name }) =>
                code === locale ? (
                  <span key={code} aria-current="true">
                    /{label}
                  </span>
                ) : (
                  <Link
                    key={code}
                    href={pathname}
                    locale={code}
                    hrefLang={hrefLang}
                    aria-label={name}
                  >
                    /{label}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* screen */}
          <div className="term-body">
            <div
              ref={viewport}
              className="term-viewport"
              style={{
                opacity: contentIn ? 1 : 0,
                transform: contentIn ? 'translateY(0px)' : 'translateY(16px)',
              }}
            >
              {children}
            </div>

            {showBoot && (
              <div className="term-boot" aria-hidden="true">
                {BOOT_LINES.slice(0, bootStep).map((line) => (
                  <div key={line} className="term-boot-line">
                    <b>[ OK ]</b> {line}
                  </div>
                ))}
                {bootTyped !== null && (
                  <div className="term-boot-line term-boot-line--command">
                    {bootTyped}
                    <span className="term-cursor term-cursor--boot" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* prompt */}
          <div className="term-prompt">
            {output && (
              <div className="term-output" style={{ color: outputColor }} role="status">
                {output}
              </div>
            )}
            <div className="term-prompt-line" aria-hidden="true">
              <span style={{ color: 'var(--color-accent)' }}>{SHELL_USER}</span>
              <span style={{ color: 'var(--term-text-ghost)' }}>~/{page}</span>
              <span style={{ color: 'var(--term-text-ghost)' }}>$</span>
              <span className="term-typed">{typed}</span>
              <span key={keystrokes} className="term-cursor" />
            </div>
          </div>

          {/* status bar */}
          <div className="term-status">
            <span>
              ⎇ {BUILD.branch} · sha {BUILD.sha} · uptime{' '}
              <span className="tnum">
                <Uptime />
              </span>
            </span>
            <span>{t.footerHint}</span>
          </div>
        </div>

        <HelpPanel t={t.helpPanel} open={helpOpen} onToggle={toggleHelp} />
      </div>
    </TerminalNavContext.Provider>
  )
}
