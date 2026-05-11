"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Lightbulb, Brain, Zap, ArrowRight, CheckCircle, Play } from "lucide-react"

interface StrategyDetailModalProps {
  strategy: {
    name: string
    description: string
    difficulty: string
    icon: any
    color: string
  } | null
  isOpen: boolean
  onClose: () => void
  onPractice?: () => void
}

export function StrategyDetailModal({ strategy, isOpen, onClose, onPractice }: StrategyDetailModalProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

  if (!strategy) return null

  const getStrategyDetails = (strategyName: string) => {
    switch (strategyName) {
      case "Naked Single":
        return {
          overview:
            "Naked Single is the most fundamental sudoku technique. When a cell can only contain one possible number, that's a naked single. This happens when all other numbers (1-9) are already present in the same row, column, or 3×3 box.",
          steps: [
            "Select an empty cell to analyze",
            "Check which numbers already exist in the same row",
            "Check which numbers already exist in the same column",
            "Check which numbers already exist in the same 3×3 box",
            "Eliminate all found numbers from possibilities",
            "If only one number remains, that's your answer!",
          ],
          example: {
            situation:
              "A cell's row contains {1,3,5,7,9}, its column contains {2,4,6,8}, and its box contains {1,2,3,4,5,6,7,8}",
            solution: "By elimination, only the number 9 can fit in this cell",
          },
          tips: [
            "Always start with cells that have the fewest possibilities",
            "Systematically check every row, column, and box",
            "Use pencil marks to track candidate numbers",
            "This technique often reveals other naked singles",
          ],
        }

      case "Hidden Single":
        return {
          overview:
            "Hidden Single occurs when a number can only be placed in one position within a row, column, or box, even though that cell might have multiple candidate numbers. The 'single' is 'hidden' among other possibilities.",
          steps: [
            "Choose a specific number (1-9) to focus on",
            "Look at one row and find where this number could go",
            "If only one cell in the row can contain this number, place it",
            "Repeat for all columns and 3×3 boxes",
            "Continue with the next number until all are placed",
          ],
          example: {
            situation: "Number 7 needs to be placed in the top row, but most cells already eliminate this possibility",
            solution: "If only one cell in the row can accommodate 7, that's a hidden single",
          },
          tips: [
            "Focus on one number at a time for systematic searching",
            "Pay attention to rows/columns/boxes that are nearly complete",
            "Hidden singles often appear after placing naked singles",
            "Use this technique in combination with elimination",
          ],
        }

      case "Elimination":
        return {
          overview:
            "Elimination is the systematic process of removing impossible numbers from cells to narrow down possibilities. It's the foundation that makes other techniques possible and should be applied continuously throughout solving.",
          steps: [
            "Mark all possible candidate numbers in each empty cell",
            "When a number is placed anywhere, update all affected cells",
            "Remove that number from the same row, column, and box",
            "Continue updating until new definitive answers emerge",
            "Repeat this process throughout the entire puzzle",
          ],
          example: {
            situation: "A cell initially has candidates {1,3,5,7}, but after placing numbers in related cells",
            solution: "The candidates reduce to {3,7}, and eventually to just {7}",
          },
          tips: [
            "Keep candidate lists updated constantly",
            "Use small numbers in cell corners for tracking",
            "Regularly scan for new naked or hidden singles",
            "This technique enables all other advanced strategies",
          ],
        }

      case "Naked Pairs":
        return {
          overview:
            "Naked Pairs occur when two cells in the same row, column, or box contain exactly the same two candidate numbers. These two numbers must go in these two cells, so they can be eliminated from all other cells in that unit.",
          steps: [
            "Look for two cells with identical candidate pairs",
            "Verify they're in the same row, column, or box",
            "Eliminate these two numbers from all other cells in that unit",
            "Check if this elimination reveals new solving opportunities",
            "Continue scanning for more naked pairs",
          ],
          example: {
            situation: "Two cells in a row both contain only candidates {4,9}",
            solution: "Numbers 4 and 9 can be eliminated from all other cells in that row",
          },
          tips: [
            "Naked pairs can appear in any unit (row, column, or box)",
            "Sometimes leads to chain reactions of eliminations",
            "Look for this pattern after basic elimination",
            "Can be extended to naked triples and quads",
          ],
        }

      case "Pointing Pairs":
        return {
          overview:
            "Pointing Pairs (also called Box/Line Reduction) occur when a candidate number in a box is restricted to only one row or column within that box. This means the number can be eliminated from the same row/column outside the box.",
          steps: [
            "Focus on one number and one 3×3 box",
            "Check if this number can only appear in one row of the box",
            "If yes, eliminate this number from the rest of that row outside the box",
            "Repeat for columns within the box",
            "Continue with other numbers and boxes",
          ],
          example: {
            situation: "Number 6 in the top-left box can only go in the top row of that box",
            solution: "Eliminate 6 from all other cells in the top row outside this box",
          },
          tips: [
            "Very effective for breaking through difficult puzzles",
            "Often creates immediate solving opportunities",
            "Work systematically through all numbers and boxes",
            "Combines well with basic elimination techniques",
          ],
        }

      case "Box/Line Reduction":
        return {
          overview:
            "Box/Line Reduction is the reverse of Pointing Pairs. When a candidate number in a row or column is restricted to only one box, it can be eliminated from other cells in that box that aren't in the same row/column.",
          steps: [
            "Focus on one number and one row or column",
            "Check if this number can only appear in one box within that row/column",
            "If yes, eliminate this number from other cells in that box",
            "The eliminations must be outside the original row/column",
            "Repeat for all numbers and all rows/columns",
          ],
          example: {
            situation: "Number 3 in the middle row can only go in the center box",
            solution: "Eliminate 3 from all other cells in the center box not in the middle row",
          },
          tips: [
            "Often works in conjunction with pointing pairs",
            "Creates powerful elimination chains",
            "Essential for solving harder puzzles",
            "Requires careful attention to box boundaries",
          ],
        }

      case "X-Wing":
        return {
          overview:
            "X-Wing is an advanced elimination pattern involving four cells that form a rectangle. When a candidate number appears in only two positions in two different rows, and these positions align in the same two columns, it creates an X-Wing pattern.",
          steps: [
            "Find a number that appears in exactly two cells in one row",
            "Find another row where the same number appears in exactly two cells",
            "Check if these four cells form a perfect rectangle",
            "If yes, eliminate this number from all other cells in those two columns",
            "The pattern works the same way with columns and rows reversed",
          ],
          example: {
            situation: "Number 8 appears only in columns 2 and 7 of both row 3 and row 8",
            solution: "Eliminate 8 from all other cells in columns 2 and 7",
          },
          tips: [
            "One of the most powerful intermediate techniques",
            "Can dramatically simplify complex puzzles",
            "Look for this pattern when basic techniques stall",
            "Practice recognizing the rectangular formation",
          ],
        }

      case "Swordfish":
        return {
          overview:
            "Swordfish is an extension of X-Wing involving three rows and three columns. When a candidate number is restricted to the same three columns across three different rows (or vice versa), it creates a swordfish pattern that allows powerful eliminations.",
          steps: [
            "Find three rows where a number appears in at most three positions each",
            "Check if all these positions align in exactly the same three columns",
            "Verify the pattern forms a valid swordfish configuration",
            "Eliminate the number from all other cells in those three columns",
            "The technique also works with three columns and three rows",
          ],
          example: {
            situation: "Number 5 appears only in columns 1, 4, and 8 across rows 2, 5, and 9",
            solution: "Eliminate 5 from all other cells in columns 1, 4, and 8",
          },
          tips: [
            "Much rarer than X-Wing but extremely powerful",
            "Requires careful pattern recognition",
            "Often appears in expert-level puzzles",
            "Can break through seemingly impossible situations",
          ],
        }

      case "XY-Wing":
        return {
          overview:
            "XY-Wing involves three cells forming a chain where eliminations can be made. It consists of a 'pivot' cell with two candidates, and two 'wing' cells that each share one candidate with the pivot. This creates a logical elimination opportunity.",
          steps: [
            "Find a cell with exactly two candidates (the pivot)",
            "Find two other cells that each share one candidate with the pivot",
            "Ensure the wing cells can 'see' each other (same row, column, or box)",
            "The remaining candidate can be eliminated from cells that see both wings",
            "Verify the logical chain before making eliminations",
          ],
          example: {
            situation: "Pivot cell has {3,7}, one wing has {3,9}, another wing has {7,9}",
            solution: "Number 9 can be eliminated from cells that can see both wing cells",
          },
          tips: [
            "Requires strong logical reasoning skills",
            "Often the key to solving expert puzzles",
            "Look for this pattern when other techniques fail",
            "Practice identifying the three-cell chain formation",
          ],
        }

      default:
        return {
          overview: "This is an important sudoku solving technique that will help improve your puzzle-solving skills.",
          steps: [
            "Learn the basic concept and when to apply it",
            "Understand the logical reasoning behind the technique",
            "Practice identifying the pattern in real puzzles",
            "Apply the technique systematically",
          ],
          example: {
            situation: "Specific puzzle situation where this technique applies",
            solution: "How the technique resolves the situation",
          },
          tips: [
            "Practice regularly to master this technique",
            "Combine with other techniques for best results",
            "Look for opportunities to apply this in every puzzle",
          ],
        }
    }
  }

  const details = getStrategyDetails(strategy.name)
  const totalSteps = details.steps.length

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-700 border-green-200"
      case "yellow":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "red":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handlePractice = () => {
    onClose()
    if (onPractice) {
      onPractice()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "white",
          color: "#111827",
          border: "1px solid #e5e7eb",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="w-full h-full p-6 rounded-lg" style={{ backgroundColor: "white", color: "#111827" }}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
              >
                <strategy.icon className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold" style={{ color: "#111827" }}>
                  {strategy.name}
                </DialogTitle>
                <Badge variant="outline" className={`mt-1 ${getColorClasses(strategy.color)}`}>
                  {strategy.difficulty}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Overview */}
            <Card className="border border-gray-200" style={{ backgroundColor: "white" }}>
              <CardContent className="p-6" style={{ backgroundColor: "white" }}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                  <Target className="w-5 h-5 text-blue-600" />
                  Technique Overview
                </h3>
                <p className="leading-relaxed" style={{ color: "#374151" }}>
                  {details.overview}
                </p>
              </CardContent>
            </Card>

            {/* Step-by-step Guide */}
            <Card className="border border-gray-200" style={{ backgroundColor: "white" }}>
              <CardContent className="p-6" style={{ backgroundColor: "white" }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#111827" }}>
                  <Brain className="w-5 h-5 text-purple-600" />
                  Step-by-Step Guide
                </h3>

                <div className="space-y-3">
                  {details.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border ${
                        currentStep === index ? "border-l-4 border-l-blue-500" : "border-gray-100"
                      }`}
                      style={{
                        backgroundColor: currentStep === index ? "#eff6ff" : "white",
                      }}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {currentStep > index ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: "#111827" }}>
                          Step {index + 1}
                        </p>
                        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    style={{ backgroundColor: "white", color: "#374151", borderColor: "#d1d5db" }}
                  >
                    Previous Step
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                    disabled={currentStep === totalSteps - 1}
                    style={{ backgroundColor: "white", color: "#374151", borderColor: "#d1d5db" }}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example */}
            <Card className="border border-gray-200" style={{ backgroundColor: "white" }}>
              <CardContent className="p-6" style={{ backgroundColor: "white" }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#111827" }}>
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Practical Example
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-orange-200" style={{ backgroundColor: "#fef3c7" }}>
                    <h4 className="font-medium mb-2" style={{ color: "#92400e" }}>
                      Situation
                    </h4>
                    <p className="text-sm" style={{ color: "#b45309" }}>
                      {details.example.situation}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-green-200" style={{ backgroundColor: "#d1fae5" }}>
                    <h4 className="font-medium mb-2" style={{ color: "#065f46" }}>
                      Solution
                    </h4>
                    <p className="text-sm" style={{ color: "#047857" }}>
                      {details.example.solution}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-gray-200" style={{ backgroundColor: "white" }}>
              <CardContent className="p-6" style={{ backgroundColor: "white" }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#111827" }}>
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Pro Tips
                </h3>

                <div className="space-y-2">
                  {details.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm" style={{ color: "#374151" }}>
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={handlePractice}
                style={{ backgroundColor: "#2563eb", color: "white" }}
              >
                <Play className="w-4 h-4 mr-2" />
                Practice This Technique
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                style={{ backgroundColor: "white", color: "#374151", borderColor: "#d1d5db" }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
