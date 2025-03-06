"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc, setDoc, onSnapshot, collection } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"

type WeddingData = {
  weddingDetails: any
  guests: any[]
  tasks: any[]
  budgetItems: any[]
  timelineEvents: any[]
}

type AuthContextType = {
  user: User | null
  loading: boolean
  demoMode: boolean
  isSharedUser: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  enableDemoMode: () => void
  disableDemoMode: () => void
  createWedding: (weddingDetails: any) => Promise<void>
  hasCreatedWedding: boolean
  checkSharedAccess: (sharedId: string) => Promise<string | null>
  sharedWeddingId: string | null
  setSharedWeddingId: (id: string | null) => void
  weddingData: WeddingData | null
  updateWeddingData: (data: Partial<WeddingData>) => Promise<void>
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
  const [hasCreatedWedding, setHasCreatedWedding] = useState(false)
  const [isSharedUser, setIsSharedUser] = useState(false)
  const [sharedWeddingId, setSharedWeddingId] = useState<string | null>(null)
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null)
  const router = useRouter()
  const customToast = useCustomToast()
  const { t } = useTranslation()

  const loadWeddingData = (userId: string) => {
    const weddingRef = doc(db, "weddings", userId)

    const unsubscribeWedding = onSnapshot(weddingRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as WeddingData
        setWeddingData(data)
        setHasCreatedWedding(true)
      } else {
        setHasCreatedWedding(false)
        setWeddingData(null)
      }
    })

    const unsubscribeGuests = onSnapshot(collection(weddingRef, "guests"), (snapshot) => {
      const guestList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setWeddingData((prev) => ({ ...prev, guests: guestList }))
    })

    const unsubscribeTasks = onSnapshot(collection(weddingRef, "tasks"), (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setWeddingData((prev) => ({ ...prev, tasks: taskList }))
    })

    const unsubscribeBudgetItems = onSnapshot(collection(weddingRef, "budgetItems"), (snapshot) => {
      const budgetList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setWeddingData((prev) => ({ ...prev, budgetItems: budgetList }))
    })

    return () => {
      unsubscribeWedding()
      unsubscribeGuests()
      unsubscribeTasks()
      unsubscribeBudgetItems()
    }
  }

  useEffect(() => {
    const storedDemoMode = localStorage.getItem("demoMode") === "true"
    if (storedDemoMode) {
      setDemoMode(true)
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        const unsubscribeWeddingData = loadWeddingData(user.uid)
        return () => unsubscribeWeddingData()
      } else {
        setHasCreatedWedding(false)
        setWeddingData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      customToast.success("התחברות הצליחה", "ברוכים הבאים ל-wedfull!")
      router.push(hasCreatedWedding ? "/dashboard" : "/onboarding")
    } catch (error: any) {
      console.error("Error signing in with Google", error)
      customToast.error("שגיאת התחברות", "אירעה שגיאה בעת ההתחברות. אנא נסה שוב מאוחר יותר.")
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      disableDemoMode()
      setSharedWeddingId(null)
      setIsSharedUser(false)
      customToast.success(t("signOutSuccess"), t("signOutSuccessDescription"))
      router.push("/login")
    } catch (error) {
      console.error("Error signing out", error)
      customToast.error(t("signOutError"), t("signOutErrorDescription"))
    }
  }

  const enableDemoMode = () => {
    setDemoMode(true)
    localStorage.setItem("demoMode", "true")
    customToast.success(t("demoModeActivated"), t("demoModeDescription"))
    router.push("/dashboard")
  }

  const disableDemoMode = () => {
    setDemoMode(false)
    localStorage.removeItem("demoMode")
  }

  const createWedding = async (weddingDetails: any) => {
    if (!user) return
    try {
      await setDoc(doc(db, "weddings", user.uid), weddingDetails)
      setHasCreatedWedding(true)
      customToast.success(t("weddingCreated"), t("weddingCreatedDescription"))
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating wedding", error)
      customToast.error(t("weddingCreationError"), t("weddingCreationErrorDescription"))
    }
  }

  const checkSharedAccess = async (sharedId: string) => {
    try {
      const weddingShareDoc = await getDoc(doc(db, "weddingShares", sharedId))
      if (weddingShareDoc.exists()) {
        const weddingId = weddingShareDoc.data().weddingId
        setIsSharedUser(true)
        setSharedWeddingId(weddingId)
        return weddingId
      }
      return null
    } catch (error) {
      console.error("Error checking shared access", error)
      return null
    }
  }

  const updateWeddingData = async (data: Partial<WeddingData>) => {
    if (!user) return
    try {
      await setDoc(doc(db, "weddings", user.uid), data, { merge: true })
      customToast.success(t("dataSaved"), t("dataSavedDescription"))
    } catch (error) {
      console.error("Error updating wedding data:", error)
      customToast.error(t("errorSavingData"), t("errorSavingDataDescription"))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        isSharedUser,
        signIn,
        signOut: signOutUser,
        enableDemoMode,
        disableDemoMode,
        createWedding,
        hasCreatedWedding,
        checkSharedAccess,
        sharedWeddingId,
        setSharedWeddingId,
        weddingData,
        updateWeddingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

