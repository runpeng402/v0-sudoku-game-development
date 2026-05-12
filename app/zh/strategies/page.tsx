import type { Metadata } from "next"
import { SeoStrategiesPage } from "@/components/seo-strategies-page"
import { localizedAlternates } from "@/lib/seo-locales"

export const metadata: Metadata = {
  title: "数独策略：候选数、唯一数、数对和排除法 | SudokuStudio",
  description:
    "学习常用数独解题策略，包括扫描、候选数、显性唯一数、隐性唯一数、数对和宫线排除，适合从入门到进阶练习。",
  alternates: localizedAlternates("zh", "/strategies"),
}

export default function ZhStrategiesPage() {
  return <SeoStrategiesPage locale="zh" />
}
