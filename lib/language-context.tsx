"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: "en" | "ar"
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  toggleLanguage: () => {},
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    const lang = savedLanguage === "ar" ? "ar" : "en"
    setLanguage(lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [])
  

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)

    // Set RTL or LTR direction based on language
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = newLanguage
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)

