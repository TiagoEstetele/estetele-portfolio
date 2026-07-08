'use client'

import { usePathname } from '@/i18n/routing'

// Long paths would blow out the terminal window before wrapping can help.
const MAX_LENGTH = 48

/**
 * Echoes the unmatched URL back into the fake shell transcript on the 404 screen,
 * spelled the way the shell would: `~/nope`.
 *
 * `not-found.tsx` is a Server Component and receives no props, so the requested path
 * can only be read through `usePathname` — the approach the Next.js not-found docs
 * prescribe. next-intl's `usePathname` strips the locale prefix, so `/pt/nope` and
 * `/nope` both echo as `~/nope`.
 *
 * `suppressHydrationWarning` guards the prerendered case, where the server has no
 * live request and would otherwise disagree with the pathname the client hydrates with.
 */
export function RequestedPath() {
  const pathname = usePathname()
  const trimmed = (pathname ?? '/').replace(/^\/+/, '')
  const path = trimmed.length > MAX_LENGTH ? `${trimmed.slice(0, MAX_LENGTH)}…` : trimmed

  return <span suppressHydrationWarning>~/{path}</span>
}
