'use client'

import type { ReactNode } from 'react'
import { Link } from '@/i18n/routing'
import { hrefFor } from '@/lib/pages'
import { useTerminalNav } from './terminal-nav'
import type { PageId } from '@/types'

interface TerminalLinkProps {
  page: PageId
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}

/**
 * An in-terminal navigation link. Renders a real `<a href>`, so it is crawlable,
 * prefetched, and opens in a new tab on cmd/middle-click, but hands plain left
 * clicks to the shell, which types out `cd ~/<page>` before letting the router move.
 *
 * `onNavigate` only fires for client-side navigations (modified clicks bypass it
 * entirely), which is exactly the split we want.
 *
 * `prefetch` is forced on. Every screen is a Server Component rendered on demand, and
 * Next.js only auto-prefetches *static* routes in full; dynamic ones would make the
 * router wait on a server round-trip after the `cd` finishes typing, stalling the
 * cross-fade for however long the request takes. With the full route prefetched, the
 * push resolves in the same frame and the fade runs at its intended 240ms.
 * (Prefetching is a production-only optimization; `next dev` always hits the server.)
 */
export function TerminalLink({ page, children, ...rest }: TerminalLinkProps) {
  const navigate = useTerminalNav()

  return (
    <Link
      href={hrefFor(page)}
      prefetch
      onNavigate={
        navigate
          ? (event) => {
              event.preventDefault()
              navigate(page)
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Link>
  )
}
