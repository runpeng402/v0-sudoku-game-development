"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Target, Lightbulb, Zap, ArrowRight, BookOpen, Play, Home, Users, Clock } from "lucide-react"
import { useState } from "react"
import { StrategyDetailModal } from "./strategy-detail-modal"
import { I18nProvider } from "@/components/i18n-provider"

function StrategiesContent() {
  const { t } = useTranslation()
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLearnMore = (strategy: any) => {
    setSelectedStrategy(strategy)
    setIsModalOpen(true)
  }

  const handlePractice = () => {
    // This would be handled by routing in the actual implementation
    window.location.href = "/play"
  }

  const beginnerStrategies = [
    {
      name: "Naked Single",
      description: "When only one number can fit in a cell",
      difficulty: "Beginner",
      icon: Target,
      color: "green",
      timeToLearn: "5 minutes",
      usage: "Every puzzle",
      detailedDescription:
        "The naked single is the most fundamental Sudoku technique. It occurs when a cell has only one possible number that can be placed in it, considering all row, column, and box constraints.",
    },
    {
      name: "Hidden Single",
      description: "When a number can only go in one place",
      difficulty: "Beginner",
      icon: Lightbulb,
      color: "green",
      timeToLearn: "10 minutes",
      usage: "Every puzzle",
      detailedDescription:
        "A hidden single occurs when a digit can only be placed in one cell within a row, column, or box, even though that cell might have other candidate numbers.",
    },
    {
      name: "Elimination",
      description: "Remove impossible numbers systematically",
      difficulty: "Beginner",
      icon: Brain,
      color: "green",
      timeToLearn: "15 minutes",
      usage: "Every puzzle",
      detailedDescription:
        "Elimination involves systematically removing numbers that cannot possibly go in a cell based on the numbers already present in the same row, column, or box.",
    },
  ]

  const intermediateStrategies = [
    {
      name: "Naked Pairs",
      description: "Two cells with same two candidates",
      difficulty: "Intermediate",
      icon: Target,
      color: "yellow",
      timeToLearn: "30 minutes",
      usage: "70% of puzzles",
      detailedDescription:
        "When two cells in the same row, column, or box contain exactly the same two candidate numbers, those numbers can be eliminated from all other cells in that unit.",
    },
    {
      name: "Pointing Pairs",
      description: "Numbers confined to one row/column in box",
      difficulty: "Intermediate",
      icon: Lightbulb,
      color: "yellow",
      timeToLearn: "45 minutes",
      usage: "50% of puzzles",
      detailedDescription:
        "When a candidate number in a box is restricted to cells that all lie in the same row or column, that number can be eliminated from the rest of that row or column.",
    },
    {
      name: "Box/Line Reduction",
      description: "Eliminate candidates across boxes",
      difficulty: "Intermediate",
      icon: Brain,
      color: "yellow",
      timeToLearn: "45 minutes",
      usage: "60% of puzzles",
      detailedDescription:
        "When all instances of a candidate number in a row or column within a box are aligned, that number can be eliminated from other positions in the same row or column outside the box.",
    },
  ]

  const advancedStrategies = [
    {
      name: "X-Wing",
      description: "Advanced elimination pattern",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
      timeToLearn: "2 hours",
      usage: "25% of puzzles",
      detailedDescription:
        "X-Wing is a pattern where a candidate appears in exactly two positions in two different rows, and these positions are aligned in two columns, creating an X shape that allows for eliminations.",
    },
    {
      name: "Swordfish",
      description: "Complex three-line pattern",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
      timeToLearn: "3 hours",
      usage: "10% of puzzles",
      detailedDescription:
        "Swordfish extends the X-Wing pattern to three rows and three columns. It's a rare but powerful technique for advanced puzzle solving.",
    },
    {
      name: "XY-Wing",
      description: "Three-cell elimination chain",
      difficulty: "Advanced",
      icon: Zap,
      color: "red",
      timeToLearn: "2.5 hours",
      usage: "15% of puzzles",
      detailedDescription:
        "XY-Wing involves three cells that form a chain, where two cells share candidates with a pivot cell, allowing eliminations in cells that can see both wing cells.",
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sudoku Strategies & Techniques</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master advanced solving techniques from beginner to expert level. Learn the strategies used by Sudoku
            champions.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/how-to-play">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">How to Play</span>
            </Button>
          </Link>
          <Link href="/play">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Play className="w-5 h-5" />
              <span className="text-sm">Practice</span>
            </Button>
          </Link>
          <Link href="/variants">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Target className="w-5 h-5" />
              <span className="text-sm">Variants</span>
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Users className="w-5 h-5" />
              <span className="text-sm">Leaderboard</span>
            </Button>
          </Link>
        </div>

        {/* Strategy Overview */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Strategy Learning Path</CardTitle>
            <CardDescription>Follow this structured approach to master all Sudoku techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Foundation (3 techniques)</h3>
                <p className="text-sm text-gray-600 mb-4">Master the basic techniques that work in every puzzle</p>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  Essential for all players
                </Badge>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Intermediate (3 techniques)</h3>
                <p className="text-sm text-gray-600 mb-4">Learn techniques for medium and hard puzzles</p>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  For advancing players
                </Badge>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Advanced (3+ techniques)</h3>
                <p className="text-sm text-gray-600 mb-4">Master expert techniques for the hardest puzzles</p>
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  For expert players
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beginner Strategies */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Foundation Strategies</h2>
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
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time to learn:</span>
                      <span className="font-medium">{strategy.timeToLearn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used in:</span>
                      <span className="font-medium">{strategy.usage}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{strategy.detailedDescription}</p>
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
            <p className="text-lg text-gray-600">Take your skills to the next level with these powerful techniques</p>
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
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time to learn:</span>
                      <span className="font-medium">{strategy.timeToLearn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used in:</span>
                      <span className="font-medium">{strategy.usage}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{strategy.detailedDescription}</p>
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
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time to learn:</span>
                      <span className="font-medium">{strategy.timeToLearn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used in:</span>
                      <span className="font-medium">{strategy.usage}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{strategy.detailedDescription}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleLearnMore(strategy)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Strategy Comparison */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Strategy Effectiveness Comparison</CardTitle>
            <CardDescription>Understand when and how often to use each technique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Technique</th>
                    <th className="text-left p-3">Difficulty</th>
                    <th className="text-left p-3">Usage Frequency</th>
                    <th className="text-left p-3">Learning Time</th>
                    <th className="text-left p-3">Effectiveness</th>
                  </tr>
                </thead>
                <tbody>
                  {[...beginnerStrategies, ...intermediateStrategies, ...advancedStrategies].map((strategy, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{strategy.name}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className={getColorClasses(strategy.color)}>
                          {strategy.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3">{strategy.usage}</td>
                      <td className="p-3">{strategy.timeToLearn}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i <
                                (
                                  strategy.difficulty === "Beginner"
                                    ? 5
                                    : strategy.difficulty === "Intermediate"
                                      ? 4
                                      : 3
                                )
                                  ? "bg-blue-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Practice Recommendations */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Practice Recommendations</CardTitle>
            <CardDescription>Structured approach to master each strategy level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Week 1-2: Foundation</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Focus on naked singles, hidden singles, and elimination. Practice 2-3 easy puzzles daily.
                </p>
                <Link href="/play">
                  <Button size="sm" variant="outline">
                    Practice Easy Puzzles
                  </Button>
                </Link>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold mb-2">Week 3-6: Intermediate</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Learn naked pairs, pointing pairs, and box-line reduction. Mix easy and medium puzzles.
                </p>
                <Link href="/play">
                  <Button size="sm" variant="outline">
                    Practice Medium Puzzles
                  </Button>
                </Link>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Week 7+: Advanced</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Master X-Wing, Swordfish, and XY-Wing. Tackle hard and expert puzzles.
                </p>
                <Link href="/play">
                  <Button size="sm" variant="outline">
                    Practice Hard Puzzles
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/articles">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Strategy Articles</h4>
                  <p className="text-gray-600 text-sm">In-depth articles on specific techniques with examples</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/variants">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Sudoku Variants</h4>
                  <p className="text-gray-600 text-sm">Apply strategies to killer, diagonal, and other variants</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/how-to-play">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Basic Rules</h4>
                  <p className="text-gray-600 text-sm">Review fundamental rules and basic solving methods</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Practice Section */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Practice These Strategies?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply what you've learned with our interactive sudoku puzzles and hint system.
          </p>
          <Link href="/play">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Practice Now
            </Button>
          </Link>
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

export function StrategiesPageContent() {
  return (
    <I18nProvider>
      <StrategiesContent />
    </I18nProvider>
  )
}
