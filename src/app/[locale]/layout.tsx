import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { buildJsonLdGraph } from '@/lib/seo'
import type { Locale } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://estetele.dev'

// Keywords optimized for recruiter + developer searches in each language
const KEYWORDS_EN = [
  'Tiago Estetele',
  'Front-End Developer',
  'React Developer',
  'Next.js Developer',
  'TypeScript Developer',
  'JavaScript Developer',
  'Web Developer',
  'WordPress Developer',
  'Frontend Engineer',
  'Strapi Developer',
  'AEM Developer',
  'Adobe Experience Manager',
  'Tailwind CSS',
  'Framer Motion',
  'Software Engineer',
  'Portfolio',
  'Brazil',
  'Remote Developer',
  'Brivia',
]

const KEYWORDS_PT = [
  'Tiago Estetele',
  'Desenvolvedor Front-End',
  'Desenvolvedor React',
  'Desenvolvedor Next.js',
  'TypeScript',
  'JavaScript',
  'Desenvolvedor Web',
  'Portfolio',
  'Brasil',
  'Desenvolvedor Remoto',
  'WordPress',
  'Strapi',
  'AEM',
  'Adobe Experience Manager',
  'Engenheiro Front-End',
  'Tailwind CSS',
  'Desenvolvedor Full Stack',
  'Brivia',
]

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const isPt = locale === 'pt'
  const canonicalUrl = isPt ? `${SITE_URL}/pt` : SITE_URL

  return {
    // ── Core ─────────────────────────────────────────────────────────────
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | ${t('name')}`,
    },
    description: t('description'),
    keywords: isPt ? KEYWORDS_PT : KEYWORDS_EN,
    authors: [{ name: 'Tiago Estetele', url: SITE_URL }],
    creator: 'Tiago Estetele',
    publisher: 'Tiago Estetele',
    category: 'technology',

    // ── Canonical & hreflang ──────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: SITE_URL,
        'pt-BR': `${SITE_URL}/pt`,
        'x-default': SITE_URL,
      },
    },

    // ── Open Graph ────────────────────────────────────────────────────────
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      siteName: t('name'),
      locale: isPt ? 'pt_BR' : 'en_US',
      alternateLocale: isPt ? ['en_US'] : ['pt_BR'],
      images: [
        {
          url: isPt ? `${SITE_URL}/pt/opengraph-image` : `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isPt
            ? 'Tiago Estetele — Desenvolvedor Front-End'
            : 'Tiago Estetele — Front-End Developer',
          type: 'image/png',
        },
      ],
    },

    // ── Twitter / X Card ──────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: isPt ? `${SITE_URL}/pt/opengraph-image` : `${SITE_URL}/opengraph-image`,
          alt: isPt
            ? 'Tiago Estetele — Desenvolvedor Front-End'
            : 'Tiago Estetele — Front-End Developer',
          width: 1200,
          height: 630,
        },
      ],
    },

    // ── Robots directives ─────────────────────────────────────────────────
    // max-snippet: -1 = no limit; max-image-preview: large = full-size previews in Google
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
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

  return (
    <>
      {/*
       * JSON-LD structured data — @graph with Person + WebSite + ProfilePage schemas.
       * Google accepts JSON-LD in <body>. Using dangerouslySetInnerHTML is safe here
       * because the content is fully controlled (no user input).
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdGraph({ locale }) }}
      />
      <LanguageSwitcher currentLocale={locale as Locale} />
      {children}
    </>
  )
}
