import type { Metadata } from "next"
import { StrategiesPageContent } from "@/components/strategies-page"
import { localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: "Sudoku Strategies & Techniques - From Beginner to Expert | SudokuStudio",
  description:
    "Master advanced Sudoku solving techniques including X-Wing, Swordfish, naked pairs, and more. Comprehensive strategy guide with examples and practice puzzles.",
  keywords: [
    "sudoku strategies",
    "sudoku techniques",
    "x-wing sudoku",
    "swordfish sudoku",
    "naked pairs",
    "hidden singles",
    "sudoku solving methods",
    "advanced sudoku",
    "expert sudoku techniques",
    "sudoku tutorial",
  ],
  openGraph: {
    images: [defaultOgImage],
    title: "Advanced Sudoku Strategies & Expert Techniques",
    description:
      "Learn X-Wing, Swordfish, and other advanced Sudoku solving techniques. Master expert-level strategies with examples.",
    url: "https://www.sudokustudio.app/strategies",
  },
  alternates: localizedAlternates("en", "/strategies"),
}

export default function StrategiesPage() {
  return <StrategiesPageContent />
}
