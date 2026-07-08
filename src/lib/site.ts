import type { Locale } from '@/types'

/** Canonical site URL — always apex (no www). Used for SEO, sitemap, and JSON-LD. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://estetele.dev'

/** BCP-47 tags for `<html lang>` and hreflang — `pt` is served as Brazilian Portuguese. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  pt: 'pt-BR',
}

export const PORTFOLIO_REPO_URL = 'https://github.com/TiagoEstetele/estetele-portfolio'

/** Shell identity — the `user@host` shown in the titlebar and at the prompt. */
export const SHELL_USER = 'tiago@estetele'

/** Fake VCS metadata for the status bar: `⎇ main · sha 7f3a2c1 · uptime …`. */
export const BUILD = {
  branch: 'main',
  sha: '7f3a2c1',
} as const

/** Real contact identity — shared across the contact screen and JSON-LD. */
export const CONTACT = {
  email: 'estetele.dev@outlook.com',
  emailHref: 'mailto:estetele.dev@outlook.com',
  github: 'github.com/TiagoEstetele',
  githubHref: 'https://github.com/TiagoEstetele',
  linkedin: 'linkedin.com/in/estetele',
  linkedinHref: 'https://www.linkedin.com/in/estetele/',
} as const
