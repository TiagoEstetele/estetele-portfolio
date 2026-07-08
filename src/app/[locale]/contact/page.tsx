import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ContactScreen } from '@/components/screens/ContactScreen'
import { buildPageMetadata } from '@/lib/metadata'
import type { ContactTranslations, Locale } from '@/types'

type Params = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return buildPageMetadata({
    locale,
    path: '/contact',
    title: t('pages.contact.title'),
    description: t('pages.contact.description'),
    siteName: t('name'),
  })
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const contactT: ContactTranslations = {
    pill: t('pill'),
    headline: t('headline'),
    subtext: t('subtext'),
    cta: t('cta'),
    emailAriaLabel: t('emailAriaLabel'),
    githubAriaLabel: t('githubAriaLabel'),
    linkedinAriaLabel: t('linkedinAriaLabel'),
  }

  return <ContactScreen t={contactT} />
}
