"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Grid, HelpCircle, Home, Printer, Tag, UserCircle } from "lucide-react"
import { homeCopy, localizedPath, pageCopy, type SeoLocale } from "@/lib/seo-locales"
import { SeoLanguageLinks } from "@/components/seo-language-links"

const translatedPages = new Set(["/", pageCopy.howToPlay.path, pageCopy.rules.path, pageCopy.printable.path,
  "/strategies", "/play", "/login", "/user-center"])

export function SeoNavigation() {
  const pathname = usePathname()
  const prefix = pathname.match(/^\/(zh|es)(?=\/|$)/)?.[1]
  const locale: SeoLocale = prefix === "zh" || prefix === "es" ? prefix : "en"
  const path = prefix ? pathname.slice(prefix.length + 1) || "/" : pathname
  const copy = homeCopy[locale]
  const items = [
    { href: localizedPath(locale, "/"), label: locale === "en" ? "Home" : locale === "zh" ? "首页" : "Inicio", icon: Home },
    { href: localizedPath(locale, pageCopy.howToPlay.path), label: copy.learn, icon: BookOpen },
    { href: localizedPath(locale, pageCopy.rules.path), label: copy.rules, icon: HelpCircle },
    { href: localizedPath(locale, pageCopy.printable.path), label: copy.printable, icon: Printer },
    { href: localizedPath(locale, "/play"), label: locale === "zh" ? "游戏" : locale === "es" ? "Jugar" : "Play", icon: Grid },
    { href: "/pricing", label: locale === "zh" ? "定价" : locale === "es" ? "Precios" : "Pricing", icon: Tag },
  ]
  const accountLabel = locale === "zh" ? "账号" : locale === "es" ? "Cuenta" : "Account"

  return (
    <nav aria-label={locale === "zh" ? "主导航" : locale === "es" ? "Navegación principal" : "Main navigation"} className="border-b bg-white/95">
      <div className="mx-auto grid max-w-[1800px] gap-4 px-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-8 md:px-8 lg:gap-12 xl:px-12">
        <Link href={localizedPath(locale, "/")} className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white">S</span>
          <span className="text-lg font-bold text-gray-950">SudokuStudio</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-center lg:gap-x-7">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={item.href === pathname ? "page" : undefined} className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-700 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 aria-[current=page]:underline aria-[current=page]:underline-offset-4">
              <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <Link
            href={localizedPath(locale, "/user-center")}
            className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:border-blue-200 hover:text-blue-700"
          >
            <UserCircle className="h-4 w-4" />
            {accountLabel}
          </Link>
          <div className="hidden h-7 w-px bg-gray-200 md:block" />
          <SeoLanguageLinks locale={locale} path={translatedPages.has(path) ? path : "/"} />
        </div>
      </div>
    </nav>
  )
}
