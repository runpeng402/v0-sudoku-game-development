"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Target, Brain, Users } from "lucide-react"

export function SEOContent() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Master the Art of Sudoku</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From beginner basics to expert strategies, everything you need to become a Sudoku master
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/how-to-play">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">How to Play</CardTitle>
                <CardDescription>Learn the fundamental rules and basic solving techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/strategies">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Advanced Strategies</CardTitle>
                <CardDescription>Master X-Wing, Swordfish, and other expert techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Strategies
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/variants">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Sudoku Variants</CardTitle>
                <CardDescription>Explore killer, samurai, and diagonal sudoku puzzles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Explore Variants
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Leaderboard</CardTitle>
                <CardDescription>Compete with players worldwide and climb the rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Rankings
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* SEO Content */}
        <div className="mt-16 prose prose-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose SudokuStudio?</h3>
          <p className="text-gray-700 mb-6">
            <strong>SudokuStudio</strong> is your ultimate destination for <strong>free online Sudoku games</strong>.
            Whether you're a complete beginner looking to learn the basics or an expert seeking challenging puzzles, our
            platform offers everything you need to enjoy and master this beloved number puzzle.
          </p>

          <h4 className="text-xl font-semibold text-gray-900 mb-4">Features That Set Us Apart:</h4>
          <ul className="text-gray-700 mb-6 space-y-2">
            <li>
              <strong>Multiple Difficulty Levels:</strong> From easy puzzles perfect for beginners to expert-level
              challenges that will test even seasoned players
            </li>
            <li>
              <strong>Interactive Hints System:</strong> Get helpful hints and step-by-step explanations to improve your
              solving skills
            </li>
            <li>
              <strong>Printable Puzzles:</strong> Download and print puzzles for offline solving
            </li>
            <li>
              <strong>Progress Tracking:</strong> Monitor your improvement with detailed statistics and achievements
            </li>
            <li>
              <strong>Multiple Languages:</strong> Play in your preferred language with full localization support
            </li>
          </ul>

          <h4 className="text-xl font-semibold text-gray-900 mb-4">Perfect for Everyone:</h4>
          <p className="text-gray-700 mb-6">
            Our <strong>Sudoku puzzles</strong> are designed for players of all ages and skill levels. Students can use
            our educational features to develop logical thinking skills, while seniors can enjoy large-print puzzles
            designed for comfortable viewing. Teachers will find our classroom-friendly resources perfect for
            educational settings.
          </p>

          <p className="text-gray-700">
            Start your Sudoku journey today and discover why millions of players choose SudokuStudio for their daily
            puzzle-solving needs. With new puzzles added regularly and a supportive community of fellow enthusiasts,
            you'll never run out of challenges to tackle.
          </p>
        </div>
      </div>
    </section>
  )
}
