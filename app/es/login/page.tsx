import LoginPage from "@/components/login-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión | SudokuStudio",
  robots: {
    index: false,
    follow: true,
  },
}

export default function EsLogin() {
  return <LoginPage locale="es" />
}
