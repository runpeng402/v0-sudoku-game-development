import type { Metadata } from "next"
import { defaultOgImage } from "@/lib/seo-locales"
import { VariantsPageContent } from "@/components/variants-page"

const title = "Sudoku Variants Explained: Killer, Jigsaw, Diagonal, Samurai Rules"
const description =
  "Learn the rules of Killer, Jigsaw, Diagonal, Hyper, Samurai and 16×16 Sudoku, with tips on where to start each variant."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [defaultOgImage],
    title,
    description,
    url: "https://www.sudokustudio.app/variants",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/variants",
  },
}

export default function VariantsPage() {
  return <VariantsPageContent />
}
