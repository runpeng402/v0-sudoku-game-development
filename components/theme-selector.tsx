"use client"

import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette } from "lucide-react"

export type Theme = "default" | "christmas" | "chineseNewYear" | "halloween" | "spring"

interface ThemeSelectorProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

const themes: { id: Theme; emoji: string }[] = [
  { id: "default", emoji: "🎯" },
  { id: "christmas", emoji: "🎄" },
  { id: "chineseNewYear", emoji: "🧧" },
  { id: "halloween", emoji: "🎃" },
  { id: "spring", emoji: "🌸" },
]

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const { t, ready } = useTranslation()

  if (!ready) {
    return <div className="w-[140px] h-10 bg-gray-100 animate-pulse rounded-md"></div>
  }

  return (
    <Select value={currentTheme} onValueChange={onThemeChange}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">{t("ui.theme")}</span>
        </div>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem key={theme.id} value={theme.id}>
            <div className="flex items-center gap-2">
              <span>{theme.emoji}</span>
              <span>{t(`themes.${theme.id}`)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
