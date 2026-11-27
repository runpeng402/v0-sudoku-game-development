import type { Metadata } from "next"
import { defaultOgImage } from "@/lib/seo-locales"
import Link from "next/link"
import { SudokuGamePage } from "@/components/sudoku-game-page"

const title = "Play Sudoku Online Free: Easy, Medium and Hard | SudokuStudio"
const description =
  "Play free Sudoku online at easy, medium, or hard difficulty with no sign-up. Use hints that explain the technique, a timer, and keyboard or touch input."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [defaultOgImage],
    title,
    description,
    url: "https://www.sudokustudio.app/play",
    siteName: "SudokuStudio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/play",
  },
}

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SudokuStudio Online Sudoku",
  url: "https://www.sudokustudio.app/play",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const levels = [
  ["Easy", "The most given numbers. Many squares have only one possible number, so it is the best place to learn the rules."],
  ["Medium", "Fewer given numbers. Hidden singles and careful scanning of rows, columns and boxes often help."],
  ["Hard", "The fewest given numbers. Writing candidates in empty squares makes the next move easier to find."],
]

export default function PlayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <SudokuGamePage locale="en" />
      <section className="border-t bg-white px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8 leading-7 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">How to play this Sudoku</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-6">
              <li>Pick a difficulty. Every level is free and needs no account.</li>
              <li>Select an empty square, then type 1-9 or tap a number button.</li>
              <li>Each row, column and 3×3 box must contain 1 to 9 exactly once.</li>
              <li>Stuck? Turn on Teaching Mode to reveal an answer, list possible numbers, check a square, or see the technique that applies.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Difficulty levels</h2>
            <dl className="mt-3 space-y-3">
              {levels.map(([name, text]) => (
                <div key={name}>
                  <dt className="font-semibold text-slate-950">{name}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Learn more</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><Link className="text-blue-700 underline underline-offset-4" href="/how-to-play-sudoku">How to play Sudoku: step-by-step guide</Link></li>
              <li><Link className="text-blue-700 underline underline-offset-4" href="/sudoku-rules">Sudoku rules explained</Link></li>
              <li><Link className="text-blue-700 underline underline-offset-4" href="/sudoku-practice">Practice exercises for each solving technique</Link></li>
              <li><Link className="text-blue-700 underline underline-offset-4" href="/printable-sudoku">Printable Sudoku PDFs with answers</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
