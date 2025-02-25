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
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("he")
  const [colorScheme, setColorScheme] = useState("default")
  const { user, signIn, signOut } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "he"
    const savedColorScheme = localStorage.getItem("colorScheme") || "default"
    setLanguage(savedLanguage)
    setColorScheme(savedColorScheme)
    document.documentElement.dir = savedLanguage === "he" ? "rtl" : "ltr"
    document.documentElement.setAttribute("data-color-scheme", savedColorScheme)
  }, [])

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr"
    toast({
      title: "שפה עודכנה",
      description: "הגדרות השפה עודכנו בהצלחה",
    })
  }

  const handleColorSchemeChange = (newColorScheme: string) => {
    setColorScheme(newColorScheme)
    localStorage.setItem("colorScheme", newColorScheme)
    document.documentElement.setAttribute("data-color-scheme", newColorScheme)
    toast({
      title: "ערכת נושא עודכנה",
      description: "ערכת הנושא עודכנה בהצלחה",
    })
  }

  const handleClearData = () => {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו בלתי הפיכה.")) {
      clearLocalStorage()
      toast({
        title: "נתונים נמחקו",
        description: "כל הנתונים נמחקו בהצלחה",
      })
    }
  }

  const handleAuth = async () => {
    try {
      if (user) {
        await signOut()
        toast({
          title: "התנתקת בהצלחה",
          description: "התנתקת מהחשבון שלך.",
        })
      } else {
        await signIn()
        toast({
          title: "התחברת בהצלחה",
          description: "ברוך הבא למתכנן החתונה שלך!",
        })
      }
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "שגיאת אימות",
        description: "אירעה שגיאה במהלך ההתחברות. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <User className="inline-block mr-2" />
            חשבון
          </CardTitle>
          <CardDescription>נהל את הגדרות החשבון שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAuth}>{user ? "התנתק" : "התחבר עם Google"}</Button>
          {user && <p className="mt-4">מחובר כ: {user.email}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Palette className="inline-block mr-2" />
            הגדרות תצוגה
          </CardTitle>
          <CardDescription>התאם את העדפות המערכת שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              מצב כהה
            </Label>
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={handleThemeChange} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language-select">שפה</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="בחר שפה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he">עברית</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="color-scheme-select">סכמת צבעים</Label>
            <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
              <SelectTrigger id="color-scheme-select">
                <SelectValue placeholder="בחר סכמת צבעים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">ברירת מחדל</SelectItem>
                <SelectItem value="warm">חם</SelectItem>
                <SelectItem value="cool">קריר</SelectItem>
                <SelectItem value="pastel">פסטל</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <DollarSign className="inline-block mr-2" />
            תכונות בתשלום
          </CardTitle>
          <CardDescription>נהל את התכונות בתשלום שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">תכונות בתשלום יהיו זמינות בקרוב!</p>
          <Button disabled>שדרג לפרימיום</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">מחיקת נתונים</CardTitle>
          <CardDescription>מחק את כל הנתונים שלך מהמערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearData}>
            מחק את כל הנתונים
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

