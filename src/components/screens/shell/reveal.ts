import type { CSSProperties } from 'react'

/**
 * Output that pops in at `at` seconds into the screen's session, after the command
 * that produced it has finished typing. `both` keeps it hidden through the delay.
 */
export function reveal(at: number, duration = 0.12): CSSProperties {
  return { animation: `appear ${duration}s ease-out ${at}s both` }
}
