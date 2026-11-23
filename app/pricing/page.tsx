import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SudokuTrainingAccess } from "@/components/sudoku-training-access"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "SudokuStudio Training Pricing",
  robots: { index: false, follow: false },
}

export default function TrainingPricingPage() {
  if (process.env.DODO_TRAINING_MODE !== "test_mode") notFound()

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">SudokuStudio training pricing</h1>
        <p className="max-w-2xl text-slate-700">Try step-by-step Sudoku exercises, then unlock the training pack with a one-time purchase.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-3 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Free practice</h2>
          <p className="text-3xl font-bold">Free</p>
          <p>Try a sample exercise for each technique in the test pack.</p>
          <Link className="font-medium text-blue-700 underline" href="/sudoku-practice#exercises">Try free exercises</Link>
        </section>
        <section className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-semibold">Complete training pack</h2>
          <p className="text-3xl font-bold">US$6.90</p>
          <p>Planned one-time launch price. The public pack is planned to contain 90 paid exercises across three difficulty levels.</p>
          <p className="text-sm font-medium">Test checkout grants access to the current 12-exercise test pack. The checkout page shows the test amount.</p>
        </section>
      </div>
      <SudokuTrainingAccess entry="pricing" />
    </main>
  )
}
