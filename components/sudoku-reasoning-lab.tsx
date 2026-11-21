"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import { findDeductions, reasoningCandidates, type ReasoningExercise, type Deduction } from "@/lib/sudoku-reasoning"

const modules = {
  hidden: { level: "Beginner", title: "Hidden single", rule: "Look for a digit with only one possible square in a row, column or box." },
  pair: { level: "Intermediate", title: "Naked pair", rule: "Find two squares in one unit with the same two candidates. Both digits are reserved for those squares." },
  wing: { level: "Advanced", title: "XY-Wing", rule: "Find a pivot with {X, Y} that sees two wings with {X, Z} and {Y, Z}. Either pivot value forces one wing to be Z." },
}
const labels = { guided: "Guided", variation: "Variation", distinction: "Spot the error", independent: "Independent check" }
const position = (index: number) => `r${Math.floor(index / 9) + 1}c${index % 9 + 1}`

export function SudokuReasoningLab({ exercises }: { exercises: ReasoningExercise[] }) {
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState<Record<number, "independent" | "supported">>({})
  const exercise = exercises[index]
  const heading = useRef<HTMLHeadingElement>(null)

  return (
    <div className="space-y-5">
      <p role="status">{Object.keys(completed).length} of {exercises.length} completed · {Object.values(completed).filter((value) => value === "independent").length} without help</p>
      <label className="block space-y-1">
        <span className="block font-medium">Choose an exercise</span>
        <select className="max-w-full rounded-md border bg-white p-2" value={index} onChange={(event) => setIndex(Number(event.target.value))}>
          {exercises.map((item, i) => (
            <option key={i} value={i}>{i + 1}. {modules[item.technique].level} · {labels[item.kind]}{completed[i] ? " ✓" : ""}</option>
          ))}
        </select>
      </label>
      <Exercise key={index} exercise={exercise} number={index + 1} heading={heading} next={index + 1 < exercises.length ? () => {
        setIndex(index + 1)
        requestAnimationFrame(() => heading.current?.focus())
      } : undefined} onComplete={(supported) => setCompleted((results) => ({
        ...results, [index]: results[index] === "independent" || !supported ? "independent" : "supported",
      }))} />
    </div>
  )
}

function Exercise({ exercise, number, next, onComplete, heading }: {
  exercise: ReasoningExercise
  number: number
  next?: () => void
  onComplete: (supported: boolean) => void
  heading: { current: HTMLHeadingElement | null }
}) {
  const { board, technique, kind, target, digit, counterexample } = exercise
  const module = modules[technique]
  const [evidence, setEvidence] = useState<number[]>([])
  const [selection, setSelection] = useState<number | null>(null)
  const [move, setMove] = useState<Deduction | null>(null)
  const [hint, setHint] = useState(0)
  const [attempted, setAttempted] = useState(false)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [retry, setRetry] = useState(0)
  const marks = reasoningCandidates(board)
  const evidenceCount = technique === "wing" ? 3 : 2
  const isElimination = technique !== "hidden"
  const chooseEvidence = isElimination && evidence.length < evidenceCount && selection === null
  const displayBoard = [...board]
  const displayedMarks = marks.map((values, index) => index === move?.target && isElimination ? values.filter((value) => value !== move.digit) : values)
  if (done && move) displayBoard[move.target] = isElimination ? displayedMarks[move.target][0] : move.digit

  useEffect(() => {
    if (retry > 0) heading.current?.focus()
  }, [retry, heading])

  function finish(message: string) {
    setFeedback(message)
    setDone(true)
    onComplete(hint > 0 || attempted || kind === "guided")
  }

  function checkNumber(value: number) {
    if (move) {
      if (displayedMarks[move.target][0] === value) {
        finish(`Correct. After removing ${move.digit}, only ${value} remains at ${position(move.target)}.`)
      } else {
        setAttempted(true)
        setFeedback("Check which candidate remains in the selected square after the deletion.")
      }
      return
    }
    const deduction = findDeductions(marks, technique).find((item) =>
      item.target === selection && item.digit === value &&
      item.evidence.every((square) => evidence.includes(square)),
    )
    if (!deduction) {
      setAttempted(true)
      setFeedback(isElimination ? "This selection does not justify that deletion. Check the relationship between the evidence squares and the target." : "Check whether this digit has only one possible position in the selected square’s row, column or box.")
      return
    }
    setMove(deduction)
    if (isElimination) {
      setFeedback(`Correct. Remove ${value} from ${position(deduction.target)}. Which number can you now place there?`)
    } else {
      finish(`Correct. ${value} has only one possible position in at least one unit containing ${position(deduction.target)}.`)
    }
  }

  function selectSquare(square: number) {
    if (technique === "hidden") setSelection(square)
    else if (evidence.includes(square)) {
      setEvidence(evidence.filter((item) => item !== square))
      setSelection(null)
    } else if (chooseEvidence) setEvidence([...evidence, square])
    else setSelection(square)
  }

  function reset() {
    setEvidence([])
    setSelection(null)
    setMove(null)
    setHint(0)
    setDone(false)
    setAttempted(true)
    setFeedback("")
    setRetry((value) => value + 1)
  }

  const hasBoardAction = kind !== "distinction" && !done && !move
  const explanation = technique === "wing"
    ? "The pivot forces one wing to hold the shared digit. The target sees both wings, so it cannot hold that digit."
    : technique === "pair"
      ? "The pair must use both of its digits in their shared unit. Other squares in that unit cannot use either digit."
      : module.rule

  return (
    <section className="space-y-4 rounded-xl border bg-slate-50 p-3 sm:p-6">
      <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold">
        {number}. {labels[kind]}{kind === "independent" && !done ? "" : ` · ${module.title}`}
      </h2>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <SudokuPracticeBoard cells={displayBoard} candidates={displayedMarks}
          selected={[...evidence, ...(selection === null ? [] : [selection])]}
          target={counterexample} highlighted={kind === "distinction" ? exercise.evidence : hint >= 2 ? [...exercise.evidence, target] : []}
          onSelect={hasBoardAction ? selectSquare : undefined} />
        <div className="space-y-3">
          {kind === "guided" && <p>{module.rule}</p>}
          {kind === "distinction" ? (
            <>
              <p>{isElimination
                ? `Can this ${module.title.toLowerCase()} at ${exercise.evidence.map(position).join(", ")} remove ${digit} from ${position(counterexample!)}?`
                : `Does a hidden single force ${digit} at ${position(counterexample!)}?`}</p>
              {!done && <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setAttempted(true)
                  setFeedback(isElimination ? "The highlighted square can still hold that digit. Check which evidence squares it can see." : "This placement is not forced by a hidden single here. Look for another possible square in each unit.")
                }}>Yes, this move is justified</Button>
                <Button type="button" variant="outline" onClick={() => finish(isElimination
                  ? "Correct. This target is outside the scope of the deletion and still needs the candidate."
                  : "Correct. This square is not the only possible location for the digit in any of its units.")}>No, there’s insufficient evidence</Button>
              </div>}
            </>
          ) : !done && (
            <>
              <p>{move ? "Place the remaining candidate." : !isElimination ? "Find a square whose value is forced by its position in a unit. Select the square and its digit."
                : chooseEvidence ? `Select ${evidenceCount} evidence squares (${evidence.length} selected).`
                  : "Select a different square with two candidates, then choose the candidate to remove."}</p>
              {selection !== null && (move || !isElimination || marks[selection].length === 2) && (
                <div role="group" aria-label={move || !isElimination ? "Digit to place" : "Candidate to remove"} className="flex flex-wrap gap-2">
                  {(move ? marks[move.target] : marks[selection]).map((value) =>
                    <Button type="button" key={value} variant="outline" onClick={() => checkNumber(value)}>{value}</Button>)}
                </div>
              )}
              {!move && kind !== "independent" && hint < 3 && <Button type="button" variant="ghost" onClick={() => setHint((value) => value + 1)}>{hint ? "More help" : "Show a hint"}</Button>}
              <p aria-live="polite">{!move && hint > 0 && (hint === 1 ? module.rule : hint === 2 ? "Look at the highlighted squares." : `Try ${position(target)} and digit ${digit}.`)}</p>
            </>
          )}
          <div role="status" className="space-y-2">
            <p>{feedback}</p>
            {done && <p>{explanation}</p>}
          </div>
          {done && <div className="flex flex-wrap gap-2">
            {next && <Button type="button" onClick={next}>Next exercise</Button>}
            <Button type="button" variant="outline" onClick={reset}>Practice again</Button>
          </div>}
        </div>
      </div>
    </section>
  )
}
