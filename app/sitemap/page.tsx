import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sitemap | SudokuStudio",
  description: "Browse SudokuStudio pages for playing, learning, printable puzzles, and Sudoku strategy guides.",
  alternates: {
    canonical: "https://www.sudokustudio.app/sitemap",
  },
}

const groups = [
  {
    title: "Play Sudoku",
    links: [
      ["/", "Free Online Sudoku"],
      ["/zh", "免费在线数独"],
      ["/es", "Sudoku gratis en línea"],
      ["/play", "Play Sudoku Online"],
    ],
  },
  {
    title: "Learn Sudoku",
    links: [
      ["/how-to-play-sudoku", "How to Play Sudoku"],
      ["/zh/how-to-play-sudoku", "数独怎么玩"],
      ["/es/how-to-play-sudoku", "Cómo jugar Sudoku"],
      ["/sudoku-rules", "Sudoku Rules"],
      ["/zh/sudoku-rules", "数独规则"],
      ["/es/sudoku-rules", "Reglas de Sudoku"],
      ["/strategies", "Sudoku Strategies"],
      ["/sudoku-practice", "Sudoku Practice Exercises"],
      ["/zh/strategies", "数独策略"],
      ["/es/strategies", "Estrategias de Sudoku"],
      ["/variants", "Sudoku Variants"],
    ],
  },
  {
    title: "Printable Sudoku",
    links: [
      ["/printable-sudoku", "Printable Sudoku PDF"],
      ["/zh/printable-sudoku", "可打印数独 PDF"],
      ["/es/printable-sudoku", "Sudoku imprimible PDF"],
    ],
  },
  {
    title: "Community and Content",
    links: [
      ["/articles", "Sudoku Articles"],
      ["/articles/beginner-sudoku-guide", "Beginner Sudoku Guide"],
      ["/articles/printable-sudoku-with-answers", "Printable Sudoku with Answers"],
      ["/articles/basic-sudoku-strategies", "Basic Sudoku Strategies"],
      ["/articles/teaching-sudoku-to-kids", "Teaching Sudoku to Kids"],
    ],
  },
]

export default function HtmlSitemapPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-950">SudokuStudio Sitemap</h1>
        <p className="mt-4 text-lg text-gray-700">
          Find the main SudokuStudio pages for playing Sudoku, learning the rules,
          reading strategy guides, and finding printable puzzles.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title} className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-950">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link className="text-blue-700 hover:text-blue-900" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
