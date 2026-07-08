import type { TechCategory } from '@/types'

/**
 * Language-neutral stack modules. The `sub` label for each module is localized
 * in messages under `technologies.categories.<id>.sub`.
 *
 * These tags are the single source of truth for the stack: `src/lib/seo.ts` derives
 * the Person schema's `knowsAbout`/`skills` from them, so adding a tag here also
 * surfaces it in the structured data.
 */
export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'frontend',
    dir: 'frontend/',
    tags: [
      'React',
      'Next.js',
      'Gatsby',
      'TypeScript',
      'Tailwind CSS',
      'SASS/SCSS',
      'styled-components',
      'shadcn/ui',
      'HTML',
      'CSS',
      'PHP',
    ],
  },
  {
    id: 'backend',
    dir: 'backend/',
    tags: ['Node.js', 'Nest.js', 'Express', 'REST APIs'],
  },
  {
    id: 'cms',
    dir: 'cms/',
    tags: ['WordPress', 'Strapi', 'Payload CMS', 'Contentful', 'Adobe Experience Manager'],
  },
  {
    id: 'database',
    dir: 'database/',
    tags: ['PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    id: 'devops',
    dir: 'devops/',
    tags: ['Git', 'GitHub', 'GitHub Actions', 'Docker', 'Vercel', 'Vite', 'Linux', 'CI/CD'],
  },
  {
    id: 'ai',
    dir: 'ai/',
    tags: [
      'Claude',
      'ChatGPT',
      'GitHub Copilot',
      'Cursor',
      'OpenAI API',
      'LangChain',
      'RAG',
      'MCP',
      'Prompt Engineering',
      'Agent Skills',
      'AI-driven Development',
      'Automation',
    ],
  },
]
