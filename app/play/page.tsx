import type { Metadata } from "next"
import { SudokuGamePage } from "@/components/sudoku-game-page"

export const metadata: Metadata = {
  title: "Play Sudoku Online - Free Sudoku Game | SudokuStudio",
  description:
    "Play free Sudoku puzzles online with multiple difficulty levels. Features hints, timer, and step-by-step solutions. Perfect for beginners and experts.",
  keywords: "play sudoku, online sudoku game, free sudoku, sudoku puzzles, sudoku solver, brain games",
  openGraph: {
    title: "Play Sudoku Online - Free Sudoku Game",
    description: "Play free Sudoku puzzles online with multiple difficulty levels and helpful features.",
    url: "https://www.sudokustudio.app/play",
    siteName: "SudokuStudio",
    images: [
      {
        url: "https://www.sudokustudio.app/images/sudoku-game-og.jpg",
        width: 1200,
        height: 630,
        alt: "Play Sudoku Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Sudoku Online - Free Sudoku Game",
    description: "Play free Sudoku puzzles online with multiple difficulty levels and helpful features.",
    images: ["https://www.sudokustudio.app/images/sudoku-game-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/play",
  },
}

export default function PlayPage() {
  return <SudokuGamePage />
}
