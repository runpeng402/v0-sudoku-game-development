import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, CheckCircle, HelpCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SudokuBeginnerLesson } from "@/components/sudoku-beginner-lesson"
import { localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/how-to-play-sudoku"

export const metadata: Metadata = {
  title: "How to Play Sudoku for Beginners: Step-by-Step Guide",
  description: "Learn how to play Sudoku with two interactive moves, step-by-step hints, and simple examples of the rules for rows, columns and boxes.",
  alternates: localizedAlternates("en", "/how-to-play-sudoku"),
  openGraph: {
    images: [defaultOgImage],
    title: "How to Play Sudoku for Beginners: Step-by-Step Guide",
    description: "Learn how to play Sudoku with two interactive moves, step-by-step hints, and simple examples of the rules for rows, columns and boxes.",
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
      text: "Find the only number that fits in a marked cell by checking its row, column, and box.",
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
            How to Play Sudoku for Beginners
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Sudoku is a logic puzzle played on a 9x9 grid. The goal is to fill every row,
            column, and 3x3 box with the numbers 1 to 9, without repeating any number.
            Try the step-by-step lesson to find your first two numbers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#example">
                <Play className="mr-2 h-5 w-5" />
                Try the free lesson
              </a>
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
              <a className="block text-gray-600 hover:text-blue-700" href="#mistakes">Beginner mistakes</a>
              <a className="block text-gray-600 hover:text-blue-700" href="#faq">FAQ</a>
            </nav>
          </aside>

          <article className="space-y-4 leading-7 text-slate-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_h3]:font-semibold [&_h3]:text-slate-950 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
            <h2>How do you play Sudoku?</h2>
            <p>
              Start with an empty cell. Check which numbers already appear in its row,
              column and 3×3 box. If those areas rule out all but one number, fill it in.
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

            <section aria-labelledby="example" className="mt-10">
              <h2 id="example" className="scroll-mt-6 text-2xl font-semibold text-slate-950">Find your first two numbers</h2>
              <p className="mt-2 leading-7 text-slate-700">
                Try two moves on a real Sudoku board. For each marked square, rule out
                numbers already in the same row, column or box. When only one number
                remains, you have found a single candidate.
              </p>
              <SudokuBeginnerLesson />
              <p>
                Ready for more? Try the{" "}
                <Link href="/sudoku-practice" className="font-medium text-blue-700 underline underline-offset-4">
                  Sudoku practice exercises
                </Link>{" "}
                on naked singles, hidden singles and locked candidates.
              </p>
            </section>

            <h2 id="mistakes">Common beginner mistakes</h2>
            <ul>
              <li>Guessing too early instead of using elimination.</li>
              <li>Checking only the row and forgetting the column or 3x3 box.</li>
              <li>Changing given numbers that are part of the original puzzle.</li>
              <li>Moving too fast and missing an obvious single.</li>
            </ul>

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
