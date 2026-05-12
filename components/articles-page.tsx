"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, User, ArrowRight, Home, Play, Brain, Target, Users } from "lucide-react"
import { I18nProvider } from "@/components/i18n-provider"

function ArticlesContent() {
  const { t } = useTranslation()

  const featuredArticles = [
    {
      id: "beginner-guide",
      title: "Complete Beginner's Guide to Sudoku",
      description: "Everything you need to know to start your Sudoku journey",
      author: "Sarah Chen",
      readTime: "15 min read",
      category: "Beginner",
      date: "2024-01-15",
      featured: true,
    },
    {
      id: "advanced-techniques",
      title: "Mastering Advanced Sudoku Techniques",
      description: "Learn X-Wing, Swordfish, and other expert-level strategies",
      author: "Dr. Michael Rodriguez",
      readTime: "25 min read",
      category: "Advanced",
      date: "2024-01-10",
      featured: true,
    },
    {
      id: "sudoku-history",
      title: "The Fascinating History of Sudoku",
      description: "From ancient Latin squares to modern puzzle phenomenon",
      author: "Emma Thompson",
      readTime: "12 min read",
      category: "History",
      date: "2024-01-05",
      featured: true,
    },
  ]

  const allArticles = [
    ...featuredArticles,
    {
      id: "mental-benefits",
      title: "The Mental Health Benefits of Sudoku",
      description: "How solving puzzles can improve cognitive function and reduce stress",
      author: "Dr. James Wilson",
      readTime: "10 min read",
      category: "Health",
      date: "2024-01-20",
      featured: false,
    },
    {
      id: "teaching-sudoku",
      title: "Teaching Sudoku to Children",
      description: "Effective methods for introducing kids to logical thinking",
      author: "Maria Garcia",
      readTime: "8 min read",
      category: "Education",
      date: "2024-01-18",
      featured: false,
    },
    {
      id: "sudoku-variants-guide",
      title: "Exploring Sudoku Variants: Beyond the Classic 9x9",
      description: "Discover killer sudoku, samurai puzzles, and other exciting variations",
      author: "Alex Kim",
      readTime: "20 min read",
      category: "Variants",
      date: "2024-01-12",
      featured: false,
    },
    {
      id: "speed-solving",
      title: "Speed Solving Techniques for Competitive Sudoku",
      description: "Tips and tricks used by world championship competitors",
      author: "Yuki Tanaka",
      readTime: "18 min read",
      category: "Competition",
      date: "2024-01-08",
      featured: false,
    },
    {
      id: "puzzle-creation",
      title: "The Art of Creating Sudoku Puzzles",
      description: "Behind the scenes of puzzle design and difficulty balancing",
      author: "Robert Smith",
      readTime: "22 min read",
      category: "Design",
      date: "2024-01-03",
      featured: false,
    },
  ]

  const categories = [
    { name: "All", count: allArticles.length },
    { name: "Beginner", count: allArticles.filter((a) => a.category === "Beginner").length },
    { name: "Advanced", count: allArticles.filter((a) => a.category === "Advanced").length },
    { name: "History", count: allArticles.filter((a) => a.category === "History").length },
    { name: "Health", count: allArticles.filter((a) => a.category === "Health").length },
    { name: "Education", count: allArticles.filter((a) => a.category === "Education").length },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      case "History":
        return "bg-blue-100 text-blue-700"
      case "Health":
        return "bg-purple-100 text-purple-700"
      case "Education":
        return "bg-yellow-100 text-yellow-700"
      case "Variants":
        return "bg-indigo-100 text-indigo-700"
      case "Competition":
        return "bg-orange-100 text-orange-700"
      case "Design":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sudoku Articles & Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover expert insights, solving techniques, and fascinating stories from the world of Sudoku
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
              <span className="text-sm">Play Now</span>
            </Button>
          </Link>
          <Link href="/strategies">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Strategies</span>
            </Button>
          </Link>
          <Link href="/variants">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-1">
              <Target className="w-5 h-5" />
              <span className="text-sm">Variants</span>
            </Button>
          </Link>
        </div>

        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <Button size="sm" variant="outline">
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Articles */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allArticles.map((article) => (
              <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <Button size="sm" variant="outline">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Latest Articles</h3>
          <p className="text-lg mb-6 opacity-90">Get notified when we publish new Sudoku guides, tips, and tutorials</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-lg text-gray-900" />
            <Button variant="secondary" className="px-6">
              Subscribe
            </Button>
          </div>
        </section>

        {/* Related Pages */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Continue Learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/strategies">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Advanced Strategies</h4>
                  <p className="text-gray-600 text-sm">Master expert-level solving techniques</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/variants">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Sudoku Variants</h4>
                  <p className="text-gray-600 text-sm">Explore different types of Sudoku puzzles</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/leaderboard">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Leaderboard</h4>
                  <p className="text-gray-600 text-sm">See how you rank against other players</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticlesPageContent() {
  return (
    <I18nProvider>
      <ArticlesContent />
    </I18nProvider>
  )
}
