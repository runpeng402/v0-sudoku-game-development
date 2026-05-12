import type { Metadata } from "next"
import { UserCenterPageContent } from "@/components/user-center-page"

export const metadata: Metadata = {
  title: "Centro de usuario | SudokuStudio",
  description: "Administra tu cuenta de Sudoku, estadísticas, historial y progreso personal.",
  alternates: {
    canonical: "https://www.sudokustudio.app/es/user-center",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function EsUserCenterPage() {
  return <UserCenterPageContent locale="es" />
}
