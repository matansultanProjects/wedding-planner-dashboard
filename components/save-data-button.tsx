"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCustomToast } from "@/components/ui/custom-toast"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-provider"

interface SaveDataButtonProps {
  data: any
  collectionName: string
  documentId: string
  fieldName?: string
}

export function SaveDataButton({ data, collectionName, documentId, fieldName }: SaveDataButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const customToast = useCustomToast()
  const { demoMode } = useAuth()

  const handleSave = async () => {
    if (demoMode) {
      customToast.warning("אזהרת מצב הדגמה", "לא ניתן לשמור שינויים במצב הדגמה")
      return
    }

    if (!documentId) {
      customToast.error("לא מחובר", "אנא התחבר כדי לשמור שינויים")
      return
    }

    setIsSaving(true)

    try {
      const docRef = doc(db, collectionName, documentId)

      if (fieldName) {
        // Update a specific field in the document
        const updateData = { [fieldName]: data }
        await updateDoc(docRef, updateData)
      } else {
        // If data is an array, wrap it in an object with the field name
        if (Array.isArray(data)) {
          const fieldNameFromCollection = collectionName.endsWith("s") ? collectionName : `${collectionName}s`
          await setDoc(docRef, { [fieldNameFromCollection]: data }, { merge: true })
        } else {
          // If data is an object, update the document
          await setDoc(docRef, data, { merge: true })
        }
      }

      customToast.success("הנתונים נשמרו", "הנתונים נשמרו בהצלחה")
    } catch (error: any) {
      console.error("שגיאה בשמירת נתונים:", error)
      customToast.error("שגיאה בשמירת הנתונים", `אירעה שגיאה בעת שמירת הנתונים: ${error.message}. אנא נסה שוב.`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={isSaving || demoMode} className="mt-4">
      {isSaving ? "שומר..." : "שמור נתונים"}
    </Button>
  )
}

