'use client'

import { useEffect, useRef } from 'react'
import { pointer } from '@/lib/pointer'

// Drifting glyph field rendered on a fixed, full-viewport canvas. Three overlapping sine
// waves decide which cells light up, giving organic green "matrix" patches behind the
// page. Throttled to ~20fps; disabled under prefers-reduced-motion.
//
// Cells near the pointer also glow, and churn through characters ten times faster. The
// glow is centred on the cursor *ring* (see src/lib/pointer.ts), which trails the actual
// pointer, so the light drags behind the cursor instead of sticking to it.
const CHARS = '01+=≡#*·:'
const CW = 16
const CH = 22

/** Pixel radius of the pointer glow. */
const GLOW_RADIUS = 240
/** Ceiling on a cell's alpha once the glow is added on top of the wave. */
const MAX_ALPHA = 0.6
/** Chance per frame that a cell swaps glyph, inside and outside the glow. */
const CHURN_LIT = 0.02
const CHURN_IDLE = 0.002

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cols = 0
    let rows = 0
    let cells: { x: number; y: number; c: string; p: number }[] = []
    let raf = 0
    let last = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(window.innerWidth / CW)
      rows = Math.ceil(window.innerHeight / CH)
      cells = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          cells.push({
            x,
            y,
            c: CHARS[Math.floor(Math.random() * CHARS.length)],
            p: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    window.addEventListener('resize', resize)
    resize()
    ctx.textBaseline = 'top'

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 50) return // ~20fps, subtle
      last = t
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = "12px 'JetBrains Mono', monospace"
      const time = t * 0.00012
      const hasPointer = pointer.seen

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i]
        const px = c.x * CW
        const py = c.y * CH

        let glow = 0
        if (hasPointer) {
          const dx = px + CW / 2 - pointer.rx
          const dy = py + CH / 2 - pointer.ry
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < GLOW_RADIUS) {
            const falloff = 1 - dist / GLOW_RADIUS
            glow = falloff * falloff * 0.5
          }
        }

        const n =
          Math.sin(c.x * 0.14 + time * 3.1) +
          Math.sin(c.y * 0.19 - time * 2.3) +
          Math.sin((c.x + c.y) * 0.07 + time * 1.7)

        // Cells below the wave threshold are dark on their own, but the glow can still
        // raise them — that's what makes the pointer carve a lit patch out of the void.
        let a = 0
        if (n >= 0.9) a = Math.min(0.34, (n - 0.9) * 0.24) * (0.7 + 0.3 * Math.sin(c.p + t * 0.001))
        a = Math.min(MAX_ALPHA, a + glow * (0.35 + 0.35 * ((n + 3) / 6)))
        if (a < 0.015) continue

        if (Math.random() < (glow > 0.05 ? CHURN_LIT : CHURN_IDLE)) {
          c.c = CHARS[Math.floor(Math.random() * CHARS.length)]
        }
        ctx.fillStyle = `rgba(74, 222, 128, ${a.toFixed(3)})`
        ctx.fillText(c.c, px, py)
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  )
}
