"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import { findDeductions, hiddenSingleAlternatives, hiddenSingleArea, reasoningCandidates, seesReasoningSquare, shareReasoningArea, type ReasoningExercise, type Deduction } from "@/lib/sudoku-reasoning"

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
  const [rejectedDigit, setRejectedDigit] = useState<number | null>(null)
  const [correction, setCorrection] = useState<{ squares: number[]; digit: number } | null>(null)
  const [retry, setRetry] = useState(0)
  const marks = reasoningCandidates(board)
  const guidedSingle = technique === "hidden" && kind === "guided"
    ? hiddenSingleArea(marks, exercise) : null
  const evidenceCount = technique === "wing" ? 3 : 2
  const isElimination = technique !== "hidden"
  const chooseEvidence = isElimination && evidence.length < evidenceCount && selection === null
  const displayBoard = [...board]
  const displayedMarks = marks.map((values, index) => index === move?.target && isElimination ? values.filter((value) => value !== move.digit) : values)
  const visibleMarks = displayedMarks.map((values, index) => {
    if (selection === index || counterexample === index || (isElimination && marks[index].length === 2)) return values
    if (correction?.squares.includes(index)) return [correction.digit]
    return guidedSingle?.cells.includes(index) ? values.filter((value) => value === digit) : []
  })
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
    setCorrection(null)
    setRejectedDigit(null)
    if (move) {
      if (displayedMarks[move.target][0] === value) {
        finish(`Correct. After removing ${move.digit}, only ${value} remains at ${position(move.target)}.`)
      } else {
        setAttempted(true)
        setRejectedDigit(value)
        setFeedback(`${value} was the candidate you removed. Look at the small number still visible in the selected square, then choose it below.`)
      }
      return
    }
    if (selection === null) return
    if (guidedSingle && value !== digit) {
      setAttempted(true)
      setRejectedDigit(value)
      setFeedback(`This step is about ${digit}. Look for its only possible square in ${guidedSingle.label}.`)
      return
    }
    const matchingEvidence = findDeductions(marks, technique).filter((item) =>
      item.evidence.every((square) => evidence.includes(square)))
    const deduction = matchingEvidence.find((item) => item.target === selection && item.digit === value)
    if (!deduction) {
      setAttempted(true)
      setRejectedDigit(value)
      if (technique === "hidden") {
        const alternatives = [...new Set(hiddenSingleAlternatives(marks, selection, value))]
        setCorrection({ squares: alternatives, digit: value })
        setFeedback(alternatives.length === 0
          ? "This square already has just one candidate. For this exercise, look for a square with multiple candidates where one of them has no other place in a row, column or box."
          : `${value} also fits at ${alternatives.map(position).join(", ")}. The highlighted squares show other places for it in the same row, column and box. Try a different digit or square.`)
      } else if (matchingEvidence.some((item) => item.target === selection)) {
        setFeedback(`The evidence supports a deletion in this square. Check which candidate is shared by ${technique === "pair" ? "the two squares in the pair" : "the two wings"}.`)
      } else if (technique === "pair") {
        setFeedback(shareReasoningArea(evidence) && marks[evidence[0]].join() === marks[evidence[1]].join()
          ? "Your pair is valid. Choose a target in the row, column or box shared by both pair squares."
          : "Recheck your two evidence squares. They must share a row, column or box and show the same two small numbers. Tap a selected square again to change it.")
      } else {
        const wings = matchingEvidence[0]?.evidence.slice(1)
        setFeedback(wings?.some((square) => !seesReasoningSquare(square, selection))
          ? "Look for a target that sees both wings. For each wing, check whether it shares a row, column or box with the target."
          : "Recheck the three evidence squares. Find a pivot that sees both wings and shares a different candidate with each. The wings must share a third candidate.")
      }
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
    setRejectedDigit(null)
    setCorrection(null)
    setFeedback("")
    if (technique === "hidden") setSelection(square)
    else if (evidence.includes(square)) {
      setEvidence(evidence.filter((item) => item !== square))
      setSelection(null)
    } else if (isElimination && marks[square].length !== 2) {
      setFeedback("Choose a square with exactly two small numbers.")
    } else if (chooseEvidence) {
      setEvidence([...evidence, square])
    }
    else setSelection(square)
  }

  function reset() {
    setEvidence([])
    setSelection(null)
    setMove(null)
    setHint(0)
    setCorrection(null)
    setRejectedDigit(null)
    setDone(false)
    setAttempted(true)
    setFeedback("")
    setRetry((value) => value + 1)
  }

  const hasBoardAction = kind !== "distinction" && !done && !move
  const instruction = move
    ? `Choose the remaining number for ${position(move.target)}.`
    : guidedSingle
      ? selection === target
        ? `Tap ${digit} below to place it in this square.`
        : `In ${guidedSingle.label}, tap the square with the small amber ${digit}.`
    : selection !== null && (!isElimination || marks[selection].length === 2)
      ? `${isElimination ? "Choose the number to remove from" : "Choose the number to place in"} ${position(selection)}.`
      : !isElimination
          ? "Tap an empty square where a digit has no other possible position in its row, column, or box."
          : chooseEvidence
            ? `Tap ${evidenceCount} squares that support your move (${evidence.length} selected).`
            : "Tap a different square with two small numbers. Then choose which number to remove."
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
      {kind !== "distinction" && !done && <p role="status" className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 font-medium text-blue-950">{instruction}</p>}
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <div className="space-y-2">
          <SudokuPracticeBoard cells={displayBoard} originalCells={board} candidates={visibleMarks}
            selected={[...evidence, ...(selection === null ? [] : [selection])]}
            target={counterexample} highlighted={guidedSingle?.cells}
            clues={correction?.squares ?? (kind === "distinction" ? exercise.evidence : hint >= 2 ? [...exercise.evidence, target] : guidedSingle && !done ? [target] : [])}
            rejected={rejectedDigit === null ? null : selection}
            onSelect={hasBoardAction ? selectSquare : undefined} />
        </div>
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
                  setFeedback(technique === "pair"
                    ? "Find the row, column or box that contains both pair squares. Is the target inside that same area?"
                    : technique === "wing"
                      ? "Compare the target with each wing. Does it share a row, column or box with both wings?"
                      : "Look for another square that could hold this digit in the target’s row, then check its column and box.")
                }}>Yes, this move is justified</Button>
                <Button type="button" variant="outline" onClick={() => finish(isElimination
                  ? "Correct. This target is outside the scope of the deletion and still needs the candidate."
                  : "Correct. This square is not the only possible location for the digit in any of its units.")}>No, there’s insufficient evidence</Button>
              </div>}
            </>
          ) : !done && (
            <>
              {selection !== null && (!guidedSingle || selection === target) && (move || !isElimination || marks[selection].length === 2) && (
                <div role="group" aria-label={move || !isElimination ? "Digit to place" : "Candidate to remove"} className="flex flex-wrap gap-2">
                  {(guidedSingle ? [digit] : move ? marks[move.target] : marks[selection]).map((value) =>
                    <Button type="button" key={value} variant={guidedSingle ? "default" : "outline"}
                      className={value === rejectedDigit ? "border-red-700 bg-red-100 text-red-950" : undefined}
                      onClick={() => checkNumber(value)}>
                      {guidedSingle ? `Place ${value}` : value}{value === rejectedDigit && <><span aria-hidden="true"> ×</span><span className="sr-only">, try another</span></>}
                    </Button>)}
                </div>
              )}
              {!move && (kind !== "independent" || attempted) && hint < 3 && <Button type="button" variant="ghost" onClick={() => { setCorrection(null); setHint((value) => value + 1) }}>{hint ? "More help" : "Show a hint"}</Button>}
              <p aria-live="polite">{!move && hint > 0 && (hint === 1 ? module.rule : hint === 2 ? "Look at the highlighted squares." : `Try ${position(target)} and digit ${digit}.`)}</p>
            </>
          )}
          <div role="status" className="space-y-2">
            {feedback && <p className="rounded-md border bg-white p-3">{feedback}</p>}
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
