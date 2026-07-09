import type { EducationEntry } from '@/types'

/**
 * Language-neutral academic entries. Course, period, and tags are localized in
 * messages under `about.education` (same order as this array).
 */
export const EDUCATION: EducationEntry[] = [
  {
    mark: 'UNIP',
    color: '#1c3f8f',
    school: 'Universidade Paulista',
  },
  {
    mark: 'FMF',
    color: '#c62828',
    school: 'FAMEF',
  },
]
