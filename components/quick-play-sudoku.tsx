"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Check, Lightbulb } from "lucide-react"
import { useTranslation } from "react-i18next"

type SudokuGrid = (number | null)[][]
type CellState = "correct" | "incorrect" | "empty" | "given"

// 简化版的数独生成器，只生成一个简单的4x4数独
const generateSimpleSudoku = (): { puzzle: SudokuGrid; solution: SudokuGrid } => {
  // 预设的简单4x4数独谜题和解答
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
        [1, 2, 3, 4],
        [4, 3, 1, 2],
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

  // 随机选择一个谜题
  const randomIndex = Math.floor(Math.random() * puzzles.length)
  return puzzles[randomIndex]
}

export function QuickPlaySudoku() {
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

  const [hintsUsed, setHintsUsed] = useState(0)

  // 初始化游戏
  useEffect(() => {
    generateNewPuzzle()
  }, [])

  // 生成新的数独谜题
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

    setHintsUsed(0)
  }

  // 验证单元格输入
  const validateCell = (row: number, col: number, value: number | null): boolean => {
    if (value === null) return true

    // 检查行
    for (let c = 0; c < 4; c++) {
      if (c !== col && gameState.userGrid[row][c] === value) return false
    }

    // 检查列
    for (let r = 0; r < 4; r++) {
      if (r !== row && gameState.userGrid[r][col] === value) return false
    }

    // 检查2x2方块
    const boxRow = Math.floor(row / 2) * 2
    const boxCol = Math.floor(col / 2) * 2
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && gameState.userGrid[r][c] === value) return false
      }
    }

    return true
  }

  // 处理单元格输入
  const handleCellInput = (row: number, col: number, value: number | null) => {
    if (gameState.puzzle[row][col] !== null) return // 不能修改给定的单元格

    const newUserGrid = gameState.userGrid.map((r) => [...r])
    const newErrors = gameState.errors.map((r) => [...r])

    newUserGrid[row][col] = value
    const isCorrect = value === null || validateCell(row, col, value)
    newErrors[row][col] = value !== null && !isCorrect

    // 检查是否完成
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

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCell: [row, col],
    }))
  }

  // 获取单元格状态用于样式
  const getCellState = (row: number, col: number): CellState => {
    if (gameState.errors[row][col]) return "incorrect"
    if (gameState.puzzle[row][col] !== null) return "given"
    if (gameState.userGrid[row][col] !== null) return "correct"
    return "empty"
  }

  // 使用提示
  const useHint = () => {
    if (!gameState.selectedCell) return

    const [row, col] = gameState.selectedCell
    if (gameState.puzzle[row][col] !== null) return

    handleCellInput(row, col, gameState.solution[row][col])
    setHintsUsed((prev) => prev + 1)
  }

  // 检查解答
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
    <Card className="p-4 shadow-lg">
      <div className="text-center mb-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={gameState.isComplete ? "default" : "outline"} className="ml-auto">
            {gameState.isComplete ? t("game.complete") : "4x4 简易数独"}
          </Badge>
        </div>

        {gameState.isComplete && <div className="text-green-600 font-semibold mb-2">恭喜！你已完成数独</div>}
      </div>

      {/* 4x4 数独网格 */}
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

      {/* 数字输入按钮 */}
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

      {/* 操作按钮 */}
      <div className="flex justify-between gap-2">
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
          清除
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={useHint}
          disabled={!gameState.selectedCell || gameState.isComplete}
          className="flex-1"
        >
          <Lightbulb className="w-4 h-4 mr-1" />
          提示
        </Button>

        <Button variant="outline" size="sm" onClick={checkSolution} disabled={gameState.isComplete} className="flex-1">
          <Check className="w-4 h-4 mr-1" />
          检查
        </Button>

        <Button variant="default" size="sm" onClick={generateNewPuzzle} className="flex-1">
          <Shuffle className="w-4 h-4 mr-1" />
          新游戏
        </Button>
      </div>

      <div className="text-center mt-4">
        <Button variant="link" className="text-blue-600" onClick={() => (window.location.href = "/play")}>
          开始完整9x9数独游戏 →
        </Button>
      </div>
    </Card>
  )
}
