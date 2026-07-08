'use client'

import { useEffect } from 'react'
import { HTML_LANG } from '@/lib/site'
import type { Locale } from '@/types'

interface HtmlLangSyncProps {
  locale: Locale
}

/**
 * Keeps `<html lang>` in step with the active locale during client-side locale switches.
 *
 * `<html>` is rendered by the root layout (src/app/layout.tsx), which sits *above* the
 * `[locale]` segment and is therefore reused — not re-rendered — when the router swaps
 * `/` for `/pt`. Only the tree from `[locale]/layout.tsx` down is re-rendered, so the
 * server-rendered `lang` would otherwise stay frozen at whichever locale was loaded first.
 *
 * This component lives inside that re-rendered subtree, so the effect re-runs on every
 * locale change. Renders nothing.
 */
export function HtmlLangSync({ locale }: HtmlLangSyncProps) {
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale]
  }, [locale])

  return null
}
