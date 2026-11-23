"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import { reasoningCandidates } from "@/lib/sudoku-reasoning"
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
  const [eliminated, setEliminated] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [started, setStarted] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const exercise = lessons[index]
  const modules = lessons.filter((lesson) => lesson.kind === "preview")

  function start() {
    if (started) return
    setStarted(true)
    trackTraining("sudoku_training_start")
  }

  function choose(digit: number) {
    if (!exercise || solved) return
    start()
    const answer = eliminated ? exercise.followUp : exercise.answer
    if (digit !== answer) {
      setFeedback(`${digit} does not satisfy the exercise. Try again.`)
      return
    }
    if (!eliminated && exercise.followUp !== undefined) {
      setEliminated(true)
      setFeedback(`Correct. Candidate ${digit} has been removed. Fill in the remaining digit.`)
      return
    }
    setSolved(true)
    setFeedback("Correct.")
    trackTraining("sudoku_training_solved", { technique: exercise.topic.id, exercise: index + 1, hint_used: Number(hint) })
  }

  function advance(next: number, focusHeading = true) {
    if (lessons[next]) onTopicChange?.(lessons[next].topic.id)
    if (next === lessons.length) trackTraining("sudoku_training_list_end", { exercise_count: lessons.length })
    if (next === 0) setStarted(false)
    setIndex(next)
    setSolved(false)
    setEliminated(false)
    setHint(false)
    setFeedback("")
    if (focusHeading) heading.current?.focus()
  }

  const cells = exercise?.board.flatMap((row) => [...row].map(Number)) ?? []
  const placed = exercise && solved && (exercise.action === "place" || exercise.followUp !== undefined)
  const originalCells = [...cells]
  if (placed) cells[exercise.target] = exercise.followUp ?? exercise.answer
  const candidates = exercise?.action === "eliminate" ? reasoningCandidates(cells) : undefined
  if (exercise && candidates && (eliminated || solved)) {
    candidates[exercise.target] = candidates[exercise.target].filter((digit) => digit !== exercise.answer)
  }
  const choices = exercise?.choices && !eliminated ? exercise.choices : Array.from({ length: 9 }, (_, index) => index + 1)
  const exerciseLabels = {
    preview: "Free sample",
    guided: "Guided practice",
    variation: "Variation",
    distinction: "Compare two choices",
    independent: "Independent check",
  }

  return (
    <section id="exercises" aria-labelledby="exercise-heading" className="scroll-mt-6 rounded-xl border bg-slate-50 p-3 sm:p-6">
      <div className="mb-5">
        <label htmlFor="training-module" className="mb-1 block text-sm font-semibold text-slate-900">Technique module</label>
        <select
          id="training-module"
          className="w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2"
          value={exercise?.topic.id ?? ""}
          onChange={(event) => advance(lessons.findIndex((lesson) => lesson.topic.id === event.target.value), false)}
        >
          {!exercise && <option value="" disabled>Choose a module</option>}
          {modules.map(({ topic }) => <option key={topic.id} value={topic.id}>{topic.level} · {topic.name}</option>)}
        </select>
      </div>
      <h2 id="exercise-heading" ref={heading} tabIndex={-1} className="mb-4 text-xl font-semibold text-slate-950">
        {exercise ? `${index + 1} of ${lessons.length} · ${exercise.topic.name}` : "Training complete"}
      </h2>
      {exercise ? (
        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[21rem]">
            <SudokuPracticeBoard
              cells={cells}
              target={placed ? undefined : exercise.target}
              highlighted={hint || eliminated || solved ? exercise.highlight : []}
              originalCells={originalCells}
              candidates={candidates}
            />
            <div role="group" aria-label="Choose a number" className="mt-3 grid grid-cols-5 gap-1.5">
              {choices.map((digit) => (
                <Button key={digit} type="button" variant="outline" className="h-11 px-0 aria-disabled:opacity-50" aria-disabled={solved} onClick={() => choose(digit)}>
                  {digit}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4 text-slate-700">
            <p className="text-sm font-medium text-slate-600">{exerciseLabels[exercise.kind]}</p>
            <p>{eliminated ? "Which digit now belongs in the marked square?" : exercise.prompt}</p>
            {!["independent", "distinction"].includes(exercise.kind) && !solved && !eliminated && (
              <Button type="button" variant="outline" className="h-11" aria-expanded={hint} aria-controls="training-hint" onClick={() => { start(); setHint(true) }}>
                Show a hint
              </Button>
            )}
            <p id="training-hint" aria-live="polite">{hint && !solved && !eliminated ? exercise.hint : ""}</p>
            <div role="status">
              <p>{feedback}</p>
              {(solved || eliminated) && <p className="mt-2">{exercise.explanation}</p>}
              {solved && exercise.followUp !== undefined && <p className="mt-2">Only {exercise.followUp} remains in the marked square, so place it there.</p>}
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
          <p>You reached the end of the exercise list. Pick a module above to practice it again.</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="h-11"><Link href="/play">Play a full puzzle</Link></Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => advance(0)}>Practice again</Button>
          </div>
        </div>
      )}
    </section>
  )
}
