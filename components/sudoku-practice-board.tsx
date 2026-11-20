interface SudokuPracticeBoardProps {
  cells: number[]
  target?: number
  highlighted?: number[]
}

export function SudokuPracticeBoard({ cells, target, highlighted = [] }: SudokuPracticeBoardProps) {
  return (
    <table className="w-full table-fixed border-collapse border-2 border-slate-800 text-center text-sm font-semibold text-slate-900">
      <caption className="sr-only">Sudoku practice board. Rows and columns are numbered from the top left.</caption>
      <tbody>
        {Array.from({ length: 9 }, (_, row) => (
          <tr key={row}>
            {cells.slice(row * 9, row * 9 + 9).map((value, col) => {
              const index = row * 9 + col
              const marked = index === target
              return (
                <td key={col} className={`border border-slate-300 p-0
                  ${col % 3 === 2 ? "border-r-2 border-r-slate-800" : ""}
                  ${row % 3 === 2 ? "border-b-2 border-b-slate-800" : ""}
                  ${marked ? "bg-blue-200 text-blue-950" : highlighted.includes(index) ? "bg-blue-50" : "bg-white"}`}>
                  <div className="grid aspect-square place-items-center">
                    <span className="sr-only">{`Row ${row + 1}, column ${col + 1}: ${marked ? "target square" : value || "empty"}`}</span>
                    <span aria-hidden="true">{marked ? "?" : value || ""}</span>
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
