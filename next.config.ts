import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// The terminal renders no remote images, so there is no `images` config to carry.
const nextConfig: NextConfig = {
  // Belt and braces for the Open Graph card: the route reads its fonts off disk at
  // request time, and the tracer has to ship them alongside the serverless function.
  // The `readFile` calls are already written so the tracer can follow them, but the
  // whole card 500s if it ever fails to, so pin the directory explicitly.
  // Keys are picomatch globs against the route path, hence the escaped brackets.
  outputFileTracingIncludes: {
    '/\\[locale\\]/opengraph-image': ['./assets/fonts/**'],
  },
}

export default withNextIntl(nextConfig)
