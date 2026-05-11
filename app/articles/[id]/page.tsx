import type { Metadata } from "next"
import { ArticleDetailPageContent } from "@/components/article-detail-page"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleTitles: Record<string, string> = {
    "beginner-guide": "Complete Beginner's Guide to Sudoku",
    "advanced-techniques": "Mastering Advanced Sudoku Techniques",
    "sudoku-history": "The Fascinating History of Sudoku",
    "mental-benefits": "The Mental Health Benefits of Sudoku",
    "teaching-sudoku": "Teaching Sudoku to Children",
    "sudoku-variants-guide": "Exploring Sudoku Variants: Beyond the Classic 9x9",
    "speed-solving": "Speed Solving Techniques for Competitive Sudoku",
    "puzzle-creation": "The Art of Creating Sudoku Puzzles",
  }

  const title = articleTitles[params.id] || "Article"

  return {
    title: `${title} | Sudoku Studio`,
    description: `Read our comprehensive article: ${title}. Learn advanced Sudoku techniques and strategies.`,
    keywords: ["sudoku", "article", "guide", "tutorial", "strategy", "puzzle"],
    openGraph: {
      title: `${title} | Sudoku Studio`,
      description: `Read our comprehensive article: ${title}`,
      url: `https://www.sudokustudio.app/articles/${params.id}`,
      siteName: "Sudoku Studio",
      type: "article",
    },
  }
}

export default function ArticleDetailPage({ params }: Props) {
  return <ArticleDetailPageContent articleId={params.id} />
}
