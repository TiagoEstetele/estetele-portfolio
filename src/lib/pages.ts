import type { PageId } from '@/types'

/**
 * The terminal's directory listing. Order drives the nav tabs, the `ls` output,
 * the numbered eyebrow on each screen (`01 / about`), and the sitemap.
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

/**
 * The `NN /` prefix and the fake shell command shown in each screen's eyebrow.
 * `home` has no eyebrow, so it's absent here.
 */
export const SCREEN_META = {
  about: { index: '01', command: 'cat about.txt' },
  stack: { index: '02', command: 'ls -la ./stack' },
  projects: { index: '03', command: 'git log --featured' },
  experience: { index: '04', command: 'git log --oneline' },
  contact: { index: '05', command: '' },
} as const satisfies Record<Exclude<PageId, 'home'>, { index: string; command: string }>
