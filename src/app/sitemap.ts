import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Use a fixed date so the file doesn't invalidate CDN cache on every build.
// Update this manually when content changes.
const LAST_MODIFIED = new Date('2026-06-03')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
      // hreflang alternates — Google uses these to serve the correct locale
      alternates: {
        languages: {
          en: SITE_URL,
          'pt-BR': `${SITE_URL}/pt`,
        },
      },
    },
    {
      url: `${SITE_URL}/pt`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          en: SITE_URL,
          'pt-BR': `${SITE_URL}/pt`,
        },
      },
    },
  ]
}
