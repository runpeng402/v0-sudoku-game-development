import Link from "next/link"
import { BookOpen, Brain, CheckCircle, Clock, FileText, Play, Printer, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { homeCopy, htmlLangByLocale, localizedPath, pageCopy, type SeoLocale } from "@/lib/seo-locales"

interface SeoHomePageProps {
  locale: SeoLocale
}

export function SeoHomePage({ locale }: SeoHomePageProps) {
  const copy = homeCopy[locale]
  const puzzlePreview = [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,
    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 0, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,
    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9,
  ]
  const learning = [
    { href: localizedPath(locale, pageCopy.howToPlay.path), title: copy.learn, icon: BookOpen },
    { href: localizedPath(locale, pageCopy.rules.path), title: copy.rules, icon: FileText },
    { href: localizedPath(locale, pageCopy.printable.path), title: copy.printable, icon: Printer },
    { href: localizedPath(locale, "/strategies"), title: locale === "zh" ? "数独策略" : locale === "es" ? "Estrategias" : "Sudoku Strategies", icon: Target },
  ]
  const playHref = localizedPath(locale, "/play")
  const stats = [
    ["Free", locale === "zh" ? "无需下载" : locale === "es" ? "Sin descargas" : "No download"],
    ["4", locale === "zh" ? "难度等级" : locale === "es" ? "Niveles" : "Difficulty levels"],
    ["Hints", locale === "zh" ? "智能提示" : locale === "es" ? "Pistas útiles" : "Beginner friendly"],
    ["PDF", locale === "zh" ? "可打印题目" : locale === "es" ? "Imprimibles" : "Printable puzzles"],
  ]

  return (
    <div className="min-h-screen bg-white" lang={htmlLangByLocale[locale]}>
      <main>
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">{copy.h1}</h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-700">{copy.subtitle}</p>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">{copy.intro}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href={playHref}>
                    <Play className="mr-2 h-5 w-5" />
                    {copy.play}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={localizedPath(locale, pageCopy.howToPlay.path)}>
                    <BookOpen className="mr-2 h-5 w-5" />
                    {copy.learn}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-gray-950">{value}</div>
                  <div className="mt-1 text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 w-full max-w-[360px] rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-950">{copy.play}</p>
                  <p className="text-xs text-gray-500">9x9 Sudoku</p>
                </div>
                <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Easy</span>
              </div>
              <div className="grid grid-cols-9 border-2 border-gray-900 bg-gray-900">
                {puzzlePreview.map((value, index) => {
                  const row = Math.floor(index / 9)
                  const col = index % 9
                  return (
                    <div
                      key={index}
                      className={`flex aspect-square items-center justify-center bg-white text-sm font-semibold text-gray-900 ${
                        col === 2 || col === 5 ? "border-r-2 border-r-gray-900" : "border-r border-r-gray-200"
                      } ${row === 2 || row === 5 ? "border-b-2 border-b-gray-900" : "border-b border-b-gray-200"}`}
                    >
                      {value || ""}
                    </div>
                  )
                })}
              </div>
              <Button asChild className="mt-4 w-full">
                <Link href={playHref}>{copy.play}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-950">{copy.featuresTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {copy.features.map(([title, text]) => (
                <Card key={title}>
                  <CardHeader>
                    <CheckCircle className="mb-2 h-6 w-6 text-blue-600" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-gray-600">{text}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-950">{copy.learningTitle}</h2>
              <p className="mt-3 text-gray-600">{copy.learningDescription}</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {learning.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg border bg-white p-6 shadow-sm transition hover:border-blue-300">
                  <item.icon className="h-7 w-7 text-blue-600" />
                  <h3 className="mt-4 font-semibold text-gray-950">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-950">{copy.benefitsTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {copy.benefits.map(([title, text], index) => {
                const Icon = index === 0 ? Brain : index === 1 ? Clock : Target
                return (
                  <div key={title} className="rounded-lg border p-6">
                    <Icon className="h-7 w-7 text-blue-600" />
                    <h3 className="mt-4 font-semibold text-gray-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t px-4 py-8 text-center text-sm text-gray-500">
        © 2024 SudokuStudio
      </footer>
    </div>
  )
}
