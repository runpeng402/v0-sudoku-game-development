import type { Metadata } from "next"
import Link from "next/link"
import { SudokuSolver } from "@/components/sudoku-solver"
import { defaultOgImage } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/sudoku-solver"
const title = "Sudoku Solver: Solve Any Puzzle Instantly and Check It Has One Answer"
const description =
  "Free online Sudoku solver. Enter or paste a 9x9 puzzle to get the full solution, reveal one square at a time, and check whether the puzzle has a unique answer."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", images: [defaultOgImage] },
}

const faqs = [
  {
    question: "How does the Sudoku solver work?",
    answer:
      "The solver fills the empty square with the fewest possible digits first, tries each option, and backs up when a choice leads to a contradiction. It keeps searching after the first answer so it can tell you whether the puzzle has one solution or several.",
  },
  {
    question: "Why does the solver say my puzzle has more than one solution?",
    answer:
      "A proper Sudoku has exactly one answer. If a clue was left out or typed in the wrong square, several grids may fit. Double-check the givens against your newspaper, book or app; one possible solution is still shown.",
  },
  {
    question: "Can I get a hint without seeing the whole answer?",
    answer:
      "Yes. Select an empty square and press Reveal one square. Only that square is filled in, so you can keep solving the rest yourself.",
  },
  {
    question: "What is the minimum number of clues a Sudoku needs?",
    answer:
      "A standard 9x9 Sudoku with a single solution needs at least 17 given numbers. That was proven by an exhaustive computer search in 2012, so the solver asks for at least 17 clues.",
  },
  {
    question: "Does the solver work for hard and expert puzzles?",
    answer:
      "Yes. Any valid 9x9 puzzle, from easy newspaper grids to the hardest known puzzles, is solved in well under a second in your browser. Nothing is sent to a server.",
  },
]

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SudokuStudio Sudoku Solver",
    url,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
]

export default function SudokuSolverPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">Sudoku Solver</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700">
            Stuck on a puzzle from a newspaper, book or another app? Type the given numbers into the grid or paste the
            puzzle, then solve it instantly. Reveal a single square if you only want a nudge, and check whether the
            puzzle really has one answer.
          </p>
          <div className="mt-8">
            <SudokuSolver />
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-4xl gap-10 leading-7 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">How to use the Sudoku solver</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6">
              <li>Click a square and type a digit from 1 to 9, or use the number pad. Arrow keys move between squares.</li>
              <li>Enter only the numbers printed in the original puzzle. Leave every other square empty.</li>
              <li>
                Or paste the puzzle as 81 characters, row by row, with 0 or a dot for blanks, and press Load pasted puzzle.
              </li>
              <li>Press Solve to see the full answer, or Reveal one square for a single hint.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">Learn the logic instead of guessing</h2>
            <p className="mt-4">
              A solver gives you the answer, but the fun of Sudoku is finding it yourself. When you are stuck, the next
              move is usually one of a few patterns. Start with{" "}
              <Link href="/strategies/naked-single" className="text-blue-700 underline underline-offset-4">naked singles</Link> and{" "}
              <Link href="/strategies/hidden-single" className="text-blue-700 underline underline-offset-4">hidden singles</Link>, then move on to{" "}
              <Link href="/strategies/locked-candidates" className="text-blue-700 underline underline-offset-4">locked candidates</Link> and{" "}
              <Link href="/strategies/naked-pairs" className="text-blue-700 underline underline-offset-4">naked pairs</Link>. Hard puzzles often need an{" "}
              <Link href="/strategies/x-wing" className="text-blue-700 underline underline-offset-4">X-Wing</Link> or an{" "}
              <Link href="/strategies/xy-wing" className="text-blue-700 underline underline-offset-4">XY-Wing</Link>.
            </p>
            <p className="mt-4">
              Prefer to play with step-by-step hints that explain each move? Open the{" "}
              <Link href="/play" className="text-blue-700 underline underline-offset-4">online Sudoku game</Link> or try today&apos;s{" "}
              <Link href="/daily-sudoku" className="text-blue-700 underline underline-offset-4">daily Sudoku</Link>.
            </p>
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
