"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Lightbulb, Target, Brain } from "lucide-react"
// import Link from "next/link" // Removed Link import

interface HowToPlayProps {
  onNavigate?: (page: "home" | "play" | "how-to-play" | "strategies") => void
}

export function HowToPlay({ onNavigate }: HowToPlayProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How to Play Sudoku</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the world's most popular number puzzle with our comprehensive guide
          </p>
        </div>

        {/* Sudoku Rules */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Sudoku Rules
            </CardTitle>
            <CardDescription className="text-lg">Learn the fundamental rules of sudoku puzzles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Basic Rules:</h3>
                <ul className="space-y-3">
                  {[
                    "Fill each row with numbers 1-9 (no repeats)",
                    "Fill each column with numbers 1-9 (no repeats)",
                    "Fill each 3×3 box with numbers 1-9 (no repeats)",
                    "Use logic and elimination to find the solution",
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Quick Tips:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Start with cells that have the fewest possibilities</li>
                  <li>• Look for numbers that can only go in one place</li>
                  <li>• Use pencil marks to track possible numbers</li>
                  <li>• Take your time - sudoku rewards patience</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solving Techniques */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Solving Techniques</h2>
          <p className="text-lg text-gray-600 text-center mb-10">
            Master these essential techniques to solve any sudoku puzzle
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Naked Single */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge variant="secondary">Beginner</Badge>
                </div>
                <CardTitle className="text-xl">Naked Single Technique</CardTitle>
                <CardDescription>When only one number can fit in a cell</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This is the most basic sudoku solving technique. When you eliminate all impossible numbers from a
                  cell, only one number remains.
                </p>
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Look at the numbers already in the row</li>
                  <li>2. Check the numbers in the column</li>
                  <li>3. Examine the numbers in the 3×3 box</li>
                  <li>4. The missing number is your answer</li>
                </ol>
              </CardContent>
            </Card>

            {/* Hidden Single */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <Badge variant="secondary">Beginner</Badge>
                </div>
                <CardTitle className="text-xl">Hidden Single Technique</CardTitle>
                <CardDescription>When a number can only go in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Sometimes a number can only be placed in one cell within a row, column, or box, even if that cell has
                  other possibilities.
                </p>
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Pick a number (1-9)</li>
                  <li>2. Check where it can go in a row/column/box</li>
                  <li>3. If only one place is possible, place it there</li>
                  <li>4. Repeat for all numbers</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Difficulty Levels */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              Sudoku Difficulty Levels Explained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">E</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Easy Sudoku</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Perfect for beginners. More given numbers and simpler logic required.
                </p>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  40+ given numbers
                </Badge>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Medium Sudoku</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Requires intermediate techniques and more logical deduction.
                </p>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  30-40 given numbers
                </Badge>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">H</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Hard Sudoku</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For experts. Advanced techniques and complex logical chains needed.
                </p>
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  25-30 given numbers
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="mb-12 border-0 shadow-lg bg-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-800">Common Sudoku Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-orange-800">Logic Mistakes:</h4>
                <ul className="space-y-2 text-orange-700">
                  <li>• Guessing instead of using logic</li>
                  <li>• Not checking all constraints</li>
                  <li>• Rushing through easy steps</li>
                  <li>• Ignoring pencil marks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-orange-800">Technical Mistakes:</h4>
                <ul className="space-y-2 text-orange-700">
                  <li>• Placing duplicate numbers</li>
                  <li>• Misreading the grid</li>
                  <li>• Erasing correct numbers</li>
                  <li>• Not double-checking work</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Put Your Skills to the Test?</h3>
          <p className="text-lg text-gray-600 mb-8">Start with an easy puzzle and work your way up to expert level!</p>
          {/* <Link href="/play">
            <Button size="lg" className="text-lg px-8 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Playing Sudoku Now
            </Button>
          </Link> */}
          <Button size="lg" className="text-lg px-8 py-4" onClick={() => onNavigate?.("play")}>
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Playing Sudoku Now
          </Button>
        </div>
      </div>
    </div>
  )
}
