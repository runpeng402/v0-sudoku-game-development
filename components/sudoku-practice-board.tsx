interface SudokuPracticeBoardProps {
  cells: number[]
  target?: number
  highlighted?: number[]
  candidates?: number[][]
  selected?: number[]
  onSelect?: (index: number) => void
}

export function SudokuPracticeBoard({ cells, target, highlighted = [], candidates, selected = [], onSelect }: SudokuPracticeBoardProps) {
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
              const candidateGrid = marks?.length ? Array.from({ length: 9 }, (_, slot) =>
                <span aria-hidden="true" key={slot}>{marks.includes(slot + 1) ? slot + 1 : ""}</span>) : null
              return (
                <td key={col} className={`border border-slate-300 p-0
                  ${col % 3 === 2 ? "border-r-2 border-r-slate-800" : ""}
                  ${row % 3 === 2 ? "border-b-2 border-b-slate-800" : ""}
                  ${pressed || marked ? "bg-blue-200 text-blue-950" : highlighted.includes(index) ? "bg-blue-50" : "bg-white"}`}>
                  {onSelect && marks?.length ? (
                    <button type="button" className="grid aspect-square w-full grid-cols-3 place-items-center text-[9px] leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 sm:text-xs"
                      aria-label={`${position}, candidates ${marks.join(", ")}`} aria-pressed={pressed} onClick={() => onSelect(index)}>
                      {candidateGrid}
                    </button>
                  ) : marks?.length ? (
                    <div className="grid aspect-square grid-cols-3 place-items-center text-[9px] leading-none sm:text-xs">
                      <span className="sr-only">{`${position}: candidates ${marks.join(", ")}`}</span>
                      {candidateGrid}
                    </div>
                  ) : (
                    <div className="grid aspect-square place-items-center">
                      <span className="sr-only">{`${position}: ${marked ? "target square" : value || "empty"}`}</span>
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
