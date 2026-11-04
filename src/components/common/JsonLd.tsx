import { getTranslations } from 'next-intl/server'
import { buildPageSchemas } from '@/lib/seo'
import type { Locale, PageId } from '@/types'

/**
 * Structured data as a plain `<script type="application/ld+json">`, the way the Next.js
 * JSON-LD guide recommends. `<` is escaped so no string in the payload can close the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * A screen's own entities: its page node and, below home, its breadcrumb. Titles and
 * descriptions come from the same `meta` messages as the page's metadata, so the
 * structured data always matches the `<title>` and description search engines see.
 */
export async function PageJsonLd({ locale, page }: { locale: Locale; page: PageId }) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const isHome = page === 'home'

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': buildPageSchemas({
          locale,
          page,
          title: isHome ? t('title') : t(`pages.${page}.title`),
          description: isHome ? t('description') : t(`pages.${page}.description`),
          siteName: t('name'),
        }),
      }}
    />
  )
}
