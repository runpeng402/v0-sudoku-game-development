import type { Metadata } from "next"
import Link from "next/link"
import { DailySudokuGame } from "@/components/daily-sudoku-game"
import { dailyDateKey, dailyDifficulties, dailyPuzzle, formatDailyDate } from "@/lib/daily-sudoku"
import { defaultOgImage } from "@/lib/seo-locales"

export const revalidate = 600

const url = "https://www.sudokustudio.app/daily-sudoku"
const title = "Daily Sudoku: Free New Easy, Medium and Hard Puzzles Every Day"
const description =
  "Play today's free daily Sudoku online. Three new puzzles every day in easy, medium and hard, with notes, hints, a timer and a printable board."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", images: [defaultOgImage] },
}

const faqs = [
  {
    question: "When does the daily Sudoku change?",
    answer: "A new set of three puzzles is published every day at midnight UTC. Everyone gets the same puzzles on the same day.",
  },
  {
    question: "Is my progress saved?",
    answer:
      "Yes. Your numbers, notes and time are saved in this browser, so you can close the page and finish later the same day.",
  },
  {
    question: "Does every daily puzzle have one solution?",
    answer: "Yes. Each puzzle is checked to have exactly one answer, so it can always be solved with logic and no guessing.",
  },
  {
    question: "Can I print the daily Sudoku?",
    answer: "Yes. Press Print to get a clean copy of the current board. For more paper puzzles, see the printable Sudoku PDFs.",
  },
]

export default function DailySudokuPage() {
  const date = dailyDateKey()
  const puzzles = dailyDifficulties.map((difficulty) => dailyPuzzle(date, difficulty))
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{formatDailyDate(date)}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">Daily Sudoku</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700 print:hidden">
            Three fresh puzzles every day: an easy warm-up, a medium challenge and a hard puzzle for experienced
            solvers. Every puzzle has one solution and can be solved with logic alone.
          </p>
          <div className="mt-8">
            <DailySudokuGame puzzles={puzzles} />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 print:hidden">
        <div className="mx-auto grid max-w-4xl gap-10 leading-7 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">How to play the daily Sudoku</h2>
            <p className="mt-4">
              Fill the grid so every row, every column and every 3x3 box contains the digits 1 to 9 exactly once. Start
              with the easy puzzle if you are new, and read the{" "}
              <Link href="/sudoku-rules" className="text-blue-700 underline underline-offset-4">Sudoku rules</Link> or the{" "}
              <Link href="/how-to-play-sudoku" className="text-blue-700 underline underline-offset-4">beginner guide</Link> first.
            </p>
            <p className="mt-4">
              Stuck on the hard puzzle? Turn on Notes to pencil in candidates, then look for{" "}
              <Link href="/strategies/hidden-single" className="text-blue-700 underline underline-offset-4">hidden singles</Link>,{" "}
              <Link href="/strategies/naked-pairs" className="text-blue-700 underline underline-offset-4">naked pairs</Link> and{" "}
              <Link href="/strategies/locked-candidates" className="text-blue-700 underline underline-offset-4">locked candidates</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">More Sudoku</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <Link href="/play" className="text-blue-700 underline underline-offset-4">Play unlimited Sudoku</Link> with step-by-step hints.
              </li>
              <li>
                <Link href="/printable-sudoku" className="text-blue-700 underline underline-offset-4">Printable Sudoku PDFs</Link> with answer keys.
              </li>
              <li>
                <Link href="/sudoku-solver" className="text-blue-700 underline underline-offset-4">Sudoku solver</Link> for puzzles from books and newspapers.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">Frequently asked questions</h2>
            <div className="mt-4 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-gray-950">{faq.question}</h3>
                  <p className="mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  )
}
