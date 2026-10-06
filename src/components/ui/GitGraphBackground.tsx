'use client'

import { useEffect, useRef } from 'react'
import { setGraphCommitSink } from '@/lib/git-graph'
import { pointer } from '@/lib/pointer'

// A living git graph on a fixed, full-viewport canvas. Horizontal lanes scroll left,
// branches fork and merge, commits are small squares (merges filled in). Near the
// pointer the graph lights up and the closest commit shows its `sha  message`.
// Navigations and clicks land highlighted commits of their own. Throttled to ~30fps;
// disabled under prefers-reduced-motion.

/** Vertical distance between lanes, and horizontal distance between columns. */
const LANE = 64
const DX = 44
const FRAME_MS = 33
/** Scroll speed, in px per second. */
const SPEED = 16
const BASE_ALPHA = 0.12
const GLOW_RADIUS = 260
/** How close the pointer has to be for a commit to show its label. */
const LABEL_RADIUS = 70
/** Session commits keep their label this long (seconds), then only show on hover. */
const LABEL_TTL = 4.5
const MAX_VISITS = 12

const MSGS = [
  'feat: neofetch on ~/home',
  'fix(cursor): smoother lerp',
  'feat: tig-style experience view',
  'perf: cache live previews',
  'chore: bump dependencies',
  'refactor: extract prompt helper',
  'feat(i18n): pt-br strings',
  'fix: 404 exit code',
  'style: tabular nums on clock',
  'docs: update README',
  'test: boot sequence',
  'feat(projects): live iframe preview',
  'fix: safari clip-path',
  'build: ship standalone html',
  'feat: help panel',
  'style: square corners everywhere',
  'perf: throttle canvas to 30fps',
  'fix(nav): wait for boot',
  'feat: tree ./education',
  'refactor: split i18n tables',
  'fix: focus ring on rows',
]
const BRANCHES = [
  'feat/neofetch',
  'fix/cursor',
  'feat/tig-view',
  'chore/deps',
  'feat/live-preview',
  'style/sharp-ui',
  'feat/i18n',
  'perf/canvas',
]
const HEX = '0123456789abcdef'

interface Segment {
  curved: boolean
  x0: number
  y0: number
  x1: number
  y1: number
}

interface Commit {
  x: number
  y: number
  sha: string
  msg: string
  merge?: boolean
}

interface Column {
  x: number
  segs: Segment[]
  nodes: Commit[]
}

interface Visit extends Commit {
  /** `performance.now()` when it landed, for the ripple and the label fade. */
  t0: number
}

export function GitGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // next/font hashes the family name, so read it off the variable it exposes.
    const mono = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-jetbrains-mono')
      .trim()
    const labelFont = `10px ${mono ? `${mono}, ` : ''}monospace`

    // Seeded, so the graph is the same shape on every visit.
    let seed = 20220901
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const sha = () => {
      let s = ''
      for (let i = 0; i < 7; i++) s += HEX[Math.floor(rnd() * 16)]
      return s
    }
    const pick = <T,>(list: readonly T[]) => list[Math.floor(rnd() * list.length)]

    let W = 0
    let H = 0
    let lanes = 0
    let active: number[] = []
    let cols: Column[] = []
    let nextCol = 0
    let offset = 0
    const visits: Visit[] = []
    const laneY = (k: number) => Math.round(LANE / 2 + k * LANE) + 0.5

    const genCol = () => {
      const x = nextCol * DX
      nextCol++
      const segs: Segment[] = []
      const nodes: Commit[] = []
      const next = active.slice()
      let live = 0
      for (let k = 0; k < lanes; k++) if (active[k]) live++
      // Steer towards ~42% of lanes busy: fork more when sparse, merge more when crowded.
      const target = Math.max(2, Math.round(lanes * 0.42))
      const pFork = live < target ? 0.09 : 0.025
      const pMerge = live > target ? 0.09 : 0.025
      const busy = new Uint8Array(lanes)

      for (let k = 0; k < lanes; k++) {
        if (!active[k]) continue
        const nb = k + (rnd() < 0.5 ? -1 : 1)
        if (
          nb >= 0 &&
          nb < lanes &&
          active[nb] &&
          !busy[k] &&
          !busy[nb] &&
          live > 2 &&
          rnd() < pMerge
        ) {
          segs.push({ curved: true, x0: x, y0: laneY(k), x1: x + DX, y1: laneY(nb) })
          nodes.push({
            x: x + DX,
            y: laneY(nb),
            sha: sha(),
            msg: `Merge branch '${pick(BRANCHES)}'`,
            merge: true,
          })
          next[k] = 0
          busy[k] = 1
          busy[nb] = 1
          live--
          continue
        }
        segs.push({ curved: false, x0: x, y0: laneY(k), x1: x + DX, y1: laneY(k) })
        if (rnd() < 0.3) nodes.push({ x, y: laneY(k), sha: sha(), msg: pick(MSGS) })
        const fork = k + (rnd() < 0.5 ? -1 : 1)
        if (fork >= 0 && fork < lanes && !active[fork] && !next[fork] && !busy[k] && rnd() < pFork) {
          segs.push({ curved: true, x0: x, y0: laneY(k), x1: x + DX, y1: laneY(fork) })
          next[fork] = 1
          busy[fork] = 1
          live++
        }
      }
      if (live === 0) next[Math.floor(rnd() * lanes)] = 1
      active = next
      cols.push({ x, segs, nodes })
    }

    const reset = () => {
      const dpr = window.devicePixelRatio || 1
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lanes = Math.ceil(H / LANE) + 1
      active = []
      for (let k = 0; k < lanes; k++) active.push(rnd() < 0.42 ? 1 : 0)
      cols = []
      nextCol = Math.floor(offset / DX) - 2
      while (nextCol * DX < offset + W + DX * 2) genCol()
    }

    const addVisit = (screenX: number, lane: number, msg: string) => {
      const k = Math.max(0, Math.min(lanes - 1, lane))
      visits.push({ x: screenX + offset, y: laneY(k), t0: performance.now(), sha: sha(), msg })
      if (visits.length > MAX_VISITS) visits.shift()
    }

    // Clicks commit to the graph wherever they land.
    const onPointerDown = (event: PointerEvent) =>
      addVisit(event.clientX, Math.round((event.clientY - LANE / 2) / LANE), 'feat: visitor was here')

    // Every navigation becomes a commit near the right edge, then scrolls into history.
    setGraphCommitSink((msg) => {
      const live: number[] = []
      for (let k = 1; k < lanes - 1; k++) if (active[k]) live.push(k)
      const k = live.length ? live[Math.floor(Math.random() * live.length)] : Math.floor(lanes / 2)
      addVisit(W - Math.max(48, (W - 980) / 4), k, msg)
    })

    const label = (sx: number, y: number, hash: string, msg: string, alpha: number) => {
      ctx.font = labelFont
      const gap = ctx.measureText(`${hash}  `).width
      const w = gap + ctx.measureText(msg).width
      let lx = sx + 10
      if (lx + w + 8 > W) lx = sx - 10 - w
      const by = y - 9
      ctx.fillStyle = `rgba(5, 6, 5, ${(0.92 * alpha).toFixed(3)})`
      ctx.fillRect(lx - 5, by - 11, w + 10, 16)
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha.toFixed(3)})`
      ctx.fillText(hash, lx, by)
      ctx.fillStyle = `rgba(201, 201, 195, ${alpha.toFixed(3)})`
      ctx.fillText(msg, lx + gap, by)
    }

    let raf = 0
    let last = 0
    let prevT = 0
    // Eases towards 1 while the pointer is on the page, so the glow fades in and out.
    let presence = 0

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < FRAME_MS) return
      const dt = prevT ? Math.min(0.1, (t - prevT) / 1000) : 0
      prevT = t
      last = t

      offset += dt * SPEED
      while (nextCol * DX < offset + W + DX * 2) genCol()
      while (cols.length && cols[0].x + DX * 3 < offset) cols.shift()
      for (let v = visits.length - 1; v >= 0; v--) if (visits[v].x - offset < -300) visits.splice(v, 1)
      presence += ((pointer.seen ? 1 : 0) - presence) * 0.08
      const mx = pointer.rx
      const my = pointer.ry

      const lines = new Path2D()
      const dots = new Path2D()
      const mergeDots = new Path2D()
      let best: { sx: number; y: number; sha: string; msg: string } | null = null
      let bestD = LABEL_RADIUS * LABEL_RADIUS

      for (const col of cols) {
        for (const s of col.segs) {
          const x0 = s.x0 - offset
          const x1 = s.x1 - offset
          lines.moveTo(x0, s.y0)
          if (s.curved) lines.bezierCurveTo(x0 + DX * 0.55, s.y0, x1 - DX * 0.55, s.y1, x1, s.y1)
          else lines.lineTo(x1, s.y1)
        }
        for (const node of col.nodes) {
          const sx = Math.round(node.x - offset) + 0.5
          if (sx < -10 || sx > W + 10) continue
          if (node.merge) mergeDots.rect(sx - 3, node.y - 3, 6, 6)
          else dots.rect(sx - 3, node.y - 3, 6, 6)
          if (presence > 0.05) {
            const dx = sx - mx
            const dy = node.y - my
            const d2 = dx * dx + dy * dy
            if (d2 < bestD) {
              bestD = d2
              best = { sx, y: node.y, sha: node.sha, msg: node.msg }
            }
          }
        }
      }

      ctx.clearRect(0, 0, W, H)
      ctx.lineWidth = 1
      const nodeAlpha = (BASE_ALPHA * 1.8).toFixed(3)
      ctx.strokeStyle = `rgba(74, 222, 128, ${BASE_ALPHA})`
      ctx.stroke(lines)
      ctx.fillStyle = '#060806'
      ctx.fill(dots)
      ctx.strokeStyle = `rgba(74, 222, 128, ${nodeAlpha})`
      ctx.stroke(dots)
      ctx.fillStyle = `rgba(74, 222, 128, ${nodeAlpha})`
      ctx.fill(mergeDots)
      if (presence > 0.02) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_RADIUS)
        glow.addColorStop(0, `rgba(134, 239, 172, ${(0.6 * presence).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(134, 239, 172, 0)')
        ctx.strokeStyle = glow
        ctx.stroke(lines)
        ctx.stroke(dots)
        ctx.fillStyle = glow
        ctx.fill(mergeDots)
      }

      // Session commits: navigations and clicks.
      const now = performance.now()
      for (const visit of visits) {
        const sx = Math.round(visit.x - offset) + 0.5
        const age = (now - visit.t0) / 1000
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(sx - 4, visit.y - 4, 8, 8)
        if (age < 1.2) {
          const size = 8 + age * 70
          ctx.strokeStyle = `rgba(134, 239, 172, ${(0.8 * (1 - age / 1.2)).toFixed(3)})`
          ctx.strokeRect(sx - size / 2, visit.y - size / 2, size, size)
        }
        if (age < LABEL_TTL) label(sx, visit.y, visit.sha, visit.msg, Math.min(1, (LABEL_TTL - age) / 0.8))
        if (presence > 0.05) {
          const dx = sx - mx
          const dy = visit.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < bestD) {
            bestD = d2
            best = { sx, y: visit.y, sha: visit.sha, msg: visit.msg }
          }
        }
      }

      if (best) {
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(best.sx - 3.5, best.y - 3.5, 7, 7)
        label(best.sx, best.y, best.sha, best.msg, Math.min(1, presence))
      }
    }

    window.addEventListener('resize', reset)
    window.addEventListener('pointerdown', onPointerDown)
    reset()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', reset)
      window.removeEventListener('pointerdown', onPointerDown)
      setGraphCommitSink(null)
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
