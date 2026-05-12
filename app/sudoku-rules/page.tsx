import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Grid3X3, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { localizedAlternates } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/sudoku-rules"

export const metadata: Metadata = {
  title: "Sudoku Rules Explained: Simple Rules for Beginners",
  description:
    "Understand the rules of Sudoku in minutes. Learn basic Sudoku game rules for rows, columns, and 3x3 boxes with clear beginner examples.",
  keywords: [
    "sudoku rules",
    "rules of sudoku",
    "sudoku game rules",
    "rules of sudoku game",
    "rules for sudoku",
    "sudoku rules for beginners",
    "basic rules of sudoku",
    "sudoku puzzle rules",
  ],
  alternates: localizedAlternates("en", "/sudoku-rules"),
  openGraph: {
    title: "Sudoku Rules Explained: Simple Rules for Beginners",
    description: "A simple guide to Sudoku row, column, and 3x3 box rules.",
    url,
    type: "article",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sudoku Rules Explained Simply",
  description:
    "A beginner-friendly explanation of Sudoku rules, valid puzzles, repeated numbers, and 4x4 vs 9x9 Sudoku.",
  mainEntityOfPage: url,
  author: {
    "@type": "Organization",
    name: "SudokuStudio",
  },
  publisher: {
    "@type": "Organization",
    name: "SudokuStudio",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the rules of Sudoku?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The rules of Sudoku are that each row, each column, and each 3x3 box must contain the numbers 1 to 9 once, with no repeats inside the same unit.",
      },
    },
    {
      "@type": "Question",
      name: "What are the Sudoku game rules for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beginners should remember three Sudoku game rules: do not repeat a number in a row, do not repeat a number in a column, and do not repeat a number in a 3x3 box.",
      },
    },
    {
      "@type": "Question",
      name: "Can numbers repeat in Sudoku?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Numbers can repeat across the whole puzzle, but the same number cannot repeat within one row, one column, or one 3x3 box.",
      },
    },
    {
      "@type": "Question",
      name: "Can Sudoku have more than one answer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good standard Sudoku puzzle should have exactly one solution. If it has more than one answer, it is usually considered a flawed puzzle.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if a number repeats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If a number repeats in the same row, column, or 3x3 box, the move breaks the Sudoku rules and the puzzle cannot be solved correctly with that placement.",
      },
    },
  ],
}

const ruleGrid = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
]

export default function SudokuRulesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
            Sudoku Rules Explained Simply
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            The rules of Sudoku are simple: place numbers 1 to 9 so they appear once in
            each row, once in each column, and once in each 3x3 box. These are the same
            core Sudoku game rules beginners use when learning their first puzzle.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <article className="prose prose-slate mx-auto max-w-4xl">
          <h2>The goal of Sudoku</h2>
          <p>
            A Sudoku puzzle starts with some numbers already placed. Your job is to fill
            every empty cell using logic. A completed puzzle must satisfy all three rules
            at the same time.
          </p>

          <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
            {[
              ["Rule 1", "Each row must contain the numbers 1-9 exactly once."],
              ["Rule 2", "Each column must contain the numbers 1-9 exactly once."],
              ["Rule 3", "Each 3x3 box must contain the numbers 1-9 exactly once."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border bg-white p-5 shadow-sm">
                <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
                <p className="font-semibold text-gray-950">{title}</p>
                <p className="mt-2 text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>

          <h2>Row, column, and box rule diagram</h2>
          <p>
            The diagram below shows the three rule areas you must check before placing a
            number: one row, one column, and one 3x3 box. A number is legal only when it
            does not repeat in any of those areas.
          </p>
          <div className="not-prose my-8 grid gap-6 rounded-lg border bg-white p-5 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
            <div className="grid grid-cols-9 border-2 border-gray-900 bg-gray-900">
              {ruleGrid.map((value, index) => {
                const row = Math.floor(index / 9)
                const col = index % 9
                const inRow = row === 0
                const inColumn = col === 4
                const inBox = row < 3 && col < 3
                const backgroundClass = inRow ? "bg-blue-100" : inColumn ? "bg-amber-100" : inBox ? "bg-emerald-100" : "bg-white"
                return (
                  <div
                    key={index}
                    className={`flex aspect-square items-center justify-center ${backgroundClass} text-sm font-semibold text-gray-900 ${
                      col === 2 || col === 5 ? "border-r-2 border-r-gray-900" : "border-r border-r-gray-200"
                    } ${row === 2 || row === 5 ? "border-b-2 border-b-gray-900" : "border-b border-b-gray-200"}`}
                  >
                    {value || ""}
                  </div>
                )
              })}
            </div>
            <div className="space-y-3 text-sm leading-6 text-gray-700">
              <p><span className="inline-block h-3 w-3 rounded-sm bg-blue-100 align-middle" /> Row rule: every row contains 1-9 once.</p>
              <p><span className="inline-block h-3 w-3 rounded-sm bg-amber-100 align-middle" /> Column rule: every column contains 1-9 once.</p>
              <p><span className="inline-block h-3 w-3 rounded-sm bg-emerald-100 align-middle" /> Box rule: every 3x3 box contains 1-9 once.</p>
            </div>
          </div>

          <h2>Rules of Sudoku game</h2>
          <p>
            The <strong>rules of Sudoku</strong> do not require arithmetic. The numbers
            are symbols used to track logic. A legal move must pass three checks: row,
            column, and 3x3 box. If one of those checks fails, the move breaks the Sudoku
            puzzle rules.
          </p>

          <h2>Can numbers repeat in Sudoku?</h2>
          <p>
            Yes, the same number appears many times across the whole puzzle. The important
            limit is local: a number cannot repeat inside the same row, same column, or
            same 3x3 box.
          </p>

          <h2>What makes a Sudoku puzzle valid?</h2>
          <p>
            A valid standard Sudoku puzzle should have one logical solution. If a puzzle
            has no solution or several solutions, it is not a good standard Sudoku puzzle.
          </p>

          <h2>Are 4x4 and 9x9 Sudoku rules different?</h2>
          <p>
            The idea is the same, but the grid size changes. A 4x4 Sudoku uses numbers 1
            to 4 and smaller boxes, which makes it useful for learning. Standard Sudoku is
            usually 9x9 and uses numbers 1 to 9.
          </p>

          <div className="not-prose my-8 rounded-lg border bg-blue-50 p-6">
            <div className="flex items-center gap-3">
              <Grid3X3 className="h-6 w-6 text-blue-700" />
              <p className="font-semibold text-blue-950">Rule check example</p>
            </div>
            <p className="mt-3 text-blue-950">
              If a row already contains 8, no other cell in that row can be 8. You must
              check the column and box before placing the final number.
            </p>
          </div>

          <h2>Sudoku rules for beginners</h2>
          <p>
            For beginners, the easiest way to remember the basic rules of Sudoku is to
            ask three questions before every move: is this number already in the row, is
            it already in the column, and is it already in the box? If the answer is no to
            all three, the move may be legal.
          </p>

          <h2>FAQ about Sudoku rules</h2>
          <h3>What are the rules of Sudoku?</h3>
          <p>
            Each row, column, and 3x3 box must contain 1 to 9 exactly once.
          </p>
          <h3>What are the Sudoku game rules?</h3>
          <p>
            The Sudoku game rules are the same as the standard puzzle rules: no repeated
            number in any row, column, or 3x3 box.
          </p>
          <h3>What are the basic rules of Sudoku for beginners?</h3>
          <p>
            Beginners only need to remember the row rule, column rule, and box rule. All
            solving techniques build on those three constraints.
          </p>
          <h3>Can Sudoku have more than one answer?</h3>
          <p>
            A well-made standard Sudoku puzzle should have exactly one solution. If a
            puzzle has more than one answer, it is usually considered invalid or poorly
            designed.
          </p>
          <h3>What happens if a number repeats?</h3>
          <p>
            If a number repeats in the same row, column, or 3x3 box, that placement breaks
            the rules. You should remove it and check the affected row, column, and box
            again.
          </p>

          <h2>Practice the rules with an easy puzzle</h2>
          <p>
            The fastest way to remember the rules is to apply them. Start with easy
            puzzles and focus on checking rows, columns, and boxes before every move.
          </p>
          <p>
            <Button asChild>
              <Link href="/play">
                <Play className="mr-2 h-4 w-4" />
                Practice the Rules
              </Link>
            </Button>
          </p>

          <h2>Related beginner guides</h2>
          <ul>
            <li>
              <Link href="/how-to-play-sudoku">How to Play Sudoku: Step-by-Step Guide</Link>
            </li>
            <li>
              <Link href="/printable-sudoku">Printable Sudoku Puzzles PDF</Link>
            </li>
            <li>
              <Link href="/strategies">Sudoku Strategies</Link>
            </li>
          </ul>
        </article>
      </section>
    </main>
  )
}
