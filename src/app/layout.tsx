import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { inter } from '@/lib/fonts'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://estetele.dev'

// Minimal fallback — locale-specific metadata is generated in [locale]/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tiago Estetele — Front-End Developer',
    template: '%s | Tiago Estetele',
  },
  description:
    'Front-End Developer specialized in React, Next.js, TypeScript, WordPress and Strapi. Building scalable web experiences and exploring the future of AI.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    // data-scroll-behavior="smooth" tells Next.js 16 that smooth scrolling is intentional
    // and prevents the router from overriding scroll restoration during transitions.
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
