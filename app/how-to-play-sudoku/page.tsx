import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SudokuBeginnerLesson } from "@/components/sudoku-beginner-lesson"
import { TeachingBoard, classicPuzzle } from "@/components/teaching-board"
import { localizedAlternates, defaultOgImage } from "@/lib/seo-locales"
import { techniqueGuides } from "@/lib/technique-guides"

const url = "https://www.sudokustudio.app/how-to-play-sudoku"
const title = "How to Play Sudoku: Step-by-Step Guide for Beginners"
const description =
  "Learn how to play Sudoku in 10 minutes: the 3 rules, key terms, two beginner methods with board examples, common mistakes and a free interactive lesson."

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("en", "/how-to-play-sudoku"),
  openGraph: { images: [defaultOgImage], title, description, url, type: "article" },
}

const faqs = [
  {
    question: "How do you play Sudoku?",
    answer:
      "Fill the empty squares of a 9x9 grid with the digits 1 to 9 so that every row, every column and every 3x3 box contains each digit exactly once. Use logic to decide each number; you never need to guess.",
  },
  {
    question: "How do I start a Sudoku as a beginner?",
    answer:
      "Pick an easy puzzle and look for the busiest row, column or box. Choose one digit, check where it can still go, and place it only when one square is left. Repeat with the next digit.",
  },
  {
    question: "Is Sudoku a math game?",
    answer: "No. Sudoku uses digits only as symbols. You could play it with letters or colors; no adding or multiplying is involved.",
  },
  {
    question: "Should beginners use pencil marks?",
    answer:
      "Easy puzzles can be solved without them. Once you get stuck, writing the possible digits (candidates) in small numbers makes patterns such as pairs much easier to see.",
  },
  {
    question: "Is it OK to guess in Sudoku?",
    answer:
      "A well-made Sudoku has one solution that can be reached by logic alone. Guessing usually leads to mistakes you discover much later, so it is better to look for another logical move or use a hint.",
  },
  {
    question: "How long does it take to learn Sudoku?",
    answer:
      "Most people learn the rules in a few minutes and can finish an easy puzzle within their first hour. Medium puzzles usually take a few days of practice; hard puzzles need techniques such as pairs and locked candidates.",
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

const terms = [
  ["Grid", "The 9x9 board of 81 squares."],
  ["Row and column", "A horizontal line or vertical line of 9 squares."],
  ["Box", "One of the nine 3x3 blocks outlined with thick lines."],
  ["Givens", "The numbers printed at the start. They never change."],
  ["Candidates", "Digits that could still go in an empty square, often written small as pencil marks."],
  ["Unit", "Any row, column or box. Each unit holds 1 to 9 exactly once."],
]

// Box 2 cross-hatching: the 8s at r3c3 and r5c4 leave r1c6 as the only square for 8.
const crossHatchMarks = {
  5: { tone: "target" as const, text: "8" },
  3: { tone: "blocked" as const, text: "×" },
  21: { tone: "blocked" as const, text: "×" },
  22: { tone: "blocked" as const, text: "×" },
  23: { tone: "blocked" as const, text: "×" },
  20: { tone: "blocker" as const },
  39: { tone: "blocker" as const },
  4: { tone: "area" as const },
  12: { tone: "area" as const },
  13: { tone: "area" as const },
  14: { tone: "area" as const },
}

const link = "font-medium text-blue-700 underline underline-offset-4"

export default function HowToPlaySudokuPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="border-b bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">How to Play Sudoku: A Beginner&apos;s Guide</h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Sudoku is a logic puzzle on a 9x9 grid. You fill the empty squares with the digits 1 to 9 so that no digit
            repeats in any row, column or 3x3 box. This guide takes about 10 minutes and ends with your first real
            moves on a board.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#lesson">
                <Play className="mr-2 h-5 w-5" />
                Try the free lesson
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/play">Play an easy Sudoku</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-lg border bg-white p-5 lg:sticky lg:top-20">
            <p className="font-semibold text-gray-950">On this page</p>
            <nav className="mt-4 space-y-2 text-sm">
              <a className="block text-gray-600 hover:text-blue-700" href="#rules">The rules in 30 seconds</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#terms">Words you will see</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#lesson">Method 1: check one square</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#scan">Method 2: scan one digit</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#stuck">When you get stuck</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#mistakes">Beginner mistakes</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#faq">FAQ</a>
            </nav>
          </aside>

          <article className="space-y-4 leading-7 text-slate-700 [&_h2]:mt-10 [&_h2]:scroll-mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_h3]:font-semibold [&_h3]:text-slate-950 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
            <h2 id="rules" className="!mt-0">The rules in 30 seconds</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["Each row contains 1 to 9 once", "Each column contains 1 to 9 once", "Each 3x3 box contains 1 to 9 once"].map((item) => (
                <div key={item} className="rounded-lg border bg-slate-50 p-5">
                  <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>
            <p>
              That is all. Every square belongs to one row, one column and one box, so a digit you place must be new to
              all three. See the <Link href="/sudoku-rules" className={link}>full Sudoku rules with legal and illegal examples</Link>.
            </p>

            <h2 id="terms">Words you will see</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {terms.map(([term, meaning]) => (
                <div key={term} className="rounded border p-4">
                  <dt className="font-semibold text-slate-950">{term}</dt>
                  <dd className="mt-1 text-sm">{meaning}</dd>
                </div>
              ))}
            </dl>

            <h2>How to start a Sudoku puzzle</h2>
            <ol>
              <li>Choose an easy puzzle. Easy puzzles give more numbers and need only the two methods below.</li>
              <li>Look for the busiest row, column or box. The more numbers it has, the fewer options remain.</li>
              <li>Use Method 1 or Method 2 to find a square with only one possible digit.</li>
              <li>Write it in, then look at the same row, column and box again. Each new number unlocks the next.</li>
            </ol>

            <section aria-labelledby="lesson">
              <h2 id="lesson">Method 1: check one square</h2>
              <p>
                Pick an empty square and list the digits already used in its row, its column and its box. If eight
                different digits are used, the ninth is the answer. Players call this a{" "}
                <Link href="/strategies/naked-single" className={link}>naked single</Link>. Try it on two squares:
              </p>
              <SudokuBeginnerLesson />
            </section>

            <h2 id="scan">Method 2: scan one digit</h2>
            <p>
              Instead of starting from a square, start from a digit. Pick a box and a digit it is missing, then follow
              that digit&apos;s rows and columns from other boxes. Every line that already has the digit crosses out
              squares in your box. When only one square is left, the digit goes there. This is called cross-hatching,
              and the result is a <Link href="/strategies/hidden-single" className={link}>hidden single</Link>.
            </p>
            <div className="grid gap-6 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
              <TeachingBoard
                cells={classicPuzzle}
                marks={crossHatchMarks}
                caption="Where does 8 go in the top middle box? Yellow: the 8s that block it. Grey ×: blocked squares. Green: the only square left."
              />
              <ol className="text-sm">
                <li>The top middle box (box 2) has no 8 yet. Its empty squares are in rows 1 and 3.</li>
                <li>Row 3 already has an 8 (row 3, column 3), so none of the three empty squares in row 3 of the box can be 8.</li>
                <li>Column 4 already has an 8 (row 5, column 4), so row 1, column 4 cannot be 8 either.</li>
                <li>Only row 1, column 6 is left. The 8 must go there, even though that square could still hold other digits.</li>
              </ol>
            </div>
            <p>
              Scanning digit by digit, 1 through 9, across all nine boxes is the fastest way to solve easy puzzles.
            </p>

            <h2 id="stuck">When you get stuck</h2>
            <p>
              Medium and hard puzzles run out of easy moves. Write the candidates for each empty square in small numbers,
              then look for patterns. Learn them in this order; each guide has a real example and practice exercises:
            </p>
            <ol>
              {techniqueGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/strategies/${guide.slug}`} className={link}>{guide.name}</Link>{" "}
                  <span className="text-sm text-slate-500">({guide.level.toLowerCase()})</span>
                </li>
              ))}
            </ol>
            <p>
              Still stuck? The <Link href="/play" className={link}>online game</Link> has hints that explain the next
              move, and the <Link href="/sudoku-solver" className={link}>Sudoku solver</Link> can reveal a single square
              of a puzzle from a book or newspaper.
            </p>

            <h2 id="mistakes">Common beginner mistakes</h2>
            <ul>
              <li>Checking the row and column but forgetting the 3x3 box.</li>
              <li>Guessing when no move is obvious. A wrong guess often shows up only much later.</li>
              <li>Writing a digit in pen before you are sure. Use notes for anything uncertain.</li>
              <li>Staring at one area for too long. Switch to another digit or box.</li>
            </ul>

            <h2>Keep practicing</h2>
            <ul>
              <li><Link href="/daily-sudoku" className={link}>Daily Sudoku</Link>: a new easy, medium and hard puzzle every day.</li>
              <li><Link href="/printable-sudoku" className={link}>Printable Sudoku</Link>: easy puzzles on paper, with answers.</li>
              <li><Link href="/sudoku-practice" className={link}>Technique exercises</Link>: one skill at a time with instant feedback.</li>
            </ul>

            <h2 id="faq">FAQ</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </main>
  )
}
