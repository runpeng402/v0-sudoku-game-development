import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found | SudokuStudio",
  robots: { index: false, follow: true },
}

const links = [
  ["/play", "Play Sudoku online"],
  ["/how-to-play-sudoku", "How to play Sudoku"],
  ["/sudoku-rules", "Sudoku rules"],
  ["/strategies", "Sudoku strategies"],
  ["/sudoku-practice", "Technique practice"],
  ["/printable-sudoku", "Printable Sudoku PDF"],
]

export default function NotFound() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-950">Page not found</h1>
      <p className="mt-4 text-lg text-gray-700">This page does not exist or has moved. Try one of these instead:</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="block rounded-lg border p-4 font-medium text-blue-700 hover:border-blue-300">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
