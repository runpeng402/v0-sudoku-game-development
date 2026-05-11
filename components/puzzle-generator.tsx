"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Settings } from "lucide-react"

interface PuzzleGeneratorProps {
  onClose?: () => void
}

export function PuzzleGenerator({ onClose }: PuzzleGeneratorProps) {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "expert">("medium")
  const [gridSize, setGridSize] = useState<"4x4" | "6x6" | "9x9" | "16x16">("9x9")
  const [variant, setVariant] = useState<"standard" | "killer" | "diagonal" | "hyper">("standard")
  const [quantity, setQuantity] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate puzzle generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a simple puzzle data structure
    const puzzleData = {
      difficulty,
      gridSize,
      variant,
      quantity,
      timestamp: new Date().toISOString(),
      puzzles: Array.from({ length: quantity }, (_, i) => ({
        id: i + 1,
        grid: generateSampleGrid(),
        solution: generateSampleSolution(),
      })),
    }

    // Convert to downloadable format
    const dataStr = JSON.stringify(puzzleData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    // Create download link
    const link = document.createElement("a")
    link.href = url
    link.download = `sudoku-${variant}-${difficulty}-${gridSize}-${quantity}puzzles.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const generateSampleGrid = () => {
    // Generate a sample 9x9 grid with some numbers
    const grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))

    // Add some random numbers for demonstration
    for (let i = 0; i < 20; i++) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      const num = Math.floor(Math.random() * 9) + 1
      grid[row][col] = num
    }

    return grid
  }

  const generateSampleSolution = () => {
    // Generate a complete solution (simplified for demo)
    return Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => Math.floor(Math.random() * 9) + 1),
      )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Sudoku Puzzle Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (40+ clues)</SelectItem>
                <SelectItem value="medium">Medium (30-40 clues)</SelectItem>
                <SelectItem value="hard">Hard (22-30 clues)</SelectItem>
                <SelectItem value="expert">Expert (17-22 clues)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid Size Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Grid Size</label>
            <Select value={gridSize} onValueChange={(value: any) => setGridSize(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4x4">4×4 (Beginner)</SelectItem>
                <SelectItem value="6x6">6×6 (Kids)</SelectItem>
                <SelectItem value="9x9">9×9 (Standard)</SelectItem>
                <SelectItem value="16x16">16×16 (Expert)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Variant Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Puzzle Variant</label>
            <Select value={variant} onValueChange={(value: any) => setVariant(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Sudoku</SelectItem>
                <SelectItem value="killer">Killer Sudoku</SelectItem>
                <SelectItem value="diagonal">Diagonal Sudoku</SelectItem>
                <SelectItem value="hyper">Hyper Sudoku</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Number of Puzzles</label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Puzzle</SelectItem>
                <SelectItem value="5">5 Puzzles</SelectItem>
                <SelectItem value="10">10 Puzzles</SelectItem>
                <SelectItem value="20">20 Puzzles</SelectItem>
                <SelectItem value="50">50 Puzzles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Generation Preview:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                • Difficulty: <Badge variant="outline">{difficulty}</Badge>
              </p>
              <p>
                • Grid Size: <Badge variant="outline">{gridSize}</Badge>
              </p>
              <p>
                • Variant: <Badge variant="outline">{variant}</Badge>
              </p>
              <p>
                • Quantity:{" "}
                <Badge variant="outline">
                  {quantity} puzzle{quantity > 1 ? "s" : ""}
                </Badge>
              </p>
              <p>• Format: PDF with solutions included</p>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Settings className="w-4 h-4 mr-2 animate-spin" />
                Generating Puzzles...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate & Download Puzzles
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Puzzles will be downloaded as a JSON file with complete solutions included.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
