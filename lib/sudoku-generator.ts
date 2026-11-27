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
  return searchSolutions(input, limit).count
}

export type SudokuSolveResult =
  | { status: "solved" | "multiple"; solution: number[][] }
  | { status: "invalid" | "unsolvable" }

export function solveSudoku(input: SudokuGrid): SudokuSolveResult {
  if (input.length !== gridSize || input.some((row) => row.length !== gridSize)) return { status: "invalid" }
  const { count, first, valid } = searchSolutions(input, 2)
  if (!valid) return { status: "invalid" }
  if (count === 0 || !first) return { status: "unsolvable" }
  if (count > 1) return { status: "multiple", solution: first }
  return { status: "solved", solution: first }
}

function searchSolutions(input: SudokuGrid, limit: number): { count: number; first: number[][] | null; valid: boolean } {
  if (input.length !== gridSize || input.some((row) => row.length !== gridSize) || limit < 1) {
    return { count: 0, first: null, valid: false }
  }

  const grid = cloneGrid(input)
  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      const value = grid[row][column]
      if (value === null) continue
      grid[row][column] = null
      const valid = digits.includes(value) && isValidPlacement(grid, row, column, value)
      grid[row][column] = value
      if (!valid) return { count: 0, first: null, valid: false }
    }
  }
  let count = 0
  let first: number[][] | null = null

  const solve = (): void => {
    if (count >= limit) return

    const next = findCellWithFewestCandidates(grid)
    if (!next) {
      count += 1
      if (!first) first = cloneGrid(grid) as number[][]
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
  return { count, first, valid: true }
}

/** Deterministic PRNG (mulberry32) so a seed such as a date always yields the same puzzle. */
export function createSeededRandom(seed: string): () => number {
  let state = 2166136261
  for (let index = 0; index < seed.length; index++) {
    state = Math.imul(state ^ seed.charCodeAt(index), 16777619)
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function generateSudokuPuzzle(
  difficulty: SudokuDifficulty = "medium",
  random: () => number = Math.random,
): {
  puzzle: SudokuGrid
  solution: number[][]
} {
  const solution = generateCompleteSolution(random)
  const puzzle: SudokuGrid = cloneGrid(solution)
  const targetRemovedCells = cellsToRemoveByDifficulty[difficulty]
  const positions = shuffleArray(Array.from({ length: 81 }, (_, index) => index), random)
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

function generateCompleteSolution(random: () => number): number[][] {
  const grid: SudokuGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null))

  if (!fillGrid(grid, random)) {
    throw new Error("Failed to generate a complete Sudoku solution")
  }

  return grid as number[][]
}

function fillGrid(grid: SudokuGrid, random: () => number): boolean {
  const next = findCellWithFewestCandidates(grid, random)
  if (!next) return true

  const [row, column, candidates] = next
  for (const value of shuffleArray(candidates, random)) {
    grid[row][column] = value
    if (fillGrid(grid, random)) {
      return true
    }
    grid[row][column] = null
  }

  return false
}

function findCellWithFewestCandidates(
  grid: SudokuGrid,
  randomTie?: () => number,
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
        (randomTie && candidates.length === best[2].length && randomTie() < 0.5)
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

function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}
