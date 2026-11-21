interface SudokuPracticeBoardProps {
  cells: number[]
  target?: number
  highlighted?: number[]
  candidates?: number[][]
  originalCells?: number[]
  selected?: number[]
  onSelect?: (index: number) => void
}

export function SudokuPracticeBoard({ cells, target, highlighted = [], candidates, originalCells, selected = [], onSelect }: SudokuPracticeBoardProps) {
  return (
    <table className="w-full table-fixed border-collapse border-2 border-slate-800 text-center text-sm font-semibold text-slate-900">
      <caption className="sr-only">Sudoku practice board. Rows and columns are numbered from the top left.</caption>
      <tbody>
        {Array.from({ length: 9 }, (_, row) => (
          <tr key={row}>
            {cells.slice(row * 9, row * 9 + 9).map((value, col) => {
              const index = row * 9 + col
              const marked = index === target
              const pressed = selected.includes(index)
              const position = `Row ${row + 1}, column ${col + 1}`
              const marks = candidates?.[index]
              const given = Boolean(originalCells?.[index])
              const candidateGrid = marks?.length ? Array.from({ length: 9 }, (_, slot) =>
                <span aria-hidden="true" key={slot}>{marks.includes(slot + 1) ? slot + 1 : ""}</span>) : null
              return (
                <td key={col} className={`border border-slate-300 p-0
                  ${col % 3 === 2 ? "border-r-2 border-r-slate-800" : ""}
                  ${row % 3 === 2 ? "border-b-2 border-b-slate-800" : ""}
                  ${pressed || marked ? "bg-blue-200 text-blue-950" : highlighted.includes(index) ? originalCells ? "bg-sky-100" : "bg-blue-50" : given ? "bg-slate-200" : "bg-white"}`}>
                  {onSelect && !value ? (
                    <button type="button" className={`grid aspect-square w-full place-items-center text-slate-600 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${candidateGrid ? "grid-cols-3 text-[9px] font-normal leading-none sm:text-xs" : ""}`}
                      aria-label={`${position}, ${marks?.length ? `candidates ${marks.join(", ")}` : "empty square"}`} aria-pressed={pressed} onClick={() => onSelect(index)}>
                      {candidateGrid ?? <span aria-hidden="true" className="text-slate-400">{pressed ? "✓" : "·"}</span>}
                    </button>
                  ) : marks?.length ? (
                    <div className="grid aspect-square grid-cols-3 place-items-center text-[9px] font-normal leading-none text-slate-600 sm:text-xs">
                      <span className="sr-only">{`${position}: candidates ${marks.join(", ")}`}</span>
                      {candidateGrid}
                    </div>
                  ) : (
                    <div className={`grid aspect-square place-items-center ${originalCells ? given ? "text-base font-bold sm:text-xl" : "text-base font-bold text-blue-800 sm:text-xl" : ""}`}>
                      <span className="sr-only">{`${position}: ${marked ? "target square" : given ? `given ${value}` : value || "empty"}`}</span>
                      <span aria-hidden="true">{marked ? "?" : value || ""}</span>
                    </div>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
