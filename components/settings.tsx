"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { clearLocalStorage } from "@/lib/storage"
import { Moon, Palette, User, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "he"
    }
    return "he"
  })
  const [colorScheme, setColorScheme] = useState("default")
  const { user, signIn, signOut } = useAuth()
  const customToast = useCustomToast()
  const router = useRouter()
  const { t, changeLanguage } = useTranslation()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "he"
    const savedColorScheme = localStorage.getItem("colorScheme") || "default"
    setLanguage(savedLanguage)
    setColorScheme(savedColorScheme)
    document.documentElement.dir = savedLanguage === "he" ? "rtl" : "ltr"
    document.documentElement.setAttribute("data-color-scheme", savedColorScheme)
  }, [])

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const handleLanguageChange = (newLanguage: string) => {
    if (typeof newLanguage !== "string" || newLanguage.length === 0) {
      console.error("Invalid language value:", newLanguage)
      return
    }
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr"
    document.documentElement.lang = newLanguage

    // Show toast before refresh
    customToast.success(
      newLanguage === "he" ? "השפה עודכנה" : "Language Updated",
      newLanguage === "he" ? "השפה עודכנה בהצלחה" : "Language has been updated successfully",
    )

    // Use router.refresh() instead of window.location.reload()
    setTimeout(() => {
      router.refresh()
    }, 1500)
  }

  const handleColorSchemeChange = (newColorScheme: string) => {
    setColorScheme(newColorScheme)
    localStorage.setItem("colorScheme", newColorScheme)
    document.documentElement.setAttribute("data-color-scheme", newColorScheme)
    setTheme(newColorScheme)
    customToast.success(t("themeUpdated"), t("themeUpdatedDescription"))
  }

  const handleClearData = () => {
    if (confirm(t("confirmClearData"))) {
      clearLocalStorage()
      customToast.success(t("dataCleared"), t("dataClearedDescription"))
    }
  }

  const handleAuth = async () => {
    try {
      if (user) {
        await signOut()
        customToast.success(t("signOutSuccess"), t("signOutSuccessDescription"))
      } else {
        await signIn()
        customToast.success(t("signInSuccess"), t("signInSuccessDescription"))
      }
    } catch (error) {
      console.error("Authentication error:", error)
      customToast.error(t("authError"), t("authErrorDescription"))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <User className="inline-block mr-2" />
            {t("account")}
          </CardTitle>
          <CardDescription>{t("manageAccountSettings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAuth}>{user ? t("signOut") : t("signInWithGoogle")}</Button>
          {user && <p className="mt-4">{t("loggedInAs", { email: user.email })}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Palette className="inline-block mr-2" />
            {t("displaySettings")}
          </CardTitle>
          <CardDescription>{t("customizeSystemPreferences")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              {t("darkMode")}
            </Label>
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={handleThemeChange} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language-select">{t("language")}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder={t("chooseLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he">{t("hebrew")}</SelectItem>
                <SelectItem value="en">{t("english")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="color-scheme-select">{t("colorScheme")}</Label>
            <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
              <SelectTrigger id="color-scheme-select">
                <SelectValue placeholder={t("chooseColorScheme")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("light")}</SelectItem>
                <SelectItem value="dark">{t("dark")}</SelectItem>
                <SelectItem value="system">{t("system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <DollarSign className="inline-block mr-2" />
            {t("paidFeatures")}
          </CardTitle>
          <CardDescription>{t("managePaidFeatures")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t("paidFeaturesComingSoon")}</p>
          <Button disabled>{t("upgradeToPremium")}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{t("deleteData")}</CardTitle>
          <CardDescription>{t("deleteAllDataDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearData}>
            {t("deleteAllData")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

