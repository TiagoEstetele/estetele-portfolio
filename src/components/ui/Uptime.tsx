'use client'

import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Anchored at module evaluation rather than at mount, so a locale switch — which
 * remounts the shell — doesn't reset the session clock back to 00:00:00.
 */
const LOADED_AT = Date.now()

// Session uptime shown in the terminal's status bar.
export function Uptime() {
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    const tick = () => setSecs(Math.floor((Date.now() - LOADED_AT) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const value = `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`
  return <span suppressHydrationWarning>{value}</span>
}
