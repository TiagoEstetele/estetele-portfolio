import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ExperienceScreen } from '@/components/screens/ExperienceScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { ExperienceItem, ExperienceTranslations, Locale } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/experience',
    title: t('pages.experience.title'),
    description: t('pages.experience.description'),
    siteName: t('name'),
  })
}

export default async function ExperiencePage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experience' })

  const experienceT: ExperienceTranslations = {
    items: t.raw('items') as ExperienceItem[],
  }

  return <ExperienceScreen t={experienceT} />
}
