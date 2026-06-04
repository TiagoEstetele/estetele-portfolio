export type Locale = 'en' | 'pt'

export type TechCategoryId = 'frontend' | 'backend' | 'cms' | 'database' | 'devops' | 'ai'

export interface TechCategory {
  id: TechCategoryId
  iconName: string
  gridSpan?: 2
  accentVariant?: 'violet' | 'tangerine' | 'green' | 'yellow' | 'default'
  tagVariant?: 'violet' | 'default'
  tags: readonly string[]
}

export interface HeroTranslations {
  eyebrow: string
  headline: string
  subtextBefore: string
  subtextTechs: string
  subtextAnd: string
  subtextStrapi: string
  subtextAfter: string
  ctaContact: string
  ctaStack: string
  badgeRemote: string
  badgeLocation: string
  badgeAi: string
}

export interface CategoryTranslation {
  name: string
  sub: string
}

export interface TechTranslations {
  pill: string
  heading: string
  subtext: string
  categories: Record<TechCategoryId, CategoryTranslation>
}

export interface ContactTranslations {
  pill: string
  headline: string
  subtext: string
  emailLabel: string
  githubLabel: string
  linkedinLabel: string
  emailAriaLabel: string
  githubAriaLabel: string
  linkedinAriaLabel: string
  footer: string
  footerLinkTitle: string
  footerLinkHidden: string
}
