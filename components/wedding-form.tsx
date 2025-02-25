"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WeddingDetails } from "@/lib/types"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"

export function WeddingForm() {
  const { toast } = useToast()
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>({
    groomName: "",
    brideName: "",
    date: "",
    venue: "",
    estimatedGuests: 0,
  })

  useEffect(() => {
    const storedData = getFromLocalStorage()
    if (storedData.weddingDetails) {
      setWeddingDetails(storedData.weddingDetails)
    }
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveToLocalStorage({ weddingDetails })
    toast({
      title: "פרטי החתונה נשמרו",
      description: "הפרטים עודכנו בהצלחה",
      variant: "default",
    })
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
    </Card>
  )
}

