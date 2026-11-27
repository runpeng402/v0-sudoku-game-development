import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Download, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { defaultOgImage } from "@/lib/seo-locales"

const baseUrl = "https://www.sudokustudio.app"

interface PrintableTopic {
  slug: string
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  downloadLevel: "easy" | "medium" | "hard" | "large-print"
  downloadLabel: string
  includes: string[]
  whoFor: string
  tips: string[]
  faqs: Array<{ question: string; answer: string }>
}

const topics: PrintableTopic[] = [
  {
    slug: "easy",
    h1: "Easy Printable Sudoku Puzzles",
    metaTitle: "Easy Printable Sudoku Puzzles (Free PDF with Answers)",
    metaDescription:
      "Free easy Sudoku puzzles to print. Beginner-friendly grids with plenty of given numbers and answer keys included. Download the PDF and start solving.",
    intro:
      "Easy Sudoku is the best way to learn: more numbers are given at the start, so every move can be found with the two basic methods from our beginner guide. Print a sheet, grab a pencil, and solve at your own pace.",
    downloadLevel: "easy",
    downloadLabel: "Download easy Sudoku PDF",
    includes: [
      "4 easy puzzles, one per page",
      "Clear spacing with room for pencil marks",
      "Full answer key on separate pages",
      "A4-friendly layout, prints on any home printer",
    ],
    whoFor: "Easy printables are made for beginners, kids and anyone who wants a relaxed puzzle without notes.",
    tips: [
      "Scan one digit at a time across the boxes (cross-hatching).",
      "Place a number only when one square is left.",
      "Check the answer key only after finishing a puzzle.",
    ],
    faqs: [
      {
        question: "How many given numbers does an easy Sudoku have?",
        answer:
          "Easy puzzles usually give 36 to 45 numbers. Our easy sheets give around 41, so most moves are simple eliminations.",
      },
      {
        question: "Are the answers included?",
        answer: "Yes. Every download includes the solutions on separate pages, so you can check your work without spoiling the puzzle.",
      },
      {
        question: "Is easy Sudoku good for kids?",
        answer: "Yes. Easy 9x9 puzzles work well from about age 8. For younger children, start with 4x4 mini Sudoku.",
      },
    ],
  },
  {
    slug: "with-answers",
    h1: "Printable Sudoku with Answers",
    metaTitle: "Printable Sudoku with Answers: Free PDF Puzzles and Solutions",
    metaDescription:
      "Download free printable Sudoku puzzles with answers. Easy, medium and hard PDFs, each with a full answer key on separate pages for checking your work.",
    intro:
      "Every SudokuStudio printable comes with a complete answer key on separate pages. Solve the puzzle first, then flip to the solutions to check. Choose easy, medium or hard, depending on how much of a challenge you want.",
    downloadLevel: "hard",
    downloadLabel: "Download hard Sudoku with answers",
    includes: [
      "4 puzzles per download, one per page",
      "Complete solutions printed after the puzzle pages",
      "Same answer-key format for easy, medium and hard",
      "Free to print for home, classroom and club use",
    ],
    whoFor: "Answer keys are for players who want to verify their logic, teachers checking homework, and anyone learning a new solving technique.",
    tips: [
      "Resist checking the key early. Circle the squares you are unsure about instead.",
      "When the key disagrees with your answer, find the first square where you went wrong.",
      "Use the hard pack with the strategy guides: each hard puzzle needs pairs or locked candidates.",
    ],
    faqs: [
      {
        question: "Do all your printable Sudoku PDFs include answers?",
        answer:
          "Yes. The easy, medium, hard and large-print packs all include full solutions on their own pages.",
      },
      {
        question: "Why do hard Sudoku puzzles need the answer key more?",
        answer:
          "Hard puzzles require advanced techniques, so mistakes are easier to make and harder to spot. The key lets you check the result and learn where your logic broke down.",
      },
      {
        question: "Can I print the answers on the back of the puzzle page?",
        answer: "Yes. Print double-sided with the solution page behind its puzzle page if you prefer a compact sheet.",
      },
    ],
  },
  {
    slug: "large-print",
    h1: "Large Print Sudoku for Seniors",
    metaTitle: "Large Print Sudoku for Seniors: Free Big-Print PDF Puzzles",
    metaDescription:
      "Free large print Sudoku puzzles to download. Big digits and roomy grids that are easy on the eyes, ideal for seniors and low-vision players. Answers included.",
    intro:
      "Standard Sudoku printouts squeeze nine tiny digits into a small grid. Our large print sheets use one puzzle per page with big, bold digits and extra space for writing, so solving stays comfortable even with weaker eyesight.",
    downloadLevel: "large-print",
    downloadLabel: "Download large print Sudoku PDF",
    includes: [
      "2 large print puzzles, one full page each",
      "Extra-large digits and wide grid lines",
      "Plenty of white space for pencil notes",
      "Answer key pages in the same large format",
    ],
    whoFor: "Large print Sudoku is designed for seniors, players with low vision, and anyone who finds standard puzzle print too small.",
    tips: [
      "Print at 100% scale; do not let the printer shrink the page.",
      "A soft pencil and a good eraser work better than a pen.",
      "Solve in good light, and take breaks. Easy puzzles keep the logic light.",
    ],
    faqs: [
      {
        question: "What font size is large print Sudoku?",
        answer:
          "Our grids are about 12 cm wide with digits roughly three times larger than a newspaper puzzle, similar to 18-point text.",
      },
      {
        question: "Are large print puzzles easier?",
        answer:
          "The large print pack uses easy-difficulty puzzles, so the focus stays on comfortable reading rather than hard logic. Answer keys are included.",
      },
      {
        question: "Can I use these in a care home or senior center?",
        answer: "Yes. You may print as many copies as you need for free, non-commercial use.",
      },
    ],
  },
]

export const dynamicParams = false

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.slug }))
}

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const topic = topics.find((item) => item.slug === params.topic)
  if (!topic) return {}
  const url = `${baseUrl}/printable-sudoku/${topic.slug}`
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: topic.metaTitle, description: topic.metaDescription, url, type: "article", images: [defaultOgImage] },
  }
}

const link = "font-medium text-blue-700 underline underline-offset-4"

export default function PrintableTopicPage({ params }: { params: { topic: string } }) {
  const topic = topics.find((item) => item.slug === params.topic)
  if (!topic) notFound()
  const url = `${baseUrl}/printable-sudoku/${topic.slug}`
  const others = topics.filter((item) => item.slug !== topic.slug)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: topic.h1,
      description: topic.metaDescription,
      url,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "SudokuStudio" },
      publisher: { "@type": "Organization", name: "SudokuStudio" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: topic.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="border-b bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="text-blue-700 hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/printable-sudoku" className="text-blue-700 hover:underline">Printable Sudoku</Link>
            <span aria-hidden="true"> / </span>
            <span>{topic.h1}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{topic.h1}</h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">{topic.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/api/printable-sudoku?level=${topic.downloadLevel}`} prefetch={false}>
                <Download className="mr-2 h-5 w-5" />
                {topic.downloadLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/play">
                <Play className="mr-2 h-5 w-5" />
                Play online instead
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-4xl gap-10 leading-7 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">What you get</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {topic.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4">{topic.whoFor}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">Tips for solving on paper</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6">
              {topic.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
            <p className="mt-4">
              New to Sudoku? Start with the <Link href="/how-to-play-sudoku" className={link}>beginner guide</Link> and
              the <Link href="/sudoku-rules" className={link}>rules</Link>, then come back for more sheets.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-950">Questions</h2>
            <div className="mt-4 space-y-6">
              {topic.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-gray-950">{faq.question}</h3>
                  <p className="mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <nav aria-label="More printable Sudoku" className="grid gap-4 sm:grid-cols-2">
            <Link href="/printable-sudoku" className="rounded-lg border p-4 hover:border-blue-300">
              <span className="block font-semibold text-gray-950">All printable Sudoku</span>
              <span className="text-sm text-slate-500">Easy, medium, hard and large print packs</span>
            </Link>
            {others.map((item) => (
              <Link key={item.slug} href={`/printable-sudoku/${item.slug}`} className="rounded-lg border p-4 hover:border-blue-300">
                <span className="block font-semibold text-gray-950">{item.h1}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  )
}
