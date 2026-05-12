import { generatePrintableSudokuPdf, normalizePrintableLevel, printableLevels } from "@/lib/printable-sudoku-pdf"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const level = normalizePrintableLevel(searchParams.get("level"))
  const pdf = generatePrintableSudokuPdf(level)
  const filename = printableLevels[level].filename

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
