import { TerminalLink } from '@/components/terminal/TerminalLink'
import { RequestedPath } from '@/components/ui/RequestedPath'
import { SHELL_USER } from '@/lib/site'
import { ART_404 } from './shell/art'
import { BlockArt } from './shell/BlockArt'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { NotFoundTranslations } from '@/types'

/** A real shell wouldn't translate its own errors, and neither does this one. */
const SHELL_ERROR = 'zsh: no such file or directory:'

/** `cd` into nowhere, the error, `echo $?`, and a way back home. */
export function NotFoundScreen({ t }: { t: NotFoundTranslations }) {
  return (
    <div className="term-screen">
      <div className="term-block">
        <div className="term-cmd">
          <span>
            <b>{SHELL_USER}</b>:~$
          </span>
          <span className="term-cmd-typed">
            cd <RequestedPath />
          </span>
        </div>
        <div className="term-error">
          {SHELL_ERROR} <RequestedPath />
        </div>
      </div>

      <div className="term-block">
        <ShellCommand path="~" command="echo $?" at={0.23} showAt={0.15} />
        <BlockArt lines={ART_404} label="404" style={{ alignSelf: 'flex-start', ...reveal(0.52) }} />
      </div>

      <div className="term-block" style={{ gap: 14, ...reveal(0.72) }}>
        <p className="term-copy" style={{ maxWidth: '60ch' }}>
          {t.description}
        </p>
        <div className="term-menu">
          <TerminalLink page="home" className="term-menu-row" data-selected>
            <span className="term-menu-ptr" aria-hidden="true">
              &gt;
            </span>
            <span>cd ~/home</span>
            <span className="term-menu-sub">{t.backHome}</span>
          </TerminalLink>
        </div>
      </div>
    </div>
  )
}
