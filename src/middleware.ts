import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

// next-intl requires Edge runtime for locale detection and routing.
// middleware.ts (Edge runtime) remains supported in Next.js 16 for this use case.
// proxy.ts (Node.js runtime) is not compatible with next-intl's createMiddleware.
export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
