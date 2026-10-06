import type { Project } from '@/types'

/**
 * Language-neutral project entries. Descriptions are localized in messages under
 * `projects.descriptions` (same order as this array).
 *
 * `embeddable` reflects each site's response headers: okn.com.br and dsec.com.br send
 * `X-Frame-Options: SAMEORIGIN`, seedz.ag sends `DENY` plus `frame-ancestors 'none'`.
 * Re-check with `curl -sI <url>` when adding a project.
 */
export const PROJECTS: Project[] = [
  {
    name: 'OKN Group',
    domain: 'okn.com.br',
    url: 'https://okn.com.br',
    embeddable: false,
    screenshot: '/projects/okn.webp',
  },
  {
    name: 'Seedz',
    domain: 'seedz.ag',
    url: 'https://seedz.ag',
    embeddable: false,
    screenshot: '/projects/seedz.webp',
  },
  {
    name: 'AND,ALL',
    domain: 'andall.ag',
    url: 'https://andall.ag',
    embeddable: true,
    screenshot: '/projects/andall.webp',
  },
  {
    name: 'Doc Security',
    domain: 'dsec.com.br',
    url: 'https://dsec.com.br',
    embeddable: false,
    screenshot: '/projects/dsec.webp',
  },
  {
    name: 'Blog Professor Ferretto',
    domain: 'blog.professorferretto.com.br',
    url: 'https://blog.professorferretto.com.br/',
    embeddable: true,
    screenshot: '/projects/ferretto.webp',
  },
]
