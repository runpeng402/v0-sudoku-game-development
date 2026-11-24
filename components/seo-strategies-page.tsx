import Link from "next/link"
import { BookOpen, CheckCircle, Grid3X3, Layers, Lightbulb, Play, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { htmlLangByLocale, localizedPath, localizedUrl, pageCopy, type SeoLocale } from "@/lib/seo-locales"

type StrategyCopy = {
  eyebrow: string
  title: string
  intro: string
  primaryCta: string
  secondaryCta: string
  howToCta: string
  sectionsTitle: string
  sections: Array<{
    title: string
    description: string
    steps: string[]
  }>
  practiceTitle: string
  practiceText: string
}

const copyByLocale: Record<SeoLocale, StrategyCopy> = {
  en: {
    eyebrow: "Sudoku strategy guide",
    title: "Sudoku Strategies",
    intro:
      "Learn the solving methods that turn Sudoku from guessing into clear logic: scanning, candidates, singles, pairs, and box-line interactions.",
    primaryCta: "Practice strategies",
    secondaryCta: "Review the rules",
    howToCta: "How to play",
    sectionsTitle: "Core Sudoku solving strategies",
    sections: [
      {
        title: "Start with scanning",
        description: "Scan rows, columns, and 3x3 boxes that already contain many numbers.",
        steps: ["Find a missing digit in one unit.", "Check the crossing row and column.", "Place it only when one cell is possible."],
      },
      {
        title: "Use candidates",
        description: "Write small notes for possible numbers so you can compare cells without guessing.",
        steps: ["Remove numbers already used in the row.", "Remove numbers already used in the column.", "Remove numbers already used in the box."],
      },
      {
        title: "Find singles",
        description: "A naked single has one candidate left. A hidden single is the only place for a digit in a row, column, or box.",
        steps: ["Check cells with very few candidates.", "Look for a digit that appears in only one candidate list.", "Confirm the move against all three rules."],
      },
      {
        title: "Move to pairs and box-line logic",
        description: "When two cells share the same two candidates, or a box confines a digit to one line, you can eliminate options elsewhere.",
        steps: ["Mark matching candidate pairs.", "Keep the pair inside its shared unit.", "Remove those candidates from the rest of that unit."],
      },
    ],
    practiceTitle: "Practice one strategy at a time",
    practiceText: "Use easy and medium puzzles first, then move to hard puzzles when candidate logic feels natural.",
  },
  zh: {
    eyebrow: "数独解题策略",
    title: "数独策略",
    intro:
      "学习把数独从猜测变成逻辑推理的方法：扫行扫列、候选数、唯一数、数对，以及宫与行列之间的排除关系。",
    primaryCta: "练习策略",
    secondaryCta: "查看规则",
    howToCta: "数独怎么玩",
    sectionsTitle: "常用数独解题策略",
    sections: [
      {
        title: "先从扫描开始",
        description: "优先观察已经给出数字较多的行、列和 3x3 宫，更容易找到确定位置。",
        steps: ["选择一个缺失数字。", "检查它所在方向的行、列限制。", "只有一个格子可填时再落子。"],
      },
      {
        title: "使用候选数",
        description: "为不确定的格子记录可能数字，后续比较不同格子时就不需要靠记忆或猜测。",
        steps: ["排除同一行已有的数字。", "排除同一列已有的数字。", "排除同一宫已有的数字。"],
      },
      {
        title: "寻找唯一数",
        description: "显性唯一数是某格只剩一个候选；隐性唯一数是某个数字在一行、一列或一宫里只有一个可放位置。",
        steps: ["先看候选数很少的格子。", "再找某个数字只出现一次的候选位置。", "填入前同时核对行、列、宫三条规则。"],
      },
      {
        title: "进阶到数对和宫线排除",
        description: "当两个格子共享同样两个候选，或某个数字在宫内只可能落在同一行/列，就能排除其他位置。",
        steps: ["标记相同候选数组成的数对。", "确认它们处在同一个行、列或宫中。", "从该区域其他格子中删除这些候选。"],
      },
    ],
    practiceTitle: "一次练习一种策略",
    practiceText: "建议先用简单和中等难度题目练手，等候选数逻辑熟悉后，再挑战困难题。",
  },
  es: {
    eyebrow: "Guía de estrategias de Sudoku",
    title: "Estrategias de Sudoku",
    intro:
      "Aprende métodos que convierten Sudoku en lógica clara: escaneo, candidatos, singles, pares y eliminaciones entre cajas, filas y columnas.",
    primaryCta: "Practicar estrategias",
    secondaryCta: "Ver reglas",
    howToCta: "Cómo jugar",
    sectionsTitle: "Estrategias básicas de Sudoku",
    sections: [
      {
        title: "Empieza con el escaneo",
        description: "Busca filas, columnas y cajas 3x3 que ya tengan muchos números dados.",
        steps: ["Elige un dígito que falte.", "Revisa la fila y la columna que se cruzan.", "Colócalo solo cuando quede una casilla posible."],
      },
      {
        title: "Usa candidatos",
        description: "Anota números posibles para comparar casillas sin adivinar.",
        steps: ["Elimina números ya usados en la fila.", "Elimina números ya usados en la columna.", "Elimina números ya usados en la caja."],
      },
      {
        title: "Encuentra singles",
        description: "Un single desnudo tiene un solo candidato. Un single oculto es el único lugar para un dígito en una fila, columna o caja.",
        steps: ["Revisa casillas con pocos candidatos.", "Busca un dígito que aparezca en una sola lista de candidatos.", "Confirma la jugada con las tres reglas."],
      },
      {
        title: "Avanza a pares y lógica caja-linea",
        description: "Si dos casillas comparten los mismos dos candidatos, o una caja limita un dígito a una linea, puedes eliminar opciones.",
        steps: ["Marca pares de candidatos iguales.", "Mantén el par dentro de la misma unidad.", "Quita esos candidatos del resto de esa unidad."],
      },
    ],
    practiceTitle: "Practica una estrategia cada vez",
    practiceText: "Usa puzzles fáciles y medios primero; pasa a difíciles cuando la lógica de candidatos sea natural.",
  },
}

const icons = [Target, Lightbulb, CheckCircle, Layers]

interface SeoStrategiesPageProps {
  locale: SeoLocale
}

export function SeoStrategiesPage({ locale }: SeoStrategiesPageProps) {
  const copy = copyByLocale[locale]
  const rulesHref = localizedPath(locale, pageCopy.rules.path)
  const howToHref = localizedPath(locale, pageCopy.howToPlay.path)
  const playHref = localizedPath(locale, "/play")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    description: copy.intro,
    url: localizedUrl(locale, "/strategies"),
    mainEntityOfPage: localizedUrl(locale, "/strategies"),
    publisher: {
      "@type": "Organization",
      name: "SudokuStudio",
    },
  }

  return (
    <div className="min-h-screen bg-white" lang={htmlLangByLocale[locale]}>
      <main>
        <section className="border-b bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-14">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{copy.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-bold text-gray-950 md:text-5xl">{copy.title}</h1>
              <p className="mt-6 text-lg leading-8 text-gray-700">{copy.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={playHref}>
                    <Play className="mr-2 h-4 w-4" />
                    {copy.primaryCta}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={rulesHref}>{copy.secondaryCta}</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Grid3X3 className="h-4 w-4 text-blue-600" />
                9x9 Sudoku
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["5", "3", ""],
                  ["", "7", ""],
                  ["6", "", ""],
                  ["", "1", "9"],
                  ["", "", "5"],
                  ["", "", ""],
                  ["", "9", "8"],
                  ["", "", ""],
                  ["", "6", ""],
                ].map((box, boxIndex) => (
                  <div key={boxIndex} className="grid grid-cols-3 border border-gray-900">
                    {box.map((value, cellIndex) => (
                      <div
                        key={`${boxIndex}-${cellIndex}`}
                        className="flex aspect-square items-center justify-center border border-gray-200 text-sm font-semibold text-gray-900"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-950">{copy.sectionsTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {copy.sections.map((section, index) => {
                const Icon = icons[index] ?? Target
                return (
                  <article key={section.title} className="rounded-lg border p-6">
                    <Icon className="h-7 w-7 text-blue-600" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-950">{section.title}</h3>
                    <p className="mt-3 leading-7 text-gray-700">{section.description}</p>
                    <ol className="mt-4 space-y-2 text-sm leading-6 text-gray-600">
                      {section.steps.map((step) => (
                        <li key={step} className="flex gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border bg-white p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">{copy.practiceTitle}</h2>
              <p className="mt-2 max-w-3xl leading-7 text-gray-700">{copy.practiceText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={playHref}>{copy.primaryCta}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={howToHref}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {copy.howToCta}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  )
}
