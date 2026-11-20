"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowRight,
  Grid,
  Puzzle,
  Printer,
  Target,
  Brain,
  Users,
  Heart,
  Home,
  Play,
  BookOpen,
  CheckCircle,
  Info,
  Clock,
} from "lucide-react"

function VariantsContent() {
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sudokuVariants = [
    {
      id: "samurai",
      title: "Samurai Sudoku Puzzles Printable",
      description: "Five overlapping 9×9 grids create an exciting challenge for experienced solvers",
      difficulty: "Expert",
      icon: Grid,
      color: "purple",
      estimatedTime: "2-4 hours",
      popularity: "Very Popular",
      detailedDescription:
        "Samurai Sudoku consists of five overlapping standard Sudoku grids. The overlapping areas must satisfy the constraints of both grids they belong to, creating a unique and challenging solving experience.",
      rules: [
        "Each of the five 9×9 grids follows standard sudoku rules",
        "Numbers 1-9 must appear exactly once in each row, column, and 3×3 box within each grid",
        "The overlapping regions must satisfy the rules for both grids they belong to",
        "Solving requires careful tracking of candidates across all five grids",
      ],
      history:
        "Samurai Sudoku was first popularized in Japanese puzzle magazines in the early 2000s and quickly gained international popularity for its complex and satisfying challenge.",
      tips: [
        "Start with the central grid and work outward",
        "Use the overlapping regions to your advantage - they provide extra constraints",
        "Keep track of candidates carefully, especially in overlapping areas",
        "Solve in pencil first, as mistakes can be difficult to correct",
      ],
    },
    {
      id: "killer",
      title: "Killer Sudoku Online Free",
      description: "Combines sudoku with math puzzles - cages must add up to specific totals",
      difficulty: "Hard",
      icon: Target,
      color: "red",
      estimatedTime: "45-90 minutes",
      popularity: "Most Popular",
      detailedDescription:
        "Killer Sudoku combines traditional Sudoku rules with mathematical constraints. Groups of cells (cages) must sum to specific totals while containing no repeated digits.",
      rules: [
        "Standard sudoku rules apply - numbers 1-9 must appear once in each row, column, and 3×3 box",
        "Numbers within each cage must sum to the total shown in the corner of the cage",
        "No number can repeat within a cage",
        "Cages do not need to follow the 3×3 box boundaries",
      ],
      history:
        "Killer Sudoku was developed in the early 2000s as a variation that adds mathematical elements to the standard puzzle. It's particularly popular among those who enjoy both logic and arithmetic puzzles.",
      tips: [
        "Start with cages that have very low or very high sums - they have fewer possible combinations",
        "Look for cages with few cells but high sums, or many cells but low sums",
        "Remember that no digit can repeat in a cage",
        "Use the 'cage sum' constraints alongside standard sudoku techniques",
      ],
    },
    {
      id: "jigsaw",
      title: "Jigsaw Sudoku Puzzles Free",
      description: "Irregular shaped regions replace the standard 3×3 boxes for a unique challenge",
      difficulty: "Medium",
      icon: Puzzle,
      color: "green",
      estimatedTime: "30-60 minutes",
      popularity: "Popular",
      detailedDescription:
        "Jigsaw Sudoku replaces the regular 3×3 boxes with irregular shaped regions of 9 cells each. This creates unique solving patterns and visual appeal.",
      rules: [
        "Numbers 1-9 must appear exactly once in each row and column",
        "Numbers 1-9 must appear exactly once in each irregular region",
        "Each irregular region contains exactly 9 cells",
        "All other standard sudoku rules apply",
      ],
      history:
        "Jigsaw Sudoku emerged as one of the early popular variations of standard sudoku, offering a fresh challenge to experienced solvers while maintaining the fundamental principles of the puzzle.",
      tips: [
        "Focus on rows and columns first, as they remain standard",
        "Use color coding to help visualize the irregular regions",
        "Apply standard techniques but pay extra attention to region boundaries",
        "Look for cells that belong to particularly constrained regions",
      ],
    },
    {
      id: "diagonal",
      title: "Diagonal Sudoku Puzzles Printable",
      description: "Main diagonals must also contain numbers 1-9 without repetition",
      difficulty: "Hard",
      icon: ArrowRight,
      color: "blue",
      estimatedTime: "40-75 minutes",
      popularity: "Popular",
      detailedDescription:
        "Diagonal Sudoku adds an extra constraint to the standard puzzle: the two main diagonals must also contain the numbers 1-9 without repetition.",
      rules: [
        "Standard sudoku rules apply - numbers 1-9 in each row, column, and 3×3 box",
        "The main diagonal from top-left to bottom-right must contain numbers 1-9",
        "The main diagonal from top-right to bottom-left must contain numbers 1-9",
        "No repetition is allowed in either diagonal",
      ],
      history:
        "Diagonal Sudoku is one of the most popular sudoku variants, adding a simple but powerful constraint that creates new solving patterns and techniques.",
      tips: [
        "Pay special attention to cells that belong to both a diagonal and a 3×3 box",
        "Use the diagonal constraints to eliminate possibilities in intersecting rows and columns",
        "Look for numbers that are already placed on the diagonals to narrow down possibilities",
        "Standard techniques still apply, but with the added diagonal constraints",
      ],
    },
    {
      id: "hyper",
      title: "Hyper Sudoku Online",
      description: "Additional 3×3 regions add extra constraints to the standard puzzle",
      difficulty: "Hard",
      icon: Grid,
      color: "orange",
      estimatedTime: "50-90 minutes",
      popularity: "Challenging",
      detailedDescription:
        "Hyper Sudoku adds four extra 3×3 regions to the standard grid. These additional regions overlap with the standard 3×3 boxes and must also contain the numbers 1-9 without repetition.",
      rules: [
        "Standard sudoku rules apply - numbers 1-9 in each row, column, and 3×3 box",
        "Four additional 3×3 regions must also contain numbers 1-9 without repetition",
        "These extra regions are typically located in the middle of each quadrant of the grid",
        "Cells in these extra regions must satisfy both standard and hyper constraints",
      ],
      history:
        "Hyper Sudoku was popularized by the Dutch newspaper NRC Handelsblad and has become a favorite among experienced solvers seeking additional challenges.",
      tips: [
        "Pay special attention to cells that belong to both standard and extra regions",
        "Use the additional constraints to your advantage - they often create more solving opportunities",
        "Standard techniques still apply, but consider the extra regions when analyzing possibilities",
        "The center of each quadrant is particularly constrained - start there",
      ],
    },
    {
      id: "16x16",
      title: "16×16 Sudoku Puzzles Online",
      description: "Expanded grid using numbers 1-16 or letters A-P for an extreme challenge",
      difficulty: "Expert",
      icon: Grid,
      color: "indigo",
      estimatedTime: "3-6 hours",
      popularity: "For Experts",
      detailedDescription:
        "16×16 Sudoku expands the standard 9×9 grid to a much larger 16×16 grid. Instead of numbers 1-9, it uses either numbers 1-16 or letters A-P.",
      rules: [
        "Numbers 1-16 (or letters A-P) must appear exactly once in each row and column",
        "Each 4×4 box must contain all 16 symbols without repetition",
        "The basic principles are the same as standard sudoku, just expanded",
        "Solving requires tracking more candidates and possibilities",
      ],
      history:
        "16×16 Sudoku emerged as puzzle enthusiasts sought ever-greater challenges. The expanded grid creates a substantially more complex puzzle that requires advanced techniques.",
      tips: [
        "Use a systematic notation system for candidates - there are many more to track",
        "Focus on the most constrained cells first",
        "Look for 'hidden singles' and other standard techniques, which still apply",
        "Consider using letters instead of numbers for clarity",
        "Take your time - these puzzles are meant to be challenging!",
      ],
    },
  ]

  const specialPurpose = [
    {
      id: "seniors",
      title: "Sudoku for Seniors Printable",
      description: "Large print puzzles with high contrast designed for older adults",
      icon: Users,
      color: "blue",
      features: ["Extra large numbers", "High contrast design", "Easy-grip friendly", "Clear visual layout"],
      targetAudience: "Seniors 55+",
    },
    {
      id: "classroom",
      title: "Sudoku for Classroom Use",
      description: "Educational puzzles with teaching guides for students of all ages",
      icon: Brain,
      color: "green",
      features: ["Teaching materials included", "Progressive difficulty", "Group activities", "Answer explanations"],
      targetAudience: "Teachers & Students",
    },
    {
      id: "anxiety",
      title: "Sudoku for Anxiety Relief",
      description: "Mindful puzzles designed to reduce stress and promote relaxation",
      icon: Heart,
      color: "purple",
      features: ["Calming designs", "Gentle difficulty curve", "Mindfulness tips", "Stress-relief focus"],
      targetAudience: "Wellness & Mental Health",
    },
    {
      id: "teachers",
      title: "Sudoku Printable for Teachers",
      description: "Classroom resources with answer keys and difficulty progression",
      icon: Printer,
      color: "indigo",
      features: ["Lesson plans included", "Multiple difficulty levels", "Printable worksheets", "Assessment tools"],
      targetAudience: "Educators",
    },
  ]

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

  const handleLearnMore = (variant: any) => {
    setSelectedVariant(variant)
    setIsModalOpen(true)
  }

  const renderVariantExample = (variantId: string) => {
    switch (variantId) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sudoku Variants & Special Collections</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore exciting sudoku variations and specialized puzzles for every need and skill level
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/how-to-play-sudoku">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">How to Play</span>
            </Button>
          </Link>
          <Link href="/play">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Play className="w-5 h-5" />
              <span className="text-sm">Play Classic</span>
            </Button>
          </Link>
          <Link href="/strategies">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Strategies</span>
            </Button>
          </Link>
          <Link href="/articles">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Articles</span>
            </Button>
          </Link>
        </div>

        {/* Popular Sudoku Variants */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Sudoku Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sudokuVariants.map((variant) => (
              <Card key={variant.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(variant.color)}`}
                    >
                      <variant.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={getColorClasses(variant.color)}>
                      {variant.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{variant.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{variant.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleLearnMore(variant)} className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Special Purpose Sudoku Collections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Special Purpose Sudoku Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialPurpose.map((collection) => (
              <Card key={collection.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(collection.color)}`}
                    >
                      <collection.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{collection.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleLearnMore(collection)} className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 space-y-3 text-center">
          <p className="text-gray-700">Variant downloads and custom generation are temporarily unavailable.</p>
          <Button asChild>
            <Link href="/printable-sudoku">Download classic Sudoku with answers</Link>
          </Button>
        </section>
      </div>

      {/* Variant Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedVariant && (
            <div className="bg-white p-6 rounded-lg">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(selectedVariant.color)}`}
                  >
                    <selectedVariant.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl text-gray-900">{selectedVariant.title}</DialogTitle>
                    {selectedVariant.difficulty && (
                      <Badge variant="outline" className={`mt-1 ${getColorClasses(selectedVariant.color)}`}>
                        {selectedVariant.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Overview */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">About {selectedVariant.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedVariant.detailedDescription}</p>
                  </div>
                  <div className="md:w-64 flex-shrink-0">
                    <div className="w-full h-48 rounded-lg border border-gray-200 bg-white p-4 flex flex-col items-center justify-center">
                      <div className="text-sm font-medium text-gray-600 mb-3">Example:</div>
                      {renderVariantExample(selectedVariant.id)}
                    </div>
                  </div>
                </div>

                {/* Rules */}
                {selectedVariant.rules && (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 bg-white">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Info className="w-5 h-5 text-blue-600" />
                        Rules
                      </h3>
                      <ul className="space-y-2">
                        {selectedVariant.rules.map((rule: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* History */}
                {selectedVariant.history && (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 bg-white">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Clock className="w-5 h-5 text-purple-600" />
                        History & Background
                      </h3>
                      <p className="text-gray-700">{selectedVariant.history}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Tips */}
                {selectedVariant.tips && (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 bg-white">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Target className="w-5 h-5 text-red-600" />
                        Solving Tips
                      </h3>
                      <div className="space-y-2">
                        {selectedVariant.tips.map((tip: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Features for Special Purpose */}
                {selectedVariant.features && (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 bg-white">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Features
                      </h3>
                      <ul className="space-y-2">
                        {selectedVariant.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedVariant.targetAudience && (
                        <div className="mt-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Target: {selectedVariant.targetAudience}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white text-gray-700 border-gray-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export { VariantsContent as VariantsPageContent }
export default VariantsContent
