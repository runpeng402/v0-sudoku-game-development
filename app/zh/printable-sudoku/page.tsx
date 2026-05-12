import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.printable.zh.title,
  description: pageCopy.printable.zh.description,
  alternates: localizedAlternates("zh", pageCopy.printable.path),
}

export default function ZhPrintableSudokuPage() {
  return <SeoInfoPage locale="zh" pageKey="printable" />
}
