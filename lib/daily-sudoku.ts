import { createSeededRandom, generateSudokuPuzzle, type SudokuDifficulty } from "@/lib/sudoku-generator"

export const dailyDifficulties: SudokuDifficulty[] = ["easy", "medium", "hard"]

export interface DailyPuzzle {
  date: string
  difficulty: SudokuDifficulty
  puzzle: string
  solution: string
}

/** Daily puzzles roll over at midnight UTC so every visitor gets the same board on the same day. */
export function dailyDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function dailyPuzzle(date: string, difficulty: SudokuDifficulty): DailyPuzzle {
  const { puzzle, solution } = generateSudokuPuzzle(difficulty, createSeededRandom(`sudokustudio-daily-${date}-${difficulty}`))
  return {
    date,
    difficulty,
    puzzle: puzzle.flat().map((value) => value ?? 0).join(""),
    solution: solution.flat().join(""),
  }
}

export function formatDailyDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
