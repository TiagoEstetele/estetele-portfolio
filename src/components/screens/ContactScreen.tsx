import { CONTACT } from '@/lib/site'
import { SCREEN_META } from '@/lib/pages'
import type { ContactTranslations } from '@/types'

export function ContactScreen({ t }: { t: ContactTranslations }) {
  return (
    <div className="py-6 text-center">
      <div
        className="font-mono text-[12px]"
        style={{ color: 'var(--color-accent)', letterSpacing: '0.08em' }}
      >
        {SCREEN_META.contact.index} / {t.pill}
      </div>

      <h1
        className="mx-auto mt-[18px] max-w-[540px] font-semibold"
        style={{
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          letterSpacing: '-0.03em',
          textWrap: 'balance',
        }}
      >
        {t.headline}
      </h1>

      <p
        className="mx-auto mt-3.5 max-w-[400px] text-[15px]"
        style={{ color: 'var(--term-text-soft)', lineHeight: 1.6 }}
      >
        {t.subtext}
      </p>

      <div className="mt-[30px] flex justify-center">
        <a
          href={CONTACT.emailHref}
          className="term-btn term-btn--primary"
          style={{ padding: '13px 26px' }}
          aria-label={t.emailAriaLabel}
        >
          {t.cta} →
        </a>
      </div>

      <div className="mt-[30px] flex flex-wrap justify-center gap-6">
        <a href={CONTACT.emailHref} className="term-contact-link" aria-label={t.emailAriaLabel}>
          {CONTACT.email}
        </a>
        <a
          href={CONTACT.githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="term-contact-link"
          aria-label={t.githubAriaLabel}
        >
          github
        </a>
        <a
          href={CONTACT.linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="term-contact-link"
          aria-label={t.linkedinAriaLabel}
        >
          linkedin
        </a>
      </div>
    </div>
  )
}
