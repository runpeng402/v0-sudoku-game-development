import type { Metadata } from "next"
import { UserCenterPageContent } from "@/components/user-center-page"

export const metadata: Metadata = {
  title: "User Center - Profile & Statistics | SudokuStudio",
  description:
    "Manage your Sudoku profile, view statistics, track progress, and customize your gaming experience. Sign in to access premium features.",
  keywords: [
    "sudoku profile",
    "user account",
    "sudoku statistics",
    "game progress",
    "sudoku login",
    "user dashboard",
    "puzzle history",
    "achievements",
    "sudoku settings",
    "account management",
  ],
  openGraph: {
    title: "User Center - Profile & Statistics",
    description: "Manage your Sudoku profile and track your puzzle-solving progress.",
    url: "https://www.sudokustudio.app/user-center",
    images: ["/og-user-center.png"],
  },
  alternates: {
    canonical: "https://www.sudokustudio.app/user-center",
  },
}

export default function UserCenterPage() {
  return <UserCenterPageContent />
}
