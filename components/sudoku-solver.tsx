"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { NumberPad, SudokuBoardGrid, findConflicts } from "@/components/sudoku-board-grid"
import { solveSudoku } from "@/lib/sudoku-generator"

const examplePuzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
const empty = () => Array<number>(81).fill(0)

type Status =
  | { kind: "idle" | "solved" | "multiple" | "unsolvable" | "conflict" | "tooFew" | "importError" }
  | { kind: "revealed"; row: number; col: number; value: number }

const messages: Record<Exclude<Status["kind"], "revealed">, { text: string; tone: string }> = {
  idle: { text: "Enter the given numbers, then press Solve. Use the keyboard or the number pad.", tone: "text-slate-600" },
  solved: { text: "Solved. This puzzle has exactly one solution, shown in green.", tone: "text-emerald-700" },
  multiple: {
    text: "This puzzle has more than one solution, so it is not a proper Sudoku. One possible solution is shown in green.",
    tone: "text-amber-700",
  },
  unsolvable: { text: "No solution exists. Check that every given number was entered in the right square.", tone: "text-red-600" },
  conflict: { text: "Some numbers repeat in a row, column or box. Fix the squares marked in red first.", tone: "text-red-600" },
  tooFew: { text: "Enter at least 17 given numbers. No proper Sudoku has fewer clues.", tone: "text-amber-700" },
  importError: { text: "Paste exactly 81 characters: digits 1-9, and 0 or . for empty squares.", tone: "text-red-600" },
}

const toRows = (cells: number[]) => Array.from({ length: 9 }, (_, row) => cells.slice(row * 9, row * 9 + 9).map((value) => value || null))

export function SudokuSolver() {
  const [givens, setGivens] = useState<number[]>(empty)
  const [solution, setSolution] = useState<number[] | null>(null)
  const [revealed, setRevealed] = useState<number[]>(empty)
  const [selected, setSelected] = useState<number | null>(0)
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [importText, setImportText] = useState("")

  const conflicts = useMemo(() => findConflicts(givens), [givens])
  const display = solution ?? givens.map((value, index) => value || revealed[index])

  const resetResult = () => {
    setSolution(null)
    setRevealed(empty())
    setStatus({ kind: "idle" })
  }

  const setCell = (index: number, value: number) => {
    setGivens((current) => current.map((old, position) => (position === index ? value : old)))
    resetResult()
  }

  type Outcome = { kind: "solved" | "multiple"; solution: number[] } | { kind: "conflict" | "tooFew" | "unsolvable" }

  const solveCurrent = (): Outcome => {
    if (conflicts.size) return { kind: "conflict" }
    if (givens.filter(Boolean).length < 17) return { kind: "tooFew" }
    const result = solveSudoku(toRows(givens))
    if (result.status === "solved" || result.status === "multiple") {
      return { kind: result.status, solution: result.solution.flat() }
    }
    return { kind: result.status === "invalid" ? "conflict" : "unsolvable" }
  }

  const handleSolve = () => {
    const result = solveCurrent()
    setStatus({ kind: result.kind })
    setSolution("solution" in result ? result.solution : null)
  }

  const handleReveal = () => {
    const result = solveCurrent()
    if (!("solution" in result)) {
      setStatus({ kind: result.kind })
      return
    }
    const preferred = selected !== null && !givens[selected] && !revealed[selected] ? selected : -1
    const target = preferred >= 0 ? preferred : givens.findIndex((value, index) => !value && !revealed[index])
    if (target < 0) {
      setStatus({ kind: result.kind })
      setSolution(result.solution)
      return
    }
    setRevealed((current) => current.map((old, index) => (index === target ? result.solution[target] : old)))
    setSelected(target)
    setStatus({ kind: "revealed", row: Math.floor(target / 9) + 1, col: (target % 9) + 1, value: result.solution[target] })
  }

  const handleImport = () => {
    const compact = importText.replace(/\s/g, "")
    if (!/^[0-9.]{81}$/.test(compact)) {
      setStatus({ kind: "importError" })
      return
    }
    setGivens([...compact].map((char) => (char === "." ? 0 : Number(char))))
    setSolution(null)
    setRevealed(empty())
    setStatus({ kind: "idle" })
  }

  const loadExample = () => {
    setGivens([...examplePuzzle].map(Number))
    setImportText(examplePuzzle)
    resetResult()
  }

  const clearAll = () => {
    setGivens(empty())
    setImportText("")
    resetResult()
  }

  const message =
    status.kind === "revealed"
      ? { text: `Row ${status.row}, column ${status.col} is ${status.value}.`, tone: "text-emerald-700" }
      : messages[status.kind]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-start">
      <div className="space-y-4">
        <SudokuBoardGrid
          label="Sudoku solver grid"
          values={display}
          selected={selected}
          onSelect={setSelected}
          onInput={setCell}
          tone={(index) => (conflicts.has(index) ? "error" : givens[index] ? "given" : "solved")}
        />
        <NumberPad onPick={(value) => selected !== null && setCell(selected, value)} disabled={selected === null} />
        <div className="mx-auto flex max-w-[460px] flex-wrap gap-2">
          <Button onClick={handleSolve}>Solve</Button>
          <Button variant="outline" onClick={handleReveal}>
            Reveal one square
          </Button>
          <Button variant="outline" onClick={() => selected !== null && setCell(selected, 0)}>
            Erase
          </Button>
          <Button variant="outline" onClick={clearAll}>
            Clear grid
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <p role="status" aria-live="polite" className={`rounded-lg border bg-white p-4 text-sm leading-6 ${message.tone}`}>
          {message.text}
        </p>
        <div className="rounded-lg border bg-white p-4">
          <label htmlFor="sudoku-import" className="text-sm font-semibold text-slate-900">
            Paste a puzzle
          </label>
          <p className="mt-1 text-sm text-slate-600">81 characters, row by row. Use 0 or . for empty squares.</p>
          <textarea
            id="sudoku-import"
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            rows={3}
            spellCheck={false}
            className="mt-3 w-full rounded border border-slate-300 p-2 font-mono text-sm"
            placeholder="530070000600195000098000060..."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              Load pasted puzzle
            </Button>
            <Button variant="outline" size="sm" onClick={loadExample}>
              Load an example
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
