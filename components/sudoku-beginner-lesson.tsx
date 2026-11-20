"use client"

import { useState } from "react"
import Link from "next/link"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import { Button } from "@/components/ui/button"

const puzzle = [
  "530070000", "600195000", "098000060",
  "800060003", "400803001", "700020006",
  "060000280", "000419005", "000080079",
].map((row) => [...row].map(Number))

const steps = [
  {
    row: 4, col: 4, answer: 5,
    title: "Find the only candidate",
    hints: [
      "Look at row 5, column 5. Check its row, column and the center box.",
      "Together, those three areas already contain 1, 2, 3, 4, 6, 7, 8 and 9.",
      "Only 5 remains. Choose 5 to fill the marked square.",
    ],
  },
  {
    row: 6, col: 5, answer: 7,
    title: "Try the next move yourself",
    hints: [
      "Look at row 7, column 6. Check its row, column and the bottom middle box.",
      "Together, those three areas already contain 1, 2, 3, 4, 5, 6, 8 and 9.",
      "Only 7 remains. Choose 7 to fill the marked square.",
    ],
  },
]

function trackLesson(event: string, properties: Record<string, string | number> = {}) {
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void }
  analytics.gtag?.("event", event, { lesson_id: "only_candidate", ...properties })
}

export function SudokuBeginnerLesson() {
  const [stepIndex, setStepIndex] = useState(0)
  const [hintCount, setHintCount] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [started, setStarted] = useState(false)
  const complete = stepIndex === steps.length
  const step = steps[stepIndex]

  function start() {
    if (started) return
    setStarted(true)
    trackLesson("sudoku_lesson_start")
  }

  function chooseDigit(digit: number) {
    if (!step) return
    start()
    if (digit !== step.answer) {
      setFeedback(`${digit} already appears in the row, column or box. Try another number.`)
      return
    }

    const finalMove = stepIndex + 1 === steps.length
    trackLesson("sudoku_lesson_move", { step: stepIndex + 1, hints_used: hintCount })
    if (finalMove) {
      trackLesson("sudoku_lesson_complete", { final_move_hints: hintCount })
    }
    setFeedback(finalMove ? "Correct. You completed both moves." : "Correct. Now try the next marked square.")
    setHintCount(0)
    setStepIndex(stepIndex + 1)
  }

  function showHint() {
    if (!step || hintCount >= step.hints.length) return
    start()
    setHintCount(hintCount + 1)
    setFeedback("")
  }

  function restart() {
    setStepIndex(0)
    setHintCount(0)
    setFeedback("")
    setStarted(false)
  }

  return (
    <div className="not-prose my-6 rounded-lg border bg-slate-50 p-3 sm:p-6">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[21rem]">
          <SudokuPracticeBoard
            cells={puzzle.flat().map((given, index) => {
              const filled = steps.slice(0, stepIndex).find((move) => move.row * 9 + move.col === index)
              return given || filled?.answer || 0
            })}
            target={step && step.row * 9 + step.col}
            highlighted={step && hintCount > 0 ? puzzle.flat().flatMap((_, index) => {
              const row = Math.floor(index / 9)
              const col = index % 9
              const related = row === step.row || col === step.col ||
                (Math.floor(row / 3) === Math.floor(step.row / 3) && Math.floor(col / 3) === Math.floor(step.col / 3))
              return related ? [index] : []
            }) : []}
          />
          <div role="group" aria-label="Choose a number" className="mt-3 grid grid-cols-5 gap-1.5">
            {Array.from({ length: 9 }, (_, index) => index + 1).map((digit) => (
              <Button key={digit} type="button" variant="outline" className="h-11 px-0" aria-disabled={complete} onClick={() => chooseDigit(digit)}>
                {digit}
              </Button>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-3 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-950">{complete ? "Lesson complete" : `Move ${stepIndex + 1} of ${steps.length} · ${step.title}`}</p>
          {step && <p>Which number belongs in row {step.row + 1}, column {step.col + 1}? Choose a number below the board.</p>}
          <p role="status">{feedback}</p>
          {step && (
            <>
              <div aria-live="polite">
                {hintCount > 0 && <p>{step.hints[hintCount - 1]}</p>}
              </div>
              <Button type="button" variant="outline" className="h-11" disabled={hintCount === step.hints.length} onClick={showHint}>
                {hintCount === 0 ? "Show a hint" : hintCount === 1 ? "Explain the elimination" : hintCount === 2 ? "Reveal the answer" : "All hints shown"}
              </Button>
            </>
          )}
          {complete && (
            <div className="space-y-3">
              <p>Try a full puzzle or practice three solving techniques with guided exercises.</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="h-11"><Link href="/play">Play a full puzzle</Link></Button>
                <Button asChild className="h-11" variant="outline">
                  <Link href="/sudoku-practice" onClick={() => trackLesson("sudoku_training_open")}>
                    Practice Sudoku techniques
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {started && <Button type="button" variant="ghost" className="h-11" onClick={restart}>Restart lesson</Button>}
        </div>
      </div>
    </div>
  )
}
