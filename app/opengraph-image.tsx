import { ImageResponse } from "next/og"

export const alt = "SudokuStudio: free online Sudoku with hints and technique practice"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const grid = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
]

export default function OpengraphImage() {
  const cell = 46
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #eef2ff 100%)", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: "#2563eb", color: "white", fontSize: 40, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a" }}>SudokuStudio</div>
          </div>
          <div style={{ marginTop: 40, fontSize: 60, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>Free Online Sudoku</div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#334155", lineHeight: 1.4 }}>Play with hints, learn the techniques, print puzzles with answers.</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: cell * 9 + 8, border: "4px solid #0f172a", background: "white" }}>
          {grid.map((value, index) => {
            const row = Math.floor(index / 9)
            const col = index % 9
            return (
              <div
                key={index}
                style={{
                  width: cell,
                  height: cell,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0f172a",
                  borderRight: col === 8 ? "none" : col % 3 === 2 ? "2px solid #0f172a" : "1px solid #cbd5e1",
                  borderBottom: row === 8 ? "none" : row % 3 === 2 ? "2px solid #0f172a" : "1px solid #cbd5e1",
                  background: row === 4 && col === 4 ? "#dbeafe" : "white",
                }}
              >
                {value ? String(value) : ""}
              </div>
            )
          })}
        </div>
      </div>
    ),
    size,
  )
}
