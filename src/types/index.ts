import type { PAGES } from '@/lib/pages'

export type Locale = 'en' | 'pt'

/** A real route in the terminal. */
export type PageId = (typeof PAGES)[number]

/** What the titlebar and prompt can display as the working directory. */
export type ScreenId = PageId | '404'

export type TechCategoryId = 'frontend' | 'backend' | 'cms' | 'database' | 'devops' | 'ai'

/** Language-neutral stack module (see src/lib/tech-data.ts). */
export interface TechCategory {
  id: TechCategoryId
  /** Monospace directory label, e.g. "frontend/". */
  dir: string
  tags: readonly string[]
}

/** Language-neutral project entry (see src/lib/projects-data.ts). */
export interface Project {
  name: string
  domain: string
  url: string
}

/** Fully localized experience entry (read from messages via t.raw). */
export interface ExperienceItem {
  role: string
  company: string
  period: string
  desc: string
}

/**
 * Strings the client-side terminal shell needs. Resolved on the server and passed
 * down as a plain object so the shell doesn't need a NextIntlClientProvider, which
 * would ship every message to the browser for the sake of five strings.
 */
export interface TerminalTranslations {
  /** Accessible name for the tab strip. */
  navLabel: string
  footerHint: string
  /** Multi-line; the page list is already interpolated server-side. */
  help: string
  whoami: string
  sudo: string
  langUsage: string
  /** Contains a literal `{cmd}` placeholder, substituted client-side. */
  commandNotFound: string
}

export interface HomeTranslations {
  role: string
  headline1: string
  headlineAI: string
  heroSub: string
  ctaContact: string
  ctaStack: string
  hint: string
}

export interface AboutTranslations {
  p1: string
  p2: string
}

export interface StackTranslations {
  pill: string
  subtext: string
  categories: Record<TechCategoryId, { sub: string }>
}

export interface ProjectsTranslations {
  pill: string
  descriptions: readonly string[]
}

export interface ExperienceTranslations {
  items: readonly ExperienceItem[]
}

export interface ContactTranslations {
  pill: string
  headline: string
  subtext: string
  cta: string
  emailAriaLabel: string
  githubAriaLabel: string
  linkedinAriaLabel: string
}

export interface NotFoundTranslations {
  description: string
}
