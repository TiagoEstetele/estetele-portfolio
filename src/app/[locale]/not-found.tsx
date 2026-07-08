import { getLocale, getTranslations } from 'next-intl/server'
import { NotFoundScreen } from '@/components/screens/NotFoundScreen'
import type { NotFoundTranslations } from '@/types'

/**
 * The 404 screen, rendered inside the terminal window.
 *
 * `not-found.tsx` is only reached via an explicit `notFound()` call, which the sibling
 * `[...rest]/page.tsx` makes for every unmatched path. That indirection is what puts
 * the 404 *inside* `[locale]/layout.tsx` — and therefore inside the shell, with its
 * tabs, prompt, and status bar intact — instead of on a bare page.
 *
 * `not-found.tsx` cannot export `metadata`, so the title falls back to the locale
 * layout's default. Next.js injects `noindex` on 404 responses automatically.
 */
export default async function LocaleNotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'notFound' })

  const notFoundT: NotFoundTranslations = {
    description: t('description'),
  }

  return <NotFoundScreen t={notFoundT} />
}
