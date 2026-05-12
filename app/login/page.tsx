import LoginPage from "@/components/login-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | SudokuStudio",
  robots: {
    index: false,
    follow: true,
  },
}

export default function Login() {
  return <LoginPage locale="en" />
}
