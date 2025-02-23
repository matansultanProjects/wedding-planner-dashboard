"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn()
      router.push("/dashboard")
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center gradient-text">ברוכים הבאים למתכנן החתונה</CardTitle>
            <CardDescription className="text-center">התחברו כדי להתחיל לתכנן את החתונה שלכם</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSignIn} className="w-full" disabled={isLoading} size="lg">
              {isLoading ? "מתחבר..." : "התחבר עם Google"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              בלחיצה על כפתור ההתחברות אתם מסכימים ל
              <br />
              <a href="#" className="underline">
                תנאי השימוש
              </a>{" "}
              ו
              <a href="#" className="underline">
                מדיניות הפרטיות
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

