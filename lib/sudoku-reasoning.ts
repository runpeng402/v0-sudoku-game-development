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
