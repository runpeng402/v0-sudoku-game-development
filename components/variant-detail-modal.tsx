"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Target, Brain, Info, CheckCircle, ArrowRight } from "lucide-react"

interface VariantDetailModalProps {
  variant: {
    id: string
    title: string
    description: string
    difficulty?: string
    icon: any
    color: string
  } | null
  isOpen: boolean
  onClose: () => void
  onGetPuzzles: (variantId: string) => void
}

export function VariantDetailModal({ variant, isOpen, onClose, onGetPuzzles }: VariantDetailModalProps) {
  if (!variant) return null

  const getVariantDetails = (variantId: string) => {
    switch (variantId) {
      case "samurai":
        return {
          fullDescription:
            "Samurai Sudoku consists of five overlapping 9×9 grids arranged in a pattern where the four corner grids overlap with the central grid. This creates an exciting and challenging puzzle that requires advanced solving techniques and careful attention to the overlapping regions.",
          rules: [
            "Each of the five 9×9 grids follows standard sudoku rules",
            "Numbers 1-9 must appear exactly once in each row, column, and 3×3 box within each grid",
            "The overlapping regions must satisfy the rules for both grids they belong to",
            "Solving requires careful tracking of candidates across all five grids",
          ],
          difficulty: "Expert level - requires advanced techniques and patience",
          history:
            "Samurai Sudoku was first popularized in Japanese puzzle magazines in the early 2000s and quickly gained international popularity for its complex and satisfying challenge.",
          tips: [
            "Start with the central grid and work outward",
            "Use the overlapping regions to your advantage - they provide extra constraints",
            "Keep track of candidates carefully, especially in overlapping areas",
            "Solve in pencil first, as mistakes can be difficult to correct",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      case "killer":
        return {
          fullDescription:
            "Killer Sudoku combines elements of sudoku with kakuro puzzles. The grid is divided into irregular 'cages' outlined with dotted lines, and each cage has a sum that the numbers within it must add up to. This adds a mathematical dimension to the standard sudoku challenge.",
          rules: [
            "Standard sudoku rules apply - numbers 1-9 must appear once in each row, column, and 3×3 box",
            "Numbers within each cage must sum to the total shown in the corner of the cage",
            "No number can repeat within a cage",
            "Cages do not need to follow the 3×3 box boundaries",
          ],
          difficulty: "Hard - requires both logical and mathematical thinking",
          history:
            "Killer Sudoku was developed in the early 2000s as a variation that adds mathematical elements to the standard puzzle. It's particularly popular among those who enjoy both logic and arithmetic puzzles.",
          tips: [
            "Start with cages that have very low or very high sums - they have fewer possible combinations",
            "Look for cages with few cells but high sums, or many cells but low sums",
            "Remember that no digit can repeat in a cage",
            "Use the 'cage sum' constraints alongside standard sudoku techniques",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      case "jigsaw":
        return {
          fullDescription:
            "Jigsaw Sudoku (also called Irregular Sudoku) replaces the standard 3×3 boxes with irregularly shaped regions. Each region still contains 9 cells, but their shapes are non-standard. This creates a fresh challenge while maintaining the core sudoku principles.",
          rules: [
            "Numbers 1-9 must appear exactly once in each row and column",
            "Numbers 1-9 must appear exactly once in each irregular region",
            "Each irregular region contains exactly 9 cells",
            "All other standard sudoku rules apply",
          ],
          difficulty: "Medium to Hard - familiar rules but requires adapting to irregular regions",
          history:
            "Jigsaw Sudoku emerged as one of the early popular variations of standard sudoku, offering a fresh challenge to experienced solvers while maintaining the fundamental principles of the puzzle.",
          tips: [
            "Focus on rows and columns first, as they remain standard",
            "Use color coding to help visualize the irregular regions",
            "Apply standard techniques but pay extra attention to region boundaries",
            "Look for cells that belong to particularly constrained regions",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      case "diagonal":
        return {
          fullDescription:
            "Diagonal Sudoku adds an extra constraint to the standard puzzle: the two main diagonals (from top-left to bottom-right and top-right to bottom-left) must also contain the numbers 1-9 without repetition. This additional rule creates new solving opportunities and challenges.",
          rules: [
            "Standard sudoku rules apply - numbers 1-9 in each row, column, and 3×3 box",
            "The main diagonal from top-left to bottom-right must contain numbers 1-9",
            "The main diagonal from top-right to bottom-left must contain numbers 1-9",
            "No repetition is allowed in either diagonal",
          ],
          difficulty: "Hard - familiar format with additional constraints",
          history:
            "Diagonal Sudoku is one of the most popular sudoku variants, adding a simple but powerful constraint that creates new solving patterns and techniques.",
          tips: [
            "Pay special attention to cells that belong to both a diagonal and a 3×3 box",
            "Use the diagonal constraints to eliminate possibilities in intersecting rows and columns",
            "Look for numbers that are already placed on the diagonals to narrow down possibilities",
            "Standard techniques still apply, but with the added diagonal constraints",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      case "hyper":
        return {
          fullDescription:
            "Hyper Sudoku (also known as NRC Sudoku or Windoku) adds four extra 3×3 regions to the standard grid. These additional regions overlap with the standard 3×3 boxes and must also contain the numbers 1-9 without repetition, creating additional constraints.",
          rules: [
            "Standard sudoku rules apply - numbers 1-9 in each row, column, and 3×3 box",
            "Four additional 3×3 regions must also contain numbers 1-9 without repetition",
            "These extra regions are typically located in the middle of each quadrant of the grid",
            "Cells in these extra regions must satisfy both standard and hyper constraints",
          ],
          difficulty: "Hard - familiar format with significant additional constraints",
          history:
            "Hyper Sudoku was popularized by the Dutch newspaper NRC Handelsblad (hence the alternative name 'NRC Sudoku') and has become a favorite among experienced solvers seeking additional challenges.",
          tips: [
            "Pay special attention to cells that belong to both standard and extra regions",
            "Use the additional constraints to your advantage - they often create more solving opportunities",
            "Standard techniques still apply, but consider the extra regions when analyzing possibilities",
            "The center of each quadrant is particularly constrained - start there",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      case "16x16":
        return {
          fullDescription:
            "16×16 Sudoku expands the standard 9×9 grid to a much larger 16×16 grid. Instead of numbers 1-9, it uses either numbers 1-16 or letters A-P. The grid is divided into sixteen 4×4 boxes, and each row, column, and 4×4 box must contain all 16 symbols without repetition.",
          rules: [
            "Numbers 1-16 (or letters A-P) must appear exactly once in each row and column",
            "Each 4×4 box must contain all 16 symbols without repetition",
            "The basic principles are the same as standard sudoku, just expanded",
            "Solving requires tracking more candidates and possibilities",
          ],
          difficulty: "Expert - significantly more complex than standard 9×9 puzzles",
          history:
            "16×16 Sudoku emerged as puzzle enthusiasts sought ever-greater challenges. The expanded grid creates a substantially more complex puzzle that requires advanced techniques and careful tracking of possibilities.",
          tips: [
            "Use a systematic notation system for candidates - there are many more to track",
            "Focus on the most constrained cells first",
            "Look for 'hidden singles' and other standard techniques, which still apply",
            "Consider using letters instead of numbers for clarity",
            "Take your time - these puzzles are meant to be challenging!",
          ],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }

      default:
        return {
          fullDescription: "This is a unique sudoku variant with special rules and challenges.",
          rules: ["Follow standard sudoku rules", "Additional special constraints apply"],
          difficulty: "Varies depending on the specific puzzle",
          history: "This variant has its own unique development history in the world of logic puzzles.",
          tips: ["Apply standard techniques", "Pay attention to the special rules"],
          imageUrl: "/placeholder.svg?height=200&width=200",
        }
    }
  }

  const details = getVariantDetails(variant.id)
  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-700 border-green-200"
      case "blue":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "red":
        return "bg-red-100 text-red-700 border-red-200"
      case "purple":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "orange":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "indigo":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const renderVariantExample = (variantId: string) => {
    switch (variantId) {
      case "killer":
        return (
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-red-50">
              <span className="text-red-600 text-xs">15</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-red-50 text-gray-900">
              7
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-blue-50">
              <span className="text-blue-600 text-xs">12</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-red-50 text-gray-900">
              8
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-green-50">
              <span className="text-green-600 text-xs">9</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-blue-50 text-gray-900">
              5
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-green-50 text-gray-900">
              4
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-green-50"></div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-purple-50">
              <span className="text-purple-600 text-xs">6</span>
            </div>
          </div>
        )

      case "jigsaw":
        return (
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="w-8 h-8 border-2 border-red-400 flex items-center justify-center bg-red-50 text-gray-900">
              5
            </div>
            <div className="w-8 h-8 border-2 border-red-400 flex items-center justify-center bg-red-50 text-gray-900">
              3
            </div>
            <div className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center bg-blue-50 text-gray-900">
              4
            </div>
            <div className="w-8 h-8 border-2 border-red-400 flex items-center justify-center bg-red-50 text-gray-900">
              6
            </div>
            <div className="w-8 h-8 border-2 border-green-400 flex items-center justify-center bg-green-50 text-gray-900">
              7
            </div>
            <div className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center bg-blue-50 text-gray-900">
              8
            </div>
            <div className="w-8 h-8 border-2 border-green-400 flex items-center justify-center bg-green-50 text-gray-900">
              1
            </div>
            <div className="w-8 h-8 border-2 border-green-400 flex items-center justify-center bg-green-50 text-gray-900">
              9
            </div>
            <div className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center bg-blue-50 text-gray-900">
              2
            </div>
          </div>
        )

      case "diagonal":
        return (
          <div className="grid grid-cols-3 gap-1 text-xs relative">
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-yellow-100 text-gray-900">
              5
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">3</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-yellow-100 text-gray-900">
              4
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">6</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-yellow-200 text-gray-900">
              7
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">8</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-yellow-100 text-gray-900">
              1
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">9</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-yellow-100 text-gray-900">
              2
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-yellow-400 border-dashed opacity-50 transform rotate-45"></div>
              <div className="w-full h-full border-2 border-yellow-400 border-dashed opacity-50 transform -rotate-45"></div>
            </div>
          </div>
        )

      case "samurai":
        return (
          <div className="flex flex-col items-center space-y-1">
            <div className="grid grid-cols-5 gap-px text-xs">
              <div className="w-4 h-4 border border-gray-400 bg-blue-50"></div>
              <div className="w-4 h-4 border border-gray-400 bg-blue-50"></div>
              <div className="w-4 h-4"></div>
              <div className="w-4 h-4 border border-gray-400 bg-green-50"></div>
              <div className="w-4 h-4 border border-gray-400 bg-green-50"></div>
            </div>
            <div className="grid grid-cols-5 gap-px text-xs">
              <div className="w-4 h-4 border border-gray-400 bg-blue-50"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4 border border-gray-400 bg-green-50"></div>
            </div>
            <div className="grid grid-cols-5 gap-px text-xs">
              <div className="w-4 h-4"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4 border border-gray-400 bg-red-100"></div>
              <div className="w-4 h-4"></div>
            </div>
            <div className="text-xs text-gray-700 mt-1">5 Overlapping Grids</div>
          </div>
        )

      case "hyper":
        return (
          <div className="grid grid-cols-3 gap-1 text-xs relative">
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">5</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-purple-100 text-gray-900">
              3
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">4</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-purple-100 text-gray-900">
              6
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">7</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-purple-100 text-gray-900">
              8
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">1</div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-purple-100 text-gray-900">
              9
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">2</div>
            <div className="absolute inset-2 border-2 border-purple-400 border-dashed rounded opacity-60 pointer-events-none"></div>
          </div>
        )

      case "16x16":
        return (
          <div className="grid grid-cols-4 gap-px text-xs">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 border border-gray-400 flex items-center justify-center text-xs bg-gray-50 text-gray-900"
              >
                {i < 10 ? i + 1 : String.fromCharCode(65 + i - 10)}
              </div>
            ))}
            <div className="col-span-4 text-xs text-gray-700 mt-1 text-center">16×16 Grid</div>
          </div>
        )

      default:
        return (
          <div className="grid grid-cols-3 gap-1 text-xs">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-900">
                {i % 2 === 0 ? i + 1 : ""}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="bg-white p-6 rounded-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(variant.color)}`}
              >
                <variant.icon className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">{variant.title}</DialogTitle>
                {variant.difficulty && (
                  <Badge variant="outline" className={`mt-1 ${getColorClasses(variant.color)}`}>
                    {variant.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Overview */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">About {variant.title}</h3>
                <p className="text-gray-700 leading-relaxed">{details.fullDescription}</p>
              </div>
              <div className="md:w-64 flex-shrink-0">
                <div className="w-full h-48 rounded-lg border border-gray-200 bg-white p-4 flex flex-col items-center justify-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">Example:</div>
                  {renderVariantExample(variant.id)}
                </div>
              </div>
            </div>

            {/* Rules */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Info className="w-5 h-5 text-blue-600" />
                  Rules
                </h3>
                <ul className="space-y-2">
                  {details.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* History */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Brain className="w-5 h-5 text-purple-600" />
                  History & Background
                </h3>
                <p className="text-gray-700">{details.history}</p>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Target className="w-5 h-5 text-red-600" />
                  Solving Tips
                </h3>
                <div className="space-y-2">
                  {details.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onGetPuzzles(variant.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download {variant.title}
              </Button>
              <Button variant="outline" onClick={onClose} className="bg-white text-gray-700 border-gray-300">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
