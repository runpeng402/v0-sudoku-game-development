import type { Metadata } from "next"
import { Homepage } from "@/components/homepage"
import { SiteNavigation } from "@/components/site-navigation"
import { I18nProvider } from "@/components/i18n-provider"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Free Online Sudoku Game - Play & Learn | SudokuStudio",
  description:
    "Play free Sudoku puzzles online with multiple difficulty levels, hints, and step-by-step solutions. Perfect for beginners and experts. Download printable puzzles.",
  keywords:
    "sudoku, free sudoku, online sudoku, sudoku game, sudoku puzzles, brain games, logic puzzles, number puzzles",
  openGraph: {
    title: "Free Online Sudoku Game - Play & Learn",
    description: "Play free Sudoku puzzles online with multiple difficulty levels, hints, and step-by-step solutions.",
    url: "https://www.sudokustudio.app",
    siteName: "SudokuStudio",
    images: [
      {
        url: "https://www.sudokustudio.app/images/sudoku-og.jpg",
        width: 1200,
        height: 630,
        alt: "Free Online Sudoku Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Sudoku Game - Play & Learn",
    description: "Play free Sudoku puzzles online with multiple difficulty levels, hints, and step-by-step solutions.",
    images: ["https://www.sudokustudio.app/images/sudoku-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app",
  },
}

function HomePageContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <SiteNavigation />

      {/* Page Content */}
      <main>
        <Homepage />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SudokuStudio</h3>
              <p className="text-gray-400 text-sm">
                The ultimate destination for Sudoku enthusiasts. Play, learn, and master the art of Sudoku.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Game</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/play" className="hover:text-white transition-colors">
                    Play Now
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-play" className="hover:text-white transition-colors">
                    How to Play
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Free Puzzles</li>
                <li>Solver</li>
                <li>Printable</li>
                <li>Hints</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 SudokuStudio. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Play Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          asChild
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Link href="/play">
            <Play className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <I18nProvider>
      <HomePageContent />
    </I18nProvider>
  )
}
