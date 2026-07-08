import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale

  // `requestLocale` is just the `[locale]` segment, and the middleware's matcher skips
  // any path containing a dot — so `/foo.txt` reaches this route with `locale: 'foo.txt'`
  // and would try to import `messages/foo.txt.json`. Validate before touching the import,
  // and let `[locale]/layout.tsx` turn the bogus locale into a 404.
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
