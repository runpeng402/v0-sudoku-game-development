export type TeachingTone = "area" | "blocked" | "blocker" | "target" | "wrong"

const toneClass: Record<TeachingTone, string> = {
  area: "bg-sky-50",
  blocked: "bg-slate-200 text-slate-400",
  blocker: "bg-amber-200",
  target: "bg-emerald-200 text-emerald-900",
  wrong: "bg-red-100 text-red-700",
}

export type TeachingMarks = Record<number, { tone: TeachingTone; text?: string }>

interface TeachingBoardProps {
  cells: number[]
  marks: TeachingMarks
  caption: string
}

export function TeachingBoard({ cells, marks, caption }: TeachingBoardProps) {
  return (
    <figure className="w-full max-w-[340px]">
      <div className="grid grid-cols-9 border-2 border-slate-900 bg-white" role="img" aria-label={caption}>
        {cells.map((value, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9
          const mark = marks[index]
          const shown = mark?.text ?? (value || "")
          return (
            <div
              key={index}
              className={`flex aspect-square items-center justify-center text-sm font-semibold sm:text-base ${
                mark ? toneClass[mark.tone] : "text-slate-900"
              } ${col % 3 === 2 && col !== 8 ? "border-r-2 border-r-slate-900" : col !== 8 ? "border-r border-r-slate-300" : ""} ${
                row % 3 === 2 && row !== 8 ? "border-b-2 border-b-slate-900" : row !== 8 ? "border-b border-b-slate-300" : ""
              }`}
            >
              {shown}
            </div>
          )
        })}
      </div>
      <figcaption className="mt-2 text-sm leading-6 text-slate-600">{caption}</figcaption>
    </figure>
  )
}

export const classicPuzzle = [..."530070000600195000098000060800060003400803001700020006060000280000419005000080079"].map(Number)
