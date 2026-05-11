"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, BookOpen, HelpCircle, Trophy, FileText, Grid, User } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { authService, type UserProfile } from "@/services/auth-service"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function SiteNavigation() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const navigationItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/how-to-play", label: t("nav.howToPlay"), icon: BookOpen },
    { href: "/strategies", label: t("nav.strategies"), icon: HelpCircle },
    { href: "/variants", label: t("nav.variants"), icon: Grid },
    { href: "/articles", label: t("nav.articles"), icon: FileText },
    { href: "/leaderboard", label: t("nav.leaderboard"), icon: Trophy },
  ]

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return "?"

    const nameParts = currentUser.username.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return currentUser.username.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">SudokuStudio</span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">SS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap text-sm font-medium ${
                  pathname === item.href ? "text-blue-600 font-semibold" : ""
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Language Selector for Desktop */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* User Center Button */}
            <div className="flex items-center">
              {currentUser ? (
                <Link href="/user-center" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Avatar className="h-8 w-8 bg-blue-500 text-white">
                    <AvatarFallback className="text-xs font-semibold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden xl:block text-sm text-gray-600">{t("common.profile")}</span>
                </Link>
              ) : (
                <Link href="/user-center">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 text-sm">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{t("nav.login")}</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Language Selector in Mobile Menu */}
                    <div className="border-b border-gray-200 pb-4">
                      <LanguageSelector />
                    </div>

                    {/* User Center in Mobile Menu */}
                    {!currentUser && (
                      <Link
                        href="/user-center"
                        className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 w-full text-left"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span className="text-lg">{t("nav.login")}</span>
                      </Link>
                    )}

                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 w-full text-left ${
                          pathname === item.href ? "text-blue-600 bg-blue-50" : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
