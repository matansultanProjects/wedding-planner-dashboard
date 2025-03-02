"use client"

import { useState, useEffect } from "react"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const [language, setLanguage] = useState("he") // Set Hebrew as default

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "he"
    setLanguage(savedLanguage)
    document.documentElement.lang = savedLanguage
    document.documentElement.dir = savedLanguage === "he" ? "rtl" : "ltr"
  }, [])

  const changeLanguage = (newLanguage: "he" | "en") => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.lang = newLanguage
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr"
    window.location.reload() // Reload the page to apply changes everywhere
  }

  const t = (key: string, variables?: Record<string, string>) => {
    let text = translations[language as "he" | "en"][key] || key

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{{${key}}}`, "g"), value)
      })
    }

    return text
  }

  return { t, language, changeLanguage }
}

