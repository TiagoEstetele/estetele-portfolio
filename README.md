# estetele.dev — Portfolio

**Tiago Estetele · Front-End Developer**
[estetele.dev](https://estetele.dev)

---

## Overview

Personal portfolio built with a focus on **performance**, **accessibility**, **internationalization**, and **production-grade SEO**. The site achieves near-perfect Lighthouse scores and serves as both a professional showcase and a technical reference for modern front-end architecture.

---

## Design

### Concept

The visual direction follows a **"Linear meets Vercel meets Apple"** aesthetic — a dark, premium interface that communicates technical credibility without visual noise.

- **Color palette:** Near-black background (`#0a0a0a`), off-white foreground (`#ededed`), violet accent (`#7000FF`), tangerine accent (`#FF5C00`)
- **Typography:** [Inter](https://rsms.me/inter/) — variable font covering weights 400–800, with tight letter-spacing and large display sizes for impact
- **Effects:** Glassmorphism cards, radial ambient glows, CSS keyframe floating badges, dot-grid backgrounds
- **Motion:** Scroll-triggered Framer Motion animations with `whileInView` + `once: true`, fully gated behind `prefers-reduced-motion`

### Sections

| Section | Purpose |
|---|---|
| **Hero** | Name, role, headline, two CTAs, three floating contextual badges |
| **Technologies** | Bento grid of 6 tech categories as glassmorphic cards with tag lists |
| **Contact** | Email, GitHub, LinkedIn with large interactive contact card |

### Design System

All design tokens are defined in `src/app/globals.css` using Tailwind v4's `@theme` and CSS custom properties:

```css
@theme {
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-accent-violet: #7000ff;
  --color-accent-tangerine: #ff5c00;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
```

Custom utilities (`@utility`) are used for repeatable patterns: `glass-card`, `gradient-text`, `float-a/b/c`, `dot-grid`, `cta-primary`, `cta-secondary`.

---

## Architecture

### Principles

- **Zero client JS for content** — Every section is a React Server Component. `"use client"` is used only on leaf components that require browser APIs (`MotionWrapper`, `LanguageSwitcher`).
- **Full Static Generation (SSG)** — Both locale routes (`/` and `/pt`) are pre-rendered at build time via `generateStaticParams`. No serverless invocations at runtime — pages are served from CDN edge.
- **Separation of concerns** — Logic lives in `lib/`, shared types in `types/`, design tokens in `globals.css`, translation strings in `messages/`, animations in `lib/animations.ts`.

### Component Hierarchy

```
RootLayout (src/app/layout.tsx)
└── html + body + Inter font
    └── LocaleLayout (src/app/[locale]/layout.tsx)
        ├── <script type="application/ld+json"> — JSON-LD @graph
        ├── LanguageSwitcher          'use client' — <a> tags, full-page reload
        └── HomePage (src/app/[locale]/page.tsx)
            └── <main>
                ├── HeroSection       Server Component
                │   ├── FloatingBadge×3   Server (CSS float-a/b/c)
                │   ├── SectionLabel      Server
                │   └── MotionWrapper     'use client' (Framer Motion)
                ├── TechnologiesSection   Server Component
                │   └── TechCard×6        Server (CSS hover)
                └── ContactSection        Server Component
                    └── ContactCard       Server (CSS hover)
```

### Internationalization (i18n)

| Route | Language |
|---|---|
| `/` | English (default) |
| `/pt` | Portuguese (Brazil) |

Built with **next-intl v4** using:
- `src/middleware.ts` — Edge runtime locale routing (redirects `/` → `/pt` for PT browsers, disabled to prevent conflicts via `localeDetection: false`)
- `src/i18n/routing.ts` — Locale config with `localePrefix: 'as-needed'`
- `src/i18n/request.ts` — Server-side message loading via `getRequestConfig`
- `messages/en.json` + `messages/pt.json` — All UI strings, zero hardcoded text in JSX

The language switcher uses plain `<a>` tags (full-page reload) to bypass App Router client caching, ensuring the server-side locale detection triggers correctly every time.

---

## Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **i18n** | next-intl v4 |
| **Font** | Inter via `next/font/google` |
| **Deployment** | Vercel |

---

## SEO Implementation

A production-grade SEO strategy is implemented across the codebase:

### Metadata API (`src/app/[locale]/layout.tsx`)
- `title`, `description`, `keywords`, `authors`, `creator`, `publisher`, `category`
- `robots` with `max-snippet: -1`, `max-image-preview: large`, `max-video-preview: -1`
- `alternates` with `canonical`, `en`, `pt-BR`, and `x-default` hreflang

### Open Graph + Twitter Cards
- Explicit OG `images` array with `alt`, `width`, `height` per locale
- `og:locale` + `og:alternateLocale`
- Twitter `summary_large_image` card with image per locale

### Structured Data — JSON-LD (`src/lib/seo.ts`)
Implemented as a `@graph` payload rendered via `<script type="application/ld+json">`:
- **Person** — name, jobTitle, description, email, image, address, sameAs, worksFor, knowsAbout, hasOccupation
- **WebSite** — name, url, author reference, inLanguage
- **ProfilePage** — per-locale page entity linked to Person

### Sitemap (`src/app/sitemap.ts`)
- Both locale routes with `alternates.languages` (hreflang in sitemap)
- Static `lastModified` date (prevents CDN cache churn)

### Dynamic OG Image (`src/app/[locale]/opengraph-image.tsx`)
- `next/og` ImageResponse — 1200×630 per locale
- Matches site visual identity (dark background, ambient glow, typography)

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Metadata API + JSON-LD script + LanguageSwitcher
│   │   ├── page.tsx            # Home — fetches translations, renders sections
│   │   ├── not-found.tsx       # 404 page (robots: noindex)
│   │   └── opengraph-image.tsx # Dynamic OG image per locale
│   ├── global-error.tsx        # Root error boundary ('use client')
│   ├── globals.css             # Tailwind import, @theme tokens, @utility, @keyframes
│   ├── layout.tsx              # Root html/body, Inter font, data-scroll-behavior
│   ├── robots.ts               # robots.txt generation
│   └── sitemap.ts              # sitemap.xml with hreflang alternates
├── components/
│   ├── common/
│   │   └── LanguageSwitcher.tsx   # Server Component, <a> tags for locale switching
│   ├── sections/
│   │   ├── HeroSection.tsx        # Hero with floating badges, headline, CTAs
│   │   ├── TechnologiesSection.tsx# Bento grid of TechCards
│   │   └── ContactSection.tsx     # Contact headline + ContactCard
│   └── ui/
│       ├── TechCard.tsx           # Individual technology category card
│       ├── ContactCard.tsx        # Email / GitHub / LinkedIn card
│       ├── FloatingBadge.tsx      # CSS-animated floating pill badge
│       ├── SectionLabel.tsx       # Eyebrow pill with optional pulsing dot
│       └── MotionWrapper.tsx      # 'use client' Framer Motion whileInView wrapper
├── i18n/
│   ├── routing.ts              # next-intl routing config (locales, prefix, detection)
│   └── request.ts              # getRequestConfig — server-side message loading
├── lib/
│   ├── animations.ts           # Framer Motion Variants (fadeInUp, stagger, scaleIn)
│   ├── fonts.ts                # Inter font instance
│   ├── seo.ts                  # JSON-LD schema builders (Person, WebSite, ProfilePage)
│   └── tech-data.ts            # Static tech category data (TECH_CATEGORIES)
├── middleware.ts               # next-intl Edge middleware for locale routing
└── types/
    └── index.ts                # Shared TypeScript types and interfaces
messages/
├── en.json                     # English translation strings
└── pt.json                     # Portuguese (Brazil) translation strings
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
git clone https://github.com/TiagoEstetele/estetele-portfolio.git
cd estetele-portfolio
npm install
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://estetele.dev
```

The site defaults to `https://estetele.dev` if this variable is not set.

### Development

```bash
npm run dev
# → http://localhost:3000   (English)
# → http://localhost:3000/pt (Portuguese)
```

### Production Build

```bash
npm run build
npm run start
```

Both locale routes (`/` and `/pt`) are statically generated at build time.

---

## Coding Standards

- **TypeScript strict mode** — no `any`, all params explicitly typed
- **Async params** — all `params` in layouts/pages are `Promise<{...}>` and awaited (Next.js 16)
- **Server Components by default** — `"use client"` only where unavoidable
- **No inline `style={}` for layout** — Tailwind utilities for structure, inline styles only for dynamic radial gradients and glassmorphism values that cannot be expressed as static tokens
- **Prettier** — `semi: false`, `singleQuote`, `trailingComma: all`, `printWidth: 100`, with `prettier-plugin-tailwindcss`

---

## License

MIT — feel free to use this as inspiration for your own portfolio.

---

*Designed & built by Tiago Estetele · 2026*
