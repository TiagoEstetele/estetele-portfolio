import type { CSSProperties } from 'react'

interface BlockArtProps {
  /** ANSI Shadow-style art: `█` blocks plus box-drawing edges. */
  lines: readonly string[]
  /** What the art spells, for screen readers. Omit to hide it from them entirely. */
  label?: string
  style?: CSSProperties
}

/**
 * Figlet art in two colors. The same lines are printed twice on one grid cell: once
 * with only the `█` blocks (bright) and once with only the box-drawing shadow (dark),
 * so the shadow can be tinted without splitting every line into spans.
 */
export function BlockArt({ lines, label, style }: BlockArtProps) {
  const fill = lines.map((line) => line.replace(/[^█]/g, ' ')).join('\n')
  const shade = lines.map((line) => line.replace(/█/g, ' ')).join('\n')

  return (
    <div
      className="term-art"
      style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <div className="term-art-layer term-art-fill">{fill}</div>
      <div className="term-art-layer term-art-shade">{shade}</div>
    </div>
  )
}
