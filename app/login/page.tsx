  "use client"

  import { useState } from "react"
  import { useRouter } from "next/navigation"
  import { useAuth } from "@/components/auth-provider"
  import { useToast } from "@/components/ui/use-toast"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardFooter } from "@/components/ui/card"
  import { CalendarHeart, AlertCircle } from "lucide-react"
  import Image from "next/image"
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

  export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const router = useRouter()
    const { toast } = useToast()
    const { signIn } = useAuth()

    const handleSignIn = async () => {
      setIsLoading(true)
      setAuthError(null)
      try {
        await signIn()
        router.push("/onboarding")
      } catch (error: any) {
        console.error("Login error:", error)

        // Handle unauthorized domain error specifically
        if (error.code === "auth/unauthorized-domain") {
          setAuthError(
            "This domain is not authorized for authentication. In the v0 environment, you may need to use the demo mode.",
          )
        } else {
          setAuthError(error.message || "An error occurred during login")
        }

        toast({
          title: "שגיאת התחברות",
          description: "אירעה שגיאה בעת ההתחברות. אנא נסה שוב מאוחר יותר.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Demo mode function - bypass authentication for demonstration purposes
    const handleDemoLogin = () => {
      toast({
        title: "מצב הדגמה",
        description: "נכנסת למערכת במצב הדגמה",
      })
      router.push("/dashboard")
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-card overflow-hidden">
            <div className="bg-gradient-to-r from-primary/90 to-pink-500/90 text-white p-6 text-center">
              <CalendarHeart className="h-12 w-12 mx-auto mb-4 animate-pulse" />
              <h1 className="text-3xl font-bold">מתכנן החתונה שלך</h1>
              <p className="text-white/80 mt-2">התחבר כדי להתחיל לתכנן את היום המיוחד שלך</p>
            </div>
            <CardContent className="p-6 pt-8">
              <div className="space-y-4">
                {authError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>שגיאת התחברות</AlertTitle>
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Google"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  {isLoading ? "מתחבר..." : "התחבר עם Google"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">או</span>
                  </div>
                </div>

                <Button onClick={handleDemoLogin} variant="outline" className="w-full h-12">
                  כניסה במצב הדגמה
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 pt-0 gap-4">
              <p className="text-sm text-muted-foreground text-center">
                בלחיצה על "התחבר", אתה מסכים לתנאי השימוש ולמדיניות הפרטיות שלנו.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

