"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Eye, Brain, Target, ArrowRight } from "lucide-react"

type SudokuGrid = (number | null)[][]

interface StepExplanation {
  type: "nakedSingle" | "hiddenSingle" | "elimination" | "pointing"
  cell: [number, number]
  value?: number
  reasoning: {
    observation: string
    analysis: string[]
    elimination: number[]
    conclusion: string
    whyNotOthers?: string[]
  }
  visualAids: {
    highlightCells: [number, number][]
    eliminatedNumbers: { [key: string]: number[] }
    focusAreas: ("row" | "column" | "box")[]
  }
}

interface StepExplanationProps {
  explanation: StepExplanation
  userGrid: SudokuGrid
  onApplyStep?: () => void
  showVisualAids: boolean
  onToggleVisualAids: () => void
}

export function StepExplanationComponent({
  explanation,
  userGrid,
  onApplyStep,
  showVisualAids,
  onToggleVisualAids,
}: StepExplanationProps) {
  const { t } = useTranslation()
  const [expandedSections, setExpandedSections] = useState<string[]>(["observation"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const [row, col] = explanation.cell

  // 获取相关区域的数字
  const getRowNumbers = () => {
    return userGrid[row].filter((n) => n !== null) as number[]
  }

  const getColumnNumbers = () => {
    return userGrid.map((r) => r[col]).filter((n) => n !== null) as number[]
  }

  const getBoxNumbers = () => {
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    const numbers: number[] = []
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (userGrid[r][c] !== null) {
          numbers.push(userGrid[r][c] as number)
        }
      }
    }
    return numbers
  }

  const allUsedNumbers = [...new Set([...getRowNumbers(), ...getColumnNumbers(), ...getBoxNumbers()])]
  const availableNumbers = Array.from({ length: 9 }, (_, i) => i + 1).filter((n) => !allUsedNumbers.includes(n))

  return (
    <Card className="w-full border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            {t(`hints.techniques.${explanation.type}.name`)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleVisualAids}>
              <Eye className="w-4 h-4 mr-1" />
              {showVisualAids ? "隐藏" : "显示"}辅助
            </Button>
            {onApplyStep && (
              <Button size="sm" onClick={onApplyStep}>
                <Target className="w-4 h-4 mr-1" />
                应用此步
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">{t(`hints.techniques.${explanation.type}.description`)}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 观察部分 */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto"
            onClick={() => toggleSection("observation")}
          >
            <div className="flex items-center gap-2">
              {expandedSections.includes("observation") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium">1. {t("hints.stepByStep.lookAt")}</span>
            </div>
          </Button>

          {expandedSections.includes("observation") && (
            <div className="ml-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm mb-3">{explanation.reasoning.observation}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <Badge variant="outline" className="mb-1">
                    第{row + 1}行
                  </Badge>
                  <div>已有数字: {getRowNumbers().join(", ") || "无"}</div>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    第{col + 1}列
                  </Badge>
                  <div>已有数字: {getColumnNumbers().join(", ") || "无"}</div>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    第{Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1}宫
                  </Badge>
                  <div>已有数字: {getBoxNumbers().join(", ") || "无"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 分析部分 */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => toggleSection("analysis")}>
            <div className="flex items-center gap-2">
              {expandedSections.includes("analysis") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium">2. {t("hints.stepByStep.analyzing")}</span>
            </div>
          </Button>

          {expandedSections.includes("analysis") && (
            <div className="ml-6 space-y-3">
              {explanation.reasoning.analysis.map((step, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 排除过程 */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto"
            onClick={() => toggleSection("elimination")}
          >
            <div className="flex items-center gap-2">
              {expandedSections.includes("elimination") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium">3. 排除不可能的数字</span>
            </div>
          </Button>

          {expandedSections.includes("elimination") && (
            <div className="ml-6 p-3 bg-red-50 rounded-lg">
              <div className="grid grid-cols-9 gap-1 mb-3">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
                  const isEliminated = explanation.reasoning.elimination.includes(num)
                  const isAvailable = availableNumbers.includes(num)
                  return (
                    <div
                      key={num}
                      className={`
                        w-8 h-8 flex items-center justify-center text-sm font-medium rounded
                        ${
                          isEliminated
                            ? "bg-red-200 text-red-700 line-through"
                            : isAvailable
                              ? "bg-green-200 text-green-700"
                              : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >
                      {num}
                    </div>
                  )
                })}
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>被排除的数字: {explanation.reasoning.elimination.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>可能的数字: {availableNumbers.join(", ")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 结论部分 */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto"
            onClick={() => toggleSection("conclusion")}
          >
            <div className="flex items-center gap-2">
              {expandedSections.includes("conclusion") ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium">4. {t("hints.stepByStep.conclusion")}</span>
            </div>
          </Button>

          {expandedSections.includes("conclusion") && (
            <div className="ml-6 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium mb-2">{explanation.reasoning.conclusion}</p>
              {explanation.value && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">答案:</span>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {explanation.value}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 为什么不是其他数字 */}
        {explanation.reasoning.whyNotOthers && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto"
              onClick={() => toggleSection("whyNotOthers")}
            >
              <div className="flex items-center gap-2">
                {expandedSections.includes("whyNotOthers") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">5. {t("hints.stepByStep.whyNotOthers")}</span>
              </div>
            </Button>

            {expandedSections.includes("whyNotOthers") && (
              <div className="ml-6 space-y-2">
                {explanation.reasoning.whyNotOthers.map((reason, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded text-sm">
                    {reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 学习要点 */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 学习要点</h4>
          <p className="text-sm text-blue-700">{t(`hints.techniques.${explanation.type}.howTo`)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
