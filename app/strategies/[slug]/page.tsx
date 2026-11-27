import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SudokuPracticeBoard } from "@/components/sudoku-practice-board"
import { Button } from "@/components/ui/button"
import { reasoningCandidates } from "@/lib/sudoku-reasoning"
import { defaultOgImage } from "@/lib/seo-locales"
import course from "@/lib/sudoku-training-course.json"
import { techniqueBySlug, techniqueGuides, type TechniqueGuide } from "@/lib/technique-guides"

const baseUrl = "https://www.sudokustudio.app"

export const dynamicParams = false

export function generateStaticParams() {
  return techniqueGuides.map((guide) => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = techniqueBySlug(params.slug)
  if (!guide) return {}
  const url = `${baseUrl}/strategies/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: guide.metaTitle, description: guide.metaDescription, url, type: "article", images: [defaultOgImage] },
  }
}

type CourseEntry = { board: string[]; target: number; digit: number; evidence: number[]; explanation: string }

function techniqueExample(guide: TechniqueGuide) {
  const entry = (course as CourseEntry[])[guide.example.index]
  const cells = entry.board.join("").split("").map(Number)
  return { cells, target: entry.target, digit: entry.digit, evidence: entry.evidence, explanation: entry.explanation }
}

const cellName = (index: number) => `row ${Math.floor(index / 9) + 1}, column ${(index % 9) + 1}`

export default function TechniqueGuidePage({ params }: { params: { slug: string } }) {
  const guide = techniqueBySlug(params.slug)
  if (!guide) notFound()

  const example = techniqueExample(guide)
  const marks = reasoningCandidates(example.cells)
  const shown = new Set([...example.evidence, example.target])
  const candidates = marks.map((cell, index) => (shown.has(index) ? cell : []))
  const position = techniqueGuides.indexOf(guide)
  const previous = techniqueGuides[position - 1]
  const next = techniqueGuides[position + 1]
  const url = `${baseUrl}/strategies/${guide.slug}`
  const isPlacement = example.evidence.length === 0

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.metaTitle,
      description: guide.metaDescription,
      url,
      mainEntityOfPage: url,
      image: `${baseUrl}/opengraph-image`,
      author: { "@type": "Organization", name: "SudokuStudio" },
      publisher: { "@type": "Organization", name: "SudokuStudio" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
        { "@type": "ListItem", position: 2, name: "Sudoku Strategies", item: `${baseUrl}/strategies` },
        { "@type": "ListItem", position: 3, name: guide.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="text-blue-700 hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/strategies" className="text-blue-700 hover:underline">Sudoku strategies</Link>
            <span aria-hidden="true"> / </span>
            <span>{guide.name}</span>
          </nav>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-700">{guide.level} technique</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{guide.name}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">{guide.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/sudoku-practice?topic=${guide.practiceTopic}`}>Practice {guide.name.split(" (")[0]}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/play">Play Sudoku with hints</Link>
            </Button>
          </div>
        </div>
      </section>

      <article className="px-4 py-12">
        <div className="mx-auto grid max-w-4xl gap-10 leading-7 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-950">What is a {guide.name.split(" (")[0].toLowerCase()}?</h2>
            <p className="mt-4">{guide.definition}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-950">Example</h2>
            <p className="mt-4">{guide.example.intro}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,360px)_1fr] md:items-start">
              <SudokuPracticeBoard cells={example.cells} target={example.target} highlighted={example.evidence} candidates={candidates} />
              <div className="space-y-3 text-sm">
                <p>
                  <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-blue-200 align-middle" aria-hidden="true" />
                  Target square: {cellName(example.target)}. {isPlacement ? `Place ${example.digit}.` : `Remove candidate ${example.digit}.`}
                </p>
                {!isPlacement && (
                  <p>
                    <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-blue-50 ring-1 ring-blue-200 align-middle" aria-hidden="true" />
                    Pattern squares: {example.evidence.map(cellName).join("; ")}.
                  </p>
                )}
                <p className="rounded border bg-slate-50 p-3">{example.explanation}</p>
                <p className="text-slate-500">Small numbers are the candidates of the squares used in this step.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-950">How to find it, step by step</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6">
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-950">Why it works</h2>
            <p className="mt-4">{guide.why}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-950">Common mistakes</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {guide.mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-950">Questions</h2>
            <div className="mt-4 space-y-6">
              {guide.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-gray-950">{faq.question}</h3>
                  <p className="mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-gray-950">Try it yourself</h2>
            <p className="mt-2">
              Work through guided exercises built around this technique, or use it in today&apos;s{" "}
              <Link href="/daily-sudoku" className="text-blue-700 underline underline-offset-4">daily Sudoku</Link>.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href={`/sudoku-practice?topic=${guide.practiceTopic}`}>Start the exercises</Link>
              </Button>
            </div>
          </section>

          <nav aria-label="More techniques" className="grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link href={`/strategies/${previous.slug}`} className="rounded-lg border p-4 hover:border-blue-300">
                <span className="text-sm text-slate-500">Previous technique</span>
                <span className="mt-1 block font-semibold text-gray-950">{previous.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/strategies/${next.slug}`} className="rounded-lg border p-4 text-right hover:border-blue-300">
                <span className="text-sm text-slate-500">Next technique</span>
                <span className="mt-1 block font-semibold text-gray-950">{next.name}</span>
              </Link>
            )}
          </nav>

          <section>
            <h2 className="text-xl font-bold text-gray-950">All Sudoku techniques</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {techniqueGuides.map((item) => (
                <li key={item.slug}>
                  <Link href={`/strategies/${item.slug}`} aria-current={item.slug === guide.slug ? "page" : undefined} className="text-blue-700 underline underline-offset-4 aria-[current=page]:font-semibold aria-[current=page]:text-gray-950 aria-[current=page]:no-underline">
                    {item.name}
                  </Link>{" "}
                  <span className="text-sm text-slate-500">· {item.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  )
}
