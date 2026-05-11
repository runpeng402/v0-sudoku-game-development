import type { Metadata } from "next"
import { ArticlesPageContent } from "@/components/articles-page"

export const metadata: Metadata = {
  title: "Sudoku Articles & Guides - Tips, Tricks & Tutorials | SudokuStudio",
  description:
    "Read comprehensive Sudoku articles, guides, and tutorials. Learn advanced solving techniques, puzzle history, and expert tips from Sudoku masters.",
  keywords: [
    "sudoku articles",
    "sudoku guides",
    "sudoku tutorials",
    "sudoku tips",
    "sudoku history",
    "sudoku techniques",
    "sudoku blog",
    "puzzle solving",
    "sudoku masters",
    "sudoku education",
  ],
  openGraph: {
    title: "Sudoku Articles & Guides - Tips, Tricks & Tutorials",
    description: "Read comprehensive Sudoku articles, guides, and tutorials from experts.",
    url: "https://www.sudokustudio.app/articles",
    images: ["/og-articles.png"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/articles",
  },
}

export default function ArticlesPage() {
  return <ArticlesPageContent />
}
