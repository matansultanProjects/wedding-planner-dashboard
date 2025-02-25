"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { getFromLocalStorage } from "@/lib/storage"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, demoMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user && !demoMode) {
        router.push("/login")
      } else {
        // Check if user has completed onboarding
        const storedData = getFromLocalStorage()
        if (!storedData.weddingDetails && pathname !== "/onboarding" && !pathname.includes("/login")) {
          router.push("/onboarding")
        }
      }
    }
  }, [user, loading, demoMode, router, pathname])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">טוען...</p>
      </div>
    )
  }

  if (!user && !demoMode) {
    return null
  }

  return <>{children}</>
}

