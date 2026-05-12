import type { Metadata } from "next"
import { SeoInfoPage } from "@/components/seo-info-page"
import { localizedAlternates, pageCopy } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: pageCopy.printable.es.title,
  description: pageCopy.printable.es.description,
  alternates: localizedAlternates("es", pageCopy.printable.path),
}

export default function EsPrintableSudokuPage() {
  return <SeoInfoPage locale="es" pageKey="printable" />
}
