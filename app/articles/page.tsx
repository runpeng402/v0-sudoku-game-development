import type { Metadata } from "next"
import { defaultOgImage } from "@/lib/seo-locales"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Home, Play, Printer, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { articles, articleUrl } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Sudoku Articles: Beginner Guides, Printable Puzzles, and Strategies",
  description:
    "Read focused Sudoku articles that support learning, printable puzzle practice, beginner rules, and basic solving strategies.",
  alternates: {
    canonical: "https://www.sudokustudio.app/articles",
  },
  openGraph: {
    images: [defaultOgImage],
    title: "Sudoku Articles: Beginner Guides, Printable Puzzles, and Strategies",
    description: "A focused Sudoku learning hub with practical articles and links to playable puzzles.",
    url: "https://www.sudokustudio.app/articles",
    type: "website",
  },
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sudoku Articles",
  itemListElement: articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: articleUrl(article.slug),
    name: article.title,
  })),
}

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="border-b bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900">
            <Home className="mr-2 h-4 w-4" />
            SudokuStudio
          </Link>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            Sudoku Articles
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
            Focused guides for learning Sudoku, practicing with printable PDFs, and building
            reliable solving habits. These articles support the main game and learning pages
            without replacing them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/play">
                <Play className="mr-2 h-4 w-4" />
                Play Sudoku
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/how-to-play-sudoku">
                <BookOpen className="mr-2 h-4 w-4" />
                How to Play
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.slug}>
              <CardHeader>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    {article.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl leading-8">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-700">{article.description}</p>
                <Button asChild variant="outline" className="mt-5">
                  <Link href={`/articles/${article.slug}`}>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <Link href="/printable-sudoku" className="rounded-lg border bg-white p-6 shadow-sm hover:border-blue-300">
            <Printer className="h-7 w-7 text-blue-600" />
            <h2 className="mt-4 font-semibold text-gray-950">Printable Sudoku PDFs</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Download real PDF puzzles with answer pages.
            </p>
          </Link>
          <Link href="/sudoku-rules" className="rounded-lg border bg-white p-6 shadow-sm hover:border-blue-300">
            <BookOpen className="h-7 w-7 text-blue-600" />
            <h2 className="mt-4 font-semibold text-gray-950">Sudoku Rules</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review row, column, and box rules with diagrams.
            </p>
          </Link>
          <Link href="/strategies" className="rounded-lg border bg-white p-6 shadow-sm hover:border-blue-300">
            <Target className="h-7 w-7 text-blue-600" />
            <h2 className="mt-4 font-semibold text-gray-950">Strategies</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Move from beginner scanning to stronger solving habits.
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}
