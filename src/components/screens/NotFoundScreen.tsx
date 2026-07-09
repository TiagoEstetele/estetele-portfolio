import { TerminalLink } from '@/components/terminal/TerminalLink'
import { RequestedPath } from '@/components/ui/RequestedPath'
import type { NotFoundTranslations } from '@/types'

/** A real shell wouldn't translate its own errors, and neither does this one. */
const SHELL_ERROR = 'zsh: no such file or directory:'

export function NotFoundScreen({ t }: { t: NotFoundTranslations }) {
  return (
    <div>
      <div
        className="font-mono text-[13px]"
        style={{ color: 'var(--term-text-faint)', lineHeight: 2 }}
      >
        <div>
          <span style={{ color: 'var(--term-text-ghost)' }}>$</span> cd <RequestedPath />
        </div>
        <div style={{ color: 'var(--color-danger)' }}>
          {SHELL_ERROR} <RequestedPath />
        </div>
        <div>
          <span style={{ color: 'var(--term-text-ghost)' }}>$</span> echo $?
        </div>
        <div style={{ color: 'var(--color-accent)' }}>404</div>
      </div>

      <h1
        className="term-in mt-7 font-semibold"
        style={{
          fontSize: 'clamp(64px, 12vw, 110px)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        404<span style={{ color: 'var(--color-accent)' }}>.</span>
      </h1>

      <p
        className="term-in term-in-1 mt-4 max-w-[400px] text-[16px]"
        style={{ lineHeight: 1.65, color: 'var(--term-text-soft)' }}
      >
        {t.description}
      </p>

      <div className="mt-7">
        <TerminalLink page="home" className="term-btn term-btn--primary">
          cd ~/home
        </TerminalLink>
      </div>
    </div>
  )
}
