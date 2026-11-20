const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

// Load the production generator without requiring a separate TypeScript test runner.
const source = fs.readFileSync(path.join(__dirname, "../lib/sudoku-generator.ts"), "utf8")
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
})
const generator = {}
new Function("exports", outputText)(generator)

const { countSudokuSolutions, generateSudokuPuzzle, isValidCompletedGrid } = generator
const empty = Array.from({ length: 9 }, () => Array(9).fill(null))
assert.equal(countSudokuSolutions(empty, 2), 2, "an unconstrained grid is not unique")
assert.equal(countSudokuSolutions([[null]], 2), 0, "a short grid is invalid")

const invalidPartial = empty.map((row) => [...row])
invalidPartial[0][0] = invalidPartial[0][1] = 1
assert.equal(countSudokuSolutions(invalidPartial, 2), 0, "duplicate clues are invalid")
invalidPartial[0][1] = 10
assert.equal(countSudokuSolutions(invalidPartial, 2), 0, "out-of-range clues are invalid")

const invalidFull = Array.from({ length: 9 }, () => Array(9).fill(1))
assert.equal(countSudokuSolutions(invalidFull, 2), 0, "a filled invalid grid is not a solution")

for (const difficulty of ["easy", "medium", "hard"]) {
  for (let sample = 0; sample < 100; sample++) {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty)
    assert.ok(isValidCompletedGrid(solution), `${difficulty}: invalid completed grid`)
    assert.ok(puzzle.flat().includes(null), `${difficulty}: no playable squares`)
    assert.ok(puzzle.every((row, r) => row.every((value, c) => value === null || value === solution[r][c])),
      `${difficulty}: given clue conflicts with its solution`)
    assert.equal(countSudokuSolutions(puzzle, 2), 1, `${difficulty}: expected a unique solution`)
  }
}

const training = require("../lib/sudoku-training-exercises.json")
for (const [technique, exercises] of Object.entries(training)) {
  assert.equal(exercises.length, 4)
  for (const exercise of exercises) {
    const puzzle = exercise.board.map((row) => [...row].map((value) => Number(value) || null))
    assert.equal(countSudokuSolutions(puzzle, 2), 1, `${technique}: expected a unique solution`)
    const row = Math.floor(exercise.target / 9)
    const col = exercise.target % 9
    assert.equal(puzzle[row][col], null, `${technique}: expected an empty target`)
    puzzle[row][col] = exercise.answer
    assert.equal(countSudokuSolutions(puzzle, 2), technique === "locked" ? 0 : 1,
      `${technique}: stored answer does not match the board`)
  }
}

console.log("Passed: 300 generated boards, 12 training boards, and invalid and non-unique input regressions.")
