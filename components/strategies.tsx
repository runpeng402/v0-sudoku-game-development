"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Target, Lightbulb, Zap, ArrowRight, BookOpen } from "lucide-react"
import { useState } from "react"
import { StrategyDetailModal } from "./strategy-detail-modal"

interface StrategiesProps {
  onNavigate?: (page: "home" | "play" | "how-to-play" | "strategies") => void
}

export function Strategies({ onNavigate }: StrategiesProps) {
  const { t } = useTranslation()
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLearnMore = (strategy: any) => {
    setSelectedStrategy(strategy)
    setIsModalOpen(true)
  }

  const handlePractice = () => {
    // Navigate to the game page for practice
    if (onNavigate) {
      onNavigate("play")
    }
  }

  const beginnerStrategies = [
    {
      name: "Naked Single",
      description: "When only one number can fit in a cell",
      difficulty: "Beginner",
      icon: Target,
      color: "green",
    },
    {
      name: "Hidden Single",
      description: "When a number can only go in one place",
      difficulty: "Beginner",
      icon: Lightbulb,
      color: "green",
    },
    {
      name: "Elimination",
      description: "Remove impossible numbers systematically",
      difficulty: "Beginner",
      icon: Brain,
      color: "green",
    },
  ]

  const intermediateStrategies = [
    {
      name: "Naked Pairs",
      description: "Two cells with same two candidates",
      difficulty: "Intermediate",
      icon: Target,
      color: "yellow",
    },
    {
      name: "Pointing Pairs",
      description: "Numbers confined to one row/column in box",
      difficulty: "Intermediate",
      icon: Lightbulb,
      color: "yellow",
    },
    {
      name: "Box/Line Reduction",
      description: "Eliminate candidates across boxes",
      difficulty: "Intermediate",
      icon: Brain,
      color: "yellow",
    },
  ]

  const advancedStrategies = [
    {
      name: "X-Wing",
      description: "Advanced elimination pattern",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
    },
    {
      name: "Swordfish",
      description: "Complex three-line pattern",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
    },
    {
      name: "XY-Wing",
      description: "Three-cell elimination chain",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
    },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sudoku Strategies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master advanced solving techniques from beginner to expert level
          </p>
        </div>

        {/* Beginner Strategies */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beginner Strategies</h2>
            <p className="text-lg text-gray-600">Start your sudoku journey with these fundamental techniques</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beginnerStrategies.map((strategy, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
                    >
                      <strategy.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={getColorClasses(strategy.color)}>
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn this fundamental technique to improve your sudoku solving speed and accuracy.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleLearnMore(strategy)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Intermediate Strategies */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intermediate Strategies</h2>
            <p className="text-lg text-gray-600">Take your skills to the next level with these advanced techniques</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intermediateStrategies.map((strategy, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
                    >
                      <strategy.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={getColorClasses(strategy.color)}>
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Master these intermediate techniques to tackle medium and hard sudoku puzzles.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleLearnMore(strategy)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advanced Strategies */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Strategies</h2>
            <p className="text-lg text-gray-600">Master expert-level techniques for the most challenging puzzles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advancedStrategies.map((strategy, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
                    >
                      <strategy.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={getColorClasses(strategy.color)}>
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Expert-level techniques for the most challenging sudoku puzzles.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleLearnMore(strategy)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Practice Section */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Practice These Strategies?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply what you've learned with our interactive sudoku puzzles and hint system.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => onNavigate?.("play")}>
            <ArrowRight className="w-5 h-5 mr-2" />
            Practice Now
          </Button>
        </section>

        {/* Strategy Detail Modal */}
        <StrategyDetailModal
          strategy={selectedStrategy}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPractice={handlePractice}
        />
      </div>
    </div>
  )
}
