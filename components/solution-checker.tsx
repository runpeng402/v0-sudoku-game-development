"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface SolutionCheckerProps {
  onClose?: () => void
}

type SudokuGrid = (number | null)[][]

export function SolutionChecker({ onClose }: SolutionCheckerProps) {
  const { t } = useTranslation()
  const [grid, setGrid] = useState<SudokuGrid>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  )
  const [checkResult, setCheckResult] = useState<{
    isValid: boolean
    isComplete: boolean
    errors: { row: number; col: number; message: string }[]
  } | null>(null)

  const handleCellChange = (row: number, col: number, value: string) => {
    const num = value === "" ? null : Number.parseInt(value)
    if (num !== null && (num < 1 || num > 9)) return

    const newGrid = grid.map((r) => [...r])
    newGrid[row][col] = num
    setGrid(newGrid)
    setCheckResult(null) // Clear previous results
  }

  const validateSudoku = () => {
    const errors: { row: number; col: number; message: string }[] = []
    let isComplete = true

    // Check for empty cells
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          isComplete = false
        }
      }
    }

    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>()
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col]
        if (value !== null) {
          if (seen.has(value)) {
            errors.push({
              row,
              col,
              message: `Duplicate ${value} in row ${row + 1}`,
            })
          }
          seen.add(value)
        }
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>()
      for (let row = 0; row < 9; row++) {
        const value = grid[row][col]
        if (value !== null) {
          if (seen.has(value)) {
            errors.push({
              row,
              col,
              message: `Duplicate ${value} in column ${col + 1}`,
            })
          }
          seen.add(value)
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>()
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const value = grid[row][col]
            if (value !== null) {
              if (seen.has(value)) {
                errors.push({
                  row,
                  col,
                  message: `Duplicate ${value} in box ${boxRow * 3 + boxCol + 1}`,
                })
              }
              seen.add(value)
            }
          }
        }
      }
    }

    setCheckResult({
      isValid: errors.length === 0,
      isComplete,
      errors,
    })
  }

  const clearGrid = () => {
    setGrid(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null)),
    )
    setCheckResult(null)
  }

  const hasError = (row: number, col: number) => {
    return checkResult?.errors.some((error) => error.row === row && error.col === col) || false
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Sudoku Solution Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Enter your sudoku solution in the grid below and click "Check Solution" to validate it. Empty cells are
              allowed for partial solutions.
            </p>
          </div>

          {/* Sudoku Grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 rounded-lg overflow-hidden w-fit">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell || ""}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-sm sm:text-base md:text-lg font-semibold
                      border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-gray-800" : ""}
                      ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-gray-800" : ""}
                      ${hasError(rowIndex, colIndex) ? "bg-red-100 text-red-600" : "bg-white"}
                    `}
                    maxLength={1}
                  />
                )),
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={validateSudoku} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Check Solution
            </Button>
            <Button onClick={clearGrid} variant="outline" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Clear Grid
            </Button>
          </div>

          {/* Results */}
          {checkResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  checkResult.isValid && checkResult.isComplete
                    ? "bg-green-50 border border-green-200"
                    : checkResult.isValid
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {checkResult.isValid && checkResult.isComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Perfect Solution!</span>
                    </>
                  ) : checkResult.isValid ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Valid but Incomplete</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Invalid Solution</span>
                    </>
                  )}
                </div>

                {checkResult.isValid && checkResult.isComplete && (
                  <p className="text-green-700">Congratulations! Your sudoku solution is completely correct.</p>
                )}

                {checkResult.isValid && !checkResult.isComplete && (
                  <p className="text-yellow-700">
                    Your solution is valid so far, but there are still empty cells to fill.
                  </p>
                )}

                {!checkResult.isValid && (
                  <div>
                    <p className="text-red-700 mb-2">
                      Found {checkResult.errors.length} error{checkResult.errors.length > 1 ? "s" : ""}:
                    </p>
                    <ul className="space-y-1">
                      {checkResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-sm text-red-600">
                          • Row {error.row + 1}, Column {error.col + 1}: {error.message}
                        </li>
                      ))}
                      {checkResult.errors.length > 5 && (
                        <li className="text-sm text-red-600">• ... and {checkResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
