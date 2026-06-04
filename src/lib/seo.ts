import { PORTFOLIO_REPO_URL, SITE_URL } from '@/lib/site'

interface SchemaOptions {
  locale: string
}

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
    jobTitle: isPt ? 'Desenvolvedor Front-End' : 'Front-End Developer',
    description: isPt
      ? 'Desenvolvedor Front-End com mais de 3 anos de experiência construindo aplicações web escaláveis com React, Next.js, TypeScript, WordPress e Strapi. Atualmente explorando Arquitetura de Software, Back-end e Engenharia de IA.'
      : 'Front-End Developer with 3+ years of experience building scalable web applications with React, Next.js, TypeScript, WordPress, and Strapi. Currently exploring Software Architecture, Back-end Development, and AI Engineering.',
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
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'WordPress',
      'Strapi',
      'Adobe Experience Manager',
      'Node.js',
      'Express',
      'Tailwind CSS',
      'Framer Motion',
      'Web Development',
      'Frontend Development',
      'Software Architecture',
      'SOLID Principles',
      'Clean Architecture',
      'Design Patterns',
      'Artificial Intelligence',
      'Large Language Models',
      'Model Context Protocol',
      'RAG',
      'Prompt Engineering',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: isPt ? 'Desenvolvedor Front-End' : 'Front-End Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'Brazil',
      },
      skills:
        'React, Next.js, TypeScript, JavaScript, WordPress, Strapi, AEM, Tailwind CSS, Node.js',
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
      'Portfolio of Tiago Estetele, Front-End Developer specialized in React, Next.js, TypeScript, and modern web engineering.',
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
      ? 'Tiago Estetele — Desenvolvedor Front-End'
      : 'Tiago Estetele — Front-End Developer',
    url: pageUrl,
    description: isPt
      ? 'Portfolio profissional de Tiago Estetele, Desenvolvedor Front-End especializado em React, Next.js e TypeScript.'
      : 'Professional portfolio of Tiago Estetele, Front-End Developer specialized in React, Next.js, and TypeScript.',
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
