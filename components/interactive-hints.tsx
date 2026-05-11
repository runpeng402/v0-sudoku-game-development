"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Eye, Brain, Target } from "lucide-react"

interface InteractiveHintsProps {
  onClose?: () => void
}

type SudokuGrid = (number | null)[][]

export function InteractiveHints({ onClose }: InteractiveHintsProps) {
  const { t } = useTranslation()
  const [currentPuzzle, setCurrentPuzzle] = useState<SudokuGrid>([
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ])

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [currentHint, setCurrentHint] = useState<{
    type: string
    message: string
    explanation: string
    highlightCells: [number, number][]
  } | null>(null)

  const solution: SudokuGrid = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]

  const getPossibleNumbers = (row: number, col: number): number[] => {
    if (currentPuzzle[row][col] !== null) return []

    const possible: number[] = []
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(row, col, num)) {
        possible.push(num)
      }
    }
    return possible
  }

  const isValidMove = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && currentPuzzle[row][c] === num) return false
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && currentPuzzle[r][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && currentPuzzle[r][c] === num) return false
      }
    }

    return true
  }

  const generateHint = () => {
    if (!selectedCell) {
      setCurrentHint({
        type: "instruction",
        message: "Please select a cell first",
        explanation: "Click on an empty cell to get a hint for that position.",
        highlightCells: [],
      })
      return
    }

    const [row, col] = selectedCell
    if (currentPuzzle[row][col] !== null) {
      setCurrentHint({
        type: "info",
        message: "This cell is already filled",
        explanation: "Select an empty cell to get solving hints.",
        highlightCells: [],
      })
      return
    }

    const possible = getPossibleNumbers(row, col)

    if (possible.length === 1) {
      setCurrentHint({
        type: "nakedSingle",
        message: `This cell can only be ${possible[0]}`,
        explanation: `Through elimination, only the number ${possible[0]} can fit in this position. This is called a "Naked Single" - the most basic sudoku solving technique.`,
        highlightCells: [[row, col]],
      })
    } else if (possible.length > 1) {
      setCurrentHint({
        type: "candidates",
        message: `Possible numbers: ${possible.join(", ")}`,
        explanation: `This cell could contain any of these numbers: ${possible.join(", ")}. Look for additional clues in the surrounding rows, columns, and boxes to narrow down the possibilities.`,
        highlightCells: [[row, col]],
      })
    } else {
      setCurrentHint({
        type: "error",
        message: "No valid numbers possible",
        explanation:
          "This suggests there might be an error in the puzzle or your current solution. Check for mistakes in the surrounding cells.",
        highlightCells: [[row, col]],
      })
    }
  }

  const showAnswer = () => {
    if (!selectedCell) return

    const [row, col] = selectedCell
    if (currentPuzzle[row][col] !== null) return

    const answer = solution[row][col]
    setCurrentHint({
      type: "answer",
      message: `The answer is ${answer}`,
      explanation: `The correct number for this position is ${answer}. Try to understand why this is the only possible answer by checking the constraints.`,
      highlightCells: [[row, col]],
    })
  }

  const applyHint = () => {
    if (!selectedCell || !currentHint) return

    const [row, col] = selectedCell
    if (currentHint.type === "nakedSingle" || currentHint.type === "answer") {
      const newPuzzle = currentPuzzle.map((r) => [...r])
      newPuzzle[row][col] = solution[row][col]
      setCurrentPuzzle(newPuzzle)
      setCurrentHint(null)
      setSelectedCell(null)
    }
  }

  const isHighlighted = (row: number, col: number) => {
    return currentHint?.highlightCells.some(([r, c]) => r === row && c === col) || false
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Interactive Sudoku with Hints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Click on any empty cell and use the hint buttons to learn solving techniques step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sudoku Grid */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Practice Puzzle</h3>
              <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 rounded-lg overflow-hidden">
                {currentPuzzle.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                    const isGiven = [
                      5, 3, 6, 9, 8, 1, 9, 5, 6, 8, 6, 3, 4, 8, 3, 1, 7, 2, 6, 6, 2, 8, 4, 1, 9, 5, 8, 7, 9,
                    ].includes(cell || 0)

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-lg font-semibold
                          border border-gray-300 transition-all duration-150
                          ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-gray-800" : ""}
                          ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-gray-800" : ""}
                          ${isSelected ? "bg-blue-200 ring-2 ring-blue-500" : ""}
                          ${isHighlighted(rowIndex, colIndex) ? "bg-yellow-200 ring-2 ring-yellow-400" : ""}
                          ${isGiven ? "bg-gray-100 text-gray-800 font-bold" : "bg-white text-blue-600"}
                          ${!isSelected && !isHighlighted(rowIndex, colIndex) ? "hover:bg-blue-50" : ""}
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                        `}
                        onClick={() => setSelectedCell([rowIndex, colIndex])}
                      >
                        {cell || ""}
                      </button>
                    )
                  }),
                )}
              </div>

              {/* Hint Controls */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={generateHint} className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Get Hint
                </Button>
                <Button onClick={showAnswer} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Show Answer
                </Button>
                {currentHint && (currentHint.type === "nakedSingle" || currentHint.type === "answer") && (
                  <Button onClick={applyHint} variant="secondary" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Apply Hint
                  </Button>
                )}
              </div>
            </div>

            {/* Hint Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hint & Explanation</h3>

              {selectedCell ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected: Row {selectedCell[0] + 1}, Column {selectedCell[1] + 1}
                  </p>
                  {currentPuzzle[selectedCell[0]][selectedCell[1]] !== null ? (
                    <p className="text-gray-700">
                      This cell is already filled with {currentPuzzle[selectedCell[0]][selectedCell[1]]}
                    </p>
                  ) : (
                    <p className="text-gray-700">Click "Get Hint" to see what number can go here</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">Select an empty cell to get started</p>
                </div>
              )}

              {currentHint && (
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">
                        {currentHint.type === "nakedSingle" && "Naked Single Technique"}
                        {currentHint.type === "candidates" && "Possible Candidates"}
                        {currentHint.type === "answer" && "Direct Answer"}
                        {currentHint.type === "error" && "Potential Error"}
                        {currentHint.type === "instruction" && "Instructions"}
                        {currentHint.type === "info" && "Information"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-800">{currentHint.message}</p>
                      </div>
                      <p className="text-gray-700">{currentHint.explanation}</p>

                      {currentHint.type === "nakedSingle" && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">💡 Learning Tip</h4>
                          <p className="text-sm text-green-700">
                            The Naked Single is the most basic sudoku technique. Always look for cells where only one
                            number can fit after eliminating all other possibilities.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Technique Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Technique Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="bg-green-50">
                        1
                      </Badge>
                      <div>
                        <h4 className="font-medium">Naked Single</h4>
                        <p className="text-sm text-gray-600">Only one number can fit in a cell</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="bg-blue-50">
                        2
                      </Badge>
                      <div>
                        <h4 className="font-medium">Hidden Single</h4>
                        <p className="text-sm text-gray-600">A number can only go in one place in a row/column/box</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="bg-purple-50">
                        3
                      </Badge>
                      <div>
                        <h4 className="font-medium">Elimination</h4>
                        <p className="text-sm text-gray-600">Remove impossible numbers systematically</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
