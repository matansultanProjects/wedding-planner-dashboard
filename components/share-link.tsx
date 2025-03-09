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
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareLink = async () => {
    if (!user) return

    setIsGenerating(true)

    try {
      // Generate a unique ID based on user email and timestamp
      const timestamp = new Date().getTime()
      const sharingId = `share-${timestamp}-${Math.random().toString(36).substring(2, 8)}`

      // Create the share URL - make sure to use absolute URL
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"
      const shareUrl = `${baseUrl}/shared/${sharingId}`
      setShareUrl(shareUrl)

      console.log("Generated share URL:", shareUrl)
      console.log("With sharing ID:", sharingId)
      console.log("For wedding ID:", user.uid)

      // Save the sharing information to Firestore if available
      if (db) {
        await setDoc(doc(db, "weddingShares", sharingId), {
          weddingId: user.uid,
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
          email: user.email,
        })
        console.log("Share document created in Firestore")
      } else {
        console.warn("Firestore not available, share link created but not saved")
      }
    } catch (error) {
      console.error("Error creating share link:", error)
      customToast.error(t("errorCreatingShareLink"), t("errorCreatingShareLinkDescription"))
    } finally {
      setIsGenerating(false)
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setIsOpen(true)
            generateShareLink()
          }}
          disabled={isGenerating}
        >
          <Share2 className="h-4 w-4" />
          {isGenerating ? t("generating") : t("shareWedding")}
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
              <Button size="icon" onClick={copyToClipboard} disabled={!shareUrl}>
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

