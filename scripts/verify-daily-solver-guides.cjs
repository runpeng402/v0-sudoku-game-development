const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

const modules = {}
function load(name) {
  if (modules[name]) return modules[name]
  const filename = path.join(__dirname, "../lib", name + ".ts")
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  const exports = {}
  const localRequire = (id) => (id.startsWith("@/lib/") ? load(id.slice(6)) : require(id))
  new Function("exports", "require", outputText)(exports, localRequire)
  return (modules[name] = exports)
}

const { solveSudoku, countSudokuSolutions, isValidCompletedGrid } = load("sudoku-generator")
const { dailyPuzzle, dailyDateKey } = load("daily-sudoku")
const { reasoningCandidates, findCourseDeductions } = load("sudoku-reasoning")
const { techniqueGuides } = load("technique-guides")
const course = require("../lib/sudoku-training-course.json")

const rows = (text) => Array.from({ length: 9 }, (_, r) => [...text.slice(r * 9, r * 9 + 9)].map((c) => Number(c) || null))

// Solver statuses
const classic = "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
const solved = solveSudoku(rows(classic))
assert.equal(solved.status, "solved")
assert.ok(isValidCompletedGrid(solved.solution))
solved.solution.flat().forEach((value, index) => classic[index] !== "0" && assert.equal(value, Number(classic[index])))
assert.equal(solveSudoku(rows("0".repeat(81))).status, "multiple")
assert.equal(solveSudoku(rows("11" + "0".repeat(79))).status, "invalid")
const unsolvable = "123456780" + "000000009" + "0".repeat(63)
assert.equal(solveSudoku(rows(unsolvable)).status, "unsolvable")

// Daily puzzles: deterministic per date and difficulty, unique solution, solution matches
assert.equal(dailyDateKey(new Date("2026-11-27T23:59:59Z")), "2026-11-27")
assert.equal(dailyDateKey(new Date("2026-11-28T00:00:00Z")), "2026-11-28")
const seen = new Set()
for (const date of ["2026-11-27", "2026-11-28", "2027-02-01"]) {
  for (const difficulty of ["easy", "medium", "hard"]) {
    const a = dailyPuzzle(date, difficulty)
    assert.deepEqual(dailyPuzzle(date, difficulty), a, "daily puzzle must be deterministic")
    assert.ok(!seen.has(a.puzzle), "daily puzzles must differ")
    seen.add(a.puzzle)
    assert.equal(countSudokuSolutions(rows(a.puzzle), 2), 1, `${date} ${difficulty} must be unique`)
    const result = solveSudoku(rows(a.puzzle))
    assert.equal(result.solution.flat().join(""), a.solution)
  }
}

// Technique guide examples are real, valid deductions of the advertised technique
const techniqueByTopic = { single: ["single"], hidden: ["hidden"], locked: ["locked"], "naked-sets": ["pair", "triple"],
  "hidden-sets": ["hidden-set"], "x-wing": ["x-wing"], wing: ["wing"] }
const slugs = new Set()
for (const guide of techniqueGuides) {
  assert.ok(!slugs.has(guide.slug))
  slugs.add(guide.slug)
  const entry = course[guide.example.index]
  assert.equal(entry.kind, "preview", `${guide.slug} must use a free preview exercise`)
  assert.ok(techniqueByTopic[guide.practiceTopic].includes(entry.technique), `${guide.slug} example technique`)
  const board = entry.board.join("").split("").map(Number)
  const found = findCourseDeductions(reasoningCandidates(board), entry.technique).some(
    (d) => d.target === entry.target && d.digit === entry.digit && d.evidence.join() === entry.evidence.join(),
  )
  assert.ok(found, `${guide.slug} example must be a valid deduction`)
  assert.ok(guide.metaTitle.length <= 70, `${guide.slug} title length`)
  assert.ok(guide.metaDescription.length <= 160, `${guide.slug} description length`)
}

console.log(`solver, ${seen.size} daily puzzles and ${techniqueGuides.length} technique guides verified`)
