"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Grid, Puzzle, Printer, Target, Brain, Users, Heart } from "lucide-react"
import { VariantDetailModal } from "./variant-detail-modal"
import { generatePDFContent } from "@/lib/pdf-generator"
import { AuthModal } from "@/components/auth-modal"
import { authService } from "@/services/auth-service"

interface VariantsProps {
  onNavigate?: (page: "home" | "play" | "how-to-play" | "strategies" | "articles" | "variants") => void
}

export function Variants({ onNavigate }: VariantsProps) {
  const { t } = useTranslation()
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authRequiredFor, setAuthRequiredFor] = useState<string>("")

  const sudokuVariants = [
    {
      id: "samurai",
      title: "Samurai Sudoku Puzzles Printable",
      description: "Five overlapping 9×9 grids create an exciting challenge for experienced solvers",
      difficulty: "Expert",
      icon: Grid,
      color: "purple",
    },
    {
      id: "killer",
      title: "Killer Sudoku Online Free",
      description: "Combines sudoku with math puzzles - cages must add up to specific totals",
      difficulty: "Hard",
      icon: Target,
      color: "red",
    },
    {
      id: "jigsaw",
      title: "Jigsaw Sudoku Puzzles Free",
      description: "Irregular shaped regions replace the standard 3×3 boxes for a unique challenge",
      difficulty: "Medium",
      icon: Puzzle,
      color: "green",
    },
    {
      id: "diagonal",
      title: "Diagonal Sudoku Puzzles Printable",
      description: "Main diagonals must also contain numbers 1-9 without repetition",
      difficulty: "Hard",
      icon: ArrowRight,
      color: "blue",
    },
    {
      id: "hyper",
      title: "Hyper Sudoku Online",
      description: "Additional 3×3 regions add extra constraints to the standard puzzle",
      difficulty: "Hard",
      icon: Grid,
      color: "orange",
    },
    {
      id: "16x16",
      title: "16×16 Sudoku Puzzles Online",
      description: "Expanded grid using numbers 1-16 or letters A-P for an extreme challenge",
      difficulty: "Expert",
      icon: Grid,
      color: "indigo",
    },
  ]

  const specialPurpose = [
    {
      id: "seniors",
      title: "Sudoku for Seniors Printable",
      description: "Large print puzzles with high contrast designed for older adults",
      icon: Users,
      color: "blue",
    },
    {
      id: "classroom",
      title: "Sudoku for Classroom Use",
      description: "Educational puzzles with teaching guides for students of all ages",
      icon: Brain,
      color: "green",
    },
    {
      id: "anxiety",
      title: "Sudoku for Anxiety Relief",
      description: "Mindful puzzles designed to reduce stress and promote relaxation",
      icon: Heart,
      color: "purple",
    },
    {
      id: "teachers",
      title: "Sudoku Printable for Teachers",
      description: "Classroom resources with answer keys and difficulty progression",
      icon: Printer,
      color: "indigo",
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

  const handleGetPuzzles = (variantId: string) => {
    // Check if user is authenticated for downloads
    if (!authService.canDownloadPuzzles()) {
      setAuthRequiredFor("download")
      setShowAuthModal(true)
      return
    }

    // Generate actual PDF content with sudoku puzzles
    const puzzleCount = 5
    const variantTitle =
      sudokuVariants.find((v) => v.id === variantId)?.title ||
      specialPurpose.find((v) => v.id === variantId)?.title ||
      `${variantId} Sudoku`

    try {
      // Generate HTML content for PDF
      const htmlContent = generatePDFContent(variantId, puzzleCount)

      // Create a blob with HTML content
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Create and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `${variantId}-sudoku-puzzles.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Show success message
      alert(
        `✅ Downloaded ${puzzleCount} ${variantId} sudoku puzzles!\n\nThe HTML file can be:\n• Opened in any browser\n• Printed directly to PDF\n• Saved as PDF using browser's print function\n\nIncludes complete puzzles with solutions!`,
      )
    } catch (error) {
      console.error("Error generating puzzles:", error)
      alert("Sorry, there was an error generating the puzzles. Please try again.")
    }
  }

  const handlePrintPuzzles = (purposeId: string) => {
    handleGetPuzzles(purposeId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sudoku Variants & Special Collections</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore exciting sudoku variations and specialized puzzles for every need and skill level
          </p>
        </div>

        {/* SEO Introduction */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-12">
          <p>
            Looking to expand your <strong>sudoku</strong> experience beyond the classic puzzle? Our collection of{" "}
            <strong>sudoku variants</strong> offers exciting new challenges that build on the traditional{" "}
            <strong>sudoku rules</strong> while adding unique twists. From{" "}
            <strong>samurai sudoku puzzles printable</strong> formats to <strong>16x16 sudoku puzzles online</strong>,
            these variations will test your skills in new and exciting ways.
          </p>
          <p>
            We also offer specialized <strong>sudoku</strong> collections designed for specific purposes, including{" "}
            <strong>sudoku for seniors printable</strong> with larger numbers, <strong>sudoku for classroom use</strong>{" "}
            with educational guides, and <strong>sudoku for anxiety relief</strong> to promote mindfulness and
            relaxation.
          </p>
        </div>

        {/* Sudoku Variants Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Sudoku Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sudokuVariants.map((variant) => (
              <Card key={variant.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(
                        variant.color,
                      )}`}
                    >
                      <variant.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={getColorClasses(variant.color)}>
                      {variant.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{variant.title}</CardTitle>
                  <CardDescription>{variant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => handleLearnMore(variant)}>
                      Learn More
                    </Button>
                    <Button size="sm" onClick={() => handleGetPuzzles(variant.id)}>
                      <Download className="w-4 h-4 mr-1" />
                      Get Puzzles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Special Purpose Sudoku */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Special Purpose Sudoku Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialPurpose.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(item.color)}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => handleLearnMore(item)}>
                      Learn More
                    </Button>
                    <Button size="sm" onClick={() => handlePrintPuzzles(item.id)}>
                      <Printer className="w-4 h-4 mr-1" />
                      Print Puzzles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sudoku Puzzle Generator Section */}
        <section className="mb-16 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Sudoku Puzzle Generator Online</h2>
            <p className="text-lg text-gray-600">
              Create custom puzzles with our <strong>sudoku puzzle generator online</strong> tool
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Generator Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Multiple difficulty levels</strong> from easy to expert
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Custom grid sizes</strong> including 4×4, 6×6, 9×9, and 16×16
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Variant options</strong> including killer, diagonal, and hyper sudoku
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>PDF export</strong> with <strong>sudoku printable PDF with answers</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Guaranteed solvable</strong> puzzles with unique solutions
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Perfect For:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Teachers</strong> creating <strong>sudoku for classroom use</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Puzzle enthusiasts</strong> seeking fresh challenges
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Publications</strong> needing <strong>free sudoku puzzles no ads</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Caregivers</strong> providing <strong>sudoku for seniors printable</strong> activities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  <span>
                    <strong>Event organizers</strong> creating custom puzzle challenges
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" onClick={() => handleGetPuzzles("custom")}>
              Generate Custom Sudoku Puzzles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Essential Sudoku Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Sudoku Solution Checker Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Verify your solutions with our <strong>sudoku solution checker online</strong> tool. Upload your
                  completed puzzle or enter numbers manually to check for errors and validate your work.
                </p>
                <Button variant="outline" className="w-full" onClick={() => alert("Solution checker would open here")}>
                  Check Your Solution
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Sudoku Hint Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stuck on a difficult puzzle? Our <strong>sudoku hint generator</strong> provides targeted clues
                  without spoiling the entire solution, helping you learn <strong>sudoku solving techniques</strong>.
                </p>
                <Button variant="outline" className="w-full" onClick={() => alert("Hint generator would open here")}>
                  Get Smart Hints
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Sudoku with Hints and Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Practice with our <strong>sudoku with hints and solutions</strong> collection. Each puzzle includes
                  progressive hints and detailed explanations of solving techniques.
                </p>
                <Button variant="outline" className="w-full" onClick={() => onNavigate?.("play")}>
                  Try Interactive Puzzles
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Sudoku Variants?</h2>
          <p className="text-xl mb-8 opacity-90">
            Try our collection of specialized puzzles and expand your sudoku skills today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => onNavigate?.("play")}>
              Play Classic Sudoku
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => handleGetPuzzles("samurai")}
            >
              Explore Variants
            </Button>
          </div>
        </section>
      </div>

      {/* Variant Detail Modal */}
      <VariantDetailModal
        variant={selectedVariant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGetPuzzles={handleGetPuzzles}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setShowAuthModal(false)
        }}
        requiredFor={authRequiredFor}
      />
    </div>
  )
}
