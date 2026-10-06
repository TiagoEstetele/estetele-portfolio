'use client'

import type { HelpPanelTranslations } from '@/types'

interface HelpPanelProps {
  t: HelpPanelTranslations
  open: boolean
  onToggle: () => void
}

const PANEL_ID = 'term-help'

/**
 * `man portfolio`: the floating `?` in the corner and the panel it opens. The shell
 * owns `open`, so the `man` command can open the same panel from the prompt.
 *
 * Rendered outside `.term-window`: the window's `backdrop-filter` makes it the
 * containing block for fixed descendants, which would pin these to the window instead
 * of the viewport.
 */
export function HelpPanel({ t, open, onToggle }: HelpPanelProps) {
  return (
    <>
      {open && (
        <section id={PANEL_ID} className="term-help" aria-label="man portfolio">
          <div className="term-help-head">
            <span className="term-help-name">man portfolio</span>
            <button type="button" className="term-help-close" onClick={onToggle} aria-label={t.close}>
              ✕
            </button>
          </div>

          <h2 className="term-help-title">## {t.navTitle}</h2>
          <p className="term-help-body">{t.navBody}</p>

          <h2 className="term-help-title">## {t.cmdTitle}</h2>
          <ul className="term-help-cmds">
            {t.commands.map(({ cmd, desc }) => (
              <li key={cmd} className="term-help-cmd">
                <code>{cmd}</code>
                <span>{desc}</span>
              </li>
            ))}
          </ul>

          <div className="term-help-tip">{t.tip}</div>
        </section>
      )}

      <button
        type="button"
        className="term-help-btn"
        onClick={onToggle}
        aria-label={t.label}
        aria-expanded={open}
        aria-controls={open ? PANEL_ID : undefined}
      >
        ?
      </button>
    </>
  )
}
