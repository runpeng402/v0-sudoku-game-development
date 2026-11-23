"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import type { TrainingExercise } from "@/lib/sudoku-training-types"

function trackTraining(event: string, properties: Record<string, string | number> = {}) {
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void }
  analytics.gtag?.("event", event, properties)
}

export function SudokuTraining({ lessons, resumeTopic, onTopicChange }: {
  lessons: TrainingExercise[]
  resumeTopic?: string
  onTopicChange?: (topic: TrainingExercise["topic"]["id"]) => void
}) {
  const [index, setIndex] = useState(() => Math.max(0, lessons.findIndex((lesson) => lesson.topic.id === resumeTopic)))
  const [hint, setHint] = useState(false)
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [started, setStarted] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const exercise = lessons[index]

  function start() {
    if (started) return
    setStarted(true)
    trackTraining("sudoku_training_start")
  }

  function choose(digit: number) {
    if (!exercise || solved) return
    start()
    if (digit !== exercise.answer) {
      setFeedback(`${digit} does not satisfy the exercise. Try again.`)
      return
    }
    setSolved(true)
    setFeedback("Correct.")
    trackTraining("sudoku_training_solved", { technique: exercise.topic.id, exercise: index + 1, hint_used: Number(hint) })
  }

  function advance(next: number) {
    if (lessons[next]) onTopicChange?.(lessons[next].topic.id)
    if (next === lessons.length) trackTraining("sudoku_training_complete", { exercise_count: lessons.length })
    if (next === 0) setStarted(false)
    setIndex(next)
    setSolved(false)
    setHint(false)
    setFeedback("")
    heading.current?.focus()
  }

  const cells = exercise?.board.flatMap((row) => [...row].map(Number)) ?? []
  if (exercise && solved && exercise.topic.id !== "locked") cells[exercise.target] = exercise.answer

  return (
    <section id="exercises" aria-labelledby="exercise-heading" className="scroll-mt-6 rounded-xl border bg-slate-50 p-3 sm:p-6">
      <h2 id="exercise-heading" ref={heading} tabIndex={-1} className="mb-4 text-xl font-semibold text-slate-950">
        {exercise ? `${index + 1} of ${lessons.length} · ${exercise.topic.name}` : "Training complete"}
      </h2>
      {exercise ? (
        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[21rem]">
            <SudokuPracticeBoard
              cells={cells}
              target={solved && exercise.topic.id !== "locked" ? undefined : exercise.target}
              highlighted={hint || solved ? exercise.highlight : []}
            />
            <div role="group" aria-label="Choose a number" className="mt-3 grid grid-cols-5 gap-1.5">
              {Array.from({ length: 9 }, (_, digit) => digit + 1).map((digit) => (
                <Button key={digit} type="button" variant="outline" className="h-11 px-0 aria-disabled:opacity-50" aria-disabled={solved} onClick={() => choose(digit)}>
                  {digit}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4 text-slate-700">
            {exercise.check && <p className="text-sm font-medium text-slate-600">Independent check · explanation after a correct answer</p>}
            <p>{exercise.prompt}</p>
            {!exercise.check && !solved && (
              <Button type="button" variant="outline" className="h-11" aria-expanded={hint} aria-controls="training-hint" onClick={() => { start(); setHint(true) }}>
                Show a hint
              </Button>
            )}
            <p id="training-hint" aria-live="polite">{hint && !solved ? exercise.hint : ""}</p>
            <div role="status">
              <p>{feedback}</p>
              {solved && <p className="mt-2">{exercise.explanation}</p>}
            </div>
            {solved && (
              <Button type="button" className="h-11" onClick={() => advance(index + 1)}>
                {index + 1 === lessons.length ? "Finish training" : "Next exercise"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-slate-700">
          <p>You completed {lessons.length} exercises on naked singles, hidden singles and locked candidates.</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="h-11"><Link href="/play">Play a full puzzle</Link></Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => advance(0)}>Practice again</Button>
          </div>
        </div>
      )}
    </section>
  )
}
