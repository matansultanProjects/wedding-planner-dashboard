"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { saveToLocalStorage } from "@/lib/storage"
import {
  dummyWeddingDetails,
  dummyGuests,
  dummyTasks,
  dummyBudgetItems,
  dummyVendors,
  dummyTimelineEvents,
  dummyTables,
} from "@/lib/dummyData"

type AuthContextType = {
  user: User | null
  loading: boolean
  demoMode: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Check if demo mode is enabled in localStorage
    const storedDemoMode = localStorage.getItem("demoMode") === "true"
    if (storedDemoMode) {
      setDemoMode(true)
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      if (process.env.NODE_ENV === "development") {
        // Use signInWithPopup for development
        await signInWithPopup(auth, provider)
      } else {
        // Use signInWithRedirect for production
        await signInWithPopup(auth, provider)
      }
    } catch (error: any) {
      console.error("Error signing in with Google", error)
      if (error.code === "auth/unauthorized-domain") {
        console.error("Unauthorized domain. Please add this domain to your Firebase authorized domains list.")
        // You can add a toast notification here to inform the user
      }
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      // Also disable demo mode when signing out
      disableDemoMode()
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  const enableDemoMode = () => {
    setDemoMode(true)
    localStorage.setItem("demoMode", "true")
    // Populate local storage with dummy data
    saveToLocalStorage({
      weddingDetails: dummyWeddingDetails,
      guests: dummyGuests,
      tasks: dummyTasks,
      budgetItems: dummyBudgetItems,
      vendors: dummyVendors,
      timelineEvents: dummyTimelineEvents,
      tables: dummyTables,
    })
  }

  const disableDemoMode = () => {
    setDemoMode(false)
    localStorage.removeItem("demoMode")
    // Clear dummy data from local storage
    localStorage.removeItem("weddingPlannerData")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        signIn,
        signOut: signOutUser,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

