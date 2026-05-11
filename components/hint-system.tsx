"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, Eye, AlertTriangle, List, BookOpen, ChevronRight, Brain } from "lucide-react"

type SudokuGrid = (number | null)[][]
type HintType = "answer" | "possible" | "error" | "technique"

interface SolvingTechnique {
  type: "nakedSingle" | "hiddenSingle" | "elimination" | "pointing"
  cell: [number, number]
  value?: number
  explanation: string
  highlightCells: [number, number][]
}

interface StepExplanation {
  type: string
  cell: [number, number]
  value?: number
  reasoning: {
    observation: string
    analysis: string[]
    elimination: number[]
    conclusion: string
    whyNotOthers: string[]
  }
  visualAids: {
    highlightCells: [number, number][]
    eliminatedNumbers: { [key: string]: number[] }
    focusAreas: string[]
  }
}

interface HintSystemProps {
  puzzle: SudokuGrid
  solution: SudokuGrid
  userGrid: SudokuGrid
  selectedCell: [number, number] | null
  errors: boolean[][]
  onHintUsed: (type: HintType, data: any) => void
  maxHints?: number
  hintsUsed: number
  teachingMode: boolean
  onTeachingModeToggle: () => void
}

export function HintSystem({
  puzzle,
  solution,
  userGrid,
  selectedCell,
  errors,
  onHintUsed,
  maxHints = 10,
  hintsUsed,
  teachingMode,
  onTeachingModeToggle,
}: HintSystemProps) {
  const { t } = useTranslation()
  const [selectedHintType, setSelectedHintType] = useState<HintType>("answer")
  const [lastHint, setLastHint] = useState<string | null>(null)

  const hintsRemaining = maxHints - hintsUsed
  const canUseHint = hintsRemaining > 0

  // 计算可能的数字
  const getPossibleNumbers = (row: number, col: number): number[] => {
    if (userGrid[row][col] !== null) return []

    const possible: number[] = []
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(userGrid, row, col, num)) {
        possible.push(num)
      }
    }
    return possible
  }

  // 检查移动是否有效
  const isValidMove = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // 检查行
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false
    }

    // 检查列
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false
    }

    // 检查3x3宫格
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false
      }
    }

    return true
  }

  // 查找解题技巧
  const findSolvingTechnique = (row: number, col: number): SolvingTechnique | null => {
    if (userGrid[row][col] !== null) return null

    const possible = getPossibleNumbers(row, col)

    // 唯一候选数（Naked Single）
    if (possible.length === 1) {
      return {
        type: "nakedSingle",
        cell: [row, col],
        value: possible[0],
        explanation: t("hints.techniques.nakedSingle"),
        highlightCells: [[row, col]],
      }
    }

    // 隐性唯一（Hidden Single）
    for (const num of possible) {
      // 检查行中的隐性唯一
      let canPlaceInRow = 0
      let lastValidCol = col
      for (let c = 0; c < 9; c++) {
        if (userGrid[row][c] === null && isValidMove(userGrid, row, c, num)) {
          canPlaceInRow++
          lastValidCol = c
        }
      }
      if (canPlaceInRow === 1 && lastValidCol === col) {
        return {
          type: "hiddenSingle",
          cell: [row, col],
          value: num,
          explanation: t("hints.techniques.hiddenSingle"),
          highlightCells: Array.from({ length: 9 }, (_, c) => [row, c]),
        }
      }

      // 检查列中的隐性唯一
      let canPlaceInCol = 0
      let lastValidRow = row
      for (let r = 0; r < 9; r++) {
        if (userGrid[r][col] === null && isValidMove(userGrid, r, col, num)) {
          canPlaceInCol++
          lastValidRow = r
        }
      }
      if (canPlaceInCol === 1 && lastValidRow === row) {
        return {
          type: "hiddenSingle",
          cell: [row, col],
          value: num,
          explanation: t("hints.techniques.hiddenSingle"),
          highlightCells: Array.from({ length: 9 }, (_, r) => [r, col]),
        }
      }

      // 检查宫格中的隐性唯一
      const boxRow = Math.floor(row / 3) * 3
      const boxCol = Math.floor(col / 3) * 3
      let canPlaceInBox = 0
      let lastValidCell: [number, number] = [row, col]
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (userGrid[r][c] === null && isValidMove(userGrid, r, c, num)) {
            canPlaceInBox++
            lastValidCell = [r, c]
          }
        }
      }
      if (canPlaceInBox === 1 && lastValidCell[0] === row && lastValidCell[1] === col) {
        const boxCells: [number, number][] = []
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            boxCells.push([r, c])
          }
        }
        return {
          type: "hiddenSingle",
          cell: [row, col],
          value: num,
          explanation: t("hints.techniques.hiddenSingle"),
          highlightCells: boxCells,
        }
      }
    }

    return null
  }

  // 生成详细的步骤解释
  const generateDetailedExplanation = (row: number, col: number): StepExplanation | null => {
    if (userGrid[row][col] !== null) return null

    const possible = getPossibleNumbers(row, col)
    const rowNumbers = userGrid[row].filter((n) => n !== null) as number[]
    const colNumbers = userGrid.map((r) => r[col]).filter((n) => n !== null) as number[]

    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    const boxNumbers: number[] = []
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (userGrid[r][c] !== null) {
          boxNumbers.push(userGrid[r][c] as number)
        }
      }
    }

    const allUsed = [...new Set([...rowNumbers, ...colNumbers, ...boxNumbers])]
    const eliminated = Array.from({ length: 9 }, (_, i) => i + 1).filter((n) => allUsed.includes(n))

    // 唯一候选数
    if (possible.length === 1) {
      const answer = possible[0]
      return {
        type: "nakedSingle",
        cell: [row, col],
        value: answer,
        reasoning: {
          observation: `观察位置 (${row + 1}, ${col + 1})，我们需要找出这里可以填入什么数字。`,
          analysis: [
            `第${row + 1}行已有数字: ${rowNumbers.join(", ") || "无"}`,
            `第${col + 1}列已有数字: ${colNumbers.join(", ") || "无"}`,
            `第${Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1}宫已有数字: ${boxNumbers.join(", ") || "无"}`,
            `根据数独规则，同行、同列、同宫不能有重复数字`,
            `因此需要排除所有已使用的数字: ${eliminated.join(", ")}`,
          ],
          elimination: eliminated,
          conclusion: `经过排除后，只有数字 ${answer} 可以填入这个位置。这就是"唯一候选数"技巧。`,
          whyNotOthers: eliminated.map(
            (num) =>
              `数字 ${num} 不能填入，因为它已经在${
                rowNumbers.includes(num) ? "同行" : colNumbers.includes(num) ? "同列" : "同宫"
              }中出现过`,
          ),
        },
        visualAids: {
          highlightCells: [[row, col]],
          eliminatedNumbers: { [`${row}-${col}`]: eliminated },
          focusAreas: ["row", "column", "box"],
        },
      }
    }

    // 隐性唯一
    for (const num of possible) {
      // 检查行中的隐性唯一
      let canPlaceInRow = 0
      const otherPositions: number[] = []
      for (let c = 0; c < 9; c++) {
        if (userGrid[row][c] === null && isValidMove(userGrid, row, c, num)) {
          canPlaceInRow++
          if (c !== col) otherPositions.push(c + 1)
        }
      }

      if (canPlaceInRow === 1) {
        return {
          type: "hiddenSingle",
          cell: [row, col],
          value: num,
          reasoning: {
            observation: `我们来分析数字 ${num} 在第${row + 1}行中的可能位置。`,
            analysis: [
              `检查数字 ${num} 在第${row + 1}行的所有空格中是否可以放置`,
              `逐一检查每个空格，考虑列和宫的限制`,
              `发现数字 ${num} 在这一行中只能放在位置 (${row + 1}, ${col + 1})`,
              `虽然这个格子还有其他候选数字 [${possible.join(", ")}]`,
              `但数字 ${num} 在这一行中没有其他地方可以放置`,
            ],
            elimination: [],
            conclusion: `因此，根据"隐性唯一"规则，这个位置必须填入数字 ${num}。`,
            whyNotOthers: [
              `其他候选数字 [${possible.filter((n) => n !== num).join(", ")}] 在这一行的其他位置还有可能放置`,
              `但数字 ${num} 如果不放在这里，这一行就无法完成了`,
            ],
          },
          visualAids: {
            highlightCells: Array.from({ length: 9 }, (_, c) => [row, c]),
            eliminatedNumbers: {},
            focusAreas: ["row"],
          },
        }
      }

      // 类似地检查列和宫...
    }

    return null
  }

  // 处理提示请求
  const handleHintRequest = () => {
    if (!canUseHint || !selectedCell) return

    const [row, col] = selectedCell

    let hintData: any = null
    let hintMessage = ""

    switch (selectedHintType) {
      case "answer":
        if (puzzle[row][col] === null) {
          hintData = { cell: [row, col], answer: solution[row][col] }
          hintMessage = `${t("hints.hintTypes.answer")}: ${solution[row][col]}`
        }
        break

      case "possible":
        const possible = getPossibleNumbers(row, col)
        hintData = { cell: [row, col], possible }
        hintMessage = `${t("hints.hintTypes.possible")}: ${possible.join(", ") || "无"}`
        break

      case "error":
        const hasError = errors[row][col]
        hintData = { cell: [row, col], hasError }
        hintMessage = hasError
          ? `${t("hints.hintTypes.error")}: 此位置有错误`
          : `${t("hints.hintTypes.error")}: 此位置正确`
        break

      case "technique":
        const technique = findSolvingTechnique(row, col)
        if (technique) {
          hintData = technique
          hintMessage = `${t("hints.hintTypes.technique")}: ${technique.explanation}`
        } else {
          hintMessage = "未找到明显的解题技巧"
        }
        break
    }

    if (hintData) {
      onHintUsed(selectedHintType, hintData)
      setLastHint(hintMessage)
    }
  }

  // 自动求解下一步
  const handleNextStep = () => {
    if (!canUseHint) return

    // 寻找最简单的下一步
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userGrid[row][col] === null && puzzle[row][col] === null) {
          const technique = findSolvingTechnique(row, col)
          if (technique && technique.type === "nakedSingle") {
            onHintUsed("technique", {
              ...technique,
              autoFill: true,
            })
            setLastHint(`自动填入: ${technique.value} (${technique.explanation})`)
            return
          }
        }
      }
    }

    // 如果没有找到唯一候选数，寻找隐性唯一
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userGrid[row][col] === null && puzzle[row][col] === null) {
          const technique = findSolvingTechnique(row, col)
          if (technique && technique.type === "hiddenSingle") {
            onHintUsed("technique", {
              ...technique,
              autoFill: true,
            })
            setLastHint(`自动填入: ${technique.value} (${technique.explanation})`)
            return
          }
        }
      }
    }

    setLastHint("未找到明显的下一步")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            {t("hints.title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={canUseHint ? "default" : "secondary"}>
              {t("hints.hintsRemaining", { count: hintsRemaining })}
            </Badge>
            <Button variant={teachingMode ? "default" : "outline"} size="sm" onClick={onTeachingModeToggle}>
              <BookOpen className="w-4 h-4 mr-1" />
              {t("hints.teachingMode")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 提示类型选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("hints.hintTypes.answer")}</label>
          <Select value={selectedHintType} onValueChange={(value: HintType) => setSelectedHintType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="answer">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t("hints.hintTypes.answer")}
                </div>
              </SelectItem>
              <SelectItem value="possible">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  {t("hints.hintTypes.possible")}
                </div>
              </SelectItem>
              <SelectItem value="error">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t("hints.hintTypes.error")}
                </div>
              </SelectItem>
              <SelectItem value="technique">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  {t("hints.hintTypes.technique")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 提示按钮 */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleHintRequest}
            disabled={!canUseHint || !selectedCell}
            className="flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {t("hints.getHint")}
          </Button>

          {teachingMode && (
            <Button
              onClick={handleNextStep}
              disabled={!canUseHint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              {t("hints.nextStep")}
            </Button>
          )}
        </div>

        {/* 最后的提示信息 */}
        {lastHint && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">{lastHint}</p>
          </div>
        )}

        {/* 使用统计 */}
        <div className="text-xs text-gray-500 text-center">{t("hints.hintUsed", { count: hintsUsed })}</div>

        {!canUseHint && <div className="text-center text-red-600 text-sm">{t("hints.noHintsLeft")}</div>}
      </CardContent>
    </Card>
  )
}
