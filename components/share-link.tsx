"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Copy, Check } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useCustomToast } from "./ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function ShareLink() {
  const { demoMode, user } = useAuth()
  const { t } = useTranslation()
  const customToast = useCustomToast()
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const generateShareLink = async () => {
    if (!user) return

    const sharingId = btoa(user.email || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 12)
    const shareUrl = `${window.location.origin}/shared/${sharingId}`
    setShareUrl(shareUrl)

    // Save the sharing information to Firestore
    try {
      await setDoc(doc(db, "weddingShares", sharingId), {
        weddingId: user.uid,
        createdAt: new Date(),
        createdBy: user.uid,
      })
    } catch (error) {
      console.error("Error creating share link:", error)
      customToast.error(t("errorCreatingShareLink"), t("errorCreatingShareLinkDescription"))
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    customToast.success(t("linkCopied"), t("linkCopiedDescription"))

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  if (demoMode) {
    return null // Don't show sharing option in demo mode
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" onClick={generateShareLink}>
          <Share2 className="h-4 w-4" />
          {t("shareWedding")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shareWeddingDetails")}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 space-x-reverse mt-4">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-muted-foreground mb-2">{t("shareWeddingDescription")}</p>
            <div className="flex items-center gap-2">
              <Input readOnly value={shareUrl} className="flex-1" />
              <Button size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{t("shareWeddingNote")}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

