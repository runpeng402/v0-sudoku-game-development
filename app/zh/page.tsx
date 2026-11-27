import type { Metadata } from "next"
import { SeoHomePage } from "@/components/seo-home-page"
import { homeCopy, localizedAlternates, defaultOgImage } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: homeCopy.zh.title,
  description: homeCopy.zh.description,
  alternates: localizedAlternates("zh", "/"),
  openGraph: {
    images: [defaultOgImage],
    title: homeCopy.zh.title,
    description: homeCopy.zh.description,
    url: "https://www.sudokustudio.app/zh",
    siteName: "SudokuStudio",
    locale: "zh_CN",
    type: "website",
  },
}

export default function ZhHomePage() {
  return <SeoHomePage locale="zh" />
}
