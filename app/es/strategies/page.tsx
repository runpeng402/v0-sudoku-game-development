import type { Metadata } from "next"
import { SeoStrategiesPage } from "@/components/seo-strategies-page"
import { localizedAlternates } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: "Estrategias de Sudoku: candidatos, singles, pares y eliminación | SudokuStudio",
  description:
    "Aprende estrategias de Sudoku como escaneo, candidatos, singles, pares y lógica caja-linea para resolver puzzles sin adivinar.",
  alternates: localizedAlternates("es", "/strategies"),
}

export default function EsStrategiesPage() {
  return <SeoStrategiesPage locale="es" />
}
