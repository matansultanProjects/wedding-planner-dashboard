"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Overview } from "@/components/overview"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SharedWeddingPage() {
  const params = useParams()
  const router = useRouter()
  const { demoMode, checkSharedAccess, setSharedWeddingId } = useAuth()
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
        const weddingId = await checkSharedAccess(sharedId)
        if (weddingId) {
          setSharedWeddingId(weddingId)
          const weddingDoc = await getDoc(doc(db, "weddings", weddingId))
          if (weddingDoc.exists()) {
            setWeddingData(weddingDoc.data())
            setLoading(false)
            customToast.info("צפייה בחתונה משותפת", "אתה צופה בחתונה ששותפה איתך")
          } else {
            setError("החתונה לא נמצאה")
            setLoading(false)
          }
        } else {
          setError("קישור השיתוף אינו תקין")
          setLoading(false)
        }
      } catch (err) {
        console.error("Error loading shared wedding:", err)
        setError("שגיאה בטעינת החתונה המשותפת")
        setLoading(false)
      }
    }

    fetchSharedWedding()
  }, [demoMode, router, sharedId, checkSharedAccess, setSharedWeddingId, customToast])

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
        <button onClick={() => router.push("/")} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
          חזרה לדף הבית
        </button>
      </div>
    )
  }

  return (
    <MainLayout isSharedView={true}>
      <div className="bg-secondary/30 p-4 rounded-lg mb-6">
        <p className="text-center text-sm font-medium">
          אתה צופה בחתונה ששותפה איתך. כל שינוי שתבצע יישמר ויהיה גלוי למארגני האירוע.
        </p>
      </div>
      <Overview isSharedView={true} weddingData={weddingData} />
    </MainLayout>
  )
}

