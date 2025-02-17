"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Download, Upload, Edit, Trash } from "lucide-react"
import type { Guest } from "@/lib/types"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRelation, setFilterRelation] = useState<string | null>(null)
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({})
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  useEffect(() => {
    const storedData = getFromLocalStorage()
    setGuests(storedData.guests || [])
  }, [])

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Partial<Guest>[]

        const newGuests = jsonData.map((guest) => ({
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fullName: guest["שם מלא"] || "",
          phoneNumber: guest["מספר טלפון"] || "",
          relation: (guest["קשר (משפחה/חברים/עבודה)"] || "חברים") as Guest["relation"],
          invitedCount: guest["כמות מוזמנים"] || 1,
          confirmed: (guest["אישור הגעה (כן/לא/אולי)"] || "אולי") as Guest["confirmed"],
          specialNotes: guest["הערות מיוחדות"] || "",
        }))

        const updatedGuests = [...guests]
        newGuests.forEach((newGuest) => {
          const existingGuestIndex = updatedGuests.findIndex(
            (g) =>
              g.fullName.toLowerCase() === newGuest.fullName.toLowerCase() && g.phoneNumber === newGuest.phoneNumber,
          )
          if (existingGuestIndex === -1) {
            updatedGuests.push(newGuest as Guest)
          } else {
            updatedGuests[existingGuestIndex] = { ...updatedGuests[existingGuestIndex], ...newGuest }
          }
        })

        setGuests(updatedGuests)
        saveToLocalStorage({ guests: updatedGuests })
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      guests.map((guest) => ({
        "שם מלא": guest.fullName,
        "מספר טלפון": guest.phoneNumber,
        "קשר (משפחה/חברים/עבודה)": guest.relation,
        "כמות מוזמנים": guest.invitedCount,
        "אישור הגעה (כן/לא/אולי)": guest.confirmed,
        "הערות מיוחדות": guest.specialNotes,
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests")
    XLSX.writeFile(workbook, "wedding_guests.xlsx")
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || guest.phoneNumber.includes(searchTerm)
    const matchesFilter = !filterRelation || guest.relation === filterRelation
    return matchesSearch && matchesFilter
  })

  const handleAddGuest = () => {
    if (newGuest.fullName) {
      const guestToAdd: Guest = {
        id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fullName: newGuest.fullName,
        phoneNumber: newGuest.phoneNumber || "",
        relation: (newGuest.relation as Guest["relation"]) || "חברים",
        invitedCount: newGuest.invitedCount || 1,
        confirmed: (newGuest.confirmed as Guest["confirmed"]) || "אולי",
        specialNotes: newGuest.specialNotes || "",
      }
      const updatedGuests = [...guests, guestToAdd]
      setGuests(updatedGuests)
      saveToLocalStorage({ guests: updatedGuests })
      setNewGuest({})
    }
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
  }

  const handleUpdateGuest = () => {
    if (editingGuest) {
      const updatedGuests = guests.map((g) => (g.id === editingGuest.id ? editingGuest : g))
      setGuests(updatedGuests)
      saveToLocalStorage({ guests: updatedGuests })
      setEditingGuest(null)
    }
  }

  const handleDeleteGuest = (id: string) => {
    const updatedGuests = guests.filter((guest) => guest.id !== id)
    setGuests(updatedGuests)
    saveToLocalStorage({ guests: updatedGuests })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>רשימת אורחים</CardTitle>
              <CardDescription>נהל את רשימת המוזמנים שלך</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => document.getElementById("file-upload")?.click()}>
                <Upload className="h-4 w-4" />
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExportExcel}>
                <Download className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="ml-2 h-4 w-4" />
                    הוסף אורח
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>הוסף אורח חדש</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        שם מלא
                      </Label>
                      <Input
                        id="name"
                        value={newGuest.fullName || ""}
                        onChange={(e) => setNewGuest({ ...newGuest, fullName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        טלפון
                      </Label>
                      <Input
                        id="phone"
                        value={newGuest.phoneNumber || ""}
                        onChange={(e) => setNewGuest({ ...newGuest, phoneNumber: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relation" className="text-right">
                        קשר
                      </Label>
                      <Select
                        value={newGuest.relation}
                        onValueChange={(value) => setNewGuest({ ...newGuest, relation: value as Guest["relation"] })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="בחר קשר" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="משפחה">משפחה</SelectItem>
                          <SelectItem value="חברים">חברים</SelectItem>
                          <SelectItem value="עבודה">עבודה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="count" className="text-right">
                        כמות מוזמנים
                      </Label>
                      <Input
                        id="count"
                        type="number"
                        value={newGuest.invitedCount || ""}
                        onChange={(e) => setNewGuest({ ...newGuest, invitedCount: Number.parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddGuest}>הוסף אורח</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש אורחים..."
                className="pr-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRelation || ""} onValueChange={(value) => setFilterRelation(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל הקשרים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="כל הקשרים">כל הקשרים</SelectItem>
                <SelectItem value="משפחה">משפחה</SelectItem>
                <SelectItem value="חברים">חברים</SelectItem>
                <SelectItem value="עבודה">עבודה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>קשר</TableHead>
                <TableHead>כמות</TableHead>
                <TableHead>אישור</TableHead>
                <TableHead>הערות</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.fullName}</TableCell>
                  <TableCell>{guest.phoneNumber}</TableCell>
                  <TableCell>{guest.relation}</TableCell>
                  <TableCell>{guest.invitedCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        guest.confirmed === "כן" ? "success" : guest.confirmed === "אולי" ? "warning" : "secondary"
                      }
                    >
                      {guest.confirmed}
                    </Badge>
                  </TableCell>
                  <TableCell>{guest.specialNotes}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEditGuest(guest)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ערוך פרטי אורח</DialogTitle>
                        </DialogHeader>
                        {editingGuest && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                שם מלא
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingGuest.fullName}
                                onChange={(e) => setEditingGuest({ ...editingGuest, fullName: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-phone" className="text-right">
                                טלפון
                              </Label>
                              <Input
                                id="edit-phone"
                                value={editingGuest.phoneNumber}
                                onChange={(e) => setEditingGuest({ ...editingGuest, phoneNumber: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-relation" className="text-right">
                                קשר
                              </Label>
                              <Select
                                value={editingGuest.relation}
                                onValueChange={(value) =>
                                  setEditingGuest({ ...editingGuest, relation: value as Guest["relation"] })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="בחר קשר" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="משפחה">משפחה</SelectItem>
                                  <SelectItem value="חברים">חברים</SelectItem>
                                  <SelectItem value="עבודה">עבודה</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-count" className="text-right">
                                כמות מוזמנים
                              </Label>
                              <Input
                                id="edit-count"
                                type="number"
                                value={editingGuest.invitedCount}
                                onChange={(e) =>
                                  setEditingGuest({ ...editingGuest, invitedCount: Number.parseInt(e.target.value) })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-confirmed" className="text-right">
                                אישור הגעה
                              </Label>
                              <Select
                                value={editingGuest.confirmed}
                                onValueChange={(value) =>
                                  setEditingGuest({ ...editingGuest, confirmed: value as Guest["confirmed"] })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="בחר סטטוס" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="כן">כן</SelectItem>
                                  <SelectItem value="לא">לא</SelectItem>
                                  <SelectItem value="אולי">אולי</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-notes" className="text-right">
                                הערות מיוחדות
                              </Label>
                              <Input
                                id="edit-notes"
                                value={editingGuest.specialNotes}
                                onChange={(e) => setEditingGuest({ ...editingGuest, specialNotes: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <Button onClick={handleUpdateGuest}>עדכן פרטי אורח</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

