import type { Locale } from '@/types'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

const LOCALE_HREFS: Record<Locale, string> = {
  en: '/',
  pt: '/pt',
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  return (
    <nav
      aria-label="Change language"
      className="fixed right-6 top-6 z-50 flex items-center gap-0.5 rounded-full p-[5px] backdrop-blur-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
      }}
    >
      {(['en', 'pt'] as const).map((locale) => {
        const isActive = locale === currentLocale
        const baseClass =
          'rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200'
        const activeStyle = {
          background: 'rgba(255,255,255,0.10)',
          color: 'rgba(237,237,237,0.90)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          fontFamily: 'inherit',
        }
        const inactiveStyle = {
          background: 'transparent',
          color: 'rgba(237,237,237,0.38)',
          fontFamily: 'inherit',
        }

        if (isActive) {
          return (
            <span
              key={locale}
              aria-current="true"
              className={baseClass}
              style={activeStyle}
            >
              {locale.toUpperCase()}
            </span>
          )
        }

        return (
          <a
            key={locale}
            href={LOCALE_HREFS[locale]}
            className={baseClass}
            style={inactiveStyle}
            aria-label={`Switch to ${locale === 'en' ? 'English' : 'Portuguese'}`}
          >
            {locale.toUpperCase()}
          </a>
        )
      })}
    </nav>
  )
}
