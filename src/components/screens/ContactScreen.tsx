import { CONTACT } from '@/lib/site'
import { Ask } from './shell/Ask'
import { MdTitle } from './shell/MdTitle'
import { SelectMenu } from './shell/SelectMenu'
import { ShellCommand } from './shell/ShellCommand'
import { reveal } from './shell/reveal'
import type { ContactTranslations } from '@/types'

/** `cat README.md`, then `./contact.sh` asking which channel to open. */
export function ContactScreen({ t }: { t: ContactTranslations }) {
  return (
    <div className="term-screen">
      <div className="term-block">
        <ShellCommand path="~/contact" command="cat README.md" at={0.08} />
        <div className="term-block" style={reveal(0.55)}>
          <MdTitle>{t.headline}</MdTitle>
          <p className="term-copy">{t.subtext}</p>
        </div>
      </div>

      <div className="term-block">
        <ShellCommand path="~/contact" command="./contact.sh" at={0.8} showAt={0.72} />
        <div className="term-block" style={{ gap: 10, ...reveal(1.24) }}>
          <Ask question={t.ask} hint={t.askHint} />
          <SelectMenu
            keyWidth="10ch"
            items={[
              {
                href: CONTACT.emailHref,
                label: 'email',
                sub: CONTACT.email,
                ariaLabel: t.emailAriaLabel,
              },
              {
                href: CONTACT.githubHref,
                external: true,
                label: 'github',
                sub: t.openProfile,
                ariaLabel: t.githubAriaLabel,
              },
              {
                href: CONTACT.linkedinHref,
                external: true,
                label: 'linkedin',
                sub: t.openProfile,
                ariaLabel: t.linkedinAriaLabel,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
