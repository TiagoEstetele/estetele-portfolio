import type { PageId } from '@/types'

/**
 * The terminal's directory listing. Order drives the nav tabs, the `ls` output,
 * and the sitemap.
 */
export const PAGES = ['home', 'about', 'stack', 'projects', 'experience', 'contact'] as const

/** Route for a page. `home` is the locale root, so it carries no segment. */
export function hrefFor(page: PageId): string {
  return page === 'home' ? '/' : `/${page}`
}

/** Narrowing guard — anything not in `PAGES` resolves to the 404 screen. */
export function isPageId(value: string): value is PageId {
  return (PAGES as readonly string[]).includes(value)
}

/**
 * Maps a locale-stripped pathname (as returned by next-intl's `usePathname`) onto a
 * screen. Unknown paths — including nested ones like `/a/b` — become `404`, which is
 * what the titlebar and prompt display as the current working directory.
 */
export function pageFromPathname(pathname: string): PageId | '404' {
  const segment = pathname === '/' ? 'home' : pathname.replace(/^\//, '')
  return isPageId(segment) ? segment : '404'
}

/** Tab labels. `home` reads as an absolute path; the rest are bare directory names. */
export const TAB_LABELS: Record<PageId, string> = {
  home: '~/home',
  about: 'about',
  stack: 'stack',
  projects: 'projects',
  experience: 'experience',
  contact: 'contact',
}
