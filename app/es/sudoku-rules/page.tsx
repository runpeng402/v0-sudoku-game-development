import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.rules.es.title,
  description: pageCopy.rules.es.description,
  alternates: localizedAlternates("es", pageCopy.rules.path),
}

export default function EsSudokuRulesPage() {
  return <SeoInfoPage locale="es" pageKey="rules" />
}
