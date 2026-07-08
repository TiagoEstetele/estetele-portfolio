'use client'

import { createContext, useContext } from 'react'
import type { PageId } from '@/types'

/**
 * Lets any client component below the shell trigger a terminal navigation — the
 * typewriter runs `cd ~/<page>` at the prompt, the content fades out, and only then
 * does the router push.
 *
 * `null` means there is no shell above us (the root `not-found.tsx` renders a bare
 * window with no prompt to type into). Consumers fall back to a plain link.
 */
export const TerminalNavContext = createContext<((page: PageId) => void) | null>(null)

export function useTerminalNav() {
  return useContext(TerminalNavContext)
}
