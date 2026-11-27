import type { Metadata } from "next"
import Link from "next/link"
import { Printer } from "lucide-react"
import { PrintableSudokuDownloads } from "@/components/printable-sudoku-downloads"
import { Button } from "@/components/ui/button"
import { localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

const url = "https://www.sudokustudio.app/printable-sudoku"

export const metadata: Metadata = {
  title: "Printable Sudoku Puzzles PDF: Free Easy to Hard Puzzles",
  description:
    "Get free printable Sudoku puzzles for easy, medium, and hard levels. Download practice sheets with answers and large-print options.",
  alternates: localizedAlternates("en", "/printable-sudoku"),
  openGraph: {
    images: [defaultOgImage],
    title: "Printable Sudoku Puzzles PDF: Free Easy to Hard Puzzles",
    description:
      "Free printable Sudoku collections for home, classroom, and offline practice.",
    url,
    type: "article",
  },
}

export default function PrintableSudokuPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-8 inline-flex text-sm font-medium text-blue-700 hover:text-blue-900">
            Back to SudokuStudio
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            Printable Sudoku Puzzles PDF
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Download free printable Sudoku puzzles for offline practice. Choose easy,
            medium, hard, or large-print puzzle sheets and use the answer keys to check
            your work.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/play">
                <Printer className="mr-2 h-5 w-5" />
                Play Online First
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <PrintableSudokuDownloads locale="en" />

          <nav aria-label="Printable collections" className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["/printable-sudoku/easy", "Easy printable Sudoku", "Beginner puzzles with many givens"],
              ["/printable-sudoku/with-answers", "Sudoku with answers", "Every pack includes full solutions"],
              ["/printable-sudoku/large-print", "Large print Sudoku", "Big digits for seniors and low vision"],
            ].map(([href, title, note]) => (
              <Link key={href} href={href} className="rounded-lg border p-4 hover:border-blue-300">
                <span className="block font-semibold text-gray-950">{title}</span>
                <span className="mt-1 block text-sm text-slate-500">{note}</span>
              </Link>
            ))}
          </nav>

          <article className="prose prose-slate mt-12 max-w-none">
            <h2>Why printable Sudoku pages work well</h2>
            <p>
              Printable Sudoku is ideal when you want to solve without a screen, prepare
              classroom activities, or give seniors and kids a clear paper puzzle. Easy
              sheets are best for beginners, while hard puzzles with answers are useful
              for serious practice.
            </p>
            <h2>What to print first</h2>
            <p>
              If you are new to Sudoku, start with easy puzzles and answer keys. If you
              already know the basic rules, use medium puzzles for daily practice. Hard
              Sudoku puzzles are best after you understand candidates and elimination.
            </p>
            <h2>Learn before you print</h2>
            <p>
              Not sure where to begin? Read our{" "}
              <Link href="/how-to-play-sudoku">step-by-step Sudoku guide</Link> or review
              the <Link href="/sudoku-rules">basic Sudoku rules</Link> before printing a
              worksheet.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
