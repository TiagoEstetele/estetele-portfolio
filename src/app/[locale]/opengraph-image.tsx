import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isPt = locale === 'pt'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: '800px',
            height: '400px',
            background:
              'radial-gradient(ellipse, rgba(112,0,255,0.25) 0%, rgba(255,92,0,0.12) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Eyebrow */}
        <p
          style={{
            fontSize: 18,
            color: 'rgba(237,237,237,0.45)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          {isPt ? 'Desenvolvedor Front-End' : 'Front-End Developer'}
        </p>

        {/* Name */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Tiago Estetele
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: 24,
            color: 'rgba(237,237,237,0.5)',
            marginTop: 24,
            letterSpacing: '-0.01em',
          }}
        >
          {isPt ? 'React · Next.js · TypeScript · IA' : 'React · Next.js · TypeScript · AI'}
        </p>

        {/* URL */}
        <p
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 16,
            color: 'rgba(237,237,237,0.25)',
            letterSpacing: '0.04em',
          }}
        >
          estetele.dev
        </p>
      </div>
    ),
    { ...size },
  )
}
