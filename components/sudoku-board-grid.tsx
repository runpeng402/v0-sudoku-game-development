"use client"

import { useEffect, useRef } from "react"

export type CellTone = "given" | "user" | "solved" | "error"

interface SudokuBoardGridProps {
  values: number[]
  selected: number | null
  onSelect: (index: number) => void
  onInput: (index: number, value: number) => void
  tone: (index: number) => CellTone
  notes?: number[][]
  label: string
}

const rowOf = (index: number) => Math.floor(index / 9)
const colOf = (index: number) => index % 9
const boxOf = (index: number) => Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3)

export function findConflicts(values: number[]): Set<number> {
  const conflicts = new Set<number>()
  for (let a = 0; a < 81; a++) {
    if (!values[a]) continue
    for (let b = a + 1; b < 81; b++) {
      if (values[a] !== values[b]) continue
      if (rowOf(a) === rowOf(b) || colOf(a) === colOf(b) || boxOf(a) === boxOf(b)) {
        conflicts.add(a)
        conflicts.add(b)
      }
    }
  }
  return conflicts
}

const toneClass: Record<CellTone, string> = {
  given: "font-bold text-slate-950",
  user: "font-semibold text-blue-700",
  solved: "font-semibold text-emerald-700",
  error: "font-semibold text-red-600",
}

export function SudokuBoardGrid({ values, selected, onSelect, onInput, tone, notes, label }: SudokuBoardGridProps) {
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([])
  const gridRef = useRef<HTMLDivElement>(null)

  // Safari does not focus buttons on click, so focus is moved explicitly to keep typing working.
  useEffect(() => {
    if (selected === null) return
    const cell = cellRefs.current[selected]
    if (cell && document.activeElement !== cell && gridRef.current?.contains(document.activeElement)) cell.focus()
  }, [selected])

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    if (selected === null || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target as HTMLElement | null
    if (target?.closest("input, textarea, select, [contenteditable=true]")) return
    const moves: Record<string, number> = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }
    if (event.key in moves) {
      if (!gridRef.current?.contains(document.activeElement)) return
      event.preventDefault()
      const next = selected + moves[event.key]
      const sameRow = event.key === "ArrowLeft" || event.key === "ArrowRight" ? rowOf(next) === rowOf(selected) : true
      if (next >= 0 && next < 81 && sameRow) onSelect(next)
      return
    }
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault()
      onInput(selected, Number(event.key))
    } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      event.preventDefault()
      onInput(selected, 0)
    }
  }

  // Digits keep working after the player clicks a toolbar button, so listen on the document instead of the grid.
  const keyHandler = useRef(handleKeyDown)
  keyHandler.current = handleKeyDown
  useEffect(() => {
    const listener = (event: globalThis.KeyboardEvent) => keyHandler.current(event)
    document.addEventListener("keydown", listener)
    return () => document.removeEventListener("keydown", listener)
  }, [])

  const selectedValue = selected === null ? 0 : values[selected]

  return (
    <div ref={gridRef} role="grid" aria-label={label} className="mx-auto grid w-full max-w-[460px] grid-cols-9 border-2 border-slate-900 bg-white select-none">
      {values.map((value, index) => {
        const row = rowOf(index)
        const col = colOf(index)
        const isSelected = index === selected
        const related =
          selected !== null && !isSelected && (rowOf(selected) === row || colOf(selected) === col || boxOf(selected) === boxOf(index))
        const sameDigit = selectedValue !== 0 && value === selectedValue && !isSelected
        const cellNotes = !value ? notes?.[index] ?? [] : []
        let background = "bg-white"
        if (related) background = "bg-slate-100"
        if (sameDigit) background = "bg-blue-100"
        if (isSelected) background = "bg-blue-200"
        return (
          <button
            key={index}
            type="button"
            role="gridcell"
            aria-selected={isSelected}
            aria-label={`Row ${row + 1}, column ${col + 1}: ${value || (cellNotes.length ? `notes ${cellNotes.join(" ")}` : "empty")}`}
            ref={(element) => {
              cellRefs.current[index] = element
            }}
            tabIndex={isSelected || (selected === null && index === 0) ? 0 : -1}
            onClick={(event) => {
              event.currentTarget.focus()
              onSelect(index)
            }}
            className={`relative aspect-square border-slate-300 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 sm:text-2xl ${background} ${
              col % 3 === 2 && col !== 8 ? "border-r-2 border-r-slate-900" : col !== 8 ? "border-r" : ""
            } ${row % 3 === 2 && row !== 8 ? "border-b-2 border-b-slate-900" : row !== 8 ? "border-b" : ""} ${value ? toneClass[tone(index)] : ""}`}
          >
            {value ? (
              value
            ) : cellNotes.length ? (
              <span aria-hidden="true" className="grid h-full w-full grid-cols-3 p-0.5 text-[9px] font-normal leading-none text-slate-500 sm:text-[11px]">
                {Array.from({ length: 9 }, (_, slot) => (
                  <span key={slot} className="flex items-center justify-center">
                    {cellNotes.includes(slot + 1) ? slot + 1 : ""}
                  </span>
                ))}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function NumberPad({ onPick, disabled }: { onPick: (value: number) => void; disabled?: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-[460px] grid-cols-9 gap-1">
      {Array.from({ length: 9 }, (_, index) => (
        <button
          key={index}
          type="button"
          disabled={disabled}
          onClick={() => onPick(index + 1)}
          className="aspect-square rounded border border-slate-300 bg-white text-lg font-semibold text-slate-900 hover:bg-blue-50 disabled:opacity-40 sm:text-xl"
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}
