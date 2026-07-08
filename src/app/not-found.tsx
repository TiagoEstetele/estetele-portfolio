import { getLocale, getTranslations } from 'next-intl/server'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { LiveClock } from '@/components/ui/LiveClock'
import { MatrixBackground } from '@/components/ui/MatrixBackground'
import { SHELL_USER } from '@/lib/site'

/**
 * Last-resort 404, for URLs the locale middleware never sees — its matcher skips any
 * path containing a dot (`/robots.txt.bak`, `/x.php`). Everything else is caught by
 * `[locale]/[...rest]/page.tsx` and rendered inside the live terminal shell.
 *
 * This page sits above `[locale]/layout.tsx`, so it has no shell, no locale context,
 * and therefore no next-intl client hooks: a bare window with a plain anchor home.
 */
const SHELL_ERROR = 'zsh: no such file or directory'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'notFound' })

  // `localePrefix: 'as-needed'` — the default locale is served unprefixed.
  const home = locale === 'pt' ? '/pt' : '/'

  return (
    <>
      <MatrixBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(74,222,128,0.06), transparent 70%)',
        }}
      />
      <CustomCursor />

      <main className="term-stage">
        <div className="term-window" style={{ height: 'auto', maxWidth: 640 }}>
          <div className="term-titlebar">
            <div className="flex flex-shrink-0 items-center gap-1.5" aria-hidden="true">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot term-dot--live" />
            </div>
            <span className="term-title">{`${SHELL_USER}:~ — zsh`}</span>
            <span className="term-clock">
              <LiveClock />
            </span>
          </div>

          <div style={{ padding: 'clamp(24px, 5vw, 44px)' }}>
            <div
              className="font-mono text-[13px]"
              style={{ color: 'var(--term-text-faint)', lineHeight: 2 }}
            >
              <div style={{ color: 'var(--color-danger)' }}>{SHELL_ERROR}</div>
              <div>
                <span style={{ color: 'var(--term-text-ghost)' }}>$</span> echo $?
              </div>
              <div style={{ color: 'var(--color-accent)' }}>404</div>
            </div>

            <h1
              className="mt-7 font-semibold"
              style={{
                fontSize: 'clamp(64px, 12vw, 110px)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              404<span style={{ color: 'var(--color-accent)' }}>.</span>
            </h1>

            <p
              className="mt-4 max-w-[400px] text-[16px]"
              style={{ lineHeight: 1.65, color: 'var(--term-text-soft)' }}
            >
              {t('description')}
            </p>

            <div className="mt-7">
              <a href={home} className="term-btn term-btn--primary">
                cd ~/home
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
