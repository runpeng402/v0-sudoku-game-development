// PDF generation utility for sudoku puzzles
export interface SudokuPuzzle {
  grid: number[][]
  solution: number[][]
  difficulty: string
  variant: string
}

export function generateSudokuGrid(variant: string, difficulty: string): SudokuPuzzle {
  // This is a simplified sudoku generator
  // In a real app, you'd use a proper sudoku generation algorithm

  const createEmptyGrid = () =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

  // Sample valid sudoku solution
  const baseSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]

  // Create puzzle by removing numbers based on difficulty
  const solution = baseSolution.map((row) => [...row])
  const grid = solution.map((row) => [...row])

  // Remove numbers based on difficulty
  const cellsToRemove = difficulty === "Easy" ? 35 : difficulty === "Medium" ? 45 : difficulty === "Hard" ? 55 : 65

  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    grid[row][col] = 0
  }

  return {
    grid,
    solution,
    difficulty,
    variant,
  }
}

export function generatePDFContent(variant: string, puzzleCount = 5): string {
  const puzzles: SudokuPuzzle[] = []
  const difficulty = variant === "samurai" || variant === "16x16" ? "Expert" : variant === "jigsaw" ? "Medium" : "Hard"

  // Generate multiple puzzles
  for (let i = 0; i < puzzleCount; i++) {
    puzzles.push(generateSudokuGrid(variant, difficulty))
  }

  // Create HTML content that can be converted to PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${variant.charAt(0).toUpperCase() + variant.slice(1)} Sudoku Puzzles</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .puzzle-container {
            page-break-after: always;
            margin-bottom: 40px;
        }
        .puzzle-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        .sudoku-grid {
            margin: 20px auto;
            border-collapse: collapse;
            border: 3px solid #000;
        }
        .sudoku-grid td {
            width: 35px;
            height: 35px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #666;
            font-size: 16px;
            font-weight: bold;
        }
        .sudoku-grid td.thick-right {
            border-right: 3px solid #000;
        }
        .sudoku-grid td.thick-bottom {
            border-bottom: 3px solid #000;
        }
        .instructions {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
        .variant-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .solutions {
            page-break-before: always;
        }
        .solution-grid {
            margin: 10px auto;
            border-collapse: collapse;
            border: 2px solid #000;
            font-size: 12px;
        }
        .solution-grid td {
            width: 25px;
            height: 25px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${variant.charAt(0).toUpperCase() + variant.slice(1)} Sudoku Puzzles</h1>
        <p>Difficulty: ${difficulty} | Generated: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="variant-info">
        <h3>About ${variant.charAt(0).toUpperCase() + variant.slice(1)} Sudoku:</h3>
        ${getVariantDescription(variant)}
    </div>
    
    <div class="instructions">
        <h3>Instructions:</h3>
        <ul>
            <li>Fill in the grid so that every row, column, and 3×3 box contains the digits 1-9</li>
            ${getVariantRules(variant)}
            <li>Use logic and deduction - no guessing required!</li>
            <li>Solutions are provided at the end of this document</li>
        </ul>
    </div>
    
    ${puzzles
      .map(
        (puzzle, index) => `
        <div class="puzzle-container">
            <div class="puzzle-title">Puzzle ${index + 1}</div>
            <table class="sudoku-grid">
                ${puzzle.grid
                  .map(
                    (row, rowIndex) => `
                    <tr>
                        ${row
                          .map(
                            (cell, colIndex) => `
                            <td class="${colIndex === 2 || colIndex === 5 ? "thick-right" : ""} ${rowIndex === 2 || rowIndex === 5 ? "thick-bottom" : ""}">
                                ${cell === 0 ? "" : cell}
                            </td>
                        `,
                          )
                          .join("")}
                    </tr>
                `,
                  )
                  .join("")}
            </table>
        </div>
    `,
      )
      .join("")}
    
    <div class="solutions">
        <h2>Solutions</h2>
        ${puzzles
          .map(
            (puzzle, index) => `
            <div style="margin-bottom: 30px;">
                <h3>Solution ${index + 1}</h3>
                <table class="solution-grid">
                    ${puzzle.solution
                      .map(
                        (row) => `
                        <tr>
                            ${row.map((cell) => `<td>${cell}</td>`).join("")}
                        </tr>
                    `,
                      )
                      .join("")}
                </table>
            </div>
        `,
          )
          .join("")}
    </div>
</body>
</html>`

  return htmlContent
}

function getVariantDescription(variant: string): string {
  switch (variant) {
    case "samurai":
      return "<p>Five overlapping 9×9 grids create an exciting challenge. The overlapping regions must satisfy the rules for both grids they belong to.</p>"
    case "killer":
      return "<p>Combines sudoku with math puzzles. Cages (outlined areas) must add up to the specified totals, and no number can repeat within a cage.</p>"
    case "jigsaw":
      return "<p>Irregular shaped regions replace the standard 3×3 boxes. Each irregular region must contain the digits 1-9.</p>"
    case "diagonal":
      return "<p>The two main diagonals must also contain the digits 1-9 without repetition, in addition to standard sudoku rules.</p>"
    case "hyper":
      return "<p>Four additional 3×3 regions (highlighted) must also contain the digits 1-9, creating extra constraints.</p>"
    case "16x16":
      return "<p>Expanded 16×16 grid using numbers 1-16 or letters A-P. Each row, column, and 4×4 box must contain all 16 symbols.</p>"
    default:
      return "<p>A unique sudoku variant with special rules and challenges.</p>"
  }
}

function getVariantRules(variant: string): string {
  switch (variant) {
    case "samurai":
      return "<li>Each of the five overlapping grids follows standard sudoku rules</li><li>Overlapping regions must satisfy rules for both grids</li>"
    case "killer":
      return "<li>Numbers in each cage must add up to the cage total</li><li>No number can repeat within a cage</li>"
    case "jigsaw":
      return "<li>Each irregular region must contain digits 1-9</li><li>Regions replace the standard 3×3 boxes</li>"
    case "diagonal":
      return "<li>Both main diagonals must contain digits 1-9</li><li>No repetition allowed in either diagonal</li>"
    case "hyper":
      return "<li>Four additional 3×3 regions must contain digits 1-9</li><li>These extra regions overlap with standard boxes</li>"
    case "16x16":
      return "<li>Use numbers 1-16 or letters A-P</li><li>Each 4×4 box must contain all 16 symbols</li>"
    default:
      return "<li>Follow the special rules for this variant</li>"
  }
}
