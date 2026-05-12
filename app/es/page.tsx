import type { Metadata } from "next"
import { SeoHomePage } from "@/components/seo-home-page"
import { homeCopy, localizedAlternates } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: homeCopy.es.title,
  description: homeCopy.es.description,
  alternates: localizedAlternates("es", "/"),
  openGraph: {
    title: homeCopy.es.title,
    description: homeCopy.es.description,
    url: "https://www.sudokustudio.app/es",
    siteName: "SudokuStudio",
    locale: "es_ES",
    type: "website",
  },
}

export default function EsHomePage() {
  return <SeoHomePage locale="es" />
}
