"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Copy, Check } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useCustomToast } from "./ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"

export function ShareLink() {
  const { demoMode, user } = useAuth()
  const { t } = useTranslation()
  const customToast = useCustomToast()
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Generate a unique sharing ID based on user email or a random ID
  const getSharingId = () => {
    if (user?.email) {
      // Create a hash from the user's email
      return btoa(user.email)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 12)
    } else {
      // If no user, generate a random ID (this shouldn't happen in non-demo mode)
      return `share-${Math.random().toString(36).substring(2, 15)}`
    }
  }

  const sharingId = getSharingId()
  const shareUrl = `${window.location.origin}/shared/${sharingId}`

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
        <Button variant="outline" size="sm" className="gap-2">
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

