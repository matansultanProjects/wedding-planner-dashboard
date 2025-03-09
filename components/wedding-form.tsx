"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WeddingDetails } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { SaveDataButton } from "@/components/save-data-button"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export function WeddingForm() {
  const { toast } = useToast()
  const { user, demoMode, weddingData } = useAuth()
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>({
    groomName: "",
    brideName: "",
    date: "",
    venue: "",
    estimatedGuests: 0,
  })

  useEffect(() => {
    if (weddingData?.weddingDetails) {
      setWeddingDetails(weddingData.weddingDetails)
    }
  }, [weddingData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWeddingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setWeddingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setWeddingDetails((prev) => ({ ...prev, date: date.toISOString() }))
    }
  }

  // נעדכן את הפונקציה handleSubmit כדי לשמור במסד הנתונים במקום באחסון המקומי
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (demoMode) {
      toast({
        title: "פרטי החתונה נשמרו",
        description: "הפרטים עודכנו בהצלחה (מצב הדגמה)",
        variant: "default",
      })
      return
    }

    if (!user || !db) {
      toast({
        title: "שגיאה בשמירת הנתונים",
        description: "אנא התחבר כדי לשמור את הנתונים",
        variant: "destructive",
      })
      return
    }

    try {
      // עדכון מסד הנתונים
      await updateDoc(doc(db, "weddings", user.uid), { weddingDetails })

      toast({
        title: "פרטי החתונה נשמרו",
        description: "הפרטים עודכנו בהצלחה",
        variant: "default",
      })
    } catch (error) {
      console.error("שגיאה בשמירת פרטי החתונה:", error)
      toast({
        title: "שגיאה בשמירת הנתונים",
        description: "אירעה שגיאה בעת שמירת הנתונים. אנא נסה שוב.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי החתונה</CardTitle>
        <CardDescription>הזן את הפרטים הבסיסיים של החתונה שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groomName">שם החתן</Label>
              <Input
                id="groomName"
                name="groomName"
                placeholder="שם החתן"
                value={weddingDetails.groomName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideName">שם הכלה</Label>
              <Input
                id="brideName"
                name="brideName"
                placeholder="שם הכלה"
                value={weddingDetails.brideName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>תאריך החתונה</Label>
            <Calendar
              mode="single"
              selected={weddingDetails.date ? new Date(weddingDetails.date) : undefined}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">מקום האירוע</Label>
            <Select value={weddingDetails.venue} onValueChange={(value) => handleSelectChange("venue", value)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מקום" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="אולם אירועים">אולם אירועים</SelectItem>
                <SelectItem value="גן אירועים">גן אירועים</SelectItem>
                <SelectItem value="חוף הים">חוף הים</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedGuests">מספר אורחים משוער</Label>
            <Input
              id="estimatedGuests"
              name="estimatedGuests"
              type="number"
              placeholder="הכנס מספר אורחים משוער"
              value={weddingDetails.estimatedGuests}
              onChange={handleInputChange}
              className="text-left"
            />
          </div>
          <Button type="submit" className="w-full">
            שמור פרטים
          </Button>
        </form>
      </CardContent>
      <SaveDataButton data={weddingDetails} collectionName="weddings" documentId={user?.uid || ""} />
    </Card>
  )
}

