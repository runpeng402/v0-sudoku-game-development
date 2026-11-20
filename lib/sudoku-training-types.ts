export interface TrainingExercise {
  board: string[]
  target: number
  answer: number
  prompt: string
  hint: string
  explanation: string
  highlight: number[]
  topic: { id: "single" | "hidden" | "locked"; name: string }
  check: boolean
}

export type TrainingAccess = "free" | "signed-out" | "locked" | "unlocked"

export interface TrainingResponse {
  access: TrainingAccess
  exercises: TrainingExercise[]
}
