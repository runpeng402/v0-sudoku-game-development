import type { Metadata } from "next"
import { defaultOgImage } from "@/lib/seo-locales"
import { LeaderboardPageContent } from "@/components/leaderboard-page"

export const metadata: Metadata = {
  title: "Sudoku Leaderboard - Top Players & Rankings | SudokuStudio",
  description:
    "View the global Sudoku leaderboard and rankings. See top players, fastest solve times, and compete with Sudoku enthusiasts worldwide.",
  keywords: [
    "sudoku leaderboard",
    "sudoku rankings",
    "top sudoku players",
    "sudoku competition",
    "fastest sudoku solve",
    "sudoku champions",
    "global rankings",
    "sudoku scores",
    "puzzle competition",
    "sudoku tournament",
  ],
  openGraph: {
    images: [defaultOgImage],
    title: "Sudoku Leaderboard - Top Players & Rankings",
    description: "View the global Sudoku leaderboard and compete with players worldwide.",
    url: "https://www.sudokustudio.app/leaderboard",
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/leaderboard",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LeaderboardPage() {
  return <LeaderboardPageContent />
}
