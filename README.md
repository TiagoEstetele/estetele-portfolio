# estetele.dev — Portfolio

**Tiago Estetele · Web Developer & Front-End Specialist**
[estetele.dev](https://estetele.dev)

---

## Overview

A personal portfolio reimagined as an **interactive terminal**. Instead of a scrolling landing page, the whole site lives inside a single terminal window: it boots up, streams a log, types a command, and hands over to a navigable shell. You move between "directories" (`about`, `stack`, `projects`…) by clicking tabs **or** typing `cd ~/<page>` at the prompt.

Built with a focus on **performance**, **accessibility**, **internationalization (en / pt-BR)**, and **production-grade SEO** — every screen is server-rendered and crawlable even though the experience feels like a live client-side terminal.

---

## Design

### Concept

A **dark, monospace terminal** aesthetic — credible to developers, tactile, and quietly animated. The chrome (title bar, tabs, prompt, status bar) frames real content; the theatrics (boot sequence, glyph field, custom cursor) sit around it without getting in the way.

- **Palette:** near-black background (`#050505`), off-white foreground (`#e8e8e5`), terminal-green accent (`#4ade80`), with a graded scale of muted greys for borders, panels, and secondary text.
- **Typography:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for display/prose, [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for everything terminal — labels, prompt, tabs, logs.
- **Atmosphere:** an animated **matrix glyph field** on a fixed canvas (throttled to ~20fps, lit by three overlapping sine waves and a glow that trails the cursor), plus a soft radial glow behind the window.
- **Cursor:** a custom green **dot + trailing ring** replaces the system cursor on fine-pointer devices, easing toward the pointer and swelling over links and buttons.

### Boot / initialization sequence

On a cold load the window scales and fades in, then:

1. Five `[ OK ]` boot-log lines stream in with jittered timing.
2. The prompt **types out `./portfolio --start`** character by character with a blinking cursor.
3. The log hands over: the first screen cross-fades in and the **navigation tabs slide into place** (they stay hidden until boot finishes).

The boot replays **once per document load** (a module-scoped flag), never on in-terminal navigation or a locale switch. Content is painted *underneath* the boot overlay, so crawlers and no-JS readers still receive the real, fully server-rendered screen.

### Screens

| Screen | Route | Contents |
|---|---|---|
| **home** | `/` | Avatar, name, live "online" badge, headline, two CTAs, prompt hint |
| **about** | `/about` | Bio paragraphs + **Academic Background** cards (institution, course, period, tags) |
| **stack** | `/stack` | Six technology categories as cards with tag lists |
| **projects** | `/projects` | Featured project links with descriptions |
| **experience** | `/experience` | Timeline of professional roles |
| **contact** | `/contact` | Email CTA + GitHub / LinkedIn links |
| **404** | catch-all | In-terminal "no such file or directory" screen |

Every screen but `home` opens with an eyebrow line (`01 / about · cat about.txt`) and reveals its content in a staggered `fadeUp` cascade layered over the viewport cross-fade.

### The prompt

The entire window is a keyboard target — click anywhere and type. `Enter` runs, `Backspace` edits.

| Command | Effect |
|---|---|
| `cd <page>` | Navigate to a screen; unknown paths land on the in-terminal 404 |
| `ls` | List available directories |
| `help` | Print the command reference |
| `whoami` | Print identity |
| `lang en\|pt` | Switch language (`br` is accepted as an alias for `pt`) |
| `clear` | Clear the prompt output |
| `sudo` | 😏 permission denied |

A floating **`?` button** opens a `man portfolio` help panel (dismissable with `Escape`) explaining navigation and commands.

### Design System

All design tokens live in `src/app/globals.css` using Tailwind v4's `@theme` plus CSS custom properties for the terminal chrome:

```css
@theme {
  --color-background: #050505;
  --color-foreground: #e8e8e5;
  --color-accent: #4ade80;
  --color-accent-strong: #86efac;
  --color-accent-dim: #3ec46e;
  --color-danger: #f87171;
  --font-sans: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

Semantic classes (`.term-window`, `.term-nav`, `.term-boot`, `.term-prompt`, `.term-card`, `.term-edu-card`, …) and keyframes (`window-in`, `fadeUp`, `blink`, `pulse-dot`) keep the markup readable; a scale of `--term-*` greys drives borders, panels, and muted type.

---

## Architecture

### Principles

- **Server-rendered content, client-driven shell.** Each screen is a React Server Component rendered in full HTML. A single client orchestrator — `TerminalShell` — owns the boot sequence, prompt, keyboard, and navigation. The other `'use client'` islands are leaf effects: `MatrixBackground`, `CustomCursor`, `LiveClock`, `Uptime`, `HelpMenu`, `TerminalLink`, `HtmlLangSync`.
- **Static generation (SSG).** Both locale trees are pre-rendered via `generateStaticParams`; screens are served from the edge. In-terminal links force `prefetch`, so a tab switch resolves in the same frame in production.
- **Navigation masks latency.** Tab/CTA navigation types `cd ~/<page>`, fades the content out, and pushes the route **concurrently** with the fade — so the (prefetched) round-trip hides behind the animation instead of following it. The arrival holds the faded-out position only for whatever's left of the cross-fade, keeping its length constant regardless of round-trip time.
- **Separation of concerns.** Localized strings in `messages/`, language-neutral data in `lib/*-data.ts`, shared types in `types/`, design tokens in `globals.css`, page/route metadata in `lib/pages.ts` + `lib/metadata.ts`.

### Component Hierarchy

```
RootLayout (src/app/layout.tsx)
└── <html>/<body> · Space Grotesk + JetBrains Mono variables
    └── LocaleLayout (src/app/[locale]/layout.tsx)
        ├── <script type="application/ld+json">   @graph structured data
        ├── HtmlLangSync            'use client'   keeps <html lang> in sync
        ├── MatrixBackground        'use client'   canvas glyph field
        ├── radial-glow <div>
        ├── CustomCursor            'use client'   dot + trailing ring
        └── NextIntlClientProvider  (messages: {} — shell strings passed as props)
            └── TerminalShell       'use client'   boot · prompt · keyboard · nav
                ├── title bar        → LiveClock 'use client'
                ├── nav tabs         → TerminalLink ×6 + locale switch
                ├── boot overlay  ⇄  content viewport
                │      └── {children} = the active screen (Server Component)
                │             HomeScreen · AboutScreen · StackScreen ·
                │             ProjectsScreen · ExperienceScreen ·
                │             ContactScreen · NotFoundScreen
                ├── prompt line
                ├── status bar       → Uptime 'use client'
                └── HelpMenu         'use client'   floating "?" → man portfolio
```

### Internationalization (i18n)

| Route | Language |
|---|---|
| `/` | English (default) |
| `/pt` | Portuguese (Brazil) |

Built with **next-intl v4**:

- `src/i18n/routing.ts` — locales `['en','pt']`, `localePrefix: 'as-needed'`, `localeDetection: false` (the URL is the single source of truth).
- `src/middleware.ts` — Edge-runtime locale routing.
- `src/i18n/request.ts` — server-side message loading via `getRequestConfig`.
- `messages/en.json` + `messages/pt.json` — all UI copy plus localized data (experience, project descriptions, academic background). Zero hardcoded strings in JSX.

The shell receives only its handful of strings as plain props, so `NextIntlClientProvider` is mounted with empty `messages` — the full message catalog is never shipped to the browser. `HtmlLangSync` keeps `<html lang>` correct across client-side locale switches, since the root layout isn't re-rendered.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI runtime** | React 19 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 (`@theme`, `@utility`) |
| **i18n** | next-intl v4 |
| **Fonts** | Space Grotesk + JetBrains Mono via `next/font/google` |
| **Analytics** | `@vercel/analytics` + `@vercel/speed-insights` |
| **Deployment** | Vercel |

No animation library, no icon library — the boot sequence, matrix field, cursor, and transitions are hand-rolled with `requestAnimationFrame`, CSS transitions, and keyframes.

---

## SEO Implementation

- **Metadata API** (`src/lib/metadata.ts` → `buildPageMetadata`, used per route): per-locale `title`/`description`, canonical URL, `en` / `pt-BR` / `x-default` hreflang alternates, Open Graph + Twitter `summary_large_image` cards, author/creator/publisher, and `robots` directives.
- **Structured data — JSON-LD `@graph`** (`src/lib/seo.ts`): `Person`, `WebSite`, `SoftwareSourceCode`, and per-locale `ProfilePage`, cross-linked via `@id`. `knowsAbout`/`skills` are derived from `tech-data.ts`, so the schema can't drift from what the Stack screen actually lists.
- **Dynamic OG image** (`src/app/[locale]/opengraph-image.tsx`): `next/og` `ImageResponse`, 1200×630 per locale, matching the terminal identity.
- **Sitemap & robots** (`src/app/sitemap.ts`, `src/app/robots.ts`): both locale trees with hreflang alternates; `noindex` on 404s.
- **Canonical domain**: apex only — `www.estetele.dev` 308-redirects to `estetele.dev` (`vercel.json`).

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # Metadata + JSON-LD + background/cursor + TerminalShell
│   │   ├── page.tsx              # home screen
│   │   ├── about/page.tsx        # about + academic background
│   │   ├── stack/page.tsx        # tech stack
│   │   ├── projects/page.tsx     # featured projects
│   │   ├── experience/page.tsx   # role timeline
│   │   ├── contact/page.tsx      # contact
│   │   ├── [...rest]/page.tsx    # catch-all → in-terminal 404
│   │   ├── not-found.tsx         # 404 screen inside the shell
│   │   └── opengraph-image.tsx   # dynamic OG image per locale
│   ├── layout.tsx                # root html/body + font variables
│   ├── globals.css               # @theme tokens, terminal chrome, keyframes
│   ├── not-found.tsx             # root fallback (no shell)
│   ├── global-error.tsx          # root error boundary
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml with hreflang
├── components/
│   ├── terminal/
│   │   ├── TerminalShell.tsx     # 'use client' — boot, prompt, keyboard, navigation
│   │   ├── terminal-nav.tsx      # React context bridging screens → shell navigation
│   │   ├── TerminalLink.tsx      # 'use client' — real <a> that hands clicks to the shell
│   │   └── HelpMenu.tsx          # 'use client' — floating "?" man panel
│   ├── screens/                  # Server Components: Home/About/Stack/Projects/…
│   │   ├── AboutScreen.tsx       # bio + academic background cards
│   │   ├── ScreenEyebrow.tsx     # "NN / dir · command" header
│   │   └── …
│   ├── ui/
│   │   ├── MatrixBackground.tsx  # 'use client' — canvas glyph field
│   │   ├── CustomCursor.tsx      # 'use client' — dot + trailing ring
│   │   ├── LiveClock.tsx         # 'use client' — title-bar clock
│   │   ├── Uptime.tsx            # 'use client' — status-bar uptime
│   │   └── RequestedPath.tsx     # 404 helper
│   └── common/
│       └── HtmlLangSync.tsx      # 'use client' — <html lang> sync
├── i18n/
│   ├── routing.ts                # locales, prefix, detection
│   └── request.ts                # server-side message loading
├── lib/
│   ├── pages.ts                  # PAGES, routes, tab labels, screen metadata
│   ├── metadata.ts               # buildPageMetadata (canonical, hreflang, OG, Twitter)
│   ├── seo.ts                    # JSON-LD @graph builders
│   ├── site.ts                   # site URL, shell identity, contact, build info
│   ├── fonts.ts                  # Space Grotesk + JetBrains Mono
│   ├── pointer.ts                # shared pointer state (cursor ↔ matrix glow)
│   ├── tech-data.ts              # stack categories (neutral)
│   ├── projects-data.ts          # projects (neutral)
│   └── education-data.ts         # academic entries (neutral)
├── middleware.ts                 # next-intl Edge middleware
└── types/
    └── index.ts                  # shared types
messages/
├── en.json                       # English strings + localized data
└── pt.json                       # Portuguese (Brazil) strings + localized data
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

Defaults to `https://estetele.dev` if unset (used for SEO, sitemap, and JSON-LD).

### Development

```bash
npm run dev
# → http://localhost:3000     (English)
# → http://localhost:3000/pt  (Portuguese)
```

> In `next dev`, routes compile on demand and aren't prefetched, so section switches feel slower than production — where every route is prefetched and the transition resolves in the same frame.

### Production Build

```bash
npm run build
npm run start
```

Both locale trees (`/…` and `/pt/…`) are statically generated at build time.

### Lint

```bash
npm run lint
```

---

## Coding Standards

- **TypeScript strict mode** — no `any`; props and data explicitly typed.
- **Async params** — `params` in layouts/pages are `Promise<{…}>` and awaited (Next.js 16).
- **Server Components by default** — `'use client'` only where a browser API or interactivity is unavoidable; content screens stay on the server.
- **Localized copy in `messages/`, neutral data in `lib/`** — no hardcoded UI strings in JSX.
- **Prettier** — `semi: false`, `singleQuote`, `trailingComma: all`, `printWidth: 100`, with `prettier-plugin-tailwindcss`.

---

## License

MIT — feel free to use this as inspiration for your own portfolio.

---

*Designed & built by Tiago Estetele · 2026*
