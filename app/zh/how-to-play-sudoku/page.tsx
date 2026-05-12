import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.howToPlay.zh.title,
  description: pageCopy.howToPlay.zh.description,
  alternates: localizedAlternates("zh", pageCopy.howToPlay.path),
}

export default function ZhHowToPlaySudokuPage() {
  return <SeoInfoPage locale="zh" pageKey="howToPlay" />
}
