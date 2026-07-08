import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { StackScreen } from '@/components/screens/StackScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { Locale, StackTranslations } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/stack',
    title: t('pages.stack.title'),
    description: t('pages.stack.description'),
    siteName: t('name'),
  })
}

export default async function StackPage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'stack' })

  const stackT: StackTranslations = {
    pill: t('pill'),
    subtext: t('subtext'),
    categories: {
      frontend: { sub: t('categories.frontend.sub') },
      backend: { sub: t('categories.backend.sub') },
      cms: { sub: t('categories.cms.sub') },
      database: { sub: t('categories.database.sub') },
      devops: { sub: t('categories.devops.sub') },
      ai: { sub: t('categories.ai.sub') },
    },
  }

  return <StackScreen t={stackT} />
}
