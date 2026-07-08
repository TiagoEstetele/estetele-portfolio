import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { SHELL_USER, SITE_URL, BUILD } from '@/lib/site'
import { PAGES, TAB_LABELS } from '@/lib/pages'
import type { Locale } from '@/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Tiago Estetele, Web Developer specialized in front-end'

/**
 * The terminal window, rendered as the social card.
 *
 * Satori only understands flexbox and a subset of CSS, so this is a hand-laid recreation
 * rather than a reuse of the real components: no `backdrop-filter`, no CSS variables, no
 * grid, and every element with more than one child needs an explicit `display: flex`.
 *
 * The vendored Latin subsets in `assets/fonts` cover `—` and `·` but *not* `→` or `⎇`,
 * which the live site uses on the CTA buttons and the status bar. Both are omitted here
 * rather than rendered as tofu.
 */

const MONO = 'JetBrains Mono'
const SANS = 'Space Grotesk'

const ACCENT = '#4ade80'
const FG = '#e8e8e5'

const WINDOW_W = 1040
const WINDOW_H = 540

const dot = (background: string) => ({
  width: 12,
  height: 12,
  borderRadius: 6,
  background,
  marginRight: 8,
})

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const [t, meta] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])

  // Spelled out rather than looped through a helper: Next's file tracer only follows
  // `readFile(join(process.cwd(), '<literal>'))`. Hand it a computed path and the fonts
  // are silently left out of the deployment bundle, and the route 500s in production.
  const [mono, monoSemiBold, sansMedium, sansBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/JetBrainsMono-Regular.woff')),
    readFile(join(process.cwd(), 'assets/fonts/JetBrainsMono-SemiBold.woff')),
    readFile(join(process.cwd(), 'assets/fonts/SpaceGrotesk-Medium.woff')),
    readFile(join(process.cwd(), 'assets/fonts/SpaceGrotesk-Bold.woff')),
  ])

  const host = new URL(SITE_URL).host

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        fontFamily: SANS,
        position: 'relative',
      }}
    >
      {/* the ambient glow that sits behind the window on the live site */}
      <div
        style={{
          position: 'absolute',
          top: -230,
          left: (size.width - 900) / 2,
          width: 900,
          height: 500,
          background: 'radial-gradient(ellipse, rgba(74,222,128,0.22) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: WINDOW_W,
          height: WINDOW_H,
          border: '1px solid #1c1c1c',
          borderRadius: 12,
          background: '#080808',
          boxShadow: '0 32px 100px rgba(0,0,0,0.65)',
        }}
      >
        {/* ── titlebar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 18px',
            borderBottom: '1px solid #161616',
            background: '#0b0b0b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={dot('#2a2a2a')} />
            <div style={dot('#2a2a2a')} />
            <div style={dot('#1e3a28')} />
          </div>
          <div
            style={{ fontFamily: MONO, fontSize: 15, color: '#565650', letterSpacing: '0.04em' }}
          >
            {`${SHELL_USER}:~/home — zsh`}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: '#3a3a36' }}>{host}</div>
        </div>

        {/* ── tabs ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid #141414',
            background: '#090909',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {PAGES.map((page) => {
              const isActive = page === 'home'
              return (
                <div
                  key={page}
                  style={{
                    display: 'flex',
                    fontFamily: MONO,
                    fontSize: 15,
                    padding: '7px 14px',
                    marginRight: 4,
                    borderRadius: 6,
                    border: `1px solid ${isActive ? '#2e4a38' : 'transparent'}`,
                    background: isActive ? '#0e0e0e' : 'transparent',
                    color: isActive ? ACCENT : '#6b6b65',
                  }}
                >
                  {TAB_LABELS[page]}
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              border: '1px solid #1e1e1e',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {(['en', 'pt'] as const).map((code) => (
              <div
                key={code}
                style={{
                  display: 'flex',
                  fontFamily: MONO,
                  fontSize: 14,
                  padding: '6px 11px',
                  background: code === locale ? '#12241a' : 'transparent',
                  color: code === locale ? ACCENT : '#6b6b65',
                }}
              >
                {`/${code}`}
              </div>
            ))}
          </div>
        </div>

        {/* ── screen ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '34px 40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 10,
                border: '1px solid #223528',
                backgroundImage: 'linear-gradient(135deg, #0d1a11, #0a0a0a)',
                fontFamily: MONO,
                fontSize: 18,
                fontWeight: 600,
                color: ACCENT,
              }}
            >
              TE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 23, fontWeight: 700, color: FG }}>{meta('name')}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: 12,
                    padding: '3px 11px',
                    borderRadius: 99,
                    border: '1px solid #1e3a28',
                    fontFamily: MONO,
                    fontSize: 13,
                    color: ACCENT,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      background: ACCENT,
                      marginRight: 7,
                    }}
                  />
                  online
                </div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 14, color: '#6b6b65', marginTop: 5 }}>
                {t('role')}
              </div>
            </div>
          </div>

          {/*
           * One span per word inside a wrapping flex row. Satori refuses any element
           * with more than one child that isn't `display: flex`, so the natural markup
           * (`{headline} <span>{AI}</span>.`) throws — and making *that* div flex would
           * turn the whole sentence into a single unbreakable item. Word-level items let
           * the line wrap where it should and still let `AI` carry its own colour.
           */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              fontSize: 50,
              fontWeight: 700,
              color: FG,
              letterSpacing: '-0.03em',
              lineHeight: 1.14,
              marginTop: 32,
              maxWidth: 910,
            }}
          >
            {t('headline1')
              .split(' ')
              .map((word, index) => (
                <span key={index} style={{ marginRight: 14 }}>
                  {word}
                </span>
              ))}
            <span style={{ color: ACCENT }}>{t('headlineAI')}</span>
            <span>.</span>
          </div>

          {/* The live buttons carry a trailing arrow; `→` is outside the vendored subset. */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 34 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: MONO,
                fontSize: 16,
                fontWeight: 600,
                padding: '14px 26px',
                borderRadius: 8,
                background: ACCENT,
                color: '#050505',
              }}
            >
              {t('ctaContact')}
            </div>
            <div
              style={{
                display: 'flex',
                marginLeft: 14,
                fontFamily: MONO,
                fontSize: 16,
                padding: '14px 26px',
                borderRadius: 8,
                border: '1px solid #232323',
                background: '#0e0e0e',
                color: '#d5d5d0',
              }}
            >
              {t('ctaStack')}
            </div>
          </div>
        </div>

        {/* ── prompt ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px 20px',
            borderTop: '1px solid #141414',
            background: '#090909',
            fontFamily: MONO,
            fontSize: 17,
          }}
        >
          <div style={{ color: ACCENT }}>{SHELL_USER}</div>
          <div style={{ color: '#565650', marginLeft: 10 }}>~/home</div>
          <div style={{ color: '#565650', marginLeft: 10 }}>$</div>
          <div style={{ color: FG, marginLeft: 10 }}>whoami</div>
          <div style={{ width: 9, height: 19, background: ACCENT, marginLeft: 10 }} />
        </div>

        {/* ── status bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            borderTop: '1px solid #141414',
            background: '#0b0b0b',
            fontFamily: MONO,
            fontSize: 12,
            color: '#33332f',
          }}
        >
          <div>{`${BUILD.branch} · sha ${BUILD.sha}`}</div>
          {/* Carries over the stack line the previous card advertised. */}
          <div>{`React · Next.js · TypeScript · ${t('headlineAI')}`}</div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: MONO, data: mono, style: 'normal', weight: 400 },
        { name: MONO, data: monoSemiBold, style: 'normal', weight: 600 },
        { name: SANS, data: sansMedium, style: 'normal', weight: 500 },
        { name: SANS, data: sansBold, style: 'normal', weight: 700 },
      ],
    },
  )
}
