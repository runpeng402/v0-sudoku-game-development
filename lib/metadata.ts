import type { Metadata } from "next"
import { siteConfig } from "./config"

const baseUrl = siteConfig.url

export const defaultMetadata: Metadata = {
  title: {
    default: "Sudoku Studio - Free Online Sudoku Game with Hints & Solutions",
    template: "%s | Sudoku Studio",
  },
  description:
    "Play free sudoku puzzles online with multiple difficulty levels, intelligent hints, and step-by-step solutions. Printable sudoku, killer sudoku, and educational content for all skill levels.",
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
    "sudoku hints",
    "sudoku tutorial",
    "learn sudoku",
    "sudoku for beginners",
    "hard sudoku",
    "expert sudoku",
    "sudoku variants",
    "online puzzle",
  ],
  authors: [{ name: "Sudoku Master Team" }],
  creator: "Sudoku Master",
  publisher: "Sudoku Master",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
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
    url: baseUrl,
    title: "Free Sudoku Game Online - Play Sudoku Puzzles with Hints & Solutions",
    description:
      "Play free sudoku puzzles online with multiple difficulty levels, intelligent hints, and step-by-step solutions.",
    siteName: "Sudoku Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Sudoku Game Online - Best Sudoku Puzzles",
      },
      {
        url: "/og-image-square.png",
        width: 600,
        height: 600,
        alt: "Sudoku Master Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku Studio - Free Online Sudoku Game with Hints & Solutions",
    description:
      "Play free sudoku puzzles online with multiple difficulty levels, intelligent hints, and step-by-step solutions.",
    images: ["/twitter-image.png"],
    creator: siteConfig.links.twitter.replace("https://twitter.com/", "@"),
    site: siteConfig.links.twitter.replace("https://twitter.com/", "@"),
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-search-console-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  category: "Games",
  classification: "Puzzle Game",
  referrer: "origin-when-cross-origin",
}

// 页面特定的元数据生成器
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  additionalKeywords: string[] = [],
): Metadata {
  return {
    title,
    description,
    keywords: [...(defaultMetadata.keywords as string[]), ...additionalKeywords],
    alternates: {
      canonical: path,
      languages: {
        "en-US": path,
        "zh-CN": `/zh${path}`,
        "es-ES": `/es${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      type: "website",
      images: [
        {
          url: `/og-${path.replace(/\//g, "-").substring(1) || "home"}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [`/twitter-${path.replace(/\//g, "-").substring(1) || "home"}.png`],
    },
  }
}
