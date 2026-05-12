import Link from "next/link"
import { ArrowLeft, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrintableSudokuDownloads } from "@/components/printable-sudoku-downloads"
import { SeoNavigation } from "@/components/seo-navigation"
import {
  homeCopy,
  htmlLangByLocale,
  localizedPath,
  pageCopy,
  type SeoLocale,
  type SeoPageKey,
} from "@/lib/seo-locales"

interface SeoInfoPageProps {
  locale: SeoLocale
  pageKey: SeoPageKey
}

export function SeoInfoPage({ locale, pageKey }: SeoInfoPageProps) {
  const page = pageCopy[pageKey]
  const copy = page[locale]
  const home = homeCopy[locale]
  const secondaryHref =
    pageKey === "printable" ? localizedPath(locale, pageCopy.howToPlay.path) : localizedPath(locale, pageCopy.printable.path)
  const secondaryLabel = pageKey === "printable" ? home.learn : home.printable
  const playHref = localizedPath(locale, "/play")

  return (
    <div className="min-h-screen bg-white" lang={htmlLangByLocale[locale]}>
      <SeoNavigation locale={locale} path={page.path} />
      <main>
        <section className="border-b bg-slate-50 px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <Link href={localizedPath(locale, "/")} className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              SudokuStudio
            </Link>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{copy.h1}</h1>
            <p className="mt-6 text-lg leading-8 text-gray-700">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={playHref}>
                  <Play className="mr-2 h-4 w-4" />
                  {home.play}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-4xl gap-6">
            {copy.sections.map(([title, text]) => (
              <article key={title} className="rounded-lg border p-6">
                <CheckCircle className="mb-3 h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>
                <p className="mt-3 leading-7 text-gray-700">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {pageKey === "printable" ? (
          <section className="px-4 pb-14">
            <div className="mx-auto max-w-5xl">
              <PrintableSudokuDownloads locale={locale} />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
