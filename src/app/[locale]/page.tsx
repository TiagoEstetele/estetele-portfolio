import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { HomeScreen } from '@/components/screens/HomeScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { HomeTranslations, Locale } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/',
    // Home carries the full site title, not `Home | Tiago Estetele`.
    absoluteTitle: t('title'),
    description: t('description'),
    siteName: t('name'),
  })
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const homeT: HomeTranslations = {
    headline1: t('headline1'),
    headlineAI: t('headlineAI'),
    heroSub: t('heroSub'),
    ctaContact: t('ctaContact'),
    ctaStack: t('ctaStack'),
    nfRole: t('nfRole'),
    nfWork: t('nfWork'),
    nfLocation: t('nfLocation'),
    nfStatus: t('nfStatus'),
    ask: t('ask'),
    askHint: t('askHint'),
  }

  return <HomeScreen t={homeT} />
}
