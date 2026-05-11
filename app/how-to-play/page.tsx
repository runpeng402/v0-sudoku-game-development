import type { Metadata } from "next"
import { HowToPlayPageContent } from "@/components/how-to-play-page"

export const metadata: Metadata = {
  title: "How to Play Sudoku - Complete Beginner's Guide | Sudoku Studio",
  description:
    "Learn how to play Sudoku with our comprehensive guide. Master the rules, techniques, and strategies from beginner to expert level. Free interactive tutorials included.",
  keywords: [
    "how to play sudoku",
    "sudoku rules",
    "sudoku tutorial",
    "sudoku for beginners",
    "learn sudoku",
    "sudoku guide",
    "sudoku instructions",
    "sudoku techniques",
    "sudoku solving methods",
    "beginner sudoku",
  ],
  openGraph: {
    title: "How to Play Sudoku - Complete Beginner's Guide",
    description:
      "Master Sudoku with our step-by-step guide. Learn rules, techniques, and strategies for all skill levels.",
    url: "https://www.sudokustudio.app/how-to-play",
    images: ["/og-how-to-play.png"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/how-to-play",
  },
}

export default function HowToPlayPage() {
  return <HowToPlayPageContent />
}
