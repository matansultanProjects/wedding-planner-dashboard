"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Overview } from "@/components/overview"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"

export default function SharedWeddingPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { demoMode } = useAuth()
  const customToast = useCustomToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sharedId = params.id as string

  useEffect(() => {
    if (demoMode) {
      // Redirect to dashboard if in demo mode
      router.push("/dashboard")
      return
    }

    // In a real app, this would be an API call to fetch the shared wedding data
    // For now, we'll simulate this with localStorage
    try {
      // This is a simplified version. In a real app, you would fetch data from a server
      // based on the shared ID

      // For now, we'll just set a flag in localStorage to indicate we're viewing shared data
      localStorage.setItem("viewingSharedWedding", "true")
      localStorage.setItem("sharedWeddingId", sharedId)

      // In a real implementation, you would fetch the wedding data from a server
      // For now, we'll just use what's in localStorage

      setLoading(false)
      customToast.info(t("viewingSharedWedding"), t("viewingSharedWeddingDescription"))
    } catch (err) {
      console.error("Error loading shared wedding:", err)
      setError(t("errorLoadingSharedWedding"))
      setLoading(false)
    }
  }, [demoMode, router, sharedId, customToast, t])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">{t("loadingSharedWedding")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-destructive">{error}</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
          {t("backToDashboard")}
        </button>
      </div>
    )
  }

  return (
    <MainLayout isSharedView={true}>
      <div className="bg-secondary/30 p-4 rounded-lg mb-6">
        <p className="text-center text-sm font-medium">{t("viewingSharedWeddingBanner")}</p>
      </div>
      <Overview isSharedView={true} />
    </MainLayout>
  )
}

