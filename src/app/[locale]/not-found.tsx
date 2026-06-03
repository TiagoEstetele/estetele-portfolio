import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-8 text-center"
      style={{ background: '#0a0a0a', color: '#ededed' }}
    >
      <p
        className="text-[13px] uppercase tracking-[0.09em]"
        style={{ color: 'rgba(237,237,237,0.38)' }}
      >
        404
      </p>
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Page not found</h1>
      <Link
        href="/"
        className="rounded-full px-6 py-3 text-[14px] font-medium transition-opacity hover:opacity-80"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        Go home
      </Link>
    </div>
  )
}
