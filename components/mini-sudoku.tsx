"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shuffle, Check, Play } from "lucide-react"
import { useTranslation } from "react-i18next"
import { CelebrationModal } from "@/components/celebration-modal"

type SudokuGrid = (number | null)[][]
type CellState = "correct" | "incorrect" | "empty" | "given"

// Simple 4x4 Sudoku generator
const generateSimpleSudoku = (): { puzzle: SudokuGrid; solution: SudokuGrid } => {
  // Pre-defined 4x4 puzzles with solutions
  const puzzles = [
    {
      puzzle: [
        [1, null, 3, null],
        [null, 4, null, 2],
        [null, 2, null, 4],
        [4, null, 1, null],
      ],
      solution: [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1],
      ],
    },
    {
      puzzle: [
        [null, 2, null, 4],
        [4, null, 2, null],
        [null, 1, null, 3],
        [3, null, 4, null],
      ],
      solution: [
        [1, 2, 3, 4],
        [4, 3, 2, 1],
        [2, 1, 4, 3],
        [3, 4, 1, 2],
      ],
    },
    {
      puzzle: [
        [null, null, 3, 4],
        [3, 4, null, null],
        [null, null, 4, 1],
        [4, 1, null, null],
      ],
      solution: [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 3, 4, 1],
        [4, 1, 2, 3],
      ],
    },
  ]

  // Randomly select a puzzle
  const randomIndex = Math.floor(Math.random() * puzzles.length)
  return puzzles[randomIndex]
}

interface MiniSudokuProps {
  onPlayFullGame?: () => void
}

export function MiniSudoku({ onPlayFullGame }: MiniSudokuProps) {
  const { t } = useTranslation()
  const [gameState, setGameState] = useState<{
    puzzle: SudokuGrid
    solution: SudokuGrid
    userGrid: SudokuGrid
    selectedCell: [number, number] | null
    isComplete: boolean
    errors: boolean[][]
  }>({
    puzzle: Array(4)
      .fill(null)
      .map(() => Array(4).fill(null)),
    solution: Array(4)
      .fill(null)
      .map(() => Array(4).fill(null)),
    userGrid: Array(4)
      .fill(null)
      .map(() => Array(4).fill(null)),
    selectedCell: null,
    isComplete: false,
    errors: Array(4)
      .fill(null)
      .map(() => Array(4).fill(false)),
  })

  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !gameState.isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, gameState.isComplete])

  // Initialize game
  useEffect(() => {
    generateNewPuzzle()
  }, [])

  // Check for completion and show celebration
  useEffect(() => {
    if (gameState.isComplete && !showCelebration) {
      setIsTimerRunning(false)
      setTimeout(() => {
        setShowCelebration(true)
      }, 500) // Small delay for better UX
    }
  }, [gameState.isComplete, showCelebration])

  // Generate new puzzle
  const generateNewPuzzle = () => {
    const { puzzle, solution } = generateSimpleSudoku()

    setGameState({
      puzzle,
      solution,
      userGrid: puzzle.map((row) => [...row]),
      selectedCell: null,
      isComplete: false,
      errors: Array(4)
        .fill(null)
        .map(() => Array(4).fill(false)),
    })

    setTimer(0)
    setIsTimerRunning(true)
    setMistakes(0)
    setShowCelebration(false)
    setGameStartTime(Date.now())
  }

  // Validate cell input
  const validateCell = (row: number, col: number, value: number | null): boolean => {
    if (value === null) return true

    // Check row
    for (let c = 0; c < 4; c++) {
      if (c !== col && gameState.userGrid[row][c] === value) return false
    }

    // Check column
    for (let r = 0; r < 4; r++) {
      if (r !== row && gameState.userGrid[r][col] === value) return false
    }

    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2
    const boxCol = Math.floor(col / 2) * 2
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && gameState.userGrid[r][c] === value) return false
      }
    }

    return true
  }

  // Handle cell input
  const handleCellInput = (row: number, col: number, value: number | null) => {
    if (gameState.puzzle[row][col] !== null) return // Can't modify given cells

    const newUserGrid = gameState.userGrid.map((r) => [...r])
    const newErrors = gameState.errors.map((r) => [...r])

    newUserGrid[row][col] = value
    const isCorrect = value === null || validateCell(row, col, value)
    newErrors[row][col] = value !== null && !isCorrect

    // Count mistakes
    if (value !== null && !isCorrect) {
      setMistakes((prev) => prev + 1)
    }

    // Check if puzzle is complete
    const isComplete = newUserGrid.every((row, r) =>
      row.every((cell, c) => cell !== null && cell === gameState.solution[r][c]),
    )

    setGameState((prev) => ({
      ...prev,
      userGrid: newUserGrid,
      errors: newErrors,
      isComplete,
    }))
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCell: [row, col],
    }))
  }

  // Get cell state for styling
  const getCellState = (row: number, col: number): CellState => {
    if (gameState.errors[row][col]) return "incorrect"
    if (gameState.puzzle[row][col] !== null) return "given"
    if (gameState.userGrid[row][col] !== null) return "correct"
    return "empty"
  }

  // Check solution
  const checkSolution = () => {
    const newErrors = gameState.userGrid.map((row, r) =>
      row.map((cell, c) => cell !== null && cell !== gameState.solution[r][c]),
    )

    setGameState((prev) => ({
      ...prev,
      errors: newErrors,
    }))
  }

  return (
    <>
      <Card className="p-4 shadow-lg bg-white">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">{t("miniGame.title", "Quick Play 4x4 Sudoku")}</h3>
          <div className="text-sm text-gray-600">
            {t("miniGame.timer", "Time")}: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* 4x4 Sudoku grid */}
        <div className="grid grid-cols-4 gap-0 mx-auto w-fit border-2 border-gray-800 rounded-lg overflow-hidden mb-4">
          {gameState.userGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = gameState.selectedCell?.[0] === rowIndex && gameState.selectedCell?.[1] === colIndex
              const cellState = getCellState(rowIndex, colIndex)
              const isInSameRow = gameState.selectedCell?.[0] === rowIndex
              const isInSameCol = gameState.selectedCell?.[1] === colIndex
              const isInSameBox =
                gameState.selectedCell &&
                Math.floor(gameState.selectedCell[0] / 2) === Math.floor(rowIndex / 2) &&
                Math.floor(gameState.selectedCell[1] / 2) === Math.floor(colIndex / 2)

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl font-semibold
                    border border-gray-300 transition-all duration-150 relative
                    ${rowIndex % 2 === 1 && rowIndex !== 3 ? "border-b-2 border-b-gray-800" : ""}
                    ${colIndex % 2 === 1 && colIndex !== 3 ? "border-r-2 border-r-gray-800" : ""}
                    ${isSelected ? "bg-blue-100 ring-2 ring-blue-500" : ""}
                    ${!isSelected && (isInSameRow || isInSameCol || isInSameBox) ? "bg-blue-50" : ""}
                    ${cellState === "given" ? "bg-gray-100 text-gray-800 font-bold" : ""}
                    ${cellState === "correct" ? "bg-white text-blue-600" : ""}
                    ${cellState === "incorrect" ? "bg-red-100 text-red-600" : ""}
                    ${cellState === "empty" ? "bg-white text-gray-400" : ""}
                    hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${gameState.isComplete ? "bg-green-50" : ""}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={gameState.isComplete}
                >
                  {cell || ""}
                </button>
              )
            }),
          )}
        </div>

        {/* Number input buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              onClick={() => {
                if (gameState.selectedCell) {
                  const [row, col] = gameState.selectedCell
                  handleCellInput(row, col, num)
                }
              }}
              disabled={!gameState.selectedCell || gameState.isComplete}
              className="min-w-0 flex-1"
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (gameState.selectedCell) {
                const [row, col] = gameState.selectedCell
                handleCellInput(row, col, null)
              }
            }}
            disabled={!gameState.selectedCell || gameState.isComplete}
            className="flex-1"
          >
            {t("miniGame.clear", "Clear")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={checkSolution}
            disabled={gameState.isComplete}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-1" />
            {t("miniGame.check", "Check")}
          </Button>

          <Button variant="default" size="sm" onClick={generateNewPuzzle} className="flex-1">
            <Shuffle className="w-4 h-4 mr-1" />
            {t("miniGame.new", "New")}
          </Button>
        </div>

        {/* Play full game button */}
        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onPlayFullGame}>
          <Play className="w-4 h-4 mr-2" />
          {t("miniGame.playFull", "Play Full 9x9 Sudoku")}
        </Button>
      </Card>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onNewGame={() => {
          setShowCelebration(false)
          generateNewPuzzle()
        }}
        onNextLevel={() => {
          setShowCelebration(false)
          onPlayFullGame?.()
        }}
        gameStats={{
          time: timer,
          difficulty: "Easy",
          hintsUsed: 0,
          mistakes: mistakes,
          isPersonalBest: timer < 120, // Under 2 minutes is considered good for 4x4
        }}
        gameType="mini"
      />
    </>
  )
}
