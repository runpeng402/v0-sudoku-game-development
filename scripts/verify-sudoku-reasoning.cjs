const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

function load(name) {
  const source = fs.readFileSync(path.join(__dirname, "../lib", name + ".ts"), "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  const exports = {}
  new Function("exports", outputText)(exports)
  return exports
}

const { countSudokuSolutions, generateSudokuPuzzle } = load("sudoku-generator")
const { reasoningCandidates, findDeductions } = load("sudoku-reasoning")
const file = path.join(__dirname, "../lib/sudoku-reasoning-samples.json")
const techniques = ["hidden", "pair", "wing"]
const kinds = ["guided", "variation", "distinction", "independent"]
const rows = (board) => Array.from({ length: 9 }, (_, index) => board.slice(index * 9, index * 9 + 9).map((digit) => digit || null))

if (process.argv.includes("--generate")) {
  const samples = techniques.flatMap((technique) => kinds.map((kind) => {
    for (let attempt = 0; attempt < 500; attempt++) {
      const { puzzle, solution } = generateSudokuPuzzle("hard")
      const board = puzzle.flat().map((digit) => digit || 0)
      const marks = reasoningCandidates(board)
      const deduction = findDeductions(marks, technique).find(({ target }) => technique === "hidden" || marks[target].length === 2)
      if (!deduction) continue
      const counterexample = solution.flat().findIndex((digit, index) => digit === deduction.digit && index !== deduction.target && marks[index].includes(digit))
      if (kind === "distinction" && counterexample < 0) continue
      return { technique, kind, board, ...deduction, ...(kind === "distinction" ? { counterexample } : {}) }
    }
    throw new Error(`Could not generate ${technique}/${kind}`)
  }))
  fs.writeFileSync(file, JSON.stringify(samples, null, 2).replace(/"board": \[([\s\S]*?)\]/g,
    (_, board) => '"board": [' + board.trim().replace(/\s+/g, " ") + "]") + "\n")
}

const samples = JSON.parse(fs.readFileSync(file, "utf8"))
assert.equal(samples.length, 12)
assert.equal(new Set(samples.map(({ board }) => board.join(""))).size, 12)
for (const technique of techniques) {
  assert.deepEqual(samples.filter((sample) => sample.technique === technique).map(({ kind }) => kind), kinds)
}
for (const { board, technique, kind, evidence, target, digit, counterexample } of samples) {
  const marks = reasoningCandidates(board)
  const deductions = findDeductions(marks, technique)
  assert.equal(countSudokuSolutions(rows(board), 2), 1)
  assert.ok(deductions.some((move) => move.target === target && move.digit === digit && move.evidence.join() === evidence.join()))
  for (const move of deductions) {
    const test = [...board]
    test[move.target] = move.digit
    assert.equal(countSudokuSolutions(rows(test), 2), technique === "hidden" ? 1 : 0)
  }
  if (technique !== "hidden") {
    const next = marks[target].find((value) => value !== digit)
    assert.equal(marks[target].length, 2)
    const test = [...board]
    test[target] = next
    assert.equal(countSudokuSolutions(rows(test), 2), 1)
  }
  if (kind === "distinction") {
    assert.ok(marks[counterexample].includes(digit))
    const test = [...board]
    test[counterexample] = digit
    assert.equal(countSudokuSolutions(rows(test), 2), 1)
    assert.ok(!deductions.some((move) => move.target === counterexample && move.digit === digit))
  }
}
console.log("Passed: 12 unique sample boards, supported deductions, follow-up singles and counterexamples.")
