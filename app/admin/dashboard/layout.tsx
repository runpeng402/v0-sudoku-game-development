import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Admin Dashboard | SudokuStudio",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
