/**
 * Bridge between the terminal and the git graph painted behind it.
 *
 * `GitGraphBackground` registers a sink while it is mounted; the shell calls
 * `commitToGraph('cd ~/stack')` on every navigation and the graph lands a highlighted
 * commit at its right edge. A module singleton, like `pointer.ts`, because this is a
 * fire-and-forget canvas effect with no business going through React state.
 *
 * With no background mounted (reduced motion, or the bare root 404) it is a no-op.
 */
type CommitSink = (message: string) => void

let sink: CommitSink | null = null

export function setGraphCommitSink(next: CommitSink | null) {
  sink = next
}

export function commitToGraph(message: string) {
  sink?.(message)
}
