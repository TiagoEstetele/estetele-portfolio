import type { MetadataRoute } from 'next'
import { PAGES, hrefFor } from '@/lib/pages'
import { urlFor } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

// Use a fixed date so the file doesn't invalidate CDN cache on every build.
// Update this manually when content changes.
const LAST_MODIFIED = new Date('2026-07-08')

/** Home outranks the inner screens; everything else is equal. */
const priorityFor = (page: (typeof PAGES)[number], isDefaultLocale: boolean) => {
  const base = page === 'home' ? 1 : 0.8
  return isDefaultLocale ? base : base - 0.1
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PAGES.map((page) => {
      const path = hrefFor(page)

      return {
        url: urlFor(locale, path),
        lastModified: LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: priorityFor(page, locale === routing.defaultLocale),
        // hreflang alternates — Google uses these to serve the correct locale
        alternates: {
          languages: {
            en: urlFor('en', path),
            'pt-BR': urlFor('pt', path),
          },
        },
      }
    }),
  )
}
