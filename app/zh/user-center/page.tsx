import type { Metadata } from "next"
import { UserCenterPageContent } from "@/components/user-center-page"

export const metadata: Metadata = {
  title: "用户中心 | SudokuStudio",
  description: "管理你的数独账户、游戏统计、历史记录和个人进度。",
  alternates: {
    canonical: "https://www.sudokustudio.app/zh/user-center",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ZhUserCenterPage() {
  return <UserCenterPageContent locale="zh" />
}
