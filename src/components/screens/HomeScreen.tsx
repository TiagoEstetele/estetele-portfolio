import { MONOGRAM } from './shell/art'
import { Ask } from './shell/Ask'
import { BlockArt } from './shell/BlockArt'
import { MdTitle } from './shell/MdTitle'
import { SelectMenu } from './shell/SelectMenu'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { HomeTranslations } from '@/types'

/** Same everywhere, so not a translation. */
const STACK = 'React · Next.js · TypeScript · Node.js'

/** The landing session: `neofetch`, `cat intro.md`, then a prompt asking where to go. */
export function HomeScreen({ t }: { t: HomeTranslations }) {
  return (
    <div className="term-screen">
      <div className="term-block">
        <ShellCommand path="~/home" command="neofetch" at={0.1} />
        <div className="term-neofetch" style={reveal(0.42)}>
          <BlockArt lines={MONOGRAM} />
          <div className="term-neofetch-info">
            <div className="term-neofetch-host">
              <b>tiago</b>@<b>estetele</b>
            </div>
            <div className="term-neofetch-rule" aria-hidden="true">
              --------------
            </div>
            <dl className="term-neofetch-grid">
              <dt>role</dt>
              <dd>{t.nfRole}</dd>
              <dt>work</dt>
              <dd>{t.nfWork}</dd>
              <dt>stack</dt>
              <dd>{STACK}</dd>
              <dt>location</dt>
              <dd>{t.nfLocation}</dd>
              <dt>status</dt>
              <dd className="term-neofetch-status">
                <span className="term-pulse" aria-hidden="true" />
                {t.nfStatus}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="term-block">
        <ShellCommand path="~/home" command="cat intro.md" at={0.7} duration={0.34} showAt={0.62} />
        <div className="term-block" style={reveal(1.1)}>
          <MdTitle>
            {t.headline1} <mark className="term-mark">{t.headlineAI}</mark>.
          </MdTitle>
          <p className="term-copy" style={{ maxWidth: '80ch' }}>
            {t.heroSub}
          </p>
        </div>
      </div>

      <div className="term-block" style={{ gap: 10, ...reveal(1.28) }}>
        <Ask question={t.ask} hint={t.askHint} />
        <SelectMenu
          keyWidth="14ch"
          items={[
            { page: 'contact', label: 'cd ~/contact', sub: t.ctaContact },
            { page: 'stack', label: 'cd ~/stack', sub: t.ctaStack },
          ]}
        />
      </div>
    </div>
  )
}
