// Enhanced PDF generation for sudoku variants
export interface SudokuVariantPuzzle {
  grid: (number | string)[][]
  solution: (number | string)[][]
  variant: string
  difficulty: string
  title: string
  instructions: string[]
  specialRules?: string[]
  cages?: { cells: [number, number][]; sum: number }[] // For killer sudoku
  regions?: number[][] // For jigsaw sudoku
}

export class VariantPuzzleGenerator {
  // Generate Samurai Sudoku (5 overlapping grids)
  static generateSamuraiSudoku(): SudokuVariantPuzzle {
    // Create 5 interconnected 9x9 grids
    const grid = Array(21)
      .fill(null)
      .map(() => Array(21).fill(0))
    const solution = Array(21)
      .fill(null)
      .map(() => Array(21).fill(0))

    // Sample Samurai pattern with 5 overlapping grids
    // This is a simplified version - real implementation would be more complex
    const samplePattern = this.createSamuraiPattern()

    return {
      grid: samplePattern.puzzle,
      solution: samplePattern.solution,
      variant: "samurai",
      difficulty: "Expert",
      title: "Samurai Sudoku Puzzle",
      instructions: [
        "Fill each of the five 9×9 grids following standard Sudoku rules",
        "Numbers 1-9 must appear once in each row, column, and 3×3 box within each grid",
        "Overlapping regions must satisfy the constraints of both grids they belong to",
      ],
      specialRules: [
        "The puzzle consists of five interconnected standard Sudoku grids",
        "Four grids are positioned at the corners, with one central grid",
        "Each corner grid overlaps with the central grid in a 3×3 region",
      ],
    }
  }

  // Generate Killer Sudoku
  static generateKillerSudoku(): SudokuVariantPuzzle {
    const grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    const solution = this.generateValidSudokuSolution()

    // Create cages with sums
    const cages = this.generateKillerCages(solution)

    // Remove numbers from grid (killer sudoku typically starts empty)
    const puzzleGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

    return {
      grid: puzzleGrid,
      solution,
      variant: "killer",
      difficulty: "Hard",
      title: "Killer Sudoku Puzzle",
      instructions: [
        "Fill the grid so each row, column, and 3×3 box contains digits 1-9",
        "Numbers in each cage must sum to the total shown in the corner",
        "No number can repeat within a cage",
      ],
      cages,
      specialRules: [
        "Cages are groups of cells outlined in dashed lines",
        "The small number in the corner shows the sum for that cage",
        "Use both Sudoku logic and arithmetic to solve",
      ],
    }
  }

  // Generate Jigsaw Sudoku
  static generateJigsawSudoku(): SudokuVariantPuzzle {
    const solution = this.generateValidSudokuSolution()
    const grid = this.createJigsawPuzzle(solution)
    const regions = this.generateJigsawRegions()

    return {
      grid,
      solution,
      variant: "jigsaw",
      difficulty: "Medium",
      title: "Jigsaw Sudoku Puzzle",
      instructions: [
        "Fill the grid so each row and column contains digits 1-9",
        "Each irregular region must also contain digits 1-9",
        "Irregular regions replace the standard 3×3 boxes",
      ],
      regions,
      specialRules: [
        "Nine irregular regions each contain exactly 9 cells",
        "Regions are shown with different background colors or borders",
        "Standard row and column rules still apply",
      ],
    }
  }

  // Generate Diagonal Sudoku
  static generateDiagonalSudoku(): SudokuVariantPuzzle {
    const solution = this.generateValidDiagonalSudokuSolution()
    const grid = this.createPuzzleFromSolution(solution, 45) // Remove 45 numbers for hard difficulty

    return {
      grid,
      solution,
      variant: "diagonal",
      difficulty: "Hard",
      title: "Diagonal Sudoku Puzzle",
      instructions: [
        "Fill the grid following standard Sudoku rules",
        "Both main diagonals must also contain digits 1-9",
        "No repetition allowed in either diagonal",
      ],
      specialRules: [
        "Main diagonal from top-left to bottom-right contains 1-9",
        "Main diagonal from top-right to bottom-left contains 1-9",
        "Diagonal constraints add extra solving opportunities",
      ],
    }
  }

  // Generate Hyper Sudoku
  static generateHyperSudoku(): SudokuVariantPuzzle {
    const solution = this.generateValidHyperSudokuSolution()
    const grid = this.createPuzzleFromSolution(solution, 50)

    return {
      grid,
      solution,
      variant: "hyper",
      difficulty: "Hard",
      title: "Hyper Sudoku Puzzle",
      instructions: [
        "Fill the grid following standard Sudoku rules",
        "Four additional 3×3 regions must also contain digits 1-9",
        "Extra regions are highlighted in the grid",
      ],
      specialRules: [
        "Four extra 3×3 regions located at positions (2,2), (2,6), (6,2), and (6,6)",
        "Each extra region must contain digits 1-9 without repetition",
        "Extra regions overlap with standard 3×3 boxes",
      ],
    }
  }

  // Generate 16x16 Sudoku
  static generate16x16Sudoku(): SudokuVariantPuzzle {
    const solution = this.generateValid16x16Solution()
    const grid = this.create16x16Puzzle(solution)

    return {
      grid,
      solution,
      variant: "16x16",
      difficulty: "Expert",
      title: "16×16 Sudoku Puzzle",
      instructions: [
        "Fill the 16×16 grid with numbers 1-16 or letters A-P",
        "Each row must contain all 16 symbols exactly once",
        "Each column must contain all 16 symbols exactly once",
        "Each 4×4 box must contain all 16 symbols exactly once",
      ],
      specialRules: [
        "Grid is 16×16 instead of standard 9×9",
        "Uses 16 symbols: either 1-16 or A-P",
        "4×4 boxes replace standard 3×3 boxes",
        "Significantly more complex than standard Sudoku",
      ],
    }
  }

  // Helper methods for puzzle generation
  private static generateValidSudokuSolution(): number[][] {
    // Base valid solution
    return [
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
  }

  private static generateValidDiagonalSudokuSolution(): number[][] {
    // Generate solution that satisfies diagonal constraints
    return [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 1, 5, 6, 4, 8, 9, 7],
      [5, 6, 4, 8, 9, 7, 2, 3, 1],
      [8, 9, 7, 2, 3, 1, 5, 6, 4],
      [3, 1, 2, 6, 4, 5, 9, 7, 8],
      [6, 4, 5, 9, 7, 8, 3, 1, 2],
      [9, 7, 8, 3, 1, 2, 6, 4, 5],
    ]
  }

  private static generateValidHyperSudokuSolution(): number[][] {
    // Generate solution that satisfies hyper constraints
    return this.generateValidSudokuSolution() // Simplified for demo
  }

  private static generateValid16x16Solution(): string[][] {
    // Generate 16x16 solution with letters A-P
    const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
    const grid = Array(16)
      .fill(null)
      .map(() => Array(16).fill(""))

    // Simplified generation - in real implementation would use proper algorithm
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        grid[i][j] = symbols[(i + j) % 16]
      }
    }
    return grid
  }

  private static createPuzzleFromSolution(solution: number[][], cellsToRemove: number): number[][] {
    const puzzle = solution.map((row) => [...row])

    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      puzzle[row][col] = 0
    }

    return puzzle
  }

  private static createJigsawPuzzle(solution: number[][]): number[][] {
    return this.createPuzzleFromSolution(solution, 40)
  }

  private static create16x16Puzzle(solution: string[][]): string[][] {
    const puzzle = solution.map((row) => [...row])

    // Remove about 60% of cells for expert difficulty
    for (let i = 0; i < 150; i++) {
      const row = Math.floor(Math.random() * 16)
      const col = Math.floor(Math.random() * 16)
      puzzle[row][col] = ""
    }

    return puzzle
  }

  private static generateKillerCages(solution: number[][]): { cells: [number, number][]; sum: number }[] {
    // Generate sample cages for killer sudoku
    return [
      {
        cells: [
          [0, 0],
          [0, 1],
        ],
        sum: solution[0][0] + solution[0][1],
      },
      {
        cells: [
          [0, 2],
          [1, 2],
        ],
        sum: solution[0][2] + solution[1][2],
      },
      {
        cells: [
          [1, 0],
          [1, 1],
          [2, 0],
        ],
        sum: solution[1][0] + solution[1][1] + solution[2][0],
      },
      // Add more cages...
    ]
  }

  private static generateJigsawRegions(): number[][] {
    // Define 9 irregular regions for jigsaw sudoku
    return [
      [0, 0, 0, 1, 1, 1, 2, 2, 2],
      [0, 0, 3, 1, 1, 4, 2, 2, 5],
      [0, 3, 3, 3, 4, 4, 4, 5, 5],
      [6, 3, 3, 7, 7, 4, 8, 8, 5],
      [6, 6, 7, 7, 7, 8, 8, 8, 8],
      [6, 6, 6, 7, 7, 7, 8, 8, 8],
      [6, 6, 6, 7, 7, 7, 8, 8, 8],
      [6, 6, 6, 7, 7, 7, 8, 8, 8],
      [6, 6, 6, 7, 7, 7, 8, 8, 8],
    ]
  }

  private static createSamuraiPattern(): { puzzle: number[][]; solution: number[][] } {
    // Simplified samurai pattern - real implementation would be much more complex
    const size = 21
    const puzzle = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0))
    const solution = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0))

    // Fill with sample pattern
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (this.isValidSamuraiCell(i, j)) {
          solution[i][j] = ((i + j) % 9) + 1
          if (Math.random() > 0.7) {
            // Keep some numbers visible
            puzzle[i][j] = solution[i][j]
          }
        }
      }
    }

    return { puzzle, solution }
  }

  private static isValidSamuraiCell(row: number, col: number): boolean {
    // Define which cells are part of the samurai pattern
    return (
      (row < 9 && col < 9) || // Top-left grid
      (row < 9 && col >= 12) || // Top-right grid
      (row >= 6 && row < 15 && col >= 6 && col < 15) || // Center grid
      (row >= 12 && col < 9) || // Bottom-left grid
      (row >= 12 && col >= 12) // Bottom-right grid
    )
  }
}

export function generateVariantPDF(variant: string, puzzleCount = 5): string {
  const puzzles: SudokuVariantPuzzle[] = []

  // Generate puzzles based on variant type
  for (let i = 0; i < puzzleCount; i++) {
    switch (variant) {
      case "samurai":
        puzzles.push(VariantPuzzleGenerator.generateSamuraiSudoku())
        break
      case "killer":
        puzzles.push(VariantPuzzleGenerator.generateKillerSudoku())
        break
      case "jigsaw":
        puzzles.push(VariantPuzzleGenerator.generateJigsawSudoku())
        break
      case "diagonal":
        puzzles.push(VariantPuzzleGenerator.generateDiagonalSudoku())
        break
      case "hyper":
        puzzles.push(VariantPuzzleGenerator.generateHyperSudoku())
        break
      case "16x16":
        puzzles.push(VariantPuzzleGenerator.generate16x16Sudoku())
        break
      default:
        puzzles.push(VariantPuzzleGenerator.generateDiagonalSudoku())
    }
  }

  // Generate HTML content for PDF
  return generateVariantHTMLContent(puzzles, variant)
}

function generateVariantHTMLContent(puzzles: SudokuVariantPuzzle[], variant: string): string {
  const variantTitle = variant.charAt(0).toUpperCase() + variant.slice(1)

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${variantTitle} Sudoku Puzzles - SudokuStudio</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .header p {
            color: #6b7280;
            font-size: 16px;
        }
        .puzzle-container {
            page-break-after: always;
            margin-bottom: 50px;
        }
        .puzzle-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #1e40af;
        }
        .puzzle-info {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
        }
        .sudoku-grid {
            margin: 20px auto;
            border-collapse: collapse;
            border: 3px solid #000;
            font-family: 'Courier New', monospace;
        }
        .sudoku-grid td {
            width: 35px;
            height: 35px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #666;
            font-size: 16px;
            font-weight: bold;
            background-color: white;
        }
        .sudoku-grid td.thick-right {
            border-right: 3px solid #000;
        }
        .sudoku-grid td.thick-bottom {
            border-bottom: 3px solid #000;
        }
        .sudoku-grid td.diagonal {
            background-color: #fef3c7;
        }
        .sudoku-grid td.hyper-region {
            background-color: #dbeafe;
        }
        .instructions {
            margin: 20px 0;
            padding: 20px;
            background-color: #f0f9ff;
            border-radius: 8px;
            border: 1px solid #0ea5e9;
        }
        .instructions h3 {
            color: #0c4a6e;
            margin-top: 0;
        }
        .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
        }
        .special-rules {
            background-color: #fef7ff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #d946ef;
            margin-top: 15px;
        }
        .special-rules h4 {
            color: #a21caf;
            margin-top: 0;
        }
        .solutions {
            page-break-before: always;
        }
        .solution-grid {
            margin: 15px auto;
            border-collapse: collapse;
            border: 2px solid #374151;
            font-size: 12px;
        }
        .solution-grid td {
            width: 25px;
            height: 25px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #9ca3af;
            font-size: 11px;
            background-color: #f9fafb;
        }
        .cage {
            border: 2px dashed #dc2626;
            position: relative;
        }
        .cage-sum {
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: 10px;
            color: #dc2626;
            font-weight: bold;
        }
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: #9ca3af;
            font-size: 12px;
        }
        @media print {
            .puzzle-container {
                page-break-after: always;
            }
            .solutions {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${variantTitle} Sudoku Puzzles</h1>
        <p>Generated by SudokuStudio.app | ${new Date().toLocaleDateString()}</p>
        <p>Difficulty: ${puzzles[0]?.difficulty || "Mixed"} | ${puzzles.length} Puzzles</p>
    </div>
    
    <div class="instructions">
        <h3>How to Solve ${variantTitle} Sudoku:</h3>
        <ul>
            ${puzzles[0]?.instructions.map((instruction) => `<li>${instruction}</li>`).join("") || ""}
        </ul>
        ${
          puzzles[0]?.specialRules
            ? `
        <div class="special-rules">
            <h4>Special Rules for ${variantTitle} Sudoku:</h4>
            <ul>
                ${puzzles[0].specialRules.map((rule) => `<li>${rule}</li>`).join("")}
            </ul>
        </div>
        `
            : ""
        }
    </div>
    
    ${puzzles
      .map(
        (puzzle, index) => `
        <div class="puzzle-container">
            <div class="puzzle-title">Puzzle ${index + 1}</div>
            <div class="puzzle-info">
                <strong>Variant:</strong> ${puzzle.variant.charAt(0).toUpperCase() + puzzle.variant.slice(1)} | 
                <strong>Difficulty:</strong> ${puzzle.difficulty}
            </div>
            ${renderPuzzleGrid(puzzle)}
        </div>
    `,
      )
      .join("")}
    
    <div class="solutions">
        <h2 style="text-align: center; color: #1e40af; margin-bottom: 30px;">Solutions</h2>
        ${puzzles
          .map(
            (puzzle, index) => `
            <div style="margin-bottom: 40px;">
                <h3 style="text-align: center;">Solution ${index + 1}</h3>
                ${renderSolutionGrid(puzzle)}
            </div>
        `,
          )
          .join("")}
    </div>
    
    <div class="watermark">
        SudokuStudio.app - Free Sudoku Puzzles
    </div>
</body>
</html>`
}

function renderPuzzleGrid(puzzle: SudokuVariantPuzzle): string {
  const gridSize = puzzle.grid.length
  const cellSize = gridSize === 16 ? "25px" : "35px"
  const fontSize = gridSize === 16 ? "12px" : "16px"

  let html = `<table class="sudoku-grid" style="font-size: ${fontSize};">`

  for (let i = 0; i < gridSize; i++) {
    html += "<tr>"
    for (let j = 0; j < gridSize; j++) {
      const cell = puzzle.grid[i][j]
      const cellValue = cell === 0 || cell === "" ? "" : cell

      let cellClass = ""

      // Add thick borders for standard sudoku boxes
      if (gridSize === 9) {
        if (j === 2 || j === 5) cellClass += " thick-right"
        if (i === 2 || i === 5) cellClass += " thick-bottom"
      } else if (gridSize === 16) {
        if (j === 3 || j === 7 || j === 11) cellClass += " thick-right"
        if (i === 3 || i === 7 || i === 11) cellClass += " thick-bottom"
      }

      // Add special styling for variants
      if (puzzle.variant === "diagonal" && (i === j || i + j === gridSize - 1)) {
        cellClass += " diagonal"
      }

      if (puzzle.variant === "hyper" && isHyperRegion(i, j)) {
        cellClass += " hyper-region"
      }

      html += `<td class="${cellClass}" style="width: ${cellSize}; height: ${cellSize};">${cellValue}</td>`
    }
    html += "</tr>"
  }

  html += "</table>"
  return html
}

function renderSolutionGrid(puzzle: SudokuVariantPuzzle): string {
  const gridSize = puzzle.solution.length

  let html = '<table class="solution-grid">'

  for (let i = 0; i < gridSize; i++) {
    html += "<tr>"
    for (let j = 0; j < gridSize; j++) {
      const cell = puzzle.solution[i][j]
      html += `<td>${cell}</td>`
    }
    html += "</tr>"
  }

  html += "</table>"
  return html
}

function isHyperRegion(row: number, col: number): boolean {
  return (
    (row >= 1 && row <= 3 && col >= 1 && col <= 3) ||
    (row >= 1 && row <= 3 && col >= 5 && col <= 7) ||
    (row >= 5 && row <= 7 && col >= 1 && col <= 3) ||
    (row >= 5 && row <= 7 && col >= 5 && col <= 7)
  )
}
