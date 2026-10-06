import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ExperienceScreen } from '@/components/screens/ExperienceScreen'
import { currentMonth } from '@/lib/format-period'
import { buildPageMetadata } from '@/lib/metadata'
import type { ExperienceText, ExperienceTranslations, Locale } from '@/types'

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
    hint: t('hint'),
    ndaErr: t('ndaErr'),
    ndaNote: t('ndaNote'),
    items: t.raw('items') as ExperienceText[],
  }

  return <ExperienceScreen t={experienceT} locale={locale} serverMonth={currentMonth()} />
}
