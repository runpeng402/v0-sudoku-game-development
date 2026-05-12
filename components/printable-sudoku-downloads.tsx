import Link from "next/link"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SeoLocale } from "@/lib/seo-locales"

const downloadCopy = {
  en: {
    easy: ["Easy Sudoku PDF", "Beginner-friendly puzzles with more given numbers and clear spacing.", "Download Easy PDF"],
    medium: ["Medium Sudoku PDF", "Balanced puzzles for regular practice and improving solving speed.", "Download Medium PDF"],
    hard: ["Hard Sudoku with Answers", "Harder puzzles for experienced solvers, with answer keys for checking.", "Download Hard PDF"],
    largePrint: ["Large Print Sudoku", "Bigger grids for seniors, classrooms, and comfortable offline solving.", "Download Large Print PDF"],
  },
  zh: {
    easy: ["简单数独 PDF", "给新手使用，已给数字更多，版面清晰，适合入门练习。", "下载简单 PDF"],
    medium: ["中等数独 PDF", "适合日常练习，在速度和逻辑难度之间保持平衡。", "下载中等 PDF"],
    hard: ["困难数独含答案", "给有经验的玩家练习，文件内包含答案页，方便核对。", "下载困难 PDF"],
    largePrint: ["大字版数独", "格子和数字更大，适合老人、课堂和纸面练习。", "下载大字版 PDF"],
  },
  es: {
    easy: ["Sudoku fácil PDF", "Puzzles para principiantes con más números dados y una cuadrícula clara.", "Descargar PDF fácil"],
    medium: ["Sudoku medio PDF", "Puzzles equilibrados para practicar a diario y mejorar la velocidad.", "Descargar PDF medio"],
    hard: ["Sudoku difícil con respuestas", "Puzzles más exigentes con páginas de respuestas para revisar.", "Descargar PDF difícil"],
    largePrint: ["Sudoku en letra grande", "Cuadrículas más grandes para imprimir y resolver con comodidad.", "Descargar PDF grande"],
  },
} satisfies Record<SeoLocale, Record<string, [string, string, string]>>

const downloads = [
  ["easy", "easy"],
  ["medium", "medium"],
  ["hard", "hard"],
  ["largePrint", "large-print"],
] as const

interface PrintableSudokuDownloadsProps {
  locale: SeoLocale
}

export function PrintableSudokuDownloads({ locale }: PrintableSudokuDownloadsProps) {
  const copy = downloadCopy[locale]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {downloads.map(([copyKey, level]) => {
        const [title, description, label] = copy[copyKey]

        return (
          <article key={level} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>
            <p className="mt-3 text-gray-700">{description}</p>
            <Button asChild variant="outline" className="mt-5">
              <Link href={`/api/printable-sudoku?level=${level}`} prefetch={false}>
                <Download className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          </article>
        )
      })}
    </div>
  )
}
