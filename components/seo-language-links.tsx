import Link from "next/link"
import { localeNames, locales, localizedPath, type SeoLocale } from "@/lib/seo-locales"

interface SeoLanguageLinksProps {
  locale: SeoLocale
  path?: string
}

export function SeoLanguageLinks({ locale, path = "/" }: SeoLanguageLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" aria-label="Language versions">
      {locales.map((item) => (
        <Link
          key={item}
          href={localizedPath(item, path)}
          hrefLang={item}
          className={
            item === locale
              ? "rounded border border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-blue-700"
              : "rounded border border-gray-200 px-3 py-1 text-gray-600 hover:border-blue-200 hover:text-blue-700"
          }
        >
          {localeNames[item]}
        </Link>
      ))}
    </div>
  )
}
