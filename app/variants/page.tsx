import type { Metadata } from "next"
import { VariantsPageContent } from "@/components/variants-page"

export const metadata: Metadata = {
  title: "Sudoku Variants & Printable Puzzles - Free Killer, Samurai, Jigsaw Sudoku",
  description:
    "Compare the rules of Killer, Samurai, Jigsaw, Diagonal, Hyper and 16×16 Sudoku.",
  openGraph: {
    title: "Free Sudoku Variants & Printable Puzzles - Killer, Samurai, Jigsaw",
    description:
      "Compare Sudoku variants and learn the rules that distinguish them from classic Sudoku.",
    url: "https://www.sudokustudio.app/variants",
    type: "website",
    images: [
      {
        url: "/og-variants.png",
        width: 1200,
        height: 630,
        alt: "Sudoku Variants - Free Printable Puzzles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sudoku Variants & Printable Puzzles",
    description:
      "Learn how the rules differ across popular Sudoku variants.",
    images: ["/twitter-variants.png"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/variants",
  },
}

export default function VariantsPage() {
  return <VariantsPageContent />
}
