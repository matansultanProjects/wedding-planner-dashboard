"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoadingScreen(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user) window.location.href = "/"
  }, [user])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn()
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "שגיאת התחברות",
        description: "אירעה שגיאה בעת ההתחברות. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showLoadingScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl font-bold text-primary-500"
          >
            💍 טוען...
          </motion.div>
          <p className="mt-2 text-gray-600">מתחיל את המסע המשותף שלנו...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-15 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="https://files.oaiusercontent.com/file-TJ47HdyzW2iHpAB4Dm1ndm?se=2025-02-18T15%3A40%3A08Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D25c5d00c-cfec-4a32-a8d4-be69c186c1f4.webp&sig=htL4qH%2BJs73mXjfCSZi5E/p1aKt86fde4H2zAWbASOw%3D" alt="לוגו" className="h-8" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignIn}
            className="animate-pulse"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />מתחבר...
              </div>
            ) : (
              "התחבר עם Google"
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <Card className="w-full max-w-4xl mx-auto shadow-2xl border-4 border-primary bg-white rounded-3xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-extrabold text-primary">💍 תכנן את החתונה שלך בקלות ובסטייל</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">📅</div>
                  <h3 className="text-xl font-semibold">סקירה כללית</h3>
                  <p className="text-center">עקוב אחרי כל שלב בתכנון החתונה שלך.</p>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">💌</div>
                  <h3 className="text-xl font-semibold">רשימת אורחים</h3>
                  <p className="text-center">נהל את רשימת האורחים שלך בקלות.</p>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">🍽️</div>
                  <h3 className="text-xl font-semibold">סידורי הושבה</h3>
                  <p className="text-center">תכנן את סידורי ההושבה בצורה נוחה.</p>
                </div>
                {/* Feature 4 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">💰</div>
                  <h3 className="text-xl font-semibold">תקציב</h3>
                  <p className="text-center">נהל את התקציב שלך בצורה חכמה.</p>
                </div>
                {/* Feature 5 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl">📝</div>
                  <h3 className="text-xl font-semibold">משימות</h3>
                  <p className="text-center">עקוב אחרי המשימות שלך בזמן אמת.</p>
                </div>
                {/* Feature 6 */}
                                {/* Feature 6 */}
                                <div className="flex flex-col items-center">
                  <div className="text-4xl">📈</div>
                  <h3 className="text-xl font-semibold">סטטיסטיקות</h3>
                  <p className="text-center">עקוב אחרי התקדמות התכנון שלך בעזרת נתונים.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-6">
        <div className="container text-center">
          <p className="text-primary text-sm ">
          Built with ❤️ for your special day
          © {new Date().getFullYear()} - תכנון החתונה שלך.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#terms" className="text-primary">תנאי שימוש</a>
            <a href="#privacy" className="text-primary">פרטיות</a>
            <a href="#contact" className="text-primary">צור קשר</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

