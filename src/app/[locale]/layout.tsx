import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { routing } from '@/i18n/routing'
import { HtmlLangSync } from '@/components/common/HtmlLangSync'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { MatrixBackground } from '@/components/ui/MatrixBackground'
import { TerminalShell } from '@/components/terminal/TerminalShell'
import { buildJsonLdGraph } from '@/lib/seo'
import { PAGES } from '@/lib/pages'
import { SITE_URL } from '@/lib/site'
import type { HelpMenuTranslations, TerminalTranslations } from '@/types'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Only the parts every screen shares. Canonical URLs, hreflang, Open Graph, and
 * Twitter cards are per-route and live in each `page.tsx` (see `buildPageMetadata`) —
 * Next.js merges metadata shallowly, so a nested `openGraph` would replace, not extend.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | ${t('name')}`,
    },
    description: t('description'),
    authors: [{ name: 'Tiago Estetele', url: SITE_URL }],
    creator: 'Tiago Estetele',
    publisher: 'Tiago Estetele',
    category: 'technology',
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // The middleware only ever routes known locales here, but a direct hit that bypasses
  // it must not render the whole site under a bogus locale.
  if (!hasLocale(routing.locales, locale)) notFound()

  const t = await getTranslations({ locale, namespace: 'terminal' })

  const terminalT: TerminalTranslations = {
    navLabel: t('navLabel'),
    footerHint: t('footerHint'),
    // `help` reads `cd <page>`, and ICU parses `<page>` as an unclosed rich-text tag.
    // Take the string raw and fill the placeholder by hand rather than escaping the
    // angle brackets into `'<'page'>'` in the translation files.
    help: (t.raw('help') as string).replace('{pages}', PAGES.join(', ')),
    whoami: t('whoami'),
    sudo: t('sudo'),
    langUsage: t('langUsage'),
    // Raw too, so the `{cmd}` placeholder survives to the client and can be filled in
    // against whatever the visitor actually typed.
    commandNotFound: t.raw('commandNotFound') as string,
    // Raw: `commands` is a list of objects, and `cd <page>` carries angle brackets
    // that ICU would misread as an unclosed rich-text tag (same reason as `help`).
    helpMenu: t.raw('helpMenu') as HelpMenuTranslations,
  }

  return (
    <>
      {/*
       * JSON-LD structured data — @graph with Person + WebSite + ProfilePage schemas.
       * Google accepts JSON-LD in <body>. dangerouslySetInnerHTML is safe here because
       * the content is fully controlled (no user input).
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdGraph({ locale }) }}
      />

      {/* Keeps <html lang> correct across client-side locale switches (root layout isn't re-rendered) */}
      <HtmlLangSync locale={locale} />

      {/* Ambient atmosphere, fixed behind the window */}
      <MatrixBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(74,222,128,0.06), transparent 70%)',
        }}
      />
      <CustomCursor />

      {/*
       * next-intl's client-side `Link`, `usePathname`, and `useRouter` read the active
       * locale from this context — without it they throw. Messages are passed explicitly
       * as `{}` because omitting them makes the provider serialize *every* message into
       * the RSC payload; the shell's handful of strings arrive as plain props instead.
       */}
      <NextIntlClientProvider locale={locale} messages={{}}>
        <TerminalShell locale={locale} t={terminalT}>
          {children}
        </TerminalShell>
      </NextIntlClientProvider>

      <SpeedInsights />
      <Analytics />
    </>
  )
}
