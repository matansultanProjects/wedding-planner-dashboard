"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ברוכים הבאים למתכנן החתונה</CardTitle>
          <CardDescription>התחבר כדי להתחיל לתכנן את החתונה שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full" disabled={isLoading}>
            {isLoading ? "מתחבר..." : "התחבר עם Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

