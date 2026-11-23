export type Technique = "hidden" | "pair" | "wing"
export type ExerciseKind = "guided" | "variation" | "distinction" | "independent"
export type Deduction = { evidence: number[]; target: number; digit: number }
export type ReasoningExercise = Deduction & {
  board: number[]
  technique: Technique
  kind: ExerciseKind
  counterexample?: number
}

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const squares = Array.from({ length: 81 }, (_, index) => index)
const row = (index: number) => Math.floor(index / 9)
const col = (index: number) => index % 9
const box = (index: number) => Math.floor(row(index) / 3) * 3 + Math.floor(col(index) / 3)
const houses = [row, col, box].flatMap((unit) => digits.map((digit) => squares.filter((index) => unit(index) === digit - 1)))
const sees = (a: number, b: number) => a !== b && (row(a) === row(b) || col(a) === col(b) || box(a) === box(b))
const peers = squares.map((index) => squares.filter((other) => sees(index, other)))

export function reasoningCandidates(board: number[]) {
  return board.map((value, index) => value ? [] : digits.filter((digit) => peers[index].every((peer) => board[peer] !== digit)))
}

export function hiddenSingleArea(marks: number[][], { target, digit }: Deduction) {
  const index = houses.findIndex((house) => house.includes(target) &&
    house.every((square) => square === target || !marks[square].includes(digit)))
  const name = ["row", "column", "box"][Math.floor(index / 9)]
  return { cells: houses[index] ?? [], label: `${name} ${index % 9 + 1}` }
}

export function hiddenSingleAlternatives(marks: number[][], target: number, digit: number) {
  return houses.filter((house) => house.includes(target)).flatMap((house) =>
    house.filter((square) => square !== target && marks[square].includes(digit)).slice(0, 1),
  )
}

export function shareReasoningArea(squares: number[]) {
  return houses.some((house) => squares.every((square) => house.includes(square)))
}

export { sees as seesReasoningSquare }

export type CourseTechnique = Technique | "single" | "locked" | "triple" | "hidden-set" | "x-wing"

function combinations<T>(items: T[], size: number, start = 0): T[][] {
  if (size === 0) return [[]]
  return items.slice(start).flatMap((item, index) =>
    combinations(items, size - 1, start + index + 1).map((rest) => [item, ...rest]),
  )
}

export function findCourseDeductions(marks: number[][], technique: CourseTechnique): Deduction[] {
  if (technique === "hidden" || technique === "pair" || technique === "wing") return findDeductions(marks, technique)
  if (technique === "single") return squares.filter((cell) => marks[cell].length === 1)
    .map((target) => ({ target, digit: marks[target][0], evidence: [] }))

  const results: Deduction[] = []
  const places = (house: number[], digit: number) => house.filter((cell) => marks[cell].includes(digit))
  if (technique === "locked" || technique === "x-wing") {
    for (const digit of digits) {
      if (technique === "locked") {
        for (const house of houses) {
          const evidence = places(house, digit)
          if (evidence.length < 2) continue
          for (const cross of houses) {
            if (cross === house || !evidence.every((cell) => cross.includes(cell))) continue
            for (const target of places(cross, digit).filter((cell) => !house.includes(cell))) {
              results.push({ evidence, target, digit })
            }
          }
        }
      } else {
        for (const [offset, slot] of [[0, col], [9, row]] as const) {
          const lines = houses.slice(offset, offset + 9).map((house) => places(house, digit))
            .filter((line) => line.length === 2)
          for (const [a, b] of combinations(lines, 2)) {
            const slots = a.map(slot)
            if (!b.every((cell) => slots.includes(slot(cell)))) continue
            const evidence = [...a, ...b]
            for (const target of squares.filter((cell) => slots.includes(slot(cell)) && !evidence.includes(cell) && marks[cell].includes(digit))) {
              results.push({ evidence, target, digit })
            }
          }
        }
      }
    }
    return results
  }

  for (const house of houses) {
    if (technique === "triple") {
      const cells = house.filter((cell) => marks[cell].length >= 2 && marks[cell].length <= 3)
      for (const evidence of combinations(cells, 3)) {
        const reserved = new Set(evidence.flatMap((cell) => marks[cell]))
        if (reserved.size !== 3) continue
        for (const target of house.filter((cell) => !evidence.includes(cell))) {
          for (const digit of marks[target].filter((value) => reserved.has(value))) results.push({ evidence, target, digit })
        }
      }
    } else {
      for (const size of [2, 3]) {
        const restricted = digits.filter((digit) => places(house, digit).length >= 2 && places(house, digit).length <= size)
        for (const reserved of combinations(restricted, size)) {
          const evidence = house.filter((cell) => reserved.some((digit) => marks[cell].includes(digit)))
          if (evidence.length !== size) continue
          for (const target of evidence) {
            for (const digit of marks[target].filter((value) => !reserved.includes(value))) results.push({ evidence, target, digit })
          }
        }
      }
    }
  }
  return results
}

export function findDeductions(marks: number[][], technique: Technique): Deduction[] {
  const results: Deduction[] = []
  if (technique === "hidden") {
    for (const house of houses) {
      for (const digit of digits) {
        const places = house.filter((index) => marks[index].includes(digit))
        if (places.length === 1 && marks[places[0]].length > 1) {
          results.push({ evidence: [], target: places[0], digit })
        }
      }
    }
    return results
  }

  const bivalue = squares.filter((index) => marks[index].length === 2)
  if (technique === "pair") {
    for (const house of houses) {
      for (const a of house.filter((index) => marks[index].length === 2)) {
        const pair = house.filter((index) => marks[index].join() === marks[a].join())
        if (pair.length !== 2 || pair[0] !== a) continue
        for (const target of house.filter((index) => !pair.includes(index))) {
          for (const digit of marks[a].filter((value) => marks[target].includes(value))) {
            results.push({ evidence: pair, target, digit })
          }
        }
      }
    }
    return results
  }

  for (const pivot of bivalue) {
    const [x, y] = marks[pivot]
    const wings = bivalue.filter((index) => sees(pivot, index))
    for (const first of wings.filter((index) => marks[index].includes(x) && !marks[index].includes(y))) {
      const z = marks[first].find((digit) => digit !== x)!
      for (const second of wings.filter((index) => marks[index].includes(y) && marks[index].includes(z))) {
        for (const target of peers[first].filter((index) => index !== pivot && sees(second, index) && marks[index].includes(z))) {
          results.push({ evidence: [pivot, first, second], target, digit: z })
        }
      }
    }
  }
  return results
}
