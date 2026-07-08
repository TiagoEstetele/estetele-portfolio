import { notFound } from 'next/navigation'

/**
 * Catches every path under a locale that no screen claims — `/void`, `/pt/nope`,
 * `/a/b/c` — and hands it to `[locale]/not-found.tsx`.
 *
 * Without this, an unmatched URL falls through to the *root* `not-found.tsx`, which
 * sits outside `[locale]/layout.tsx` and so renders with no terminal shell around it.
 * Routing the miss through `notFound()` keeps the 404 inside the window — tabs, prompt,
 * and status bar intact — which is exactly where `cd ~/void` should land you.
 *
 * Trade-off, verified against a production build: a thrown `notFound()` yields the right
 * `404` status, but Next.js streams the not-found UI only in the RSC payload — the
 * initial HTML `<body>` comes back empty and the screen paints on hydration. (Reproduced
 * with a bare `<div>` as the not-found, so it is framework behavior, not this shell.)
 * Real screens are unaffected: they server-render in full. We take the blank pre-hydration
 * frame on 404s — which are `noindex` anyway — to keep the miss inside the terminal.
 */
export default function CatchAllPage() {
  notFound()
}
