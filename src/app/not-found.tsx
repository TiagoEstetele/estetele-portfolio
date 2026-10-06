import { getLocale, getTranslations } from 'next-intl/server'
import { ART_404 } from '@/components/screens/shell/art'
import { BlockArt } from '@/components/screens/shell/BlockArt'
import { ShellCommand } from '@/components/screens/shell/ShellCommand'
import { reveal } from '@/components/screens/shell/reveal'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { GitGraphBackground } from '@/components/ui/GitGraphBackground'
import { LiveClock } from '@/components/ui/LiveClock'
import { SHELL_USER } from '@/lib/site'

/**
 * Last-resort 404, for URLs the locale middleware never sees: its matcher skips any
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

  // `localePrefix: 'as-needed'`: the default locale is served unprefixed.
  const home = locale === 'pt' ? '/pt' : '/'

  return (
    <>
      <GitGraphBackground />
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
            <span className="term-title">{`${SHELL_USER}:~ · zsh`}</span>
            <span className="term-clock tnum">
              <LiveClock />
            </span>
          </div>

          <div className="term-screen" style={{ padding: 'var(--term-pad)' }}>
            <div className="term-error">{SHELL_ERROR}</div>

            <div className="term-block">
              <ShellCommand path="~" command="echo $?" at={0.23} showAt={0.15} />
              <BlockArt
                lines={ART_404}
                label="404"
                style={{ alignSelf: 'flex-start', ...reveal(0.52) }}
              />
            </div>

            <div className="term-block" style={{ gap: 14, ...reveal(0.72) }}>
              <p className="term-copy" style={{ maxWidth: '60ch' }}>
                {t('description')}
              </p>
              <div className="term-menu">
                <a href={home} className="term-menu-row" data-selected>
                  <span className="term-menu-ptr" aria-hidden="true">
                    &gt;
                  </span>
                  <span>cd ~/home</span>
                  <span className="term-menu-sub">{t('backHome')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
