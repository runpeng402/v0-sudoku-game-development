import type { Metadata } from "next"
import Link from "next/link"
import { SudokuTrainingAccess } from "@/components/sudoku-training-access"

export const dynamic = "force-dynamic"
export function generateMetadata(): Metadata {
  return {
    title: "SudokuStudio Training Pricing",
    alternates: { canonical: "/pricing" },
    robots: process.env.DODO_TRAINING_MODE === "test_mode" ? { index: false, follow: false } : undefined,
  }
}

export default function TrainingPricingPage() {
  const mode = process.env.DODO_TRAINING_MODE
  const testCheckout = mode === "test_mode"
  const checkoutEnabled = testCheckout || mode === "live_mode"

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
          <p>Try one exercise for each of the three techniques.</p>
          <Link className="font-medium text-blue-700 underline" href="/sudoku-practice#exercises">Try free exercises</Link>
        </section>
        <section className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-semibold">Complete training pack</h2>
          <p className="text-3xl font-bold">US$6.90</p>
          <p>Get 12 interactive exercises covering naked singles, hidden singles, and locked candidates. Each technique includes three guided exercises and one independent check.</p>
          {testCheckout && <p className="text-sm font-medium">US$6.90 is the planned launch price. The test checkout shows its own amount and currency.</p>}
          {!checkoutEnabled && <p className="text-sm font-medium">Planned one-time price. The training pack is currently available to try for free. Paid checkout is not open yet.</p>}
        </section>
      </div>
      {checkoutEnabled && <SudokuTrainingAccess entry="pricing" />}
    </main>
  )
}
