import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { TechnologiesSection } from '@/components/sections/TechnologiesSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { HeroTranslations, TechTranslations, ContactTranslations } from '@/types'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const [tHero, tTech, tContact] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'technologies' }),
    getTranslations({ locale, namespace: 'contact' }),
  ])

  const heroT: HeroTranslations = {
    eyebrow: tHero('eyebrow'),
    headline: tHero('headline'),
    subtextBefore: tHero('subtextBefore'),
    subtextTechs: tHero('subtextTechs'),
    subtextAnd: tHero('subtextAnd'),
    subtextStrapi: tHero('subtextStrapi'),
    subtextAfter: tHero('subtextAfter'),
    ctaContact: tHero('ctaContact'),
    ctaStack: tHero('ctaStack'),
    badgeRemote: tHero('badges.remote'),
    badgeLocation: tHero('badges.location'),
    badgeAi: tHero('badges.ai'),
  }

  const techT: TechTranslations = {
    pill: tTech('pill'),
    heading: tTech('heading'),
    subtext: tTech('subtext'),
    categories: {
      frontend: { name: tTech('categories.frontend.name'), sub: tTech('categories.frontend.sub') },
      backend: { name: tTech('categories.backend.name'), sub: tTech('categories.backend.sub') },
      cms: { name: tTech('categories.cms.name'), sub: tTech('categories.cms.sub') },
      database: { name: tTech('categories.database.name'), sub: tTech('categories.database.sub') },
      devops: { name: tTech('categories.devops.name'), sub: tTech('categories.devops.sub') },
      ai: { name: tTech('categories.ai.name'), sub: tTech('categories.ai.sub') },
    },
  }

  const contactT: ContactTranslations = {
    pill: tContact('pill'),
    headline: tContact('headline'),
    subtext: tContact('subtext'),
    emailLabel: tContact('emailLabel'),
    githubLabel: tContact('githubLabel'),
    linkedinLabel: tContact('linkedinLabel'),
    emailAriaLabel: tContact('emailAriaLabel'),
    githubAriaLabel: tContact('githubAriaLabel'),
    linkedinAriaLabel: tContact('linkedinAriaLabel'),
    footer: tContact('footer'),
    footerLinkTitle: tContact('footerLinkTitle'),
    footerLinkHidden: tContact('footerLinkHidden'),
  }

  return (
    <main id="main-content">
      <HeroSection t={heroT} />
      <TechnologiesSection t={techT} />
      <ContactSection t={contactT} />
    </main>
  )
}
