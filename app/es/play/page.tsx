import type { Metadata } from "next"
import { SudokuGamePage } from "@/components/sudoku-game-page"

export const metadata: Metadata = {
  title: "Jugar Sudoku en linea gratis | SudokuStudio",
  description: "Juega Sudoku gratis en linea con niveles facil, medio y dificil, pistas, temporizador y practica interactiva.",
  alternates: {
    canonical: "https://www.sudokustudio.app/es/play",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function EsPlayPage() {
  return <SudokuGamePage locale="es" />
}
