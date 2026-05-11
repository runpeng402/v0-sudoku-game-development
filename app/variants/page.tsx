import type { Metadata } from "next"
import { VariantsPageContent } from "@/components/variants-page"

export const metadata: Metadata = {
  title: "Sudoku Variants & Printable Puzzles - Free Killer, Samurai, Jigsaw Sudoku",
  description:
    "Explore exciting sudoku variants including killer sudoku online free, samurai sudoku puzzles printable, jigsaw sudoku puzzles free, diagonal sudoku, and 16x16 sudoku puzzles. Download printable PDF puzzles for all skill levels.",
  keywords: [
    "sudoku variants",
    "killer sudoku online free",
    "samurai sudoku puzzles printable",
    "jigsaw sudoku puzzles free",
    "diagonal sudoku puzzles printable",
    "hyper sudoku online",
    "16x16 sudoku puzzles online",
    "sudoku printable PDF",
    "free sudoku variants",
    "sudoku puzzle generator",
    "printable sudoku puzzles",
    "sudoku for seniors printable",
    "sudoku for classroom use",
    "sudoku printable for teachers",
    "custom sudoku puzzles",
    "sudoku variants download",
  ],
  openGraph: {
    title: "Free Sudoku Variants & Printable Puzzles - Killer, Samurai, Jigsaw",
    description:
      "Download free printable sudoku variants including killer sudoku, samurai sudoku, jigsaw sudoku, and more. Perfect for all skill levels with PDF downloads available.",
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
      "Download free printable sudoku variants including killer sudoku, samurai sudoku, jigsaw sudoku, and more.",
    images: ["/twitter-variants.png"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/variants",
  },
}

export default function VariantsPage() {
  return <VariantsPageContent />
}
