# estetele.dev · Portfolio

**Tiago Estetele · Web Developer & Front-End Specialist**
[estetele.dev](https://estetele.dev)

---

## Overview

A personal portfolio reimagined as an **interactive terminal**. Instead of a scrolling landing page, the whole site lives inside a single terminal window: it boots up, streams a log, types a command, and hands over to a navigable shell. You move between "directories" (`about`, `stack`, `projects`…) by clicking tabs **or** typing `cd ~/<page>` at the prompt.

Built with a focus on **performance**, **accessibility**, **internationalization (en / pt-BR)**, and **production-grade SEO**: every screen is server-rendered and crawlable even though the experience feels like a live client-side terminal.

---

## Design

### Concept

A **dark, monospace terminal** aesthetic: credible to developers, tactile, and quietly animated. The chrome (title bar, tabs, prompt, status bar) frames real content, and every screen reads as a shell session: a typed command, then its output. The theatrics (boot sequence, git graph, custom cursor) sit around it without getting in the way.

- **Palette:** near-black background (`#050505`), off-white foreground (`#e8e8e5`), terminal-green accent (`#4ade80`), with a graded scale of muted greys for borders, panels, and secondary text.
- **Typography:** [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for the terminal and every screen, [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for longer prose such as the help panel. ASCII art falls back to a system monospace that has the box-drawing glyphs.
- **Atmosphere:** a living **git graph** on a fixed canvas (~30fps). Lanes scroll left, branches fork and merge, and the graph lights up around the cursor, showing the nearest commit's `sha  message`. Every navigation lands a highlighted `cd ~/<page>` commit at the right edge, and clicking anywhere commits `feat: visitor was here`.
- **Cursor:** a custom green **dot + trailing ring** replaces the system cursor on fine-pointer devices, easing toward the pointer and swelling over links and buttons.

### Boot / initialization sequence

On a cold load the window scales and fades in, then:

1. Five `[ OK ]` boot-log lines fade in with jittered timing.
2. The prompt **types out `./portfolio --start`** character by character with a blinking cursor.
3. The log hands over: the first screen fades in, its session starts playing, and the **navigation tabs slide into place** (they stay hidden until boot finishes).

The boot replays **once per document load** (a module-scoped flag), never on in-terminal navigation or a locale switch. The screen is in the server-rendered HTML from the first byte, only hidden while the log plays, so crawlers and no-JS readers still receive the real page.

### Screens

Every screen is a short shell session: each command types itself in (`typeIn`), then its output appears.

| Screen | Route | Session |
|---|---|---|
| **home** | `/` | `neofetch` with the `TE` monogram, `cat intro.md`, then an inquirer-style "Where to next?" menu |
| **about** | `/about` | `cat about.md` (bio) + `tree ./education` |
| **stack** | `/stack` | `cat README.md` + `ls -la ./stack`, one directory per area |
| **projects** | `/projects` | `ls ./projects --preview`, with a live scaled-down preview of the hovered site (a screenshot for sites that refuse to be framed) |
| **experience** | `/experience` | `tig --career`: roles as commits on a proportional timeline, `git show` details on click, the current role under NDA |
| **contact** | `/contact` | `cat README.md` + `./contact.sh` menu (email / GitHub / LinkedIn) |
| **404** | catch-all | `cd` into nowhere, the shell error, and `echo $?` printing **404** in ASCII art |

### The prompt

The entire window is a keyboard target: click anywhere and type. `Enter` runs, `Backspace` edits, `↑`/`↓` walk the command history.

| Command | Effect |
|---|---|
| `cd <page>` | Navigate to a screen; unknown paths land on the in-terminal 404 |
| `ls` | List available directories |
| `pwd` | Print the current directory |
| `history` | List the commands entered this session |
| `echo <text>` | Print the text back |
| `date` | Print the current date |
| `man` | Open the help panel |
| `help` | Print the command reference |
| `whoami` | Print identity |
| `lang en\|br` | Switch language (`pt` is accepted too) |
| `clear` | Clear the prompt output |
| `sudo` | 😏 permission denied |

A floating **`?` button** (or `man`) opens a `man portfolio` help panel, dismissable with `Escape`, explaining navigation and commands.

### Design System

All design tokens live in `src/app/globals.css` using Tailwind v4's `@theme` plus CSS custom properties for the terminal chrome:

```css
@theme {
  --color-background: #050505;
  --color-foreground: #e8e8e5;
  --color-accent: #4ade80;
  --color-accent-strong: #86efac;
  --color-danger: #f87171;
  --font-sans: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

Semantic classes (`.term-window`, `.term-cmd`, `.term-menu-row`, `.term-tree`, `.term-ls`, `.term-tig`, `.term-preview`, …) and keyframes (`window-in`, `fadeUp`, `appear`, `typeIn`, `loadbar`, `blink`, `pulse-dot`) keep the markup readable; a scale of `--term-*` greys drives borders, panels, and muted type.

---

## Architecture

### Principles

- **Server-rendered content, client-driven shell.** Screens render in full HTML on the server. A single client orchestrator, `TerminalShell`, owns the boot sequence, prompt, keyboard, help panel, and navigation. The other `'use client'` islands are leaf effects or interactive pieces: `GitGraphBackground`, `CustomCursor`, `LiveClock`, `Uptime`, `TerminalLink`, `SelectMenu`, `HtmlLangSync`, plus the `ProjectsScreen` preview and the `ExperienceScreen` log.
- **Static generation (SSG).** Both locale trees are pre-rendered via `generateStaticParams`; screens are served from the edge. In-terminal links force `prefetch`, so a tab switch resolves in the same frame in production.
- **Navigation masks latency.** Tab/CTA navigation types `cd ~/<page>`, fades the content out, and pushes the route **concurrently** with the fade, so the (prefetched) round-trip hides behind the animation instead of following it. The arrival holds the faded-out position only for whatever's left of the cross-fade, keeping its length constant regardless of round-trip time.
- **Live dates.** Experience durations (`2 mos`, `1 yr 6 mos`) and the timeline are computed from the current month, LinkedIn-style, so they keep counting without a redeploy.
- **Separation of concerns.** Localized strings in `messages/`, language-neutral data in `lib/*-data.ts`, shared types in `types/`, design tokens in `globals.css`, page/route metadata in `lib/pages.ts` + `lib/metadata.ts`.

### Component Hierarchy

```
RootLayout (src/app/layout.tsx)
└── <html>/<body> · Space Grotesk + JetBrains Mono variables
    └── LocaleLayout (src/app/[locale]/layout.tsx)
        ├── <script type="application/ld+json">   @graph structured data
        ├── HtmlLangSync            'use client'   keeps <html lang> in sync
        ├── GitGraphBackground      'use client'   canvas git graph
        ├── radial-glow <div>
        ├── CustomCursor            'use client'   dot + trailing ring
        └── NextIntlClientProvider  (messages: {}, shell strings passed as props)
            └── TerminalShell       'use client'   boot · prompt · keyboard · nav
                ├── title bar        → LiveClock 'use client'
                ├── nav tabs         → TerminalLink ×6 + locale switch (/en · /br)
                ├── boot log  ⇄  content viewport
                │      └── {children} = the active screen
                │             HomeScreen · AboutScreen · StackScreen ·
                │             ProjectsScreen · ExperienceScreen ·
                │             ContactScreen · NotFoundScreen
                ├── prompt line
                ├── status bar       → Uptime 'use client'
                └── HelpPanel        'use client'   floating "?" → man portfolio
```

### Internationalization (i18n)

| Route | Language |
|---|---|
| `/` | English (default) |
| `/pt` | Portuguese (Brazil), labelled `/br` in the switcher |

Built with **next-intl v4**:

- `src/i18n/routing.ts`: locales `['en','pt']`, `localePrefix: 'as-needed'`, `localeDetection: false` (the URL is the single source of truth).
- `src/middleware.ts`: Edge-runtime locale routing.
- `src/i18n/request.ts`: server-side message loading via `getRequestConfig`.
- `messages/en.json` + `messages/pt.json`: all UI copy plus localized data (experience, project descriptions, education). Zero hardcoded strings in JSX.

The shell receives only its handful of strings as plain props, so `NextIntlClientProvider` is mounted with empty `messages` and the full message catalog is never shipped to the browser. `HtmlLangSync` keeps `<html lang>` correct across client-side locale switches, since the root layout isn't re-rendered.

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

No animation library, no icon library: the boot sequence, git graph, cursor, and transitions are hand-rolled with `requestAnimationFrame`, CSS transitions, and keyframes.

---

## SEO Implementation

- **Metadata API** (`src/lib/metadata.ts` → `buildPageMetadata`, used per route): per-locale `title`/`description`, canonical URL, `en` / `pt-BR` / `x-default` hreflang alternates, Open Graph + Twitter `summary_large_image` cards, author/creator/publisher, and `robots` directives.
- **Structured data, JSON-LD `@graph`** (`src/lib/seo.ts`): `Person`, `WebSite`, `SoftwareSourceCode`, and per-locale `ProfilePage`, cross-linked via `@id`. `knowsAbout`/`skills` are derived from `tech-data.ts`, so the schema can't drift from what the Stack screen actually lists.
- **Dynamic OG image** (`src/app/[locale]/opengraph-image.tsx`): `next/og` `ImageResponse`, 1200×630 per locale, matching the terminal identity.
- **Sitemap & robots** (`src/app/sitemap.ts`, `src/app/robots.ts`): both locale trees with hreflang alternates; `noindex` on 404s.
- **Canonical domain**: apex only; `www.estetele.dev` 308-redirects to `estetele.dev` (`vercel.json`).

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # Metadata + JSON-LD + background/cursor + TerminalShell
│   │   ├── page.tsx              # home screen
│   │   ├── about/page.tsx        # about + education
│   │   ├── stack/page.tsx        # tech stack
│   │   ├── projects/page.tsx     # featured projects
│   │   ├── experience/page.tsx   # career log
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
│   │   ├── TerminalShell.tsx     # 'use client': boot, prompt, keyboard, navigation
│   │   ├── terminal-nav.tsx      # React context bridging screens → shell navigation
│   │   ├── TerminalLink.tsx      # 'use client': real <a> that hands clicks to the shell
│   │   └── HelpPanel.tsx         # 'use client': floating "?" man panel
│   ├── screens/                  # Home/About/Stack/Projects/Experience/Contact/NotFound
│   │   └── shell/                # session building blocks: ShellCommand, MdTitle,
│   │                             # Ask, SelectMenu, BlockArt, ASCII art, reveal()
│   ├── ui/
│   │   ├── GitGraphBackground.tsx # 'use client': canvas git graph
│   │   ├── CustomCursor.tsx      # 'use client': dot + trailing ring
│   │   ├── LiveClock.tsx         # 'use client': title-bar clock
│   │   ├── Uptime.tsx            # 'use client': status-bar uptime
│   │   └── RequestedPath.tsx     # 404 helper
│   └── common/
│       └── HtmlLangSync.tsx      # 'use client': <html lang> sync
├── i18n/
│   ├── routing.ts                # locales, prefix, detection
│   └── request.ts                # server-side message loading
├── lib/
│   ├── pages.ts                  # PAGES, routes, tab labels
│   ├── metadata.ts               # buildPageMetadata (canonical, hreflang, OG, Twitter)
│   ├── seo.ts                    # JSON-LD @graph builders
│   ├── site.ts                   # site URL, shell identity, contact, build info
│   ├── fonts.ts                  # Space Grotesk + JetBrains Mono
│   ├── pointer.ts                # shared pointer state (cursor ↔ graph glow)
│   ├── git-graph.ts              # shell → background commit bridge
│   ├── format-period.ts          # month math for experience durations
│   ├── tech-data.ts              # stack categories (neutral)
│   ├── projects-data.ts          # projects (neutral, incl. embeddable + screenshot)
│   ├── experience-data.ts        # roles (neutral: sha, dates, skills)
│   └── education-data.ts         # education entries (neutral)
├── middleware.ts                 # next-intl Edge middleware
└── types/
    └── index.ts                  # shared types
messages/
├── en.json                       # English strings + localized data
└── pt.json                       # Portuguese (Brazil) strings + localized data
public/
└── projects/                     # screenshots for sites that can't be framed
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

> In `next dev`, routes compile on demand and aren't prefetched, so section switches feel slower than production, where every route is prefetched and the transition resolves in the same frame.

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

- **TypeScript strict mode**: no `any`; props and data explicitly typed.
- **Async params**: `params` in layouts/pages are `Promise<{…}>` and awaited (Next.js 16).
- **Server Components by default**: `'use client'` only where a browser API or interactivity is unavoidable; content screens stay on the server where they can.
- **Localized copy in `messages/`, neutral data in `lib/`**: no hardcoded UI strings in JSX.
- **Prettier**: `semi: false`, `singleQuote`, `trailingComma: all`, `printWidth: 100`, with `prettier-plugin-tailwindcss`.

---

## License

MIT. Feel free to use this as inspiration for your own portfolio.

---

*Designed & built by Tiago Estetele · 2026*
