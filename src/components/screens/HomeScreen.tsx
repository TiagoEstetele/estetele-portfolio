import { TerminalLink } from '@/components/terminal/TerminalLink'
import type { HomeTranslations } from '@/types'

/** The shell reports the host as reachable — a terminal affectation, not a translation. */
const STATUS = 'online'
const INITIALS = 'TE'

export function HomeScreen({ t }: { t: HomeTranslations }) {
  return (
    <div>
      <div className="term-in term-in--home mb-7 flex items-center gap-3.5">
        <div className="term-avatar" aria-hidden="true">
          {INITIALS}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[17px] font-semibold">Tiago Estetele</span>
            <span className="term-badge">{STATUS}</span>
          </div>
          <div
            className="mt-[3px] font-mono text-[11px]"
            style={{ color: 'var(--term-text-faint)' }}
          >
            {t.role}
          </div>
        </div>
      </div>

      <h1
        className="term-in term-in--home term-in-1 max-w-[760px] font-semibold"
        style={{
          fontSize: 'clamp(32px, 5.4vw, 56px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          textWrap: 'balance',
        }}
      >
        {t.headline1} <span style={{ color: 'var(--color-accent)' }}>{t.headlineAI}</span>.
      </h1>

      <p
        className="term-in term-in--home term-in-2 mt-[22px] max-w-[560px] text-[17px]"
        style={{ lineHeight: 1.65, color: 'var(--term-text-muted)' }}
      >
        {t.heroSub}
      </p>

      <div className="term-in term-in--home term-in-3 mt-8 flex flex-wrap items-center gap-3">
        <TerminalLink page="contact" className="term-btn term-btn--primary">
          {t.ctaContact}
        </TerminalLink>
        <TerminalLink page="stack" className="term-btn term-btn--ghost">
          {t.ctaStack} →
        </TerminalLink>
      </div>

      <div
        className="term-in term-in--home term-in-5 mt-9 font-mono text-[11px]"
        style={{ color: 'var(--term-text-trace)', lineHeight: 1.9 }}
      >
        {t.hint}
      </div>
    </div>
  )
}
