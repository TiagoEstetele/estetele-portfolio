import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ProjectsScreen } from '@/components/screens/ProjectsScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { Locale, ProjectsTranslations } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/projects',
    title: t('pages.projects.title'),
    description: t('pages.projects.description'),
    siteName: t('name'),
  })
}

export default async function ProjectsPage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })

  const projectsT: ProjectsTranslations = {
    pill: t('pill'),
    descriptions: t.raw('descriptions') as string[],
  }

  return <ProjectsScreen t={projectsT} />
}
