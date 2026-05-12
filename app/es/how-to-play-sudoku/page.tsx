import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.howToPlay.es.title,
  description: pageCopy.howToPlay.es.description,
  alternates: localizedAlternates("es", pageCopy.howToPlay.path),
}

export default function EsHowToPlaySudokuPage() {
  return <SeoInfoPage locale="es" pageKey="howToPlay" />
}
