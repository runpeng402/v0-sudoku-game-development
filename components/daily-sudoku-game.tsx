"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Eraser, Lightbulb, Pencil, Printer, RotateCcw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberPad, SudokuBoardGrid, findConflicts } from "@/components/sudoku-board-grid"
import type { DailyPuzzle } from "@/lib/daily-sudoku"
import type { SudokuDifficulty } from "@/lib/sudoku-generator"

interface Progress {
  values: number[]
  notes: number[][]
  seconds: number
  hints: number
  done: boolean
}

const labels: Record<SudokuDifficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" }
const storageKey = (puzzle: DailyPuzzle) => `sudokustudio:daily:${puzzle.date}:${puzzle.difficulty}`
const digitsOf = (value: string) => [...value].map(Number)
const freshProgress = (puzzle: DailyPuzzle): Progress => ({
  values: digitsOf(puzzle.puzzle),
  notes: Array.from({ length: 81 }, () => []),
  seconds: 0,
  hints: 0,
  done: false,
})

function loadProgress(puzzle: DailyPuzzle): Progress {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey(puzzle)) ?? "null") as Progress | null
    if (saved && Array.isArray(saved.values) && saved.values.length === 81) return saved
  } catch {
    // Corrupt or blocked storage falls back to a fresh board.
  }
  return freshProgress(puzzle)
}

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

export function DailySudokuGame({ puzzles }: { puzzles: DailyPuzzle[] }) {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("medium")
  const puzzle = puzzles.find((item) => item.difficulty === difficulty) ?? puzzles[0]
  const givens = useMemo(() => digitsOf(puzzle.puzzle), [puzzle])
  const solution = useMemo(() => digitsOf(puzzle.solution), [puzzle])

  const [progress, setProgress] = useState<Record<string, Progress>>(() =>
    Object.fromEntries(puzzles.map((item) => [item.difficulty, freshProgress(item)])),
  )
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [notesMode, setNotesMode] = useState(false)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle")

  const current = progress[difficulty]

  useEffect(() => {
    setProgress(Object.fromEntries(puzzles.map((item) => [item.difficulty, loadProgress(item)])))
    setLoaded(true)
  }, [puzzles])

  useEffect(() => {
    if (!loaded) return
    try {
      for (const item of puzzles) window.localStorage.setItem(storageKey(item), JSON.stringify(progress[item.difficulty]))
    } catch {
      // Private browsing can block storage; the game still works for this visit.
    }
  }, [loaded, progress, puzzles])

  useEffect(() => {
    if (!loaded || current.done) return
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return
      setProgress((all) => ({ ...all, [difficulty]: { ...all[difficulty], seconds: all[difficulty].seconds + 1 } }))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [loaded, current.done, difficulty])

  const update = useCallback(
    (change: (state: Progress) => Progress) => {
      setProgress((all) => {
        const next = change(all[difficulty])
        const done = next.values.every((value, index) => value === solution[index])
        return { ...all, [difficulty]: { ...next, done } }
      })
    },
    [difficulty, solution],
  )

  const conflicts = useMemo(() => findConflicts(current.values), [current.values])

  const input = (index: number, value: number) => {
    if (current.done || givens[index]) return
    setChecked(new Set())
    update((state) => {
      if (notesMode && value) {
        if (state.values[index]) return state
        const notes = state.notes.map((cell, position) =>
          position === index ? (cell.includes(value) ? cell.filter((note) => note !== value) : [...cell, value].sort()) : cell,
        )
        return { ...state, notes }
      }
      const values = state.values.map((old, position) => (position === index ? (old === value ? 0 : value) : old))
      const notes = state.notes.map((cell, position) => (position === index ? [] : cell))
      return { ...state, values, notes }
    })
  }

  const hint = () => {
    if (current.done) return
    const wrongOrEmpty = (index: number) => !givens[index] && current.values[index] !== solution[index]
    const target = selected !== null && wrongOrEmpty(selected) ? selected : current.values.findIndex((_, index) => wrongOrEmpty(index))
    if (target < 0) return
    setSelected(target)
    setChecked(new Set())
    update((state) => ({
      ...state,
      hints: state.hints + 1,
      values: state.values.map((old, index) => (index === target ? solution[target] : old)),
      notes: state.notes.map((cell, index) => (index === target ? [] : cell)),
    }))
  }

  const check = () => {
    setChecked(new Set(current.values.flatMap((value, index) => (value && !givens[index] && value !== solution[index] ? [index] : []))))
  }

  const restart = () => {
    setChecked(new Set())
    setSelected(null)
    setProgress((all) => ({ ...all, [difficulty]: freshProgress(puzzle) }))
  }

  const share = async () => {
    const text = `I solved the ${labels[difficulty]} Daily Sudoku for ${puzzle.date} in ${formatTime(current.seconds)}${
      current.hints ? ` with ${current.hints} hint${current.hints === 1 ? "" : "s"}` : " with no hints"
    }. https://www.sudokustudio.app/daily-sudoku`
    try {
      await navigator.clipboard.writeText(text)
      setShareState("copied")
    } catch {
      setShareState("failed")
    }
  }

  const filled = current.values.filter(Boolean).length
  const remaining = 81 - filled

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-start">
      <div className="space-y-4">
        <div role="tablist" aria-label="Difficulty" className="mx-auto flex max-w-[460px] gap-2 print:hidden">
          {puzzles.map((item) => {
            const state = progress[item.difficulty]
            return (
              <button
                key={item.difficulty}
                type="button"
                role="tab"
                aria-selected={item.difficulty === difficulty}
                onClick={() => {
                  setDifficulty(item.difficulty)
                  setSelected(null)
                  setChecked(new Set())
                  setShareState("idle")
                }}
                className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 aria-selected:border-blue-700 aria-selected:bg-blue-700 aria-selected:text-white"
              >
                {labels[item.difficulty]}
                {state.done ? " ✓" : ""}
              </button>
            )
          })}
        </div>

        <div className="mx-auto flex max-w-[460px] items-center justify-between text-sm text-slate-600">
          <span>
            {labels[difficulty]} · {remaining} squares left
          </span>
          <span aria-label="Time" className="font-mono text-base text-slate-900 print:hidden">
            {formatTime(current.seconds)}
          </span>
        </div>

        <SudokuBoardGrid
          label={`Daily Sudoku, ${labels[difficulty]}`}
          values={current.values}
          notes={current.notes}
          selected={selected}
          onSelect={setSelected}
          onInput={input}
          tone={(index) =>
            givens[index] ? "given" : checked.has(index) || conflicts.has(index) ? "error" : current.done ? "solved" : "user"
          }
        />

        <div className="print:hidden">
          <NumberPad onPick={(value) => selected !== null && input(selected, value)} disabled={selected === null || current.done} />
        </div>

        <div className="mx-auto flex max-w-[460px] flex-wrap gap-2 print:hidden">
          <Button variant={notesMode ? "default" : "outline"} size="sm" aria-pressed={notesMode} onClick={() => setNotesMode((on) => !on)}>
            <Pencil className="mr-1 h-4 w-4" />
            Notes {notesMode ? "on" : "off"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => selected !== null && input(selected, 0)} disabled={current.done}>
            <Eraser className="mr-1 h-4 w-4" />
            Erase
          </Button>
          <Button variant="outline" size="sm" onClick={check} disabled={current.done}>
            <Check className="mr-1 h-4 w-4" />
            Check
          </Button>
          <Button variant="outline" size="sm" onClick={hint} disabled={current.done}>
            <Lightbulb className="mr-1 h-4 w-4" />
            Hint
          </Button>
          <Button variant="outline" size="sm" onClick={restart}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Restart
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="space-y-4 print:hidden" aria-live="polite">
        {current.done ? (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-5">
            <p className="text-lg font-semibold text-emerald-900">
              Solved in {formatTime(current.seconds)}
              {current.hints ? ` with ${current.hints} hint${current.hints === 1 ? "" : "s"}` : " with no hints"}.
            </p>
            <p className="mt-2 text-sm text-emerald-900">A new set of puzzles arrives at midnight UTC.</p>
            <Button className="mt-4" size="sm" onClick={share}>
              <Share2 className="mr-1 h-4 w-4" />
              {shareState === "copied" ? "Result copied" : "Copy result to share"}
            </Button>
            {shareState === "failed" && <p className="mt-2 text-sm text-red-700">Copying is blocked in this browser.</p>}
          </div>
        ) : checked.size ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {checked.size} square{checked.size === 1 ? " is" : "s are"} wrong, marked in red.
          </p>
        ) : current.values.length && filled === 81 ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            The grid is full but something is wrong. Press Check to find the mistakes.
          </p>
        ) : (
          <p className="rounded-lg border bg-white p-4 text-sm leading-6 text-slate-600">
            Select a square, then type a number or tap the pad. Turn on Notes to pencil in candidates. Your progress is
            saved in this browser.
          </p>
        )}
      </div>
    </div>
  )
}
