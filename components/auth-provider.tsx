"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, onSnapshot, collection, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"
import { dummyWeddingDetails, dummyGuests, dummyTasks, dummyBudgetItems, dummyTimelineEvents } from "@/lib/dummyData"

type WeddingData = {
  weddingDetails: any
  guests: any[]
  tasks: any[]
  budgetItems: any[]
  timelineEvents: any[]
  tables?: any[]
  vendors?: any[]
  couplePhoto?: string | null
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
  const [authInitialized, setAuthInitialized] = useState(false)

  // Load demo data when in demo mode
  useEffect(() => {
    if (demoMode) {
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
      setHasCreatedWedding(true)
    }
  }, [demoMode])

  const loadWeddingData = (userId: string) => {
    try {
      if (!db) {
        console.error("Firestore is not initialized")
        setLoading(false)
        return () => {}
      }

      console.log("Setting up data listeners for user:", userId)

      const weddingRef = doc(db, "weddings", userId)

      // Main wedding data
      const unsubscribeWedding = onSnapshot(
        weddingRef,
        (doc) => {
          console.log("Wedding document update:", doc.exists())
          if (doc.exists()) {
            const data = doc.data()
            console.log("Wedding data:", data)

            // Create a new wedding data object with all the fields
            const newWeddingData: WeddingData = {
              weddingDetails: data.weddingDetails || {},
              guests: data.guests || [],
              tasks: data.tasks || [],
              budgetItems: data.budgetItems || [],
              timelineEvents: data.timelineEvents || [],
              tables: data.tables || [],
              vendors: data.vendors || [],
              couplePhoto: data.couplePhoto || null,
            }

            setWeddingData(newWeddingData)
            setHasCreatedWedding(true)
          } else {
            console.log("Wedding document does not exist")
            setHasCreatedWedding(false)
            // Initialize with empty data if no wedding document exists
            setWeddingData({
              weddingDetails: {},
              guests: [],
              tasks: [],
              budgetItems: [],
              timelineEvents: [],
              tables: [],
              vendors: [],
              couplePhoto: null,
            })
          }
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching wedding data:", error)
          setLoading(false)
        },
      )

      // Set up listeners for subcollections
      const unsubscribeGuests = onSnapshot(
        collection(weddingRef, "guests"),
        (snapshot) => {
          const guestList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setWeddingData((prevData) => (prevData ? { ...prevData, guests: guestList } : null))

          // Update the main document with the guests array for easier access
          if (guestList.length > 0) {
            updateDoc(weddingRef, { guests: guestList }).catch((error) => {
              console.error("Error updating main document with guests:", error)
            })
          }
        },
        (error) => {
          console.error("Error fetching guests:", error)
        },
      )

      const unsubscribeTasks = onSnapshot(
        collection(weddingRef, "tasks"),
        (snapshot) => {
          const taskList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setWeddingData((prevData) => (prevData ? { ...prevData, tasks: taskList } : null))

          // Update the main document with the tasks array
          if (taskList.length > 0) {
            updateDoc(weddingRef, { tasks: taskList }).catch((error) => {
              console.error("Error updating main document with tasks:", error)
            })
          }
        },
        (error) => {
          console.error("Error fetching tasks:", error)
        },
      )

      const unsubscribeBudgetItems = onSnapshot(
        collection(weddingRef, "budgetItems"),
        (snapshot) => {
          const budgetList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setWeddingData((prevData) => (prevData ? { ...prevData, budgetItems: budgetList } : null))

          // Update the main document with the budget items array
          if (budgetList.length > 0) {
            updateDoc(weddingRef, { budgetItems: budgetList }).catch((error) => {
              console.error("Error updating main document with budget items:", error)
            })
          }
        },
        (error) => {
          console.error("Error fetching budget items:", error)
        },
      )

      const unsubscribeVendors = onSnapshot(
        collection(weddingRef, "vendors"),
        (snapshot) => {
          const vendorList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setWeddingData((prevData) => (prevData ? { ...prevData, vendors: vendorList } : null))

          // Update the main document with the vendors array
          if (vendorList.length > 0) {
            updateDoc(weddingRef, { vendors: vendorList }).catch((error) => {
              console.error("Error updating main document with vendors:", error)
            })
          }
        },
        (error) => {
          console.error("Error fetching vendors:", error)
        },
      )

      return () => {
        unsubscribeWedding()
        unsubscribeGuests()
        unsubscribeTasks()
        unsubscribeBudgetItems()
        unsubscribeVendors()
      }
    } catch (error) {
      console.error("Error setting up data listeners:", error)
      setLoading(false)
      return () => {}
    }
  }

  useEffect(() => {
    console.log("AuthProvider useEffect running")

    // Check for demo mode first - only run on client side
    if (typeof window !== "undefined") {
      const storedDemoMode = localStorage.getItem("demoMode") === "true"
      if (storedDemoMode) {
        console.log("Demo mode detected from localStorage")
        setDemoMode(true)
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
        setHasCreatedWedding(true)
        setLoading(false)
        setAuthInitialized(true)
        return
      }

      // Check for shared wedding mode
      const storedSharedWeddingId = localStorage.getItem("sharedWeddingId")
      const viewingSharedWedding = localStorage.getItem("viewingSharedWedding") === "true"

      if (viewingSharedWedding && storedSharedWeddingId) {
        console.log("Shared wedding mode detected:", storedSharedWeddingId)
        setIsSharedUser(true)
        setSharedWeddingId(storedSharedWeddingId)

        // Set up real-time listeners for shared wedding data
        const unsubscribeSharedData = loadSharedWeddingData(storedSharedWeddingId)
        setLoading(false)
        setAuthInitialized(true)

        return () => {
          if (typeof unsubscribeSharedData === "function") {
            unsubscribeSharedData()
          }
        }
      }
    }

    // Check if Firebase auth is available
    if (!auth) {
      console.warn("Firebase auth is not available. Enabling demo mode.")
      enableDemoMode()
      setLoading(false)
      setAuthInitialized(true)
      return
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("Auth state changed, user:", user ? user.email : "null")
        setUser(user)
        setAuthInitialized(true)

        if (user) {
          // Initialize wedding data to null before loading
          setWeddingData(null)
          const unsubscribeWeddingData = loadWeddingData(user.uid)
          setLoading(false)
          return () => unsubscribeWeddingData()
        } else {
          setHasCreatedWedding(false)
          setWeddingData(null)
          setLoading(false)
        }
      },
      (error) => {
        console.error("Auth state change error:", error)
        setLoading(false)
        setAuthInitialized(true)
      },
    )

    return () => unsubscribe()
  }, [])

  // Load shared wedding data with real-time updates
  const loadSharedWeddingData = (weddingId: string) => {
    try {
      if (!db) {
        console.error("Firestore is not initialized")
        return () => {}
      }

      console.log("Setting up shared data listeners for wedding:", weddingId)

      const weddingRef = doc(db, "weddings", weddingId)

      // Set up real-time listener for the wedding document
      const unsubscribeWedding = onSnapshot(
        weddingRef,
        (doc) => {
          console.log("Shared wedding document update:", doc.exists())
          if (doc.exists()) {
            const data = doc.data()

            // Create a new wedding data object with all the fields
            const newWeddingData: WeddingData = {
              weddingDetails: data.weddingDetails || {},
              guests: data.guests || [],
              tasks: data.tasks || [],
              budgetItems: data.budgetItems || [],
              timelineEvents: data.timelineEvents || [],
              tables: data.tables || [],
              vendors: data.vendors || [],
              couplePhoto: data.couplePhoto || null,
            }

            setWeddingData(newWeddingData)
            setHasCreatedWedding(true)
          } else {
            console.error("Error fetching wedding data, using dummy data:", "Wedding document does not exist")
            // Use dummy data as fallback for shared view
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
        },
        (error) => {
          console.error("Error fetching wedding data, using dummy data:", error)
          // Use dummy data as fallback for shared view
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
          setLoading(false)
        },
      )

      return () => {
        unsubscribeWedding()
      }
    } catch (error) {
      console.error("Error loading shared wedding data:", error)
      setLoading(false)
      return () => {}
    }
  }

  const signIn = async () => {
    if (!auth) {
      customToast.error("Authentication Error", "Firebase authentication is not available. Using demo mode instead.")
      enableDemoMode()
      return
    }

    const provider = new GoogleAuthProvider()
    try {
      console.log("Starting Google sign in process")
      const result = await signInWithPopup(auth, provider)
      console.log("Google sign in successful:", result.user.email)

      // Force update the user state immediately
      setUser(result.user)
      setLoading(false)

      // Check if the user has a wedding document
      let hasWedding = false
      if (db) {
        try {
          const weddingDoc = await getDoc(doc(db, "weddings", result.user.uid))
          hasWedding = weddingDoc.exists()
          setHasCreatedWedding(hasWedding)
          console.log("Wedding document exists:", hasWedding)

          // Start listening for data changes
          loadWeddingData(result.user.uid)
        } catch (error) {
          console.error("Error checking wedding document:", error)
        }
      }

      customToast.success("התחברות הצליחה", "ברוכים הבאים ל-wedfull!")

      // Redirect based on whether the user has created a wedding
      const destination = hasWedding ? "/dashboard" : "/onboarding"
      console.log("Redirecting to:", destination)
      router.push(destination)
    } catch (error: any) {
      console.error("Error signing in with Google", error)

      // Handle specific Firebase auth errors
      if (error.code === "auth/invalid-api-key") {
        customToast.error("שגיאת התחברות", "מפתח API לא תקין. עובר למצב הדגמה.")
        enableDemoMode()
      } else if (error.code === "auth/unauthorized-domain") {
        customToast.error("שגיאת התחברות", "דומיין לא מורשה לאימות. עובר למצב הדגמה.")
        enableDemoMode()
      } else {
        customToast.error("שגיאת התחברות", "אירעה שגיאה בעת ההתחברות. אנא נסה שוב מאוחר יותר.")
      }
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      console.log("Signing out user")
      if (auth) {
        await firebaseSignOut(auth)
      }

      // Clear all state
      setUser(null)
      setWeddingData(null)
      setHasCreatedWedding(false)

      disableDemoMode()
      setSharedWeddingId(null)
      setIsSharedUser(false)
      if (typeof window !== "undefined") {
        localStorage.removeItem("viewingSharedWedding")
        localStorage.removeItem("sharedWeddingId")
      }

      customToast.success(t("signOutSuccess"), t("signOutSuccessDescription"))
      router.push("/login")
    } catch (error) {
      console.error("Error signing out", error)
      customToast.error(t("signOutError"), t("signOutErrorDescription"))
    }
  }

  const enableDemoMode = () => {
    console.log("Enabling demo mode")
    setDemoMode(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("demoMode", "true")
    }
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
    setHasCreatedWedding(true)
    customToast.success("מצב הדגמה הופעל", "נכנסת למערכת במצב הדגמה")
    router.push("/dashboard")
  }

  const disableDemoMode = () => {
    console.log("Disabling demo mode")
    setDemoMode(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("demoMode")
    }
  }

  const createWedding = async (weddingDetails: any) => {
    if (demoMode) {
      // In demo mode, just update the local state
      setWeddingData((prevData) => ({
        ...prevData,
        weddingDetails,
      }))
      setHasCreatedWedding(true)
      customToast.success(t("weddingCreated"), t("weddingCreatedDescription"))
      router.push("/dashboard")
      return
    }

    if (!user || !db) return

    try {
      console.log("Creating wedding for user:", user.uid)

      // Create the initial wedding document with the wedding details
      const initialData = {
        weddingDetails,
        guests: [],
        tasks: [],
        budgetItems: [],
        timelineEvents: [],
        tables: [],
        vendors: [],
        couplePhoto: null,
      }

      await setDoc(doc(db, "weddings", user.uid), initialData)
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
      if (!db) {
        console.error("Firestore is not initialized")
        return null
      }

      console.log("Checking shared access for ID:", sharedId)
      const weddingShareDoc = await getDoc(doc(db, "weddingShares", sharedId))
      if (weddingShareDoc.exists()) {
        const weddingId = weddingShareDoc.data().weddingId
        console.log("Found shared wedding ID:", weddingId)
        setIsSharedUser(true)
        setSharedWeddingId(weddingId)
        if (typeof window !== "undefined") {
          localStorage.setItem("viewingSharedWedding", "true")
          localStorage.setItem("sharedWeddingId", weddingId)
        }

        // Load the shared wedding data
        loadSharedWeddingData(weddingId)

        return weddingId
      }
      return null
    } catch (error) {
      console.error("Error checking shared access:", error)
      return null
    }
  }

  const updateWeddingData = async (data: Partial<WeddingData>) => {
    if (demoMode) {
      // במצב דמו, רק מעדכנים את המצב המקומי ולא שומרים באחסון המקומי
      setWeddingData((prevData) => ({
        ...prevData,
        ...data,
      }))
      customToast.success("הנתונים עודכנו", "הנתונים עודכנו בהצלחה (מצב הדגמה)")
      return
    }

    if (!user || !db) return

    try {
      console.log("Updating wedding data for user:", user.uid, data)

      // Convert any arrays to objects if needed
      const dataToUpdate = { ...data }

      await setDoc(doc(db, "weddings", user.uid), dataToUpdate, { merge: true })

      // עדכון מיידי של המצב המקומי לאחר שמירה במסד הנתונים
      setWeddingData((prevData) => ({
        ...prevData,
        ...data,
      }))

      customToast.success("הנתונים נשמרו", "הנתונים נשמרו בהצלחה")
    } catch (error) {
      console.error("Error updating wedding data:", error)
      customToast.error("שגיאה בשמירת הנתונים", "אירעה שגיאה בעת שמירת הנתונים. אנא נסה שוב.")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading && authInitialized, // Only show loading if auth is initialized
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

