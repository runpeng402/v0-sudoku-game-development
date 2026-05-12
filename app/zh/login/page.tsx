import LoginPage from "@/components/login-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "登录 | SudokuStudio",
  robots: {
    index: false,
    follow: true,
  },
}

export default function ZhLogin() {
  return <LoginPage locale="zh" />
}
