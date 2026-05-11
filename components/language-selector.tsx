"use client"

import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useEffect } from "react"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

export function LanguageSelector() {
  const { i18n, t, ready } = useTranslation()

  const handleLanguageChange = async (languageCode: string) => {
    try {
      if (i18n && typeof i18n.changeLanguage === "function") {
        await i18n.changeLanguage(languageCode)

        // Update document direction and language
        document.documentElement.dir = "ltr" // All supported languages are LTR
        document.documentElement.lang = languageCode
      }
    } catch (error) {
      console.error("Failed to change language:", error)
    }
  }

  // Set initial direction
  useEffect(() => {
    if (ready && i18n) {
      document.documentElement.dir = "ltr"
      document.documentElement.lang = i18n.language
    }
  }, [ready, i18n])

  if (!ready || !i18n) {
    return <div className="w-[140px] h-10 bg-gray-100 animate-pulse rounded-md"></div>
  }

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[160px] bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="font-medium">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code} className="cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
