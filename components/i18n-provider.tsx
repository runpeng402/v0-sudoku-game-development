"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { I18nextProvider, useTranslation as useI18nextTranslation } from "react-i18next"
import { createI18nInstance, type AppLanguage } from "@/lib/i18n"

interface I18nContextType {
  isLoading: boolean
  error: string | null
}

const I18nContext = createContext<I18nContextType>({
  isLoading: false,
  error: null,
})

export const useI18nContext = () => useContext(I18nContext)

export const useTranslation = () => {
  return useI18nextTranslation()
}

interface I18nProviderProps {
  children: React.ReactNode
  initialLanguage?: AppLanguage
}

export function I18nProvider({ children, initialLanguage = "en" }: I18nProviderProps) {
  // One instance per provider keeps server renders for different locales from sharing language state.
  const [i18nInstance] = useState(() => createI18nInstance(initialLanguage))

  return (
    <I18nextProvider i18n={i18nInstance}>
      <I18nContext.Provider value={{ isLoading: false, error: null }}>{children}</I18nContext.Provider>
    </I18nextProvider>
  )
}
