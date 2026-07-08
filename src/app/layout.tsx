import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { spaceGrotesk, jetbrainsMono } from '@/lib/fonts'
import { HTML_LANG, SITE_URL } from '@/lib/site'
import type { Locale } from '@/types'
import './globals.css'

// Minimal fallback — locale-specific metadata is generated in [locale]/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tiago Estetele | Web Developer & Front-End Specialist',
    template: '%s | Tiago Estetele',
  },
  description:
    'Web developer specialized in front-end, with hands-on full stack experience and ambitious about where AI is taking software engineering.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale

  return (
    // `lang` is only correct for the *initial* render — this layout is shared across both
    // locale routes and isn't re-rendered on a client-side locale switch. HtmlLangSync
    // (rendered under [locale]/layout.tsx) keeps it accurate after that.
    <html lang={HTML_LANG[locale]} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
