import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SudokuReasoningLab } from "@/components/sudoku-reasoning-lab"
import samples from "@/lib/sudoku-reasoning-samples.json"
import type { ReasoningExercise } from "@/lib/sudoku-reasoning"

export const metadata: Metadata = {
  title: "Sudoku Reasoning Lab",
  robots: { index: false, follow: false },
}

export default function SudokuReasoningLabPage() {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview") notFound()

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
      <Link href="/sudoku-practice" className="text-sm text-blue-700 underline">Back to Sudoku practice</Link>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sudoku Reasoning Lab</h1>
      <p className="max-w-2xl text-slate-700">Try 12 sample exercises on hidden singles, naked pairs and XY-Wing. Find a move, test its reasoning, and see how far you can get without hints.</p>
      <SudokuReasoningLab exercises={samples as ReasoningExercise[]} />
    </main>
  )
}
