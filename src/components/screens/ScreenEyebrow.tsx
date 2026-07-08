import { SCREEN_META } from '@/lib/pages'
import type { PageId } from '@/types'

interface ScreenEyebrowProps {
  /** Reads the index and shell command from `SCREEN_META`. */
  page: Exclude<PageId, 'home' | 'contact'>
  /** Localized directory label, e.g. "My Stack". */
  label: string
  className?: string
}

/** `01 / about · cat about.txt` — the header line above every screen but home. */
export function ScreenEyebrow({ page, label, className }: ScreenEyebrowProps) {
  const { index, command } = SCREEN_META[page]

  return (
    <div className={`term-eyebrow ${className ?? 'mb-6'}`}>
      <b>{index}</b> / {label} <i>· {command}</i>
    </div>
  )
}
