import type { Project } from '@/types'

/**
 * Language-neutral project entries. Descriptions are localized in messages under
 * `projects.descriptions` (same order as this array).
 *
 * The list renders professional entries first, then personal ones, so keep that order
 * here too: index 0 is the project selected when the screen opens. A personal project
 * with no site of its own links to its repository and previews a screenshot.
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
    kind: 'professional',
    embeddable: false,
    screenshot: '/projects/okn.webp',
  },
  {
    name: 'Seedz',
    domain: 'seedz.ag',
    url: 'https://seedz.ag',
    kind: 'professional',
    embeddable: false,
    screenshot: '/projects/seedz.webp',
  },
  {
    name: 'AND,ALL',
    domain: 'andall.ag',
    url: 'https://andall.ag',
    kind: 'professional',
    embeddable: true,
    screenshot: '/projects/andall.webp',
  },
  {
    name: 'Doc Security',
    domain: 'dsec.com.br',
    url: 'https://dsec.com.br',
    kind: 'professional',
    embeddable: false,
    screenshot: '/projects/dsec.webp',
  },
  {
    name: 'Blog Professor Ferretto',
    domain: 'blog.professorferretto.com.br',
    url: 'https://blog.professorferretto.com.br/',
    kind: 'professional',
    embeddable: true,
    screenshot: '/projects/ferretto.webp',
  },
  {
    name: 'Automatic Grammar Correction',
    domain: 'github.com/TiagoEstetele/automatic-grammar-correction',
    url: 'https://github.com/TiagoEstetele/automatic-grammar-correction',
    kind: 'personal',
    // A Windows tray app, so there is no site to frame, and github.com sends `DENY`.
    embeddable: false,
    // The explainer from the app's README (1280x720), muted, with its cover as poster.
    screenshot: '/projects/agc.webp',
    video: '/projects/agc-explainer.mp4',
    previewRatio: 16 / 9,
  },
]
