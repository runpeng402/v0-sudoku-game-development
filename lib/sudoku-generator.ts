export type SudokuGrid = (number | null)[][]
export type SudokuDifficulty = "easy" | "medium" | "hard"

const gridSize = 9
const boxSize = 3
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const cellsToRemoveByDifficulty: Record<SudokuDifficulty, number> = {
  easy: 40,
  medium: 50,
  hard: 54,
}

export function cloneGrid<T>(grid: T[][]): T[][] {
  return grid.map((row) => [...row])
}

export function isValidCompletedGrid(grid: number[][]): boolean {
  if (grid.length !== gridSize || grid.some((row) => row.length !== gridSize)) {
    return false
  }

  for (let index = 0; index < gridSize; index++) {
    const row = new Set<number>()
    const column = new Set<number>()

    for (let offset = 0; offset < gridSize; offset++) {
      row.add(grid[index][offset])
      column.add(grid[offset][index])
    }

    if (!hasAllDigits(row) || !hasAllDigits(column)) {
      return false
    }
  }

  for (let boxRow = 0; boxRow < gridSize; boxRow += boxSize) {
    for (let boxColumn = 0; boxColumn < gridSize; boxColumn += boxSize) {
      const box = new Set<number>()
      for (let row = boxRow; row < boxRow + boxSize; row++) {
        for (let column = boxColumn; column < boxColumn + boxSize; column++) {
          box.add(grid[row][column])
        }
      }
      if (!hasAllDigits(box)) {
        return false
      }
    }
  }

  return true
}

export function countSudokuSolutions(input: SudokuGrid, limit = 2): number {
  if (input.length !== gridSize || input.some((row) => row.length !== gridSize) || limit < 1) return 0

  const grid = cloneGrid(input)
  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      const value = grid[row][column]
      if (value === null) continue
      grid[row][column] = null
      const valid = digits.includes(value) && isValidPlacement(grid, row, column, value)
      grid[row][column] = value
      if (!valid) return 0
    }
  }
  let count = 0

  const solve = (): void => {
    if (count >= limit) return

    const next = findCellWithFewestCandidates(grid)
    if (!next) {
      count += 1
      return
    }

    const [row, column, candidates] = next
    for (const value of candidates) {
      grid[row][column] = value
      solve()
      grid[row][column] = null
      if (count >= limit) return
    }
  }

  solve()
  return count
}

export function generateSudokuPuzzle(difficulty: SudokuDifficulty = "medium"): {
  puzzle: SudokuGrid
  solution: number[][]
} {
  const solution = generateCompleteSolution()
  const puzzle: SudokuGrid = cloneGrid(solution)
  const targetRemovedCells = cellsToRemoveByDifficulty[difficulty]
  const positions = shuffleArray(Array.from({ length: 81 }, (_, index) => index))
  let removedCells = 0

  for (const position of positions) {
    if (removedCells >= targetRemovedCells) break

    const row = Math.floor(position / gridSize)
    const column = position % gridSize
    const previousValue = puzzle[row][column]

    puzzle[row][column] = null

    if (countSudokuSolutions(puzzle, 2) === 1) {
      removedCells += 1
    } else {
      puzzle[row][column] = previousValue
    }
  }

  return { puzzle, solution }
}

export function hasSingleSolution(grid: SudokuGrid): boolean {
  return countSudokuSolutions(grid, 2) === 1
}

function generateCompleteSolution(): number[][] {
  const grid: SudokuGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null))

  if (!fillGrid(grid)) {
    throw new Error("Failed to generate a complete Sudoku solution")
  }

  return grid as number[][]
}

function fillGrid(grid: SudokuGrid): boolean {
  const next = findCellWithFewestCandidates(grid, true)
  if (!next) return true

  const [row, column, candidates] = next
  for (const value of shuffleArray(candidates)) {
    grid[row][column] = value
    if (fillGrid(grid)) {
      return true
    }
    grid[row][column] = null
  }

  return false
}

function findCellWithFewestCandidates(
  grid: SudokuGrid,
  allowRandomTie = false,
): [number, number, number[]] | null {
  let best: [number, number, number[]] | null = null

  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      if (grid[row][column] !== null) continue

      const candidates = getCandidates(grid, row, column)
      if (candidates.length === 0) {
        return [row, column, []]
      }

      if (
        !best ||
        candidates.length < best[2].length ||
        (allowRandomTie && candidates.length === best[2].length && Math.random() < 0.5)
      ) {
        best = [row, column, candidates]
      }
    }
  }

  return best
}

function getCandidates(grid: SudokuGrid, row: number, column: number): number[] {
  return digits.filter((value) => isValidPlacement(grid, row, column, value))
}

function isValidPlacement(grid: SudokuGrid, row: number, column: number, value: number): boolean {
  for (let offset = 0; offset < gridSize; offset++) {
    if (grid[row][offset] === value || grid[offset][column] === value) {
      return false
    }
  }

  const boxRow = Math.floor(row / boxSize) * boxSize
  const boxColumn = Math.floor(column / boxSize) * boxSize
  for (let r = boxRow; r < boxRow + boxSize; r++) {
    for (let c = boxColumn; c < boxColumn + boxSize; c++) {
      if (grid[r][c] === value) {
        return false
      }
    }
  }

  return true
}

function hasAllDigits(values: Set<number>): boolean {
  return values.size === gridSize && digits.every((digit) => values.has(digit))
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}
