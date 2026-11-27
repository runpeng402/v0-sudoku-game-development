export interface TechniqueGuide {
  slug: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
  practiceTopic: string
  metaTitle: string
  metaDescription: string
  summary: string
  definition: string
  steps: string[]
  why: string
  mistakes: string[]
  faqs: Array<{ question: string; answer: string }>
  example: { index: number; intro: string }
}

export const techniqueGuides: TechniqueGuide[] = [
  {
    slug: "naked-single",
    name: "Naked Single",
    level: "Beginner",
    practiceTopic: "single",
    metaTitle: "Naked Single in Sudoku: How to Find the Only Possible Number",
    metaDescription:
      "Learn the naked single, the most basic Sudoku technique. See a real example, step-by-step instructions and common mistakes, then practice it.",
    summary:
      "A naked single is a square where only one digit is still possible. It is the first technique every Sudoku player learns, and it solves a large part of every easy puzzle.",
    definition:
      "Look at one empty square. Cross out every digit that already appears in its row, its column and its 3x3 box. If exactly one digit from 1 to 9 is left, that digit must go in the square.",
    steps: [
      "Pick an empty square in a busy area of the grid, where the row, column and box already contain many numbers.",
      "List the digits already used in the square's row.",
      "Add the digits used in its column and in its 3x3 box.",
      "If eight different digits are used, the ninth one is the answer. Write it in.",
      "Placing a number removes options from its neighbours, so check the squares in the same row, column and box next.",
    ],
    why: "Every row, column and box must contain each digit once. A digit that already appears in any of the three can never be repeated in this square, so if only one digit survives all three checks there is no other option.",
    mistakes: [
      "Checking only the row and column and forgetting the 3x3 box.",
      "Stopping after finding one missing digit without confirming the other eight are really used.",
      "Scanning randomly. Squares in crowded rows and boxes produce singles much more often.",
    ],
    faqs: [
      {
        question: "What is the difference between a naked single and a hidden single?",
        answer:
          "A naked single looks at one square and finds that only one digit fits. A hidden single looks at one digit and finds that only one square in a row, column or box can take it, even if that square has other candidates.",
      },
      {
        question: "Can an easy Sudoku be solved with naked singles only?",
        answer:
          "Many easy puzzles can be solved with naked and hidden singles alone. Medium and hard puzzles usually need pairs or locked candidates as well.",
      },
    ],
    example: {
      index: 0,
      intro:
        "In the board below, the highlighted square at row 2, column 7 already sees eight different digits in its row, column and box. Only 7 is left.",
    },
  },
  {
    slug: "hidden-single",
    name: "Hidden Single",
    level: "Beginner",
    practiceTopic: "hidden",
    metaTitle: "Hidden Single in Sudoku: Find the One Place a Number Can Go",
    metaDescription:
      "A hidden single is a digit that fits in only one square of a row, column or box. Learn how to spot hidden singles with a real example and practice.",
    summary:
      "A hidden single is a digit that has only one possible place left in a row, column or box. The square may still have several candidates, which is why the move is \u201chidden\u201d.",
    definition:
      "Choose a digit that is missing from a row, column or box. Check every empty square in that unit. If the digit can legally go in only one of them, it must go there, whatever other candidates that square has.",
    steps: [
      "Pick a digit that already appears many times in the grid, for example a digit placed six or seven times.",
      "Choose a box (or row, or column) where that digit is still missing.",
      "For each empty square in the unit, check whether the digit already appears in the crossing row or column.",
      "If all squares but one are ruled out, place the digit in the remaining square.",
      "Repeat with the same digit in other boxes. One placement often unlocks the next.",
    ],
    why: "Each unit must contain every digit exactly once. If a digit is missing from a unit and only one square in that unit can hold it, no other arrangement is possible.",
    mistakes: [
      "Looking only at candidates in one square. Hidden singles are found by following one digit across a unit.",
      "Forgetting that the target square can have other candidates. It still must take the digit.",
      "Only scanning boxes. Rows and columns contain hidden singles too.",
    ],
    faqs: [
      {
        question: "Are hidden singles harder than naked singles?",
        answer:
          "They are not harder, just a different way of looking. Most players find hidden singles faster by scanning one digit at a time across the boxes, a method often called cross-hatching.",
      },
      {
        question: "Do I need pencil marks to find hidden singles?",
        answer:
          "No. You can find them by scanning. Pencil marks help on harder puzzles, where the digit is blocked by candidates rather than by placed numbers.",
      },
    ],
    example: {
      index: 11,
      intro:
        "The highlighted square at row 1, column 3 could be 4 or 6. But 4 cannot go anywhere else in row 1, so this square must be 4.",
    },
  },
  {
    slug: "locked-candidates",
    name: "Locked Candidates (Pointing and Claiming)",
    level: "Beginner",
    practiceTopic: "locked",
    metaTitle: "Locked Candidates in Sudoku: Pointing Pairs and Box-Line Reduction",
    metaDescription:
      "Learn locked candidates, also called pointing pairs and box-line reduction. Step-by-step guide with a real Sudoku example and practice exercises.",
    summary:
      "Locked candidates happen when every possible place for a digit in one unit also lies inside a second unit. The digit is then locked there and can be removed from the rest of the second unit.",
    definition:
      "There are two forms. Pointing: inside a box, all candidates for a digit sit in one row or column, so the digit can be removed from that line outside the box. Claiming (box-line reduction): inside a row or column, all candidates for a digit sit in one box, so the digit can be removed from the rest of that box.",
    steps: [
      "Pick a digit and look at one box, row or column where it is still missing.",
      "Mark every square in that unit where the digit is still a candidate.",
      "Check whether all those squares also share a second unit: the same row or column for a box, or the same box for a line.",
      "If they do, remove the digit from every other square of the second unit.",
      "Look for new singles in the squares you just changed.",
    ],
    why: "The digit must appear once in the first unit, and all its options there are inside the second unit. Whichever option turns out true, the second unit's copy of the digit is used up, so no other square of the second unit can hold it.",
    mistakes: [
      "Removing the digit from squares inside the overlap instead of outside it.",
      "Applying the rule when one candidate lies outside the shared line or box.",
      "Forgetting the claiming direction (line to box), which is just as common as pointing.",
    ],
    faqs: [
      {
        question: "What is a pointing pair in Sudoku?",
        answer:
          "A pointing pair is two candidates for the same digit in one box that also share a row or column. They \u201cpoint\u201d along that line, so the digit can be removed from the line outside the box. With three cells it is called a pointing triple.",
      },
      {
        question: "What is box-line reduction?",
        answer:
          "It is the reverse direction: in a row or column, all candidates for a digit fall in one box, so the digit can be removed from the other squares of that box.",
      },
    ],
    example: {
      index: 22,
      intro:
        "In column 8, digit 1 can only go at row 1 or row 3. Both squares are in box 3, so 1 can be removed from row 1, column 7, which is elsewhere in box 3.",
    },
  },
  {
    slug: "naked-pairs",
    name: "Naked Pairs",
    level: "Intermediate",
    practiceTopic: "naked-sets",
    metaTitle: "Naked Pairs in Sudoku: How to Use Twin Candidates to Eliminate",
    metaDescription:
      "A naked pair is two squares in one unit that share the same two candidates. Learn how naked pairs work, see a real example and practice the technique.",
    summary:
      "A naked pair is two squares in the same row, column or box that have exactly the same two candidates. Those two digits must go in those two squares, so they can be removed from the rest of the unit.",
    definition:
      "Find two squares in one unit whose candidate lists are both exactly the same pair, such as {2, 3}. One square will be 2 and the other 3. No other square in that unit can be 2 or 3.",
    steps: [
      "Fill in pencil marks (candidates) for the unit you are studying.",
      "Look for two squares that each have exactly two candidates, and the same two.",
      "Confirm both squares are in the same row, column or box.",
      "Remove those two digits from every other square in that unit.",
      "If the pair also shares a box, remove the digits from the rest of the box too.",
    ],
    why: "Two squares need two different digits, and only two digits are available to them. Both digits are used up by the pair, so they cannot appear anywhere else in the shared unit.",
    mistakes: [
      "Pairing squares that are in different units.",
      "Using squares with an extra third candidate. That is not a naked pair (but may be part of a naked triple).",
      "Removing the digits from the pair squares themselves.",
    ],
    faqs: [
      {
        question: "What is a naked triple?",
        answer:
          "Three squares in one unit whose candidates together contain only three digits, for example {5, 6}, {5, 6} and {6, 7}. Those three digits fill the three squares, so they can be removed from the rest of the unit. Not every square needs all three digits.",
      },
      {
        question: "How is a naked pair different from a hidden pair?",
        answer:
          "A naked pair is seen from the squares: two squares with only the same two candidates. A hidden pair is seen from the digits: two digits that can only go in the same two squares, even though those squares have other candidates.",
      },
    ],
    example: {
      index: 33,
      intro:
        "In row 5, the squares at columns 2 and 3 both have candidates 2 and 3 only. They use up 2 and 3, so 2 can be removed from row 5, column 4.",
    },
  },
  {
    slug: "hidden-pairs",
    name: "Hidden Pairs",
    level: "Intermediate",
    practiceTopic: "hidden-sets",
    metaTitle: "Hidden Pairs in Sudoku: Find Two Digits Locked in Two Squares",
    metaDescription:
      "A hidden pair is two digits that can only go in the same two squares of a unit. Learn to spot hidden pairs with a real example and clear steps.",
    summary:
      "A hidden pair is two digits that, within one row, column or box, can only go in the same two squares. Those squares must take those two digits, so every other candidate in them can be removed.",
    definition:
      "Within a unit, count where each missing digit can go. If two digits each have exactly the same two possible squares, those squares are reserved for them. Delete all other candidates from the two squares.",
    steps: [
      "Fill in candidates for a row, column or box.",
      "For each missing digit, note the squares where it can go.",
      "Find two digits that share exactly the same two possible squares.",
      "Remove every other candidate from those two squares, turning them into a naked pair.",
      "Use the new naked pair to clean up the rest of the unit.",
    ],
    why: "Both digits must appear in the unit, and they only fit in two squares. So those two squares are filled by these two digits, and any other candidate in them can never be correct.",
    mistakes: [
      "Using digits that have a third possible square in the unit.",
      "Removing the pair digits from other squares before confirming they are hidden pairs in that unit.",
      "Missing hidden pairs because candidate lists look crowded. Count positions per digit instead.",
    ],
    faqs: [
      {
        question: "Are hidden pairs common?",
        answer:
          "They appear in many medium and hard puzzles, but they are harder to see than naked pairs because the squares hide the pair among other candidates.",
      },
      {
        question: "Is there a hidden triple?",
        answer:
          "Yes. Three digits that can only go in the same three squares of a unit form a hidden triple, and all other candidates can be removed from those squares.",
      },
    ],
    example: {
      index: 44,
      intro:
        "In row 4, digits 2 and 9 can only go in columns 1 and 5. Those two squares are reserved for 2 and 9, so the extra candidates, including 1, can be removed from row 4, column 1.",
    },
  },
  {
    slug: "x-wing",
    name: "X-Wing",
    level: "Advanced",
    practiceTopic: "x-wing",
    metaTitle: "X-Wing Sudoku Technique Explained with a Real Example",
    metaDescription:
      "Learn the X-Wing Sudoku strategy step by step. See how a digit locked in a rectangle of four squares lets you eliminate candidates, then practice it.",
    summary:
      "An X-Wing uses one digit in two parallel rows (or columns). If the digit has exactly two possible squares in each, and they line up in the same two columns, the digit can be removed from the rest of those columns.",
    definition:
      "Find two rows where a digit has exactly two candidates, in the same two columns. The four squares form a rectangle. The digit must occupy two opposite corners, so it fills both columns, and it can be removed from every other square in those columns. The same works with columns and rows swapped.",
    steps: [
      "Choose a digit and fill in its candidates across the grid.",
      "Find rows where that digit has exactly two possible squares.",
      "Look for two such rows whose squares are in the same two columns.",
      "Remove the digit from all other squares in those two columns.",
      "Try the same search with columns, looking for matching rows.",
    ],
    why: "In the first row the digit is in one of the two columns; in the second row it must be in the other. Either way both columns get the digit inside the rectangle, so no other square in those columns can hold it.",
    mistakes: [
      "Using a row where the digit has three possible squares.",
      "Removing the digit from the rows instead of the columns (or the other way round).",
      "Mixing two different digits in one rectangle.",
    ],
    faqs: [
      {
        question: "Why is it called an X-Wing?",
        answer:
          "The two possible solutions sit on opposite corners of the rectangle, forming an X shape, like the wings of a starfighter.",
      },
      {
        question: "What is a Swordfish?",
        answer:
          "A Swordfish is a larger X-Wing that uses three rows and three columns instead of two. Jellyfish uses four.",
      },
    ],
    example: {
      index: 66,
      intro:
        "Digit 3 can only go in columns 6 and 9 in both row 1 and row 2. Those four squares form an X-Wing, so 3 can be removed from row 4, column 9, which is outside the rectangle.",
    },
  },
  {
    slug: "xy-wing",
    name: "XY-Wing (Y-Wing)",
    level: "Advanced",
    practiceTopic: "wing",
    metaTitle: "XY-Wing (Y-Wing) Sudoku Strategy: Step-by-Step Guide",
    metaDescription:
      "Learn the XY-Wing, also called Y-Wing: a pivot and two wings with two candidates each. Step-by-step guide with a real Sudoku example and practice.",
    summary:
      "An XY-Wing uses three squares with two candidates each: a pivot {X, Y} and two wings {X, Z} and {Y, Z}. Whatever the pivot is, one wing becomes Z, so any square that sees both wings cannot be Z.",
    definition:
      "Find a pivot with candidates X and Y. Find a wing it can see with X and Z, and another wing it can see with Y and Z. If the pivot is X, the first wing is Z; if the pivot is Y, the second wing is Z. Every square that sees both wings loses Z.",
    steps: [
      "Look for squares with exactly two candidates.",
      "Pick one as the pivot, with candidates X and Y.",
      "Find a wing that shares a unit with the pivot and has X plus a new digit Z.",
      "Find a second wing that shares a unit with the pivot and has Y and the same Z.",
      "Remove Z from any square that shares a unit with both wings.",
    ],
    why: "The pivot must be X or Y. If it is X, the first wing cannot be X, so it is Z. If it is Y, the second wing is Z. One of the wings is always Z, so a square that sees both can never be Z.",
    mistakes: [
      "Choosing wings that do not share a unit with the pivot.",
      "Using wings whose shared digit Z is different.",
      "Removing Z from squares that see only one wing.",
    ],
    faqs: [
      {
        question: "Is an XY-Wing the same as a Y-Wing?",
        answer: "Yes. Both names describe the same pattern of a pivot and two wings, each with two candidates.",
      },
      {
        question: "What is an XYZ-Wing?",
        answer:
          "An XYZ-Wing is a variation where the pivot has three candidates X, Y and Z. Only squares that see the pivot and both wings can lose Z.",
      },
    ],
    example: {
      index: 77,
      intro:
        "The pivot at row 1, column 8 is 1 or 8. Its wings at row 5, column 8 {1, 5} and row 4, column 8 {5, 8} share the digit 5. One wing must be 5, so 5 can be removed from row 4, column 7, which sees both wings.",
    },
  },
]

export const techniqueBySlug = (slug: string) => techniqueGuides.find((guide) => guide.slug === slug)
