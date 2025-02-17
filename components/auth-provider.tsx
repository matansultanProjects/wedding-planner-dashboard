"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
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

  useEffect(() => {
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
        await signInWithRedirect(auth, provider)
      }
    } catch (error) {
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
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut: signOutUser }}>{children}</AuthContext.Provider>
}

