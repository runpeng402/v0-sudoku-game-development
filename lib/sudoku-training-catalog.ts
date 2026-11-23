export const trainingModules = [
  { id: "single", name: "Naked singles", level: "Beginner", techniques: ["single"] },
  { id: "hidden", name: "Hidden singles", level: "Beginner", techniques: ["hidden"] },
  { id: "locked", name: "Locked candidates", level: "Beginner", techniques: ["locked"] },
  { id: "naked-sets", name: "Naked pairs and triples", level: "Intermediate", techniques: ["pair", "triple"] },
  { id: "hidden-sets", name: "Hidden pairs and triples", level: "Intermediate", techniques: ["hidden-set"] },
  { id: "compound", name: "Compound deductions", level: "Intermediate", techniques: ["locked", "pair", "triple"] },
  { id: "x-wing", name: "X-Wing", level: "Advanced", techniques: ["x-wing"] },
  { id: "wing", name: "XY-Wing", level: "Advanced", techniques: ["wing"] },
  { id: "mixed", name: "Mixed deductions", level: "Advanced", techniques: ["x-wing", "wing"] },
] as const

export const freeExerciseCount = trainingModules.length
export const paidExerciseCount = trainingModules.length * 10
