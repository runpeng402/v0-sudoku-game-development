"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { I18nextProvider, useTranslation as useI18nextTranslation } from "react-i18next"
import { initI18n } from "@/lib/i18n"
import type { i18n as I18nInstance } from "i18next"

interface I18nContextType {
  isLoading: boolean
  error: string | null
}

const I18nContext = createContext<I18nContextType>({
  isLoading: true,
  error: null,
})

export const useI18nContext = () => useContext(I18nContext)

// Export the useTranslation hook
export const useTranslation = () => {
  return useI18nextTranslation()
}

interface I18nProviderProps {
  children: React.ReactNode
  initialLanguage?: "en" | "zh" | "es"
}

export function I18nProvider({ children, initialLanguage = "en" }: I18nProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<I18nInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupI18n = async () => {
      try {
        console.log("Initializing i18n...")
        const i18n = await initI18n()

        // 确保默认语言是英文
        if (i18n.language !== initialLanguage) {
          await i18n.changeLanguage(initialLanguage)
        }

        console.log("i18n initialized successfully, language:", i18n.language)
        setI18nInstance(i18n)
        setError(null)
      } catch (err) {
        console.error("Failed to initialize i18n:", err)
        setError("Failed to load translations")
      } finally {
        setIsLoading(false)
      }
    }

    setupI18n()
  }, [initialLanguage])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !i18nInstance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-red-600">
          <p>Error loading translations: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      <I18nContext.Provider value={{ isLoading, error }}>{children}</I18nContext.Provider>
    </I18nextProvider>
  )
}
