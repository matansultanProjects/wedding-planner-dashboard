"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { Overview } from "@/components/overview"
import { GuestList } from "@/components/guest-list"
import { Budget } from "@/components/budget"
import { Timeline } from "@/components/timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function SharedWeddingView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shareId = searchParams.get("id")
  const { checkSharedAccess, weddingData, sharedWeddingId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const customToast = useCustomToast()

  useEffect(() => {
    async function fetchSharedWedding() {
      if (!shareId) {
        setError("No share ID provided")
        setLoading(false)
        return
      }

      try {
        console.log("Fetching shared wedding with ID:", shareId)

        // First check if the share document exists
        const shareDoc = await getDoc(doc(db, "weddingShares", shareId))
        console.log("Share document exists:", shareDoc.exists())

        if (!shareDoc.exists()) {
          setError("Invalid share link")
          customToast.error("שגיאה", "קישור השיתוף אינו תקין")
          setLoading(false)
          return
        }

        const weddingId = shareDoc.data().weddingId
        console.log("Wedding ID from share:", weddingId)

        // Use the checkSharedAccess function from AuthProvider
        const result = await checkSharedAccess(shareId)

        if (!result) {
          setError("Unable to access shared wedding")
          customToast.error("שגיאה", "לא ניתן לגשת לחתונה המשותפת")
        } else {
          customToast.info("צפייה בחתונה משותפת", "אתה צופה בחתונה ששותפה איתך")
        }
      } catch (error) {
        console.error("Error fetching shared wedding:", error)
        setError("Error loading shared wedding")
        customToast.error("שגיאה", "אירעה שגיאה בטעינת החתונה המשותפת")
      } finally {
        setLoading(false)
      }
    }

    fetchSharedWedding()
  }, [shareId, checkSharedAccess, customToast])

  // If we have wedding data, show the shared view
  if (weddingData && !loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>צפייה בחתונה משותפת</CardTitle>
            <CardDescription>
              אתה צופה בחתונה של {weddingData.weddingDetails?.brideName} ו{weddingData.weddingDetails?.groomName}
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="guests">רשימת אורחים</TabsTrigger>
            <TabsTrigger value="budget">תקציב</TabsTrigger>
            <TabsTrigger value="timeline">ציר זמן</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview isSharedView={true} />
          </TabsContent>
          <TabsContent value="guests">
            <GuestList isSharedView={true} />
          </TabsContent>
          <TabsContent value="budget">
            <Budget isSharedView={true} />
          </TabsContent>
          <TabsContent value="timeline">
            <Timeline isSharedView={true} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Show loading or error state
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {loading ? "טוען חתונה משותפת..." : "שגיאה בטעינת החתונה המשותפת"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <p className="text-center text-muted-foreground">{error}</p>
              <Button onClick={() => router.push("/login")}>חזרה לדף הכניסה</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

