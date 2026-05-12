import { generateSudokuPuzzle, type SudokuDifficulty } from "@/lib/sudoku-generator"

type PrintableLevel = "easy" | "medium" | "hard" | "large-print"

type SudokuPuzzle = {
  title: string
  difficulty: string
  grid: number[][]
  solution: number[][]
}

export const printableLevels: Record<
  PrintableLevel,
  { label: string; filename: string; puzzleCount: number; removedCells: number }
> = {
  easy: {
    label: "Easy Sudoku",
    filename: "easy-sudoku-printable.pdf",
    puzzleCount: 4,
    removedCells: 34,
  },
  medium: {
    label: "Medium Sudoku",
    filename: "medium-sudoku-printable.pdf",
    puzzleCount: 4,
    removedCells: 44,
  },
  hard: {
    label: "Hard Sudoku",
    filename: "hard-sudoku-with-answers.pdf",
    puzzleCount: 4,
    removedCells: 54,
  },
  "large-print": {
  label: "Large Print Sudoku",
    filename: "large-print-sudoku.pdf",
    puzzleCount: 2,
    removedCells: 34,
  },
}

export function normalizePrintableLevel(level: string | null): PrintableLevel {
  if (level === "medium" || level === "hard" || level === "large-print") {
    return level
  }

  return "easy"
}

export function generatePrintableSudokuPdf(level: PrintableLevel): Buffer {
  const config = printableLevels[level]
  const puzzles = Array.from({ length: config.puzzleCount }, (_, index) =>
    createPuzzle(config.label, config.removedCells, index + 1),
  )
  const pageStreams = [
    ...puzzles.map((puzzle, index) => drawPuzzlePage(puzzle, index + 1, level === "large-print")),
    ...puzzles.map((puzzle, index) => drawSolutionPage(puzzle, index + 1, level === "large-print")),
  ]

  return buildPdf(pageStreams)
}

function createPuzzle(difficulty: string, removedCells: number, seed: number): SudokuPuzzle {
  const level = printableDifficultyFromRemovedCells(removedCells)
  const { puzzle, solution } = generateSudokuPuzzle(level)
  const grid = puzzle.map((row) => row.map((value) => value ?? 0))

  return {
    title: `${difficulty} Puzzle ${seed}`,
    difficulty,
    grid,
    solution,
  }
}

function printableDifficultyFromRemovedCells(removedCells: number): SudokuDifficulty {
  if (removedCells >= 50) return "hard"
  if (removedCells >= 44) return "medium"
  return "easy"
}

function drawPuzzlePage(puzzle: SudokuPuzzle, number: number, largePrint: boolean): string {
  const gridSize = largePrint ? 432 : 396
  const x = (612 - gridSize) / 2
  const y = largePrint ? 210 : 235
  const cellSize = gridSize / 9

  return [
    text("SudokuStudio Printable Sudoku", 72, 742, 18),
    text(`${puzzle.title} ${number}`, 72, 712, 15),
    text("Fill every row, column, and 3x3 box with the numbers 1-9.", 72, 690, 10),
    text("Solutions are included after the puzzle pages.", 72, 674, 10),
    drawGrid(x, y, cellSize, puzzle.grid, largePrint ? 20 : 17),
    text("sudokustudio.app", 72, 56, 9),
  ].join("\n")
}

function drawSolutionPage(puzzle: SudokuPuzzle, number: number, largePrint: boolean): string {
  const gridSize = largePrint ? 396 : 324
  const x = (612 - gridSize) / 2
  const y = largePrint ? 230 : 270
  const cellSize = gridSize / 9

  return [
    text("SudokuStudio Printable Sudoku", 72, 742, 18),
    text(`Solution ${number}`, 72, 712, 15),
    drawGrid(x, y, cellSize, puzzle.solution, largePrint ? 18 : 14),
    text("Check your answer, then try another puzzle at sudokustudio.app.", 72, 80, 10),
  ].join("\n")
}

function drawGrid(x: number, y: number, cellSize: number, grid: number[][], fontSize: number): string {
  const size = cellSize * 9
  const commands: string[] = ["q"]

  for (let i = 0; i <= 9; i++) {
    const weight = i % 3 === 0 ? 2 : 0.5
    const pos = round(x + i * cellSize)
    commands.push(`${weight} w ${pos} ${round(y)} m ${pos} ${round(y + size)} l S`)
  }

  for (let i = 0; i <= 9; i++) {
    const weight = i % 3 === 0 ? 2 : 0.5
    const pos = round(y + i * cellSize)
    commands.push(`${weight} w ${round(x)} ${pos} m ${round(x + size)} ${pos} l S`)
  }

  grid.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) return
      const textX = x + columnIndex * cellSize + cellSize / 2 - fontSize / 4
      const textY = y + (8 - rowIndex) * cellSize + cellSize / 2 - fontSize / 3
      commands.push(text(String(value), textX, textY, fontSize))
    })
  })

  commands.push("Q")
  return commands.join("\n")
}

function buildPdf(pageStreams: string[]): Buffer {
  const objects: string[] = []
  const addObject = (content: string) => {
    objects.push(content)
    return objects.length
  }

  addObject("<< /Type /Catalog /Pages 2 0 R >>")
  addObject("")
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

  const pageIds: number[] = []
  for (const stream of pageStreams) {
    const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`)
    const pageId = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
    pageIds.push(pageId)
  }

  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`

  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((content, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"))
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`
  })

  const xrefOffset = Buffer.byteLength(pdf, "utf8")
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, "utf8")
}

function text(value: string, x: number, y: number, size: number): string {
  return `BT /F1 ${size} Tf ${round(x)} ${round(y)} Td (${escapePdfText(value)}) Tj ET`
}

function escapePdfText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

function round(value: number): string {
  return Number(value.toFixed(2)).toString()
}
