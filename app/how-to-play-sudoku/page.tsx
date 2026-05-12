import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, CheckCircle, HelpCircle, Play, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { localizedAlternates } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/how-to-play-sudoku"

export const metadata: Metadata = {
  title: "How to Play Sudoku: Easy Step-by-Step Guide for Beginners",
  description:
    "Learn how to play Sudoku with simple rules, step-by-step examples, beginner tips, Sudoku instructions, and free puzzles you can practice instantly.",
  keywords: [
    "how to play sudoku",
    "sudoku how to play",
    "how do you play sudoku",
    "how to play sudoku for beginners",
    "how to play sudoku game",
    "sudoku instructions",
    "how does sudoku work",
    "how to play sudoku step by step",
  ],
  alternates: localizedAlternates("en", "/how-to-play-sudoku"),
  openGraph: {
    title: "How to Play Sudoku: Easy Step-by-Step Guide for Beginners",
    description:
      "A beginner-friendly Sudoku guide with rules, examples, common mistakes, and practice puzzles.",
    url,
    type: "article",
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Play Sudoku",
  description:
    "Learn the goal, basic rules, first solving steps, and beginner tips for Sudoku.",
  totalTime: "PT15M",
  step: [
    {
      "@type": "HowToStep",
      name: "Understand the goal",
      text: "Fill the 9x9 grid so every row, column, and 3x3 box contains the numbers 1 to 9 once.",
    },
    {
      "@type": "HowToStep",
      name: "Scan rows, columns, and boxes",
      text: "Look for units with many given numbers and identify which numbers are missing.",
    },
    {
      "@type": "HowToStep",
      name: "Use elimination",
      text: "Check whether a missing number is blocked by the same number in a row, column, or box.",
    },
    {
      "@type": "HowToStep",
      name: "Use a step-by-step example",
      text: "In a nearly complete row, list missing numbers and eliminate choices that already appear in the same column or box.",
    },
    {
      "@type": "HowToStep",
      name: "Practice with an easy puzzle",
      text: "Start with easy puzzles and use logic instead of guessing.",
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do you play Sudoku?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You play Sudoku by filling a 9x9 grid so every row, column, and 3x3 box contains the numbers 1 to 9 once. Use logic and elimination instead of guessing.",
      },
    },
    {
      "@type": "Question",
      name: "How do you play Sudoku for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beginners should start with easy Sudoku puzzles, scan rows, columns, and boxes with many given numbers, list missing numbers, and place a number only when one option is certain.",
      },
    },
    {
      "@type": "Question",
      name: "What are the basic Sudoku instructions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The basic Sudoku instructions are to fill empty cells with numbers 1 to 9 while avoiding repeats in each row, column, and 3x3 box.",
      },
    },
    {
      "@type": "Question",
      name: "How does Sudoku work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sudoku works by combining three constraints: rows, columns, and boxes. Each move must satisfy all three constraints at the same time.",
      },
    },
    {
      "@type": "Question",
      name: "Is Sudoku a math game?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sudoku uses numbers, but it is a logic puzzle. You do not need arithmetic to solve it.",
      },
    },
    {
      "@type": "Question",
      name: "Can I guess in Sudoku?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Good Sudoku solving relies on logic. Beginners should avoid guessing and use elimination instead.",
      },
    },
    {
      "@type": "Question",
      name: "Is Sudoku hard to learn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sudoku is not hard to learn. The rules are simple, and beginners can start with easy puzzles that require only basic elimination.",
      },
    },
    {
      "@type": "Question",
      name: "What is the first move in Sudoku?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good first move is to scan the most complete row, column, or 3x3 box, list the missing numbers, and place a number only when one cell has a single legal option.",
      },
    },
  ],
}

const exampleGrid = [
  1, 2, 4, 5, 7, 8, 9, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 6, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
]

export default function HowToPlaySudokuPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-8 inline-flex text-sm font-medium text-blue-700 hover:text-blue-900">
            Back to SudokuStudio
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            How to Play Sudoku: A Beginner's Guide
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Sudoku is a logic puzzle played on a 9x9 grid. The goal is to fill every row,
            column, and 3x3 box with the numbers 1 to 9, without repeating any number.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/play">
                <Play className="mr-2 h-5 w-5" />
                Practice Sudoku Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sudoku-rules">Read the Rules</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-lg border bg-white p-5 lg:sticky lg:top-20">
            <p className="font-semibold text-gray-950">On this page</p>
            <nav className="mt-4 space-y-2 text-sm">
              <a className="block text-gray-600 hover:text-blue-700" href="#rules">Basic rules</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#start">How to start</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#example">Step-by-step example</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#visual-example">9x9 visual example</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#mistakes">Beginner mistakes</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#faq">FAQ</a>
            </nav>
          </aside>

          <article className="prose prose-slate max-w-none">
            <h2>How do you play Sudoku?</h2>
            <p>
              If you are searching for <strong>sudoku how to play</strong>, the short
              answer is this: choose an empty cell and place a number from 1 to 9 only
              when that number does not repeat in the same row, column, or 3x3 box. A
              Sudoku game is solved when every empty cell is filled and all three checks
              are still true.
            </p>

            <h2 id="rules">The 3 basic rules of Sudoku</h2>
            <p>
              Standard Sudoku has three simple rules. Every row must contain 1 through 9,
              every column must contain 1 through 9, and every 3x3 box must contain 1
              through 9. A number can appear only once in each row, column, and box.
            </p>
            <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
              {[
                "Each row contains 1-9 once",
                "Each column contains 1-9 once",
                "Each 3x3 box contains 1-9 once",
              ].map((item) => (
                <div key={item} className="rounded-lg border bg-slate-50 p-5">
                  <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>

            <h2 id="start">How to start a Sudoku puzzle</h2>
            <p>
              Start by scanning rows, columns, or boxes that already contain many numbers.
              Write down which numbers are missing, then check each empty cell against its
              row, column, and box. If only one number can fit, place it.
            </p>
            <ol>
              <li>Choose a row, column, or 3x3 box with many given numbers.</li>
              <li>List the missing numbers from 1 to 9.</li>
              <li>For each empty cell, remove numbers already present in its row, column, or box.</li>
              <li>Place a number only when logic leaves one possible answer.</li>
            </ol>

            <h2>How to play Sudoku for beginners</h2>
            <p>
              Beginners should not try to solve the whole Sudoku puzzle at once. Start
              with an easy Sudoku game, look for the most complete row, column, or box,
              and ask: which numbers are missing, and which cells can legally take each
              missing number? This step-by-step habit is the safest way to learn how to
              play Sudoku without guessing.
            </p>
            <ul>
              <li>Start with easy puzzles rather than hard or expert puzzles.</li>
              <li>Use notes for possible numbers when one answer is not certain.</li>
              <li>Check row, column, and box before every move.</li>
              <li>Use hints to learn the reason behind a move, not just the answer.</li>
            </ul>

            <h2 id="example">Step-by-step example for beginners</h2>
            <p>
              Imagine a row already has 1, 2, 4, 5, 7, 8, and 9. The only missing numbers
              are 3 and 6. If one empty cell is in a column that already contains 6, that
              cell cannot be 6. Therefore it must be 3.
            </p>
            <div className="not-prose my-8 rounded-lg border bg-blue-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Search className="h-6 w-6 text-blue-700" />
                <p className="font-semibold text-blue-950">Beginner logic pattern</p>
              </div>
              <p className="text-blue-950">
                Missing numbers in the row: 3 and 6. The column blocks 6. The answer is 3.
              </p>
            </div>

            <h2 id="visual-example">9x9 step-by-step Sudoku example</h2>
            <p>
              This small 9x9 example shows how a beginner move works. The first row is
              missing only 3 and 6. The highlighted empty cell is in a column that already
              contains 6, so 6 is blocked. That leaves 3 as the only logical answer.
            </p>
            <div className="not-prose my-8 grid gap-6 rounded-lg border bg-white p-5 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
              <div className="grid grid-cols-9 border-2 border-gray-900 bg-gray-900">
                {exampleGrid.map((value, index) => {
                  const row = Math.floor(index / 9)
                  const col = index % 9
                  const isTarget = index === 7
                  const isColumnClue = index === 16
                  const backgroundClass = isTarget ? "bg-blue-100" : isColumnClue ? "bg-amber-100" : "bg-white"
                  const textClass = isTarget ? "text-blue-800" : isColumnClue ? "text-amber-800" : "text-gray-900"
                  return (
                    <div
                      key={index}
                      className={`flex aspect-square items-center justify-center text-sm font-semibold ${backgroundClass} ${textClass} ${
                        isTarget ? "ring-2 ring-inset ring-blue-500" : ""
                      } ${
                        col === 2 || col === 5 ? "border-r-2 border-r-gray-900" : "border-r border-r-gray-200"
                      } ${row === 2 || row === 5 ? "border-b-2 border-b-gray-900" : "border-b border-b-gray-200"}`}
                    >
                      {isTarget ? "?" : value || ""}
                    </div>
                  )
                })}
              </div>
              <ol className="space-y-3 text-sm leading-6 text-gray-700">
                <li>
                  <strong>Step 1:</strong> In the first row, the missing numbers are 3 and 6.
                </li>
                <li>
                  <strong>Step 2:</strong> The highlighted cell shares a column with 6, so it cannot be 6.
                </li>
                <li>
                  <strong>Step 3:</strong> The only remaining number is 3, so this cell should be 3.
                </li>
              </ol>
            </div>

            <h2 id="mistakes">Common beginner mistakes</h2>
            <ul>
              <li>Guessing too early instead of using elimination.</li>
              <li>Checking only the row and forgetting the column or 3x3 box.</li>
              <li>Changing given numbers that are part of the original puzzle.</li>
              <li>Moving too fast and missing an obvious single.</li>
            </ul>

            <p>
              Sudoku is sometimes misspelled as sudoko, sodoku, or suduko, but the rules
              are the same: fill the grid with logical deductions.
            </p>

            <h2>Sudoku instructions in one minute</h2>
            <p>
              These are the basic Sudoku instructions: use numbers 1 to 9, do not repeat
              a number in any row, do not repeat a number in any column, and do not repeat
              a number in any 3x3 box. When a cell has only one legal number left, fill it
              in. That is how Sudoku works at the beginner level.
            </p>

            <h2>Practice with a free online Sudoku puzzle</h2>
            <p>
              The best way to learn is to solve an easy puzzle slowly. Use the hint system
              when you are stuck, then read the explanation before moving on.
            </p>
            <p>
              <Button asChild>
                <Link href="/play">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start an Easy Sudoku
                </Link>
              </Button>
            </p>

            <h2 id="faq">FAQ</h2>
            <h3>How do you play Sudoku?</h3>
            <p>
              Fill the empty cells with 1 to 9. Each row, column, and 3x3 box must contain
              every number once.
            </p>
            <h3>How do you play Sudoku for beginners?</h3>
            <p>
              Start with easy puzzles, scan the most complete areas first, and use
              elimination before writing a number.
            </p>
            <h3>How do you play a Sudoku game step by step?</h3>
            <p>
              Pick a nearly complete row, column, or box, list the missing numbers, remove
              blocked options, then place a number only when one choice remains.
            </p>
            <h3>Is Sudoku a math game?</h3>
            <p>
              No. Sudoku uses numbers as symbols, but solving it requires logic rather
              than arithmetic.
            </p>
            <h3>Should beginners use pencil marks?</h3>
            <p>
              Yes. Pencil marks help you track possible numbers and avoid guessing.
            </p>
            <h3>What puzzle should I play first?</h3>
            <p>
              Start with easy Sudoku puzzles. They have more given numbers and usually
              require only basic elimination.
            </p>
            <h3>Is Sudoku hard to learn?</h3>
            <p>
              No. Sudoku is easy to learn because the rules are simple. It becomes more
              challenging as puzzles require more advanced solving techniques.
            </p>
            <h3>What is the first move in Sudoku?</h3>
            <p>
              The best first move is usually in a row, column, or 3x3 box with many given
              numbers. List the missing numbers and use elimination to find a certain cell.
            </p>

            <div className="not-prose mt-12 rounded-lg border p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-6 w-6 text-blue-700" />
                <div>
                  <p className="font-semibold text-gray-950">Next step</p>
                  <p className="mt-2 text-gray-700">
                    If you understand the goal, read the dedicated rules page to make each
                    constraint clear before solving faster puzzles.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/sudoku-rules">Sudoku Rules Explained</Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
