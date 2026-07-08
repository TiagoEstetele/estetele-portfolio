'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { LiveClock } from '@/components/ui/LiveClock'
import { Uptime } from '@/components/ui/Uptime'
import { PAGES, TAB_LABELS, hrefFor, pageFromPathname } from '@/lib/pages'
import { BUILD, SHELL_USER } from '@/lib/site'
import { TerminalLink } from './TerminalLink'
import { TerminalNavContext } from './terminal-nav'
import type { Locale, PageId, TerminalTranslations } from '@/types'

interface TerminalShellProps {
  locale: Locale
  t: TerminalTranslations
  children: ReactNode
}

const BOOT_LINES = [
  { tag: '[ OK ]', text: 'boot sequence initialized' },
  { tag: '[ OK ]', text: 'mounting /dev/portfolio' },
  { tag: '[ OK ]', text: 'loading modules: react · next · typescript' },
  { tag: '[ OK ]', text: 'connecting to estetele.dev ... 200' },
  { tag: '[ OK ]', text: 'env: remote · brazil · utc-3' },
  { tag: '$', text: './portfolio --start', bright: true },
]

const LOCALES = [
  { code: 'en', hrefLang: 'en', name: 'English' },
  { code: 'pt', hrefLang: 'pt-BR', name: 'Português' },
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
const BOOT_HOLD_MS = 520

/**
 * Survives client-side navigation — including a locale switch, which remounts this
 * subtree because the `[locale]` segment changes — but resets on a hard reload.
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

  const showBoot = booting && !prefersReducedMotion

  const [contentIn, setContentIn] = useState(true)
  const [typed, setTyped] = useState('')
  const [output, setOutput] = useState('')
  const [outputColor, setOutputColor] = useState(OUTPUT_QUIET)
  const [busy, setBusy] = useState(false)

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
  useEffect(() => {
    if (hasBooted) return

    // Nothing to animate, and `showBoot` already hides the overlay — just mark the
    // document as booted so a later locale switch doesn't try to replay it.
    if (prefersReducedMotion) {
      hasBooted = true
      return
    }

    let step = 0
    const advance = () => {
      step += 1
      setBootStep(step)

      if (step < BOOT_LINES.length) {
        later(BOOT_LINE_BASE_MS + Math.random() * BOOT_LINE_JITTER_MS, advance)
        return
      }

      later(BOOT_HOLD_MS, () => {
        hasBooted = true
        setBooting(false)
        // Drop the content to its "out" position for a frame so it fades in behind
        // the boot log rather than snapping into place.
        setContentIn(false)
        later(60, () => setContentIn(true))
      })
    }

    later(BOOT_FIRST_LINE_MS, advance)
  }, [later, prefersReducedMotion])

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

      const [command, rawArg = ''] = input.toLowerCase().split(/\s+/)
      const arg = rawArg.replace(/^~\//, '').replace(/^\//, '')

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

          setTyped('')
          setOutput('')
          if (href === pathname) refade()
          else leaveTo(href)
          return
        }

        case 'ls':
          say(PAGES.map((entry) => `${entry}/`).join('  '), OUTPUT_INFO)
          return

        case 'help':
          say(t.help, OUTPUT_INFO)
          return

        case 'whoami':
          say(t.whoami, OUTPUT_INFO)
          return

        case 'lang': {
          // `br` is what a Brazilian reaches for; the route is `pt` (served as pt-BR).
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
    [locale, pathname, refade, leaveTo, router, t],
  )

  // ── Keyboard: the whole window is the input ───────────────────────────────
  // The listener attaches once; this ref keeps it looking at fresh state.
  const latest = useRef({ busy, typed, execute })
  useEffect(() => {
    latest.current = { busy, typed, execute }
  })

  useEffect(() => {
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

      if (event.key === 'Enter') {
        latest.current.execute(latest.current.typed)
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

  return (
    <TerminalNavContext.Provider value={navigate}>
      <div className="term-stage">
        {/* Each branch spells out the full class list. A template literal with a
            leading-space fragment (`term-window${' term-window--entering'}`) gets its
            space eaten by prettier-plugin-tailwindcss, silently welding the two names
            into one that matches no rule. */}
        <div className={entering ? 'term-window term-window--entering' : 'term-window'}>
          {/* titlebar */}
          <div className="term-titlebar">
            <div className="flex flex-shrink-0 items-center gap-1.5" aria-hidden="true">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot term-dot--live" />
            </div>
            <span className="term-title">{`${SHELL_USER}:~/${page} — zsh`}</span>
            <span className="term-clock">
              <LiveClock />
            </span>
          </div>

          {/* tabs + locale */}
          <div className="term-nav">
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
              {LOCALES.map(({ code, hrefLang, name }) =>
                code === locale ? (
                  <span key={code} aria-current="true">
                    /{code}
                  </span>
                ) : (
                  <Link
                    key={code}
                    href={pathname}
                    locale={code}
                    hrefLang={hrefLang}
                    aria-label={name}
                  >
                    /{code}
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
                  <div
                    key={line.text}
                    style={line.bright ? { color: 'var(--color-foreground)' } : undefined}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>{line.tag}</span> {line.text}
                  </div>
                ))}
                <span className="term-cursor term-cursor--boot" />
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
              <span className="term-cursor" />
            </div>
          </div>

          {/* status bar */}
          <div className="term-status">
            <span>
              ⎇ {BUILD.branch} · sha {BUILD.sha} · uptime <Uptime />
            </span>
            <span>{t.footerHint}</span>
          </div>
        </div>
      </div>
    </TerminalNavContext.Provider>
  )
}
