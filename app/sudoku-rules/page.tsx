import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeachingBoard, classicPuzzle, type TeachingMarks } from "@/components/teaching-board"
import { localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/sudoku-rules"
const title = "Sudoku Rules: The 3 Rules of Sudoku Explained with Examples"
const description =
  "The rules of Sudoku in plain English: rows, columns and 3x3 boxes, with legal and illegal move examples, what the rules do not say, and rules for 4x4 and variants."

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("en", "/sudoku-rules"),
  openGraph: { images: [defaultOgImage], title, description, url, type: "article" },
}

const faqs = [
  {
    question: "What are the rules of Sudoku?",
    answer:
      "Fill the 9x9 grid so that every row, every column and every 3x3 box contains the digits 1 to 9 exactly once. The numbers printed at the start cannot be changed.",
  },
  {
    question: "Can numbers repeat in Sudoku?",
    answer:
      "Each digit appears nine times in a finished grid, once in every row, column and box. It can never appear twice in the same row, column or box.",
  },
  {
    question: "Do the diagonals matter in Sudoku?",
    answer:
      "Not in standard Sudoku. Only rows, columns and boxes count. Diagonal Sudoku (also called Sudoku X) is a variant that adds the two main diagonals as extra units.",
  },
  {
    question: "Can a Sudoku have more than one solution?",
    answer:
      "A proper Sudoku has exactly one solution. Puzzles with several solutions are considered broken, because you would have to guess.",
  },
  {
    question: "What is the minimum number of clues in a Sudoku?",
    answer:
      "17. A 2012 computer search proved that no 9x9 Sudoku with 16 or fewer givens has a unique solution. Most newspaper puzzles give 22 to 36 numbers.",
  },
  {
    question: "Is there a time limit in Sudoku?",
    answer: "No. Time limits and scores are added by apps and competitions; they are not part of the puzzle rules.",
  },
]

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "SudokuStudio" },
    publisher: { "@type": "Organization", name: "SudokuStudio" },
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

const unitMarks: TeachingMarks = {}
classicPuzzle.forEach((_, index) => {
  const row = Math.floor(index / 9)
  const col = index % 9
  if (row === 0) unitMarks[index] = { tone: "area" }
  else if (col === 4) unitMarks[index] = { tone: "blocker" }
  else if (row < 3 && col < 3) unitMarks[index] = { tone: "target" }
})

// Each example breaks exactly one rule on the classic puzzle: verified so that the other two units stay clear.
const illegalMoves: Array<{ rule: string; marks: TeachingMarks; text: string }> = [
  {
    rule: "Row rule broken",
    marks: { 2: { tone: "wrong", text: "7" }, 4: { tone: "blocker" } },
    text: "A 7 in row 1, column 3 is illegal: row 1 already has a 7 in column 5. The column and box would be fine, but one broken rule is enough.",
  },
  {
    rule: "Column rule broken",
    marks: { 37: { tone: "wrong", text: "6" }, 55: { tone: "blocker" } },
    text: "A 6 in row 5, column 2 is illegal: column 2 already has a 6 in row 7.",
  },
  {
    rule: "Box rule broken",
    marks: { 2: { tone: "wrong", text: "9" }, 19: { tone: "blocker" } },
    text: "A 9 in row 1, column 3 is illegal: the top left box already has a 9 in row 3, column 2, even though row 1 and column 3 have no 9.",
  },
]

const link = "font-medium text-blue-700 underline underline-offset-4"

export default function SudokuRulesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="border-b bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">Sudoku Rules</h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Sudoku has only three rules, and they all say the same thing in different directions: no digit may repeat.
            Here they are with pictures, examples of legal and illegal moves, and answers to the questions beginners
            ask most.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <article className="mx-auto max-w-4xl space-y-4 leading-7 text-slate-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_h3]:font-semibold [&_h3]:text-slate-950 [&_ul]:list-disc [&_ul]:pl-6">
          <h2 className="!mt-0">The 3 rules of Sudoku</h2>
          <p>A standard Sudoku is a 9x9 grid divided into nine 3x3 boxes. Some squares start with numbers. To solve it:</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Rule 1: rows", "Each of the 9 rows contains the digits 1 to 9 exactly once."],
              ["Rule 2: columns", "Each of the 9 columns contains the digits 1 to 9 exactly once."],
              ["Rule 3: boxes", "Each of the 9 boxes contains the digits 1 to 9 exactly once."],
            ].map(([heading, text]) => (
              <div key={heading} className="rounded-lg border bg-white p-5 shadow-sm">
                <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
                <p className="font-semibold text-gray-950">{heading}</p>
                <p className="mt-2 text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
          <p>The numbers given at the start (the givens) are fixed. You win when every square is filled and no rule is broken.</p>

          <div className="grid gap-6 rounded-lg border p-5 md:grid-cols-[minmax(0,340px)_1fr] md:items-center">
            <TeachingBoard
              cells={classicPuzzle}
              marks={unitMarks}
              caption="Blue: row 1. Yellow: column 5. Green: the top left box."
            />
            <p className="text-sm">
              Every square sits in exactly one row, one column and one box. Before you write a digit, check all three.
              The square at row 1, column 5 belongs to the blue row, the yellow column and the top middle box at the
              same time.
            </p>
          </div>

          <h2>Legal and illegal moves</h2>
          <p>Breaking any one of the three rules makes a move illegal. These examples use the puzzle above:</p>
          <div className="grid gap-6 md:grid-cols-3">
            {illegalMoves.map((move) => (
              <div key={move.rule}>
                <h3>{move.rule}</h3>
                <div className="mt-3">
                  <TeachingBoard cells={classicPuzzle} marks={move.marks} caption={move.text} />
                </div>
              </div>
            ))}
          </div>
          <p>
            A legal move is not always a correct move: a digit can pass all three checks and still be wrong. That is why
            you place a digit only when logic leaves one option. The{" "}
            <Link href="/how-to-play-sudoku" className={link}>beginner guide</Link> shows two simple ways to find those moves.
          </p>

          <h2>What the rules do not say</h2>
          <ul>
            <li>No math is needed. The digits are just symbols; nothing has to add up.</li>
            <li>The diagonals do not count in standard Sudoku.</li>
            <li>You can fill squares in any order.</li>
            <li>There is no time limit. Timers and scores come from apps, not from the rules.</li>
            <li>You never need to guess. A proper puzzle has one solution that logic can reach.</li>
          </ul>

          <h2>Rules for smaller and different grids</h2>
          <p>
            Mini Sudoku for kids works the same way with smaller numbers: a 4x4 grid uses 1 to 4 with 2x2 boxes, and a
            6x6 grid uses 1 to 6 with 2x3 boxes. Variants add one extra rule on top of the three: Diagonal Sudoku adds
            the diagonals, Killer Sudoku adds cages whose digits must add up to a total, and Jigsaw Sudoku replaces the
            boxes with irregular shapes. See all <Link href="/variants" className={link}>Sudoku variants and their rules</Link>.
          </p>

          <h2>FAQ about Sudoku rules</h2>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}

          <div className="mt-10 rounded-lg border bg-slate-50 p-6">
            <p className="font-semibold text-gray-950">Put the rules to work</p>
            <p className="mt-2">Start with an easy puzzle and check row, column and box before every move.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/play">
                  <Play className="mr-2 h-4 w-4" />
                  Play an easy Sudoku
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/how-to-play-sudoku">How to play, step by step</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/printable-sudoku">Printable puzzles</Link>
              </Button>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
