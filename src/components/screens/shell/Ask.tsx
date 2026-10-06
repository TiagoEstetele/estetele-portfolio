/** Inquirer-style question line: `? Where to next? (click an option or type the command)`. */
export function Ask({ question, hint }: { question: string; hint: string }) {
  return (
    <div className="term-ask">
      <span className="term-ask-mark" aria-hidden="true">
        ?
      </span>
      <span className="term-ask-question">{question}</span>
      <span className="term-ask-hint">{hint}</span>
    </div>
  )
}
