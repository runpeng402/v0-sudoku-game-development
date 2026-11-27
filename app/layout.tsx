import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { SeoNavigation } from "@/components/seo-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sudokustudio.app"),
  title: "SudokuStudio: Free Online Sudoku with Hints",
  description: "Play free online Sudoku with hints, learn solving techniques, and print Sudoku puzzles with answers.",
  applicationName: "SudokuStudio",
  openGraph: {
    siteName: "SudokuStudio",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense（必须用原生 <script>，不能用 <Script />） */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3643336601680114"
          crossOrigin="anonymous"
        ></script>

        {/* Google Analytics */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-R4JL9PF838" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R4JL9PF838');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SeoNavigation />
        {children}
      </body>
    </html>
  )
}
