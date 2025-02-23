"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { motion } from "framer-motion"
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary">
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
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

