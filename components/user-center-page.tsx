"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { UserCenter } from "@/components/user-center"
import { Home } from "lucide-react"
import { I18nProvider } from "@/components/i18n-provider"
import { localizedPath, type SeoLocale } from "@/lib/seo-locales"

function UserCenterContent({ locale }: { locale: SeoLocale }) {
  const { t } = useTranslation()
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: localizedPath(locale, "/"),
      play: localizedPath(locale, "/play"),
      strategies: localizedPath(locale, "/strategies"),
      "how-to-play": localizedPath(locale, "/how-to-play-sudoku"),
      "how-to-play-sudoku": localizedPath(locale, "/how-to-play-sudoku"),
    }

    window.location.href = routes[page] ?? `/${page}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href={localizedPath(locale, "/")}>
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t("home", "Home")}
            </Button>
          </Link>
        </div>

        {/* User Center Component */}
        <UserCenter onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export function UserCenterPageContent({ locale = "en" }: { locale?: SeoLocale }) {
  return (
    <I18nProvider initialLanguage={locale}>
      <UserCenterContent locale={locale} />
    </I18nProvider>
  )
}
