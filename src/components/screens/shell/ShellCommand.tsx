import { SHELL_USER } from '@/lib/site'

/** Typing speed of every scripted command: 30ms a character. */
const MS_PER_CHAR = 30

interface ShellCommandProps {
  /** Working directory as the prompt shows it, e.g. `~/about` or `~`. */
  path: string
  command: string
  /** Seconds into the screen's session when the command starts typing. */
  at: number
  /** Typing time in seconds. Defaults to `MS_PER_CHAR` per character. */
  duration?: number
  /**
   * For a second command in the same session: keep the whole prompt line hidden until
   * this moment, so it shows up only once the previous output is on screen.
   */
  showAt?: number
}

/** `tiago@estetele:~/about$ cat about.md`, with the command typed in a step at a time. */
export function ShellCommand({ path, command, at, duration, showAt }: ShellCommandProps) {
  const steps = command.length
  const time = duration ?? (steps * MS_PER_CHAR) / 1000

  return (
    <div
      className="term-cmd"
      style={showAt === undefined ? undefined : { animation: `appear 0.01s linear ${showAt}s both` }}
    >
      <span>
        <b>{SHELL_USER}</b>:{path}$
      </span>
      <span
        className="term-cmd-typed"
        style={{ animation: `typeIn ${time}s steps(${steps}, end) ${at}s both` }}
      >
        {command}
      </span>
    </div>
  )
}
