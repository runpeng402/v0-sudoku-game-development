"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { UserCenter } from "@/components/user-center"
import { Home } from "lucide-react"
import { I18nProvider } from "@/components/i18n-provider"

function UserCenterContent() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t("home", "Home")}
            </Button>
          </Link>
        </div>

        {/* User Center Component */}
        <UserCenter onNavigate={(page) => (window.location.href = `/${page}`)} />
      </div>
    </div>
  )
}

export function UserCenterPageContent() {
  return (
    <I18nProvider>
      <UserCenterContent />
    </I18nProvider>
  )
}
