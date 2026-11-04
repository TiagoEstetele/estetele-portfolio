import { urlFor } from '@/lib/metadata'
import { hrefFor } from '@/lib/pages'
import { HTML_LANG, PORTFOLIO_REPO_URL, SITE_URL } from '@/lib/site'
import { TECH_CATEGORIES } from '@/lib/tech-data'
import type { Locale, PageId } from '@/types'

interface SchemaOptions {
  locale: string
}

/**
 * Every technology advertised in the Technologies section, so the structured data can
 * never drift from what the page actually claims. Add a tag in `tech-data.ts` and it
 * shows up here automatically.
 */
const STACK_SKILLS = TECH_CATEGORIES.flatMap((category) => category.tags)

/** Concepts and disciplines that aren't tools, so they don't belong in `tech-data.ts`. */
const DISCIPLINES = [
  'Web Development',
  'Frontend Development',
  'Full Stack Development',
  'Software Architecture',
  'SOLID Principles',
  'Clean Architecture',
  'Design Patterns',
  'Headless CMS',
  'Web Performance',
  'Accessibility',
  'Artificial Intelligence',
  'AI Engineering',
  'Large Language Models',
]

/**
 * https://schema.org/Person — Tiago Estetele
 * Used as the canonical entity across all schemas via @id reference.
 */
export function buildPersonSchema({ locale }: SchemaOptions) {
  const isPt = locale === 'pt'

  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Tiago Estetele',
    givenName: 'Tiago',
    familyName: 'Estetele',
    jobTitle: isPt ? 'Desenvolvedor Web' : 'Web Developer',
    description: isPt
      ? 'Desenvolvedor Web especializado em front-end, com mais de 3 anos de experiência construindo aplicações web escaláveis com React, Next.js, TypeScript, Gatsby, Node.js e CMS headless (WordPress, Strapi, Contentful, Adobe Experience Manager). Com experiência prática em full stack e atualmente explorando Arquitetura de Software, Back-end e Engenharia de IA.'
      : 'Web Developer specialized in front-end, with 3+ years of experience building scalable web applications with React, Next.js, TypeScript, Gatsby, Node.js, and headless CMS platforms (WordPress, Strapi, Contentful, Adobe Experience Manager). Hands-on full stack experience and currently exploring Software Architecture, Back-end Development, and AI Engineering.',
    url: SITE_URL,
    email: 'estetele.dev@outlook.com',
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
    sameAs: ['https://github.com/TiagoEstetele', 'https://www.linkedin.com/in/estetele/'],
    worksFor: {
      '@type': 'Organization',
      name: 'Brivia',
    },
    knowsLanguage: [
      { '@type': 'Language', name: 'Portuguese', alternateName: 'pt-BR' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    knowsAbout: [...STACK_SKILLS, ...DISCIPLINES],
    hasOccupation: {
      '@type': 'Occupation',
      name: isPt ? 'Desenvolvedor Web' : 'Web Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'Brazil',
      },
      skills: STACK_SKILLS.join(', '),
    },
  }
}

/**
 * https://schema.org/WebSite — estetele.dev
 */
export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Tiago Estetele',
    // The name Google already shows for the site; listing it keeps the two tied together.
    alternateName: 'estetele.dev',
    url: SITE_URL,
    description:
      'Portfolio of Tiago Estetele, Web Developer specialized in front-end, working with React, Next.js, TypeScript, headless CMS platforms, and AI-driven web engineering.',
    author: { '@id': `${SITE_URL}/#person` },
    inLanguage: ['en', 'pt-BR'],
    isBasedOn: { '@id': `${PORTFOLIO_REPO_URL}#sourcecode` },
  }
}

/**
 * https://schema.org/SoftwareSourceCode — open-source portfolio repository
 */
export function buildSoftwareSourceCodeSchema() {
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${PORTFOLIO_REPO_URL}#sourcecode`,
    name: 'estetele-portfolio',
    description:
      'Open-source portfolio website built with Next.js, TypeScript, Tailwind CSS, and next-intl.',
    url: PORTFOLIO_REPO_URL,
    codeRepository: PORTFOLIO_REPO_URL,
    programmingLanguage: ['TypeScript', 'JavaScript', 'CSS'],
    runtimePlatform: 'Node.js',
    license: 'https://opensource.org/licenses/MIT',
    author: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }
}

/** schema.org type of each screen's page entity. */
const PAGE_TYPES: Record<PageId, string> = {
  home: 'ProfilePage',
  about: 'AboutPage',
  stack: 'WebPage',
  projects: 'CollectionPage',
  experience: 'WebPage',
  contact: 'ContactPage',
}

interface PageSchemaOptions {
  locale: Locale
  page: PageId
  /** The screen's title as in its metadata: the full site title on home, e.g. "Sobre" elsewhere. */
  title: string
  description: string
  /** Label of the breadcrumb's first step, the home page. */
  siteName: string
}

/**
 * The page entity for one screen (https://schema.org/WebPage and subtypes), plus, below
 * home, a https://schema.org/BreadcrumbList placing it under the home page. Together they
 * spell out the site's structure for search engines, one level deep: every screen is a
 * direct child of home.
 */
export function buildPageSchemas({
  locale,
  page,
  title,
  description,
  siteName,
}: PageSchemaOptions) {
  const url = urlFor(locale, hrefFor(page))
  const person = { '@id': `${SITE_URL}/#person` }

  const webPage = {
    '@type': PAGE_TYPES[page],
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: HTML_LANG[locale],
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }

  if (page === 'home') {
    return [
      {
        ...webPage,
        mainEntity: person,
        dateModified: new Date().toISOString().split('T')[0],
      },
    ]
  }

  return [
    { ...webPage, about: person, breadcrumb: { '@id': `${url}#breadcrumb` } },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: siteName, item: urlFor(locale, '/') },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    },
  ]
}

/**
 * The entities every page shares, as one @graph for a single JSON-LD script. Using
 * @graph is the recommended approach for multiple interlinked entities. Each page adds
 * its own entities next to it (see `buildPageSchemas`).
 */
export function buildSiteJsonLd({ locale }: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildPersonSchema({ locale }),
      buildWebSiteSchema(),
      buildSoftwareSourceCodeSchema(),
    ],
  }
}
