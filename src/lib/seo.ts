import { PORTFOLIO_REPO_URL, SITE_URL } from '@/lib/site'
import { TECH_CATEGORIES } from '@/lib/tech-data'

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

/**
 * https://schema.org/ProfilePage — per-locale page entity
 */
export function buildProfilePageSchema({ locale }: SchemaOptions) {
  const isPt = locale === 'pt'
  const pageUrl = isPt ? `${SITE_URL}/pt` : SITE_URL

  return {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}/#profilepage`,
    name: isPt
      ? 'Tiago Estetele | Desenvolvedor Web Especialista em Front-End'
      : 'Tiago Estetele | Web Developer & Front-End Specialist',
    url: pageUrl,
    description: isPt
      ? 'Portfolio profissional de Tiago Estetele, Desenvolvedor Web especializado em front-end, atuando com React, Next.js e TypeScript.'
      : 'Professional portfolio of Tiago Estetele, Web Developer specialized in front-end, working with React, Next.js, and TypeScript.',
    mainEntity: { '@id': `${SITE_URL}/#person` },
    inLanguage: isPt ? 'pt-BR' : 'en',
    dateModified: new Date().toISOString().split('T')[0],
  }
}

/**
 * Builds a combined @graph payload for embedding as a single JSON-LD script.
 * Using @graph is the recommended approach for multiple interlinked entities.
 */
export function buildJsonLdGraph({ locale }: SchemaOptions): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      buildPersonSchema({ locale }),
      buildWebSiteSchema(),
      buildSoftwareSourceCodeSchema(),
      buildProfilePageSchema({ locale }),
    ],
  })
}
