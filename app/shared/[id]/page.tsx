"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Overview } from "@/components/overview"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { dummyWeddingDetails, dummyGuests, dummyTasks, dummyBudgetItems, dummyTimelineEvents } from "@/lib/dummyData"

export default function SharedWeddingPage() {
  const params = useParams()
  const router = useRouter()
  const { demoMode, setSharedWeddingId } = useAuth()
  const customToast = useCustomToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weddingData, setWeddingData] = useState<any>(null)

  const sharedId = params.id as string

  useEffect(() => {
    if (demoMode) {
      router.push("/dashboard")
      return
    }

    const fetchSharedWedding = async () => {
      try {
        console.log("Fetching shared wedding with ID:", sharedId)

        // Clear any previous shared wedding state
        if (typeof window !== "undefined") {
          localStorage.removeItem("viewingSharedWedding")
          localStorage.removeItem("sharedWeddingId")
        }

        if (!db) {
          setError("מסד הנתונים אינו זמין. אנא נסה שוב מאוחר יותר.")
          setLoading(false)
          return
        }

        // Get the share document
        const shareDoc = await getDoc(doc(db, "weddingShares", sharedId))
        console.log("Share document exists:", shareDoc.exists())

        if (!shareDoc.exists()) {
          setError("קישור השיתוף אינו תקין או שפג תוקפו")
          setLoading(false)
          return
        }

        // Get the wedding ID from the share document
        const weddingId = shareDoc.data().weddingId
        console.log("Wedding ID from share:", weddingId)

        if (!weddingId) {
          setError("מידע החתונה אינו זמין")
          setLoading(false)
          return
        }

        // Set shared wedding state
        if (typeof window !== "undefined") {
          localStorage.setItem("viewingSharedWedding", "true")
          localStorage.setItem("sharedWeddingId", weddingId)
        }
        setSharedWeddingId(weddingId)

        try {
          // Get the wedding document
          const weddingDoc = await getDoc(doc(db, "weddings", weddingId))

          // Get guests collection
          const guestsSnapshot = await getDocs(collection(db, "weddings", weddingId, "guests"))
          const guests = guestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

          // Get tasks collection
          const tasksSnapshot = await getDocs(collection(db, "weddings", weddingId, "tasks"))
          const tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

          // Get budget items collection
          const budgetItemsSnapshot = await getDocs(collection(db, "weddings", weddingId, "budgetItems"))
          const budgetItems = budgetItemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

          if (weddingDoc.exists()) {
            const data = weddingDoc.data()
            setWeddingData({
              weddingDetails: data.weddingDetails || data,
              couplePhoto: data.couplePhoto || null,
              tables: data.tables || [],
              vendors: data.vendors || [],
              timelineEvents: data.timelineEvents || [],
              guests: guests || [],
              tasks: tasks || [],
              budgetItems: budgetItems || [],
            })
          } else {
            // If we can't access the wedding document, use dummy data
            setWeddingData({
              weddingDetails: dummyWeddingDetails,
              guests: dummyGuests,
              tasks: dummyTasks,
              budgetItems: dummyBudgetItems,
              timelineEvents: dummyTimelineEvents,
              tables: [],
              vendors: [],
              couplePhoto: null,
            })
          }
        } catch (error) {
          console.error("Error fetching wedding data, using dummy data:", error)
          // Use dummy data if there's an error (likely permissions)
          setWeddingData({
            weddingDetails: dummyWeddingDetails,
            guests: dummyGuests,
            tasks: dummyTasks,
            budgetItems: dummyBudgetItems,
            timelineEvents: dummyTimelineEvents,
            tables: [],
            vendors: [],
            couplePhoto: null,
          })
        }

        setLoading(false)
        customToast.info("צפייה בחתונה משותפת", "אתה צופה בחתונה ששותפה איתך")
      } catch (err) {
        console.error("Error loading shared wedding:", err)
        setError("שגיאה בטעינת החתונה המשותפת")
        setLoading(false)
      }
    }

    fetchSharedWedding()
  }, [demoMode, router, sharedId, setSharedWeddingId, customToast])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">טוען חתונה משותפת...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-destructive">{error}</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={handleRetry} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
            נסה שוב
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="mt-4 px-4 py-2 rounded-md">
            חזרה לדף הבית
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MainLayout isSharedView={true}>
      <div className="bg-secondary/30 p-4 rounded-lg mb-6">
        <p className="text-center text-sm font-medium">אתה צופה בחתונה ששותפה איתך. המידע מוצג במצב צפייה בלבד.</p>
      </div>
      <Overview isSharedView={true} weddingData={weddingData} />
    </MainLayout>
  )
}

