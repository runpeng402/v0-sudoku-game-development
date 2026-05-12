import { siteUrl } from "@/lib/seo-locales"

export type ArticleSection = {
  heading: string
  body: string[]
  bullets?: string[]
}

export type ArticleLink = {
  href: string
  label: string
}

export type SudokuArticle = {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  datePublished: string
  dateModified: string
  sections: ArticleSection[]
  relatedLinks: ArticleLink[]
}

export const articles: SudokuArticle[] = [
  {
    slug: "beginner-sudoku-guide",
    title: "Beginner Sudoku Guide: How to Start Solving with Logic",
    description:
      "A practical beginner guide for learning Sudoku without guessing, with simple scanning habits and links to the full step-by-step guide.",
    category: "Beginner",
    readTime: "7 min read",
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    sections: [
      {
        heading: "Start with the three rules",
        body: [
          "A standard Sudoku puzzle is built around one idea: every row, every column, and every 3x3 box must contain the numbers 1 to 9 once. You do not add numbers or use arithmetic. The numbers are labels for a logic puzzle.",
          "Before placing a number, check those three areas. If the same number already appears in the row, column, or box, that move is not allowed.",
        ],
      },
      {
        heading: "Look for the most complete areas first",
        body: [
          "New players often scan the whole grid at random. A better habit is to start with a row, column, or box that already has many numbers. Fewer blanks means fewer candidates to test.",
          "This makes the first move less mysterious. You are not trying to solve the whole puzzle at once; you are looking for one cell where logic leaves only one possible answer.",
        ],
        bullets: [
          "Scan boxes with six or more given numbers.",
          "List the missing numbers from 1 to 9.",
          "Check each missing number against the crossing rows and columns.",
          "Place a number only when every other option is blocked.",
        ],
      },
      {
        heading: "Use notes before guessing",
        body: [
          "If two or three numbers could fit in a cell, write them as notes and keep moving. Guessing can make a puzzle look solved for several moves before a contradiction appears.",
          "Notes turn uncertainty into visible information. As nearby cells get solved, notes become easier to remove.",
        ],
      },
      {
        heading: "Practice with a guided page",
        body: [
          "This article is a short learning entry. The full guide includes a 9x9 example board and a step-by-step first move walkthrough.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/how-to-play-sudoku", label: "Read the full how-to-play guide" },
      { href: "/sudoku-rules", label: "Review the basic Sudoku rules" },
      { href: "/play", label: "Practice with an easy online puzzle" },
    ],
  },
  {
    slug: "printable-sudoku-with-answers",
    title: "Printable Sudoku with Answers: How to Practice Offline",
    description:
      "Learn when printable Sudoku puzzles are useful, which difficulty to print first, and how to use answer keys without spoiling practice.",
    category: "Printable",
    readTime: "6 min read",
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    sections: [
      {
        heading: "Why print Sudoku puzzles?",
        body: [
          "Printable Sudoku is useful when you want a screen-free puzzle, classroom activity, travel worksheet, or larger grid for comfortable handwriting.",
          "A printed puzzle also slows the solving process down in a good way. You can mark candidates carefully and review the puzzle away from notifications.",
        ],
      },
      {
        heading: "Choose the right difficulty",
        body: [
          "Start with easy printable puzzles if you are learning the rules. Move to medium puzzles when you can solve easy grids without guessing. Hard puzzles are better after you are comfortable with candidates and elimination.",
        ],
        bullets: [
          "Easy PDFs are best for beginners and kids.",
          "Medium PDFs are good for daily practice.",
          "Hard PDFs should include answers so mistakes can be checked.",
          "Large-print PDFs are better for seniors and classrooms.",
        ],
      },
      {
        heading: "Use answer keys the right way",
        body: [
          "Answer keys are most helpful after you finish a puzzle or when you are checking a suspected mistake. If you look at the answer too early, it turns practice into copying.",
          "A better approach is to compare only the row, column, or box where you think the mistake happened, then return to solving.",
        ],
      },
      {
        heading: "Download real PDF sheets",
        body: [
          "SudokuStudio now provides printable PDF downloads for easy, medium, hard, and large-print Sudoku. Each PDF includes puzzle pages and solution pages.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/printable-sudoku", label: "Download printable Sudoku PDFs" },
      { href: "/sudoku-rules", label: "Check the rules before printing" },
      { href: "/how-to-play-sudoku", label: "Learn how to solve your first puzzle" },
    ],
  },
  {
    slug: "basic-sudoku-strategies",
    title: "Basic Sudoku Strategies Before Advanced Techniques",
    description:
      "Learn the beginner-friendly Sudoku strategies that should come before X-Wing, Swordfish, and other advanced solving patterns.",
    category: "Strategy",
    readTime: "8 min read",
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    sections: [
      {
        heading: "Master scanning before advanced patterns",
        body: [
          "Advanced names like X-Wing and Swordfish are useful later, but most beginner and medium Sudoku puzzles can be solved with careful scanning and candidate elimination.",
          "If you skip the basics, advanced techniques feel like memorized tricks instead of logical extensions.",
        ],
      },
      {
        heading: "Naked singles",
        body: [
          "A naked single happens when a cell has only one possible number left. This is the safest move in Sudoku because the row, column, and box already rule out every other number.",
        ],
      },
      {
        heading: "Hidden singles",
        body: [
          "A hidden single happens when a number has only one possible position inside a row, column, or box. The cell may appear to have several candidates, but the unit itself gives the answer.",
        ],
      },
      {
        heading: "Candidate cleanup",
        body: [
          "After every confirmed placement, remove that number from notes in the same row, column, and box. Many puzzles become easier simply because the notes stay accurate.",
        ],
        bullets: [
          "Update notes after every solved cell.",
          "Scan one 3x3 box at a time.",
          "Avoid long chains until basic candidates are clean.",
          "Use hints as a learning tool, not as a replacement for checking.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/strategies", label: "Explore more Sudoku strategies" },
      { href: "/how-to-play-sudoku", label: "Return to the beginner guide" },
      { href: "/play", label: "Practice strategies online" },
    ],
  },
  {
    slug: "teaching-sudoku-to-kids",
    title: "Teaching Sudoku to Kids: Simple Ways to Build Logic Skills",
    description:
      "A parent and teacher friendly guide to introducing Sudoku with smaller grids, patient rules practice, and printable worksheets.",
    category: "Education",
    readTime: "6 min read",
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    sections: [
      {
        heading: "Start smaller than 9x9",
        body: [
          "Children can learn the idea of Sudoku before they are ready for a full 9x9 grid. A 4x4 puzzle with numbers 1 to 4 teaches the same rule pattern with less visual load.",
          "Once the child understands that rows, columns, and boxes cannot repeat, a 9x9 grid becomes much less intimidating.",
        ],
      },
      {
        heading: "Teach rules through questions",
        body: [
          "Instead of saying the answer, ask simple checking questions: Is this number already in the row? Is it already in the column? Is it already in the box?",
          "This keeps the focus on reasoning rather than speed.",
        ],
      },
      {
        heading: "Use printed puzzles for classrooms",
        body: [
          "Printable Sudoku sheets are useful in classrooms because every student can mark notes at their own pace. Easy and large-print sheets are usually the best starting point.",
        ],
      },
      {
        heading: "Keep the first wins small",
        body: [
          "A child does not need to finish a whole puzzle on the first try. Solving one row, one box, or one clear cell is enough to build confidence.",
        ],
        bullets: [
          "Use easy puzzles with many given numbers.",
          "Celebrate correct reasoning, not just finished grids.",
          "Keep sessions short.",
          "Move to harder puzzles only after the rules feel natural.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/printable-sudoku", label: "Print easy Sudoku worksheets" },
      { href: "/sudoku-rules", label: "Use the rule diagram" },
      { href: "/how-to-play-sudoku", label: "Show a step-by-step example" },
    ],
  },
]

export const articleRedirects: Record<string, string> = {
  "beginner-guide": "/articles/beginner-sudoku-guide",
  "printable-puzzles": "/articles/printable-sudoku-with-answers",
  "advanced-techniques": "/articles/basic-sudoku-strategies",
  "teaching-sudoku": "/articles/teaching-sudoku-to-kids",
  "sudoku-variants-guide": "/variants",
  "sudoku-history": "/articles",
  "mental-benefits": "/articles",
  "speed-solving": "/articles",
  "puzzle-creation": "/articles",
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}

export function articleUrl(slug: string) {
  return `${siteUrl}/articles/${slug}`
}
