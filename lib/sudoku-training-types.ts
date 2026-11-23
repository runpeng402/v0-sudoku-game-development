import type { trainingModules } from "./sudoku-training-catalog"

export interface TrainingExercise {
  board: string[]
  target: number
  answer: number
  prompt: string
  hint: string
  explanation: string
  highlight: number[]
  topic: Pick<(typeof trainingModules)[number], "id" | "name" | "level">
  kind: "preview" | "guided" | "variation" | "distinction" | "independent"
  action: "place" | "eliminate"
  followUp?: number
  choices?: number[]
}

export type TrainingAccess = "free" | "signed-out" | "locked" | "unlocked"

export interface TrainingResponse {
  access: TrainingAccess
  exercises: TrainingExercise[]
  paymentStatus?: "processing" | "failed" | "cancelled" | "succeeded"
}
