import { ScreenEyebrow } from './ScreenEyebrow'
import type { AboutTranslations } from '@/types'

export function AboutScreen({ t }: { t: AboutTranslations }) {
  return (
    <div>
      <ScreenEyebrow page="about" label="about" />

      <p
        className="max-w-[640px] text-[21px]"
        style={{ lineHeight: 1.6, color: '#c9c9c3', letterSpacing: '-0.01em' }}
      >
        {t.p1}
      </p>

      <p
        className="mt-5 max-w-[640px] text-[16px]"
        style={{ lineHeight: 1.7, color: 'var(--term-text-soft)' }}
      >
        {t.p2}
      </p>
    </div>
  )
}
