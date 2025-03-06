"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, demoMode, isSharedUser, checkSharedAccess, sharedWeddingId } = useAuth()

  useEffect(() => {
    const checkAccess = async () => {
      const sharedId = searchParams.get("shared")
      if (sharedId) {
        const hasAccess = await checkSharedAccess(sharedId)
        if (hasAccess) {
          router.push(`/shared/${sharedId}`)
          return
        }
      }

      if (!loading) {
        if (user || demoMode) {
          router.push("/dashboard")
        } else if (isSharedUser && sharedWeddingId) {
          router.push(`/shared/${sharedWeddingId}`)
        }
      }
    }

    checkAccess()
  }, [user, loading, demoMode, isSharedUser, router, checkSharedAccess, sharedWeddingId, searchParams])

  if (loading) {
    return <div>Loading...</div>
  }

  return <LandingPage />
}

