'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { CURSOR_MEDIA_QUERY, pointer, resetPointer } from '@/lib/pointer'

/** How much of the remaining distance each element closes per frame. */
const DOT_EASE = 0.35
const RING_EASE = 0.14

const RING_IDLE = { size: '34px', margin: '-17px 0 0 -17px' }
const RING_HOVER = { size: '48px', margin: '-24px 0 0 -24px' }

const BASE: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 100,
  pointerEvents: 'none',
  opacity: 0,
}

let mediaQuery: MediaQueryList | null = null
const getMediaQuery = () => (mediaQuery ??= window.matchMedia(CURSOR_MEDIA_QUERY))

const subscribe = (onChange: () => void) => {
  const query = getMediaQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Green dot plus a trailing ring, in place of the system cursor.
 *
 * Both nodes are always rendered (inert, `opacity: 0`) so the server markup and the
 * first client render agree; only the listeners are conditional. They light up on the
 * first mousemove and hide again when the pointer leaves the document.
 *
 * Gated on the same media query that hides the native cursor (a real pointing device),
 * and subscribed to it, so a device change mid-session can never leave the page with two
 * cursors or none.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const active = useSyncExternalStore(
    subscribe,
    () => getMediaQuery().matches,
    () => false,
  )

  useEffect(() => {
    if (!active) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Only now does globals.css hide the native cursor. If this component never mounts,
    // the visitor keeps the cursor they came with.
    document.documentElement.dataset.cursor = 'custom'

    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY

      // First sighting: drop both elements straight onto the pointer rather than
      // letting them ease in from the top-left corner.
      if (!pointer.seen) {
        pointer.sx = pointer.rx = pointer.x
        pointer.sy = pointer.ry = pointer.y
        pointer.seen = true
      }

      const target = event.target instanceof Element ? event.target.closest('a, button') : null
      const hover = target !== null
      if (hover === pointer.hover) return

      pointer.hover = hover
      const { size, margin } = hover ? RING_HOVER : RING_IDLE
      ring.style.width = size
      ring.style.height = size
      ring.style.margin = margin
      ring.style.borderColor = hover ? 'rgba(134,239,172,0.9)' : 'rgba(74,222,128,0.55)'
      ring.style.background = hover ? 'rgba(74,222,128,0.08)' : 'transparent'
    }

    // `relatedTarget` is null only when the pointer leaves the document entirely;
    // every other mouseout is just a hop between elements.
    const onOut = (event: MouseEvent) => {
      if (event.relatedTarget) return
      pointer.seen = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!pointer.seen) return

      pointer.sx += (pointer.x - pointer.sx) * DOT_EASE
      pointer.sy += (pointer.y - pointer.sy) * DOT_EASE
      pointer.rx += (pointer.x - pointer.rx) * RING_EASE
      pointer.ry += (pointer.y - pointer.ry) * RING_EASE

      dot.style.opacity = '1'
      dot.style.transform = `translate3d(${pointer.sx.toFixed(1)}px,${pointer.sy.toFixed(1)}px,0)`
      ring.style.opacity = '1'
      ring.style.transform = `translate3d(${pointer.rx.toFixed(1)}px,${pointer.ry.toFixed(1)}px,0)`
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onOut)
      delete document.documentElement.dataset.cursor
      // Stop the glyph field chasing a cursor that no longer exists.
      resetPointer()
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
  }, [active])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...BASE,
          width: RING_IDLE.size,
          height: RING_IDLE.size,
          margin: RING_IDLE.margin,
          border: '1px solid rgba(74,222,128,0.55)',
          borderRadius: '50%',
          transition:
            'width 0.25s ease, height 0.25s ease, margin 0.25s ease, border-color 0.25s ease, background 0.25s ease',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...BASE,
          width: 6,
          height: 6,
          margin: '-3px 0 0 -3px',
          borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 10px rgba(74,222,128,0.7)',
        }}
      />
    </>
  )
}
