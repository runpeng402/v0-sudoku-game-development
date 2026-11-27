import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Variant = {
  id: string
  name: string
  summary: string
  difficulty: string
  rules: string[]
  tips: string[]
}

const variants: Variant[] = [
  {
    id: "killer",
    name: "Killer Sudoku",
    summary: "Classic Sudoku plus cages: groups of squares whose digits must add up to a printed total.",
    difficulty: "Hard",
    rules: [
      "Standard rules apply: 1-9 once in each row, column and 3×3 box.",
      "The digits in each cage must add up to the number shown in the cage corner.",
      "A digit cannot repeat inside a cage.",
      "Cages can cross 3×3 box boundaries.",
    ],
    tips: [
      "Start with small cages that have very low or very high totals, since few digit combinations fit.",
      "Every row, column and box adds up to 45. Compare that with the cage totals inside it to find hidden sums.",
      "Use normal Sudoku techniques alongside the cage totals.",
    ],
  },
  {
    id: "jigsaw",
    name: "Jigsaw Sudoku",
    summary: "The 3×3 boxes are replaced by nine irregular regions of nine squares each.",
    difficulty: "Medium",
    rules: [
      "1-9 must appear once in each row and each column.",
      "1-9 must appear once in each irregular region.",
      "Every region contains exactly nine squares.",
    ],
    tips: [
      "Rows and columns work exactly as in classic Sudoku, so scan them first.",
      "Shade or outline the regions on paper so their borders are easy to follow.",
    ],
  },
  {
    id: "diagonal",
    name: "Diagonal Sudoku (Sudoku X)",
    summary: "Both main diagonals must also contain 1-9 once.",
    difficulty: "Hard",
    rules: [
      "Standard rules apply: 1-9 once in each row, column and 3×3 box.",
      "The diagonal from top-left to bottom-right must contain 1-9 once.",
      "The diagonal from top-right to bottom-left must contain 1-9 once.",
    ],
    tips: [
      "The center square sits on both diagonals, so it is often the most restricted square.",
      "Treat each diagonal as an extra unit when you look for hidden singles.",
    ],
  },
  {
    id: "hyper",
    name: "Hyper Sudoku (Windoku)",
    summary: "Four extra shaded 3×3 regions must also contain 1-9 once.",
    difficulty: "Hard",
    rules: [
      "Standard rules apply: 1-9 once in each row, column and 3×3 box.",
      "Four additional 3×3 regions, one inside each quadrant of the grid, must each contain 1-9 once.",
    ],
    tips: [
      "Squares that belong to both a normal box and an extra region have the most constraints.",
      "Use the extra regions as additional units when searching for singles.",
    ],
  },
  {
    id: "samurai",
    name: "Samurai Sudoku",
    summary: "Five classic 9×9 grids overlap in an X shape, sharing their corner boxes with the central grid.",
    difficulty: "Expert",
    rules: [
      "Each of the five 9×9 grids follows classic Sudoku rules.",
      "The four shared corner boxes must satisfy the rules of both grids they belong to.",
    ],
    tips: [
      "Look for progress in the shared boxes first, because they receive clues from two grids.",
      "Finish one grid at a time once a shared box is filled.",
    ],
  },
  {
    id: "16x16",
    name: "16×16 Sudoku",
    summary: "A larger grid that uses 16 symbols, usually 1-9 plus A-G or the letters A-P.",
    difficulty: "Expert",
    rules: [
      "Each row and column contains all 16 symbols once.",
      "Each 4×4 box contains all 16 symbols once.",
    ],
    tips: [
      "Write candidates systematically, because each square can start with up to 16 options.",
      "Hidden singles are even more useful here than in 9×9 Sudoku.",
    ],
  },
]

export function VariantsPageContent() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">Sudoku Variants Explained</h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Every variant keeps the core idea of classic Sudoku: place digits so none repeat inside a unit. What changes is
            the shape of the units or an extra constraint such as cage sums or diagonals. Here are the rules of the most
            popular variants and how to start each one.
          </p>
          <nav aria-label="Variants" className="mt-8 flex flex-wrap gap-2">
            {variants.map((variant) => (
              <a key={variant.id} href={`#${variant.id}`} className="rounded-full border bg-white px-4 py-1.5 text-sm font-medium text-blue-700 hover:border-blue-300">
                {variant.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12">
        {variants.map((variant) => (
          <section key={variant.id} id={variant.id} aria-labelledby={`${variant.id}-title`} className="scroll-mt-6 rounded-lg border p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id={`${variant.id}-title`} className="text-2xl font-semibold text-gray-950">{variant.name}</h2>
              <Badge variant="outline">{variant.difficulty}</Badge>
            </div>
            <p className="mt-3 leading-7 text-gray-700">{variant.summary}</p>
            <h3 className="mt-6 font-semibold text-gray-950">Rules</h3>
            <ul className="mt-2 space-y-2">
              {variant.rules.map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle aria-hidden="true" className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-semibold text-gray-950">How to start</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              {variant.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-lg border bg-blue-50 p-6">
          <h2 className="text-2xl font-semibold text-gray-950">New to Sudoku?</h2>
          <p className="mt-3 leading-7 text-gray-700">
            Variants are easier once classic Sudoku feels natural. Learn the basic rules, practice the core techniques, or print
            classic puzzles with answer keys, including a large-print set.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild><Link href="/play">Play classic Sudoku</Link></Button>
            <Button asChild variant="outline"><Link href="/sudoku-rules">Sudoku rules</Link></Button>
            <Button asChild variant="outline"><Link href="/sudoku-practice">Technique practice</Link></Button>
            <Button asChild variant="outline"><Link href="/printable-sudoku">Printable Sudoku PDF</Link></Button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default VariantsPageContent
