import type { CompanyId, ExperienceEntry } from '@/types'

/** Display names, as the `Org:` line of `git show` prints them. */
export const COMPANIES: Record<CompanyId, string> = {
  brivia: 'Brivia | The Creative Smartech',
  polo: 'Polo BPM',
  okn: 'OKN',
}

/**
 * Career history, newest first, as listed on LinkedIn. Roles, locations and
 * descriptions are localized in messages under `experience.items` (same order).
 *
 * Durations are never stored: they are derived from `start`/`end` against the current
 * month, so the "Present" role keeps counting without a redeploy.
 */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    sha: 'a3f9c21',
    deco: 'HEAD -> brivia',
    company: 'brivia',
    start: [2026, 9],
    end: null,
    nda: true,
    skills: ['PHP', 'JavaScript', 'HTML', 'CSS/SCSS', 'WordPress', 'SEO'],
  },
  {
    sha: '7b21e04',
    deco: '',
    company: 'brivia',
    start: [2025, 12],
    end: [2026, 9],
    skills: ['PHP', 'JavaScript', 'HTML', 'CSS/SCSS', 'WordPress', 'SEO'],
  },
  {
    sha: '4c8d1aa',
    deco: 'polo-bpm',
    company: 'polo',
    start: [2025, 6],
    end: [2025, 11],
    skills: ['React.js', 'Tailwind CSS', 'Node.js', 'Express'],
  },
  {
    sha: '9e02f7b',
    deco: 'okn',
    company: 'okn',
    start: [2024, 1],
    end: [2025, 6],
    skills: ['JavaScript', 'React.js', 'Next.js', 'PHP'],
  },
  {
    sha: '1d4c3e9',
    deco: '',
    company: 'okn',
    start: [2022, 9],
    end: [2024, 1],
    skills: ['JavaScript', 'PHP', 'WordPress', 'Elementor', 'SASS/SCSS', 'Figma'],
  },
]
