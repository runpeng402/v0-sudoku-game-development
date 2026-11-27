import type { Metadata } from "next"
import { SeoHomePage } from "@/components/seo-home-page"
import { homeCopy, localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: homeCopy.en.title,
  description: homeCopy.en.description,
  keywords: "sudoku, free sudoku, online sudoku, sudoku game, sudoku puzzles, brain games, logic puzzles",
  alternates: localizedAlternates("en", "/"),
  openGraph: {
    images: [defaultOgImage],
    title: homeCopy.en.title,
    description: homeCopy.en.description,
    url: "https://www.sudokustudio.app",
    siteName: "SudokuStudio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeCopy.en.title,
    description: homeCopy.en.description,
  },
}

export default function Home() {
  return <SeoHomePage locale="en" />
}
