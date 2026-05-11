"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Play,
  BookOpen,
  Lightbulb,
  Target,
  Download,
  Printer,
  Globe,
  Brain,
  Clock,
  Trophy,
  Users,
  Star,
} from "lucide-react"
import { SEOContent } from "@/components/seo-content"
import { FeedbackSection } from "@/components/feedback-section"
import { FloatingFeedbackButton } from "@/components/floating-feedback-button"
import { StructuredData } from "@/components/structured-data"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { authService } from "@/services/auth-service"
import { MiniSudoku } from "@/components/mini-sudoku"
import Link from "next/link"

export function Homepage() {
  const { t } = useTranslation()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authRequiredFor, setAuthRequiredFor] = useState<string>("")

  const handleDownloadCollection = (type: "kids" | "hard" | "special") => {
    // Check if user is authenticated for downloads
    if (!authService.canDownloadPuzzles()) {
      setAuthRequiredFor("download")
      setShowAuthModal(true)
      return
    }

    const collections = {
      kids: {
        name: t("collections.kidsTitle"),
        description: t("collections.kidsDescription"),
        puzzles: 20,
        difficulty: t("game.difficulty.easy"),
        features: [
          t("collections.features.largeNumbers"),
          t("collections.features.educational"),
          t("collections.features.ageAppropriate"),
          "Colorful designs",
        ],
      },
      hard: {
        name: t("collections.hardTitle"),
        description: t("collections.hardDescription"),
        puzzles: 15,
        difficulty: t("game.difficulty.hard"),
        features: [
          t("collections.features.advancedTechniques"),
          t("collections.features.detailedSolutions"),
          "Multiple solving paths",
          "Brain training",
        ],
      },
      special: {
        name: t("collections.specialTitle"),
        description: t("collections.specialDescription"),
        puzzles: 25,
        difficulty: "Various",
        features: [
          t("collections.features.seniorsFriendly"),
          t("collections.features.classroomUse"),
          t("collections.features.anxietyRelief"),
          t("collections.features.therapeuticDesigns"),
        ],
      },
    }

    const collection = collections[type]
    const puzzleData = {
      collection: collection.name,
      description: collection.description,
      totalPuzzles: collection.puzzles,
      difficulty: collection.difficulty,
      features: collection.features,
      format: "PDF",
      timestamp: new Date().toISOString(),
      downloadUrl: `https://www.sudokustudio.app/downloads/${type}-collection.pdf`,
    }

    const dataStr = JSON.stringify(puzzleData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${type}-sudoku-collection.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert(
      `${collection.name} downloaded successfully! This would normally download a PDF with ${collection.puzzles} puzzles.`,
    )
  }

  const features = [
    {
      icon: Lightbulb,
      title: t("features.items.hints.title"),
      description: t("features.items.hints.description"),
    },
    {
      icon: Target,
      title: t("features.items.difficulty.title"),
      description: t("features.items.difficulty.description"),
    },
    {
      icon: Brain,
      title: t("features.items.solver.title"),
      description: t("features.items.solver.description"),
    },
    {
      icon: Download,
      title: t("features.items.offline.title"),
      description: t("features.items.offline.description"),
    },
    {
      icon: Printer,
      title: t("features.items.printable.title"),
      description: t("features.items.printable.description"),
    },
    {
      icon: Globe,
      title: t("features.items.multilingual.title"),
      description: t("features.items.multilingual.description"),
    },
  ]

  const stats = [
    { icon: Users, value: "1M+", label: t("stats.activePlayers") },
    { icon: Trophy, value: "50K+", label: t("stats.puzzlesSolved") },
    { icon: Star, value: "4.8", label: t("stats.userRating") },
    { icon: Clock, value: "24/7", label: t("stats.available") },
  ]

  return (
    <>
      {/* 结构化数据 */}
      <StructuredData type="website" data={{}} />
      <StructuredData type="game" data={{}} />
      <StructuredData type="organization" data={{}} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{t("hero.title")}</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">{t("hero.subtitle")}</p>
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">{t("hero.description")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/play">
                <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700">
                  <Play className="w-5 h-5 mr-2" />
                  {t("hero.playNow")}
                </Button>
              </Link>
              <Link href="/how-to-play">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t("hero.learnHow")}
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mini Sudoku Game */}
            <div className="mt-16 max-w-lg mx-auto">
              <MiniSudoku onPlayFullGame={() => (window.location.href = "/play")} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("features.title")}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("features.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Complete Printable Sudoku Collection Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("collections.title")}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Download our curated Sudoku collections in PDF format for offline enjoyment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Easy Sudoku for Kids */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Printer className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t("collections.kidsTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {t("collections.kidsDescription")}
                  </CardDescription>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>• {t("collections.features.pdfAnswers")}</li>
                    <li>• {t("collections.features.largeNumbers")}</li>
                    <li>• {t("collections.features.educational")}</li>
                    <li>• {t("collections.features.ageAppropriate")}</li>
                  </ul>
                  <Button className="w-full" onClick={() => handleDownloadCollection("kids")}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("collections.downloadKids")}
                  </Button>
                </CardContent>
              </Card>

              {/* Hard Sudoku Challenges */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{t("collections.hardTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {t("collections.hardDescription")}
                  </CardDescription>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>• {t("collections.features.expertLevel")}</li>
                    <li>• {t("collections.features.detailedSolutions")}</li>
                    <li>• {t("collections.features.advancedTechniques")}</li>
                    <li>• {t("collections.features.experiencedSolvers")}</li>
                  </ul>
                  <Button className="w-full" onClick={() => handleDownloadCollection("hard")}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("collections.downloadHard")}
                  </Button>
                </CardContent>
              </Card>

              {/* Special Collections */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{t("collections.specialTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {t("collections.specialDescription")}
                  </CardDescription>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>• {t("collections.features.seniorsFriendly")}</li>
                    <li>• {t("collections.features.classroomUse")}</li>
                    <li>• {t("collections.features.anxietyRelief")}</li>
                    <li>• {t("collections.features.therapeuticDesigns")}</li>
                  </ul>
                  <Button className="w-full" onClick={() => handleDownloadCollection("special")}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("collections.downloadSpecial")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <SEOContent />

        {/* User Feedback Section */}
        <FeedbackSection />

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("benefits.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t("benefits.brainTraining.title")}</h3>
                <p className="text-gray-600">{t("benefits.brainTraining.description")}</p>
              </div>
              <div className="p-6">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t("benefits.focus.title")}</h3>
                <p className="text-gray-600">{t("benefits.focus.description")}</p>
              </div>
              <div className="p-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t("benefits.stressRelief.title")}</h3>
                <p className="text-gray-600">{t("benefits.stressRelief.description")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("cta.title")}</h2>
            <p className="text-xl mb-8 opacity-90">{t("cta.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/play">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  {t("cta.playNow")}
                </Button>
              </Link>
              <Link href="/articles">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t("cta.learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* External Resources Section */}
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore More Sudoku Content</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover amazing Sudoku content from top creators and communities across the web
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* YouTube */}
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">YouTube Tutorials</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.youtube.com/watch?v=6_-cI5SjWLs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Sudoku Solving Techniques
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=C-gEQdGVXbk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Advanced Sudoku Strategies
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=McutmJFSqrI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Sudoku for Beginners
                  </a>
                </div>
              </div>

              {/* Reddit */}
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Reddit Communities</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.reddit.com/r/sudoku/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    r/sudoku Community
                  </a>
                  <a
                    href="https://www.reddit.com/r/puzzles/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    r/puzzles Discussion
                  </a>
                  <a
                    href="https://www.reddit.com/r/logic/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    r/logic Puzzles
                  </a>
                </div>
              </div>

              {/* Pinterest */}
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Pinterest Boards</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.pinterest.com/search/pins/?q=sudoku%20puzzles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Sudoku Puzzles Collection
                  </a>
                  <a
                    href="https://www.pinterest.com/search/pins/?q=printable%20sudoku"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Printable Sudoku Boards
                  </a>
                  <a
                    href="https://www.pinterest.com/search/pins/?q=sudoku%20for%20kids"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Sudoku for Kids
                  </a>
                </div>
              </div>

              {/* Educational Resources */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Educational Resources</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/solving-sudoku-with-recursive-backtracking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Khan Academy - Sudoku Algorithms
                  </a>
                  <a
                    href="https://en.wikipedia.org/wiki/Sudoku"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Wikipedia - Sudoku History
                  </a>
                  <a
                    href="https://www.mathsisfun.com/puzzles/sudoku.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Math is Fun - Sudoku Guide
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Discover more amazing Sudoku content from creators and communities worldwide
              </p>
            </div>
          </div>
        </section>

        {/* Floating Feedback Button */}
        <FloatingFeedbackButton />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setShowAuthModal(false)
            if (authRequiredFor === "download") {
              // Retry download after auth
            }
          }}
          requiredFor={authRequiredFor}
        />
      </div>
    </>
  )
}
