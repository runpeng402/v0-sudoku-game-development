const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

function load(name) {
  const filename = path.join(__dirname, "../lib", name + ".ts")
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })
  const exports = {}
  new Function("exports", outputText)(exports)
  return exports
}

const { countSudokuSolutions, generateSudokuPuzzle } = load("sudoku-generator")
const { reasoningCandidates, findCourseDeductions, hiddenSingleArea } = load("sudoku-reasoning")
const { trainingModules, freeExerciseCount, paidExerciseCount } = load("sudoku-training-catalog")
const kinds = ["preview", "guided", "guided", "variation", "variation", "variation", "variation",
  "distinction", "distinction", "independent", "independent"]
const file = path.join(__dirname, "../lib/sudoku-training-course.json")
const placement = new Set(["single", "hidden"])
const rows = (board) => Array.from({ length: 9 }, (_, i) => board.slice(i * 9, i * 9 + 9))
const solverRows = (board) => rows(board).map((row) => row.map((digit) => digit || null))
const label = (cell) => `r${Math.floor(cell / 9) + 1}c${cell % 9 + 1}`
const units = ["row", "column", "box"].flatMap((name, type) => Array.from({ length: 9 }, (_, i) => ({
  name: `${name} ${i + 1}`,
  cells: Array.from({ length: 81 }, (_, cell) => cell).filter((cell) => {
    const row = Math.floor(cell / 9)
    const column = cell % 9
    return [row, column, Math.floor(row / 3) * 3 + Math.floor(column / 3)][type] === i
  }),
})))
const normalize = (board) => {
  const digits = new Map()
  return board.map((digit) => {
    if (!digit) return 0
    if (!digits.has(digit)) digits.set(digit, digits.size + 1)
    return digits.get(digit)
  }).join("")
}

function description(technique, marks, move) {
  const { target, digit, evidence } = move
  const cells = evidence.map(label).join(", ")
  const candidates = marks[target].join(", ")
  switch (technique) {
    case "single":
      return ["Check which digits the row, column and box already contain.",
        `${label(target)} has only one legal candidate: ${digit}.`]
    case "hidden": {
      const area = hiddenSingleArea(marks, move).label
      return [`Compare the possible positions of each digit in ${area}.`,
        `${label(target)} has candidates ${candidates}, but ${digit} has no other position in ${area}.`]
    }
    case "locked": {
      const first = units.find(({ cells }) => !cells.includes(target) &&
        cells.filter((cell) => marks[cell].includes(digit)).join() === evidence.join())
      const second = units.find(({ cells }) => cells.includes(target) && evidence.every((cell) => cells.includes(cell)))
      return ["Look for a digit whose possible positions in one unit all lie in a second unit.",
        `In ${first.name}, ${digit} can only go at ${cells}. Those cells also lie in ${second.name}, so remove ${digit} from ${label(target)} elsewhere in ${second.name}.`]
    }
    case "pair":
    case "triple": {
      const reserved = [...new Set(evidence.flatMap((cell) => marks[cell]))].sort().join(", ")
      return ["Look for cells in one unit that collectively have as many candidates as there are cells.",
        `${cells} share a unit and must use ${reserved} among themselves. Remove ${digit} from ${label(target)}, which is elsewhere in the same unit.`]
    }
    case "hidden-set": {
      const proof = units.filter(({ cells }) => evidence.every((cell) => cells.includes(cell)))
        .map(({ name, cells }) => ({
          name,
          digits: Array.from({ length: 9 }, (_, index) => index + 1).filter((value) => {
            const positions = cells.filter((cell) => marks[cell].includes(value))
            return positions.length >= 2 && positions.every((cell) => evidence.includes(cell)) && value !== digit
          }),
        })).find(({ digits }) => digits.length === evidence.length)
      return ["Count the positions available to each digit in the unit containing the marked cell.",
        `In ${proof.name}, ${proof.digits.join(", ")} can only go in ${cells}. These digits fill those cells, so remove the extra candidate ${digit} from ${label(target)}.`]
    }
    case "x-wing":
      return ["Look for the same two positions for a digit in two parallel units.",
        `${digit} has exactly two positions in each of two parallel units, forming the rectangle ${cells}. Those placements use both crossing units, so remove ${digit} from ${label(target)} outside the rectangle.`]
    case "wing": {
      const [pivot, first, second] = evidence
      return ["Find a two-candidate pivot that sees two wings sharing a common candidate.",
        `The pivot ${label(pivot)} has candidates ${marks[pivot].join(" and ")}. Either pivot choice forces ${digit} into one of the wings at ${label(first)} and ${label(second)}. ${label(target)} sees both wings, so it cannot contain ${digit}.`]
    }
    default:
      throw new Error("Unknown technique " + technique)
  }
}

function generate() {
  const used = new Set()
  return trainingModules.flatMap((module) => kinds.map((kind, index) => {
    const technique = module.techniques[index % module.techniques.length]
    const sequence = module.id === "compound" || module.id === "mixed"
    for (let attempt = 0; attempt < 2500; attempt++) {
      const { puzzle, solution } = generateSudokuPuzzle(module.id === "single" ? "medium" : "hard")
      const board = puzzle.flat().map((digit) => digit || 0)
      const key = normalize(board)
      if (used.has(key)) continue
      const marks = reasoningCandidates(board)
      const solved = solution.flat()
      const move = findCourseDeductions(marks, technique).find(({ target, digit }) =>
        (placement.has(technique) ? solved[target] === digit : solved[target] !== digit) &&
        (!sequence || marks[target].length === 2))
      if (!move) continue
      const [hint, explanation] = description(technique, marks, move)
      const choices = kind === "distinction" ? [move.digit,
        placement.has(technique)
          ? (marks[move.target].find((value) => value !== move.digit) ?? move.digit % 9 + 1)
          : solved[move.target]].sort() : undefined
      used.add(key)
      return {
        module: module.id, kind, technique,
        board: rows(board).map((row) => row.join("")),
        ...move, hint, explanation, choices,
        ...(sequence ? { followUp: marks[move.target].find((digit) => digit !== move.digit) } : {}),
      }
    }
    throw new Error(`Could not generate ${module.id}/${kind}/${technique}`)
  }))
}

if (process.argv.includes("--generate")) {
  fs.writeFileSync(file, "[\n" + generate().map((exercise) => "  " + JSON.stringify(exercise)).join(",\n") + "\n]\n")
}

const fixtures = JSON.parse(fs.readFileSync(file, "utf8"))
assert.equal(fixtures.length, freeExerciseCount + paidExerciseCount)
assert.equal(new Set(fixtures.map(({ board }) => normalize(board.join("").split("").map(Number)))).size, fixtures.length)
for (const module of trainingModules) {
  assert.deepEqual(fixtures.filter((exercise) => exercise.module === module.id).map(({ kind }) => kind), kinds)
}
for (const { board: strings, module: id, kind, technique, target, digit, evidence, followUp, hint, explanation, choices } of fixtures) {
  const board = strings.join("").split("").map(Number)
  const module = trainingModules.find(({ id: name }) => name === id)
  assert.ok(module.techniques.includes(technique))
  assert.equal(board[target], 0)
  assert.equal(countSudokuSolutions(solverRows(board), 2), 1)
  const marks = reasoningCandidates(board)
  assert.ok(findCourseDeductions(marks, technique).some((move) =>
    move.target === target && move.digit === digit && move.evidence.join() === evidence.join()))
  const test = [...board]
  test[target] = digit
  assert.equal(countSudokuSolutions(solverRows(test), 2), placement.has(technique) ? 1 : 0)
  if (id === "compound" || id === "mixed") {
    assert.deepEqual(marks[target].filter((candidate) => candidate !== digit), [followUp])
    test[target] = followUp
    assert.equal(countSudokuSolutions(solverRows(test), 2), 1)
  }
  assert.ok(kinds.includes(kind))
  assert.deepEqual([hint, explanation], description(technique, marks, { target, digit, evidence }))
  if (kind === "distinction") {
    assert.equal(choices.length, 2)
    assert.ok(choices.includes(digit))
    test[target] = choices.find((value) => value !== digit)
    assert.equal(countSudokuSolutions(solverRows(test), 2), placement.has(technique) ? 0 : 1)
  }
}
console.log(`Passed: ${fixtures.length} unique course boards, validated deductions and follow-up singles.`)
