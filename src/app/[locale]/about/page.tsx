import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AboutScreen } from '@/components/screens/AboutScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { AboutTranslations, Locale } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/about',
    title: t('pages.about.title'),
    description: t('pages.about.description'),
    siteName: t('name'),
  })
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  const aboutT: AboutTranslations = {
    p1: t('p1'),
    p2: t('p2'),
  }

  return <AboutScreen t={aboutT} />
}
