"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTranslation } from "@/hooks/useTranslation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SaveDataButtonProps {
  data: any
  collectionName: string
  documentId: string
}

export function SaveDataButton({ data, collectionName, documentId }: SaveDataButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { user, demoMode, isSharedUser } = useAuth()
  const customToast = useCustomToast()
  const { t } = useTranslation()

  const handleSave = async () => {
    if (demoMode) {
      customToast.warning(t("demoModeWarning"), t("demoModeWarningDescription"))
      return
    }

    if (!user && !isSharedUser) {
      customToast.error(t("notAuthenticated"), t("pleaseLoginToSave"))
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmSave = async () => {
    setIsSaving(true)
    try {
      const docRef = doc(db, collectionName, documentId)

      // Convert arrays to objects with numeric keys
      const processData = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.reduce((acc, item, index) => {
            acc[index.toString()] = processData(item)
            return acc
          }, {})
        } else if (typeof obj === "object" && obj !== null) {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[key] = processData(value)
            return acc
          }, {} as any)
        }
        return obj
      }

      const processedData = processData(data)

      await setDoc(docRef, processedData, { merge: true })
      customToast.success(t("dataSaved"), t("dataSavedDescription"))
    } catch (error) {
      console.error("Error saving data:", error)
      customToast.error(t("errorSavingData"), t("errorSavingDataDescription"))
    } finally {
      setIsSaving(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <>
      <Button onClick={handleSave} disabled={isSaving || demoMode}>
        {isSaving ? t("saving") : t("saveData")}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmSaveTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmSaveDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>{t("confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

