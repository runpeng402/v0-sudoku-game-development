import type { Metadata } from "next"
import Link from "next/link"
import { SudokuGamePage } from "@/components/sudoku-game-page"

const title = "Jugar Sudoku Gratis en Línea: Fácil, Medio y Difícil | SudokuStudio"
const description =
  "Juega Sudoku gratis en línea sin registrarte. Niveles fácil, medio y difícil, con pistas que explican cada movimiento. Funciona en móvil, tablet y ordenador."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://www.sudokustudio.app/es/play",
    languages: {
      en: "https://www.sudokustudio.app/play",
      es: "https://www.sudokustudio.app/es/play",
      "x-default": "https://www.sudokustudio.app/play",
    },
  },
  openGraph: {
    title,
    description,
    url: "https://www.sudokustudio.app/es/play",
    siteName: "SudokuStudio",
    locale: "es_ES",
    type: "website",
  },
}

export default function EsPlayPage() {
  return (
    <>
      <SudokuGamePage locale="es" />
      <section className="border-t bg-white px-4 py-12" lang="es">
        <div className="mx-auto max-w-3xl space-y-8 leading-7 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Cómo jugar este Sudoku gratis</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-6">
              <li>Elige un nivel. Fácil, medio y difícil son gratis y no piden cuenta.</li>
              <li>Haz clic en una casilla vacía y escribe un número del 1 al 9, o usa el teclado en pantalla.</li>
              <li>Cada fila, columna y caja 3x3 debe contener los números 1 a 9 sin repetir.</li>
              <li>Si te bloqueas, usa una pista: te explica la lógica del siguiente movimiento.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">¿Qué nivel elegir?</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><strong>Fácil</strong>: más números dados. Ideal para aprender las reglas y jugar relajado.</li>
              <li><strong>Medio</strong>: menos pistas iniciales. Requiere observar filas, columnas y cajas con cuidado.</li>
              <li><strong>Difícil</strong>: para jugadores con experiencia. Apunta candidatos en las casillas vacías.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Aprende mientras juegas</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><Link href="/es/how-to-play-sudoku" className="font-medium text-blue-700 underline underline-offset-4">Cómo jugar Sudoku</Link>, guía paso a paso para principiantes.</li>
              <li><Link href="/es/sudoku-rules" className="font-medium text-blue-700 underline underline-offset-4">Reglas de Sudoku</Link> explicadas con ejemplos.</li>
              <li><Link href="/es/printable-sudoku" className="font-medium text-blue-700 underline underline-offset-4">Sudoku imprimible</Link> en PDF con respuestas.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
