import type { Metadata } from "next"
import Link from "next/link"
import { SudokuTrainingAccess } from "@/components/sudoku-training-access"

const title = "Sudoku Practice Exercises: 9 Technique Modules"
const description =
  "Practice Sudoku solving techniques from naked singles to XY-Wing with interactive exercises, hints and independent checks."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sudoku-practice" },
  openGraph: { title, description, url: "/sudoku-practice", type: "website" },
}

export default function SudokuPracticePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-4">
        <Link href="/how-to-play-sudoku" className="text-sm font-medium text-blue-700 underline underline-offset-4">
          How to play Sudoku
        </Link>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Sudoku practice exercises</h1>
        <p className="max-w-2xl leading-7 text-slate-700">
          Start with 9 free exercises, one in each module. The full training pack adds 90 exercises across three levels.
          Practice placing digits, eliminating candidates, and using one deduction to set up the next.
        </p>
        <Link href="/pricing" className="inline-block font-medium text-blue-700 underline">See training pricing</Link>
      </header>

      <SudokuTrainingAccess />

      <section aria-labelledby="techniques" className="max-w-2xl space-y-4 leading-7 text-slate-700">
        <h2 id="techniques" className="text-2xl font-semibold text-slate-950">Beginner techniques</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-950">Naked single</dt>
            <dd>Cross out every digit already in a square’s row, column or box. If just one digit is left, it belongs in that square.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Hidden single</dt>
            <dd>Choose one missing digit and look for every place it could go in a row. If it fits in only one square, that square must take it even when the square has other candidates.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Locked candidates</dt>
            <dd>If all possible positions for a digit in one box share a row or column, that line cannot contain the digit anywhere outside the box. In these exercises, choose the digit to remove from the marked square.</dd>
          </div>
        </dl>
        <p>
          Need a refresher on rows, columns and boxes?{" "}
          <Link href="/sudoku-rules" className="text-blue-700 underline underline-offset-4">Review the Sudoku rules</Link>.
        </p>
      </section>
    </main>
  )
}
