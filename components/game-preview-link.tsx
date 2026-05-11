"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export function GamePreviewLink() {
  const { t } = useTranslation()

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="flex flex-col items-center">
        {/* 预览图 */}
        <div className="relative mb-4 w-full max-w-xs">
          <div className="grid grid-cols-3 grid-rows-3 gap-0.5 border-2 border-gray-800 rounded-lg overflow-hidden">
            {/* 简化的9x9数独预览 */}
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="bg-gray-50 aspect-square flex items-center justify-center">
                  {i % 3 === 0 && <span className="text-gray-800 font-bold">{i + 1}</span>}
                </div>
              ))}
          </div>

          {/* 半透明覆盖层 */}
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="mr-2 h-5 w-5" />
              {t("game.startPlaying")}
            </Button>
          </div>
        </div>

        {/* 链接文本 */}
        <Link
          href="/play"
          className="w-full text-center text-blue-600 hover:text-blue-800 text-lg font-medium flex items-center justify-center group"
        >
          开始完整9x9数独游戏
          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  )
}
