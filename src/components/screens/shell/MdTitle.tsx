import type { ReactNode } from 'react'

/** A markdown `# Title`, printed the way `cat` shows it: hash and all. */
export function MdTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="term-h1">
      <span className="term-h1-hash" aria-hidden="true">
        #&nbsp;
      </span>
      {children}
    </h1>
  )
}
