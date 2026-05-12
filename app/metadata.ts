import type { Metadata } from "next"

export const defaultMetadata: Metadata = {
  title: {
    default: "Free Sudoku Game Online - Play Sudoku Puzzles with Hints & Solutions",
    template: "%s | Free Sudoku Game Online",
  },
  description:
    "Play free sudoku puzzles online with multiple difficulty levels, hints, and solving techniques. Printable sudoku, killer sudoku, and more variants available.",
  keywords: [
    "sudoku",
    "free sudoku",
    "sudoku online",
    "sudoku game",
    "sudoku puzzles",
    "sudoku solver",
    "printable sudoku",
    "killer sudoku",
    "sudoku strategies",
    "brain training",
    "puzzle game",
    "logic puzzle",
  ],
  authors: [{ name: "SudokuStudio Team" }],
  creator: "SudokuStudio",
  publisher: "SudokuStudio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.sudokustudio.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "zh-CN": "/zh",
      "es-ES": "/es",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sudokustudio.app",
    title: "Free Sudoku Game Online - Play Sudoku Puzzles with Hints & Solutions",
    description: "Play free sudoku puzzles online with multiple difficulty levels, hints, and solving techniques.",
    siteName: "Free Sudoku Game Online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Sudoku Game Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sudoku Game Online - Play Sudoku Puzzles with Hints & Solutions",
    description: "Play free sudoku puzzles online with multiple difficulty levels, hints, and solving techniques.",
    images: ["/twitter-image.png"],
    creator: "@sudokustudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
}
