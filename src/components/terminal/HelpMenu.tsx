'use client'

import { useEffect, useState } from 'react'
import type { HelpMenuTranslations } from '@/types'

interface HelpMenuProps {
  t: HelpMenuTranslations
}

const PANEL_ID = 'term-help-panel'

/**
 * Floating "?" button, bottom-right, that toggles a small `man portfolio` panel
 * explaining how to move around the terminal. Self-contained: its open/closed state is
 * local and never touches the shell's navigation or boot state, so it lives here rather
 * than in TerminalShell.
 */
export function HelpMenu({ t }: HelpMenuProps) {
  const [open, setOpen] = useState(false)

  // Escape dismisses the panel. The shell's window-wide key handler only forwards
  // single-character keys to the prompt, so it ignores "Escape" and the two don't fight.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      {open && (
        <div id={PANEL_ID} className="term-help-panel" role="dialog" aria-label={t.title}>
          <div className="term-help-head">
            <span className="term-help-title">{t.title}</span>
            <button
              type="button"
              className="term-help-close"
              onClick={() => setOpen(false)}
              aria-label={t.closeLabel}
            >
              ✕
            </button>
          </div>

          <div className="term-help-section">{t.navTitle}</div>
          <p className="term-help-body">{t.navBody}</p>

          <div className="term-help-section">{t.cmdTitle}</div>
          <div className="term-help-cmds">
            {t.commands.map((command) => (
              <div key={command.cmd} className="term-help-cmd">
                <span className="term-help-key">{command.cmd}</span>
                <span className="term-help-desc">{command.desc}</span>
              </div>
            ))}
          </div>

          <div className="term-help-tip">{t.tip}</div>
        </div>
      )}

      <button
        type="button"
        className="term-help-btn"
        onClick={() => setOpen((value) => !value)}
        aria-label={t.toggleLabel}
        aria-expanded={open}
        aria-controls={PANEL_ID}
      >
        ?
      </button>
    </>
  )
}
