import type { Metadata } from "next"
import { SudokuGamePage } from "@/components/sudoku-game-page"

export const metadata: Metadata = {
  title: "在线玩数独 - 免费数独游戏 | SudokuStudio",
  description: "在线玩免费数独游戏，支持简单、中等、困难难度，并提供提示、计时和练习功能。",
  alternates: {
    canonical: "https://www.sudokustudio.app/zh/play",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ZhPlayPage() {
  return <SudokuGamePage locale="zh" />
}
