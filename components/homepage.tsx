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
    { icon: Users, value: "Free", label: "No download" },
    { icon: Trophy, value: "4", label: "Difficulty levels" },
    { icon: Star, value: "Hints", label: "Beginner friendly" },
    { icon: Clock, value: "PDF", label: "Printable puzzles" },
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
              <Link href="/how-to-play-sudoku">
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

        {/* Internal Learning Hubs Section */}
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Keep Learning on SudokuStudio</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Move from playing to learning with focused guides, rules, printable puzzles, and strategies.
              </p>
              <Link href="/pricing" className="mt-4 inline-block font-medium text-blue-300 underline underline-offset-4">
                See training pricing
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { href: "/how-to-play-sudoku", title: "How to Play Sudoku", text: "Learn the goal, rules, first steps, and beginner mistakes." },
                { href: "/sudoku-rules", title: "Sudoku Rules", text: "Understand rows, columns, boxes, and valid puzzle rules." },
                { href: "/printable-sudoku", title: "Printable Sudoku", text: "Find printable puzzle sheets for offline practice." },
                { href: "/strategies", title: "Sudoku Strategies", text: "Build skill with beginner and advanced solving techniques." },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-lg border border-gray-700 p-6 hover:border-blue-400 hover:bg-gray-800 transition-colors">
                  <BookOpen className="w-7 h-7 text-blue-300 mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </Link>
              ))}
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
