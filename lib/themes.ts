import type { Theme } from "@/components/theme-selector"

export const getThemeStyles = (theme: Theme) => {
  const baseStyles = {
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    card: "bg-white",
    primary: "bg-blue-600 hover:bg-blue-700",
    accent: "bg-blue-200",
  }

  switch (theme) {
    case "christmas":
      return {
        background: "bg-gradient-to-br from-red-50 to-green-50",
        card: "bg-white border-red-200",
        primary: "bg-red-600 hover:bg-red-700",
        accent: "bg-red-100",
        decoration: "🎄❄️🎅",
      }
    case "chineseNewYear":
      return {
        background: "bg-gradient-to-br from-red-50 to-yellow-50",
        card: "bg-white border-red-300",
        primary: "bg-red-600 hover:bg-red-700",
        accent: "bg-red-100",
        decoration: "🧧🐉🏮",
      }
    case "halloween":
      return {
        background: "bg-gradient-to-br from-orange-50 to-purple-50",
        card: "bg-white border-orange-200",
        primary: "bg-orange-600 hover:bg-orange-700",
        accent: "bg-orange-100",
        decoration: "🎃👻🦇",
      }
    case "spring":
      return {
        background: "bg-gradient-to-br from-pink-50 to-green-50",
        card: "bg-white border-pink-200",
        primary: "bg-pink-600 hover:bg-pink-700",
        accent: "bg-pink-100",
        decoration: "🌸🌺🦋",
      }
    default:
      return baseStyles
  }
}

export const getSeasonalTheme = (): Theme => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  // Christmas season (December 1-31)
  if (month === 12) return "christmas"

  // Chinese New Year (late January to mid February)
  if ((month === 1 && day > 20) || (month === 2 && day < 20)) return "chineseNewYear"

  // Halloween season (October)
  if (month === 10) return "halloween"

  // Spring season (March-May)
  if (month >= 3 && month <= 5) return "spring"

  return "default"
}
