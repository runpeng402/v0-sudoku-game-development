import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.rules.zh.title,
  description: pageCopy.rules.zh.description,
  alternates: localizedAlternates("zh", pageCopy.rules.path),
}

export default function ZhSudokuRulesPage() {
  return <SeoInfoPage locale="zh" pageKey="rules" />
}
