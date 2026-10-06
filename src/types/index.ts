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
  /**
   * Whether the site lets itself be framed. Sites that send `X-Frame-Options` or a CSP
   * `frame-ancestors` refusing us can never load in the live preview, so they get
   * `screenshot` instead.
   */
  embeddable: boolean
  /** Capture of the site at 1280x1280 (`public/projects`), shown when the frame can't load. */
  screenshot: string
}

/** `[year, month]`, month 1-based, the way a CV writes it. */
export type YearMonth = readonly [year: number, month: number]

export type CompanyId = 'brivia' | 'polo' | 'okn'

/** Language-neutral experience entry (see src/lib/experience-data.ts). */
export interface ExperienceEntry {
  /** Fake commit hash the `tig` view lists the role under. */
  sha: string
  /** Branch decoration, e.g. `HEAD -> brivia`. Empty for none. */
  deco: string
  company: CompanyId
  start: YearMonth
  /** `null` while the role is ongoing. */
  end: YearMonth | null
  /** Current role under NDA: the description is replaced by a redacted `--stat`. */
  nda?: boolean
  skills: readonly string[]
}

/** Localized half of an experience entry (messages `experience.items`, same order). */
export interface ExperienceText {
  role: string
  where: string
  desc: readonly string[]
}

/** Localized half of an education entry (messages `about.education`, same order as src/lib/education-data.ts). */
export interface EducationText {
  course: string
  tags: readonly string[]
}

export interface HelpCommand {
  cmd: string
  desc: string
}

export interface HelpPanelTranslations {
  /** Accessible name of the floating `?` button. */
  label: string
  close: string
  navTitle: string
  navBody: string
  cmdTitle: string
  commands: readonly HelpCommand[]
  tip: string
}

/**
 * Strings the client-side terminal shell needs. Resolved on the server and passed
 * down as a plain object so the shell doesn't need a NextIntlClientProvider, which
 * would ship every message to the browser for the sake of a handful of strings.
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
  historyEmpty: string
  helpPanel: HelpPanelTranslations
}

export interface HomeTranslations {
  headline1: string
  headlineAI: string
  heroSub: string
  ctaContact: string
  ctaStack: string
  nfRole: string
  nfWork: string
  nfLocation: string
  nfStatus: string
  ask: string
  askHint: string
}

export interface AboutTranslations {
  title: string
  p1: string
  p2: string
  education: readonly EducationText[]
}

export interface StackTranslations {
  pill: string
  subtext: string
  categories: Record<TechCategoryId, { sub: string }>
}

export interface ProjectsTranslations {
  pill: string
  sub: string
  hint: string
  live: string
  loading: string
  snapshot: string
  descriptions: readonly string[]
}

export interface ExperienceTranslations {
  hint: string
  ndaErr: string
  ndaNote: string
  items: readonly ExperienceText[]
}

export interface ContactTranslations {
  headline: string
  subtext: string
  ask: string
  askHint: string
  openProfile: string
  emailAriaLabel: string
  githubAriaLabel: string
  linkedinAriaLabel: string
}

export interface NotFoundTranslations {
  description: string
  backHome: string
}
