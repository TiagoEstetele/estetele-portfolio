'use client'

import { useState } from 'react'
import { TerminalLink } from '@/components/terminal/TerminalLink'
import type { PageId } from '@/types'

/** A row that runs a terminal navigation (types `cd ~/<page>` first). */
interface PageItem {
  page: PageId
  label: string
  sub: string
}

/** A row that leaves the terminal: mail client, external profile. */
interface LinkItem {
  href: string
  external?: boolean
  label: string
  sub: string
  ariaLabel?: string
}

export type SelectMenuItem = PageItem | LinkItem

interface SelectMenuProps {
  items: readonly SelectMenuItem[]
  /** Width of the label column, e.g. `14ch`. */
  keyWidth: string
}

/**
 * An inquirer-style picker. Hovering or focusing a row moves the inverted selection
 * bar onto it, the way arrow keys would in a real CLI prompt; clicking runs it.
 */
export function SelectMenu({ items, keyWidth }: SelectMenuProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="term-menu" style={{ '--term-menu-key': keyWidth } as React.CSSProperties}>
      {items.map((item, index) => {
        const row = {
          className: 'term-menu-row',
          'data-selected': index === selected || undefined,
          onMouseEnter: () => setSelected(index),
          onFocus: () => setSelected(index),
        }
        const content = (
          <>
            <span className="term-menu-ptr" aria-hidden="true">
              &gt;
            </span>
            <span>{item.label}</span>
            <span className="term-menu-sub">{item.sub}</span>
          </>
        )

        return 'page' in item ? (
          <TerminalLink key={item.page} page={item.page} {...row}>
            {content}
          </TerminalLink>
        ) : (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.ariaLabel}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...row}
          >
            {content}
          </a>
        )
      })}
    </div>
  )
}
