"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Download, Upload, Edit, Trash, Filter } from "lucide-react"
import type { Guest } from "@/lib/types"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function GuestList() {
  const { toast } = useToast()
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRelation, setFilterRelation] = useState<string | null>(null)
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({})
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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

        toast({
          title: "ייבוא הושלם",
          description: `${newGuests.length} אורחים יובאו בהצלחה`,
        })
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
    const matchesFilter = !filterRelation || filterRelation === "כל הקשרים" || guest.relation === filterRelation
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
      setIsAddDialogOpen(false)
      toast({
        title: "אורח נוסף",
        description: `${guestToAdd.fullName} נוסף בהצלחה לרשימת האורחים`,
      })
    }
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setIsEditDialogOpen(true)
  }

  const handleUpdateGuest = () => {
    if (editingGuest) {
      const updatedGuests = guests.map((g) => (g.id === editingGuest.id ? editingGuest : g))
      setGuests(updatedGuests)
      saveToLocalStorage({ guests: updatedGuests })
      setEditingGuest(null)
      setIsEditDialogOpen(false)
      toast({
        title: "אורח עודכן",
        description: "פרטי האורח עודכנו בהצלחה",
      })
    }
  }

  const handleDeleteGuest = (id: string) => {
    const guestName = guests.find((g) => g.id === id)?.fullName
    const updatedGuests = guests.filter((guest) => guest.id !== id)
    setGuests(updatedGuests)
    saveToLocalStorage({ guests: updatedGuests })
    toast({
      title: "אורח הוסר",
      description: `${guestName} הוסר מרשימת האורחים`,
    })
  }

  // Calculate statistics
  const totalGuests = guests.reduce((sum, guest) => sum + guest.invitedCount, 0)
  const confirmedGuests = guests
    .filter((guest) => guest.confirmed === "כן")
    .reduce((sum, guest) => sum + guest.invitedCount, 0)
  const pendingGuests = guests
    .filter((guest) => guest.confirmed === "אולי")
    .reduce((sum, guest) => sum + guest.invitedCount, 0)
  const declinedGuests = guests
    .filter((guest) => guest.confirmed === "לא")
    .reduce((sum, guest) => sum + guest.invitedCount, 0)

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-none overflow-hidden">
        <div className="bg-gradient-to-r from-primary/90 to-pink-500/90 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">רשימת אורחים</CardTitle>
            <CardDescription className="text-white/80">נהל את רשימת המוזמנים שלך</CardDescription>
          </CardHeader>
        </div>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-secondary/30 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">סך הכל אורחים</p>
                <p className="text-3xl font-bold">{totalGuests}</p>
              </CardContent>
            </Card>
            <Card className="bg-success/10 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">אישרו הגעה</p>
                <p className="text-3xl font-bold text-success">{confirmedGuests}</p>
              </CardContent>
            </Card>
            <Card className="bg-warning/10 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">טרם אישרו</p>
                <p className="text-3xl font-bold text-warning">{pendingGuests}</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10 border-none">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">לא מגיעים</p>
                <p className="text-3xl font-bold text-destructive">{declinedGuests}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש אורחים..."
                className="pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    סינון
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterRelation("כל הקשרים")}>כל הקשרים</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRelation("משפחה")}>משפחה</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRelation("חברים")}>חברים</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRelation("עבודה")}>עבודה</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                <Upload className="h-4 w-4 mr-1" />
                ייבוא
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
              </Button>

              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                ייצוא
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    הוסף אורח
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirmed" className="text-right">
                        אישור הגעה
                      </Label>
                      <Select
                        value={newGuest.confirmed}
                        onValueChange={(value) => setNewGuest({ ...newGuest, confirmed: value as Guest["confirmed"] })}
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
                      <Label htmlFor="notes" className="text-right">
                        הערות
                      </Label>
                      <Input
                        id="notes"
                        value={newGuest.specialNotes || ""}
                        onChange={(e) => setNewGuest({ ...newGuest, specialNotes: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      ביטול
                    </Button>
                    <Button onClick={handleAddGuest}>הוסף אורח</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {filterRelation && filterRelation !== "כל הקשרים" && (
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="gap-1">
                {filterRelation}
                <button
                  onClick={() => setFilterRelation(null)}
                  className="ml-1 rounded-full hover:bg-secondary/50 p-0.5"
                >
                  ✕
                </button>
              </Badge>
            </div>
          )}
        </CardContent>

        <Tabs defaultValue="table" className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="table">טבלה</TabsTrigger>
            <TabsTrigger value="cards">כרטיסים</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <div className="rounded-md border">
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
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.fullName}</TableCell>
                        <TableCell>{guest.phoneNumber}</TableCell>
                        <TableCell>{guest.relation}</TableCell>
                        <TableCell>{guest.invitedCount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              guest.confirmed === "כן" ? "success" : guest.confirmed === "אולי" ? "warning" : "outline"
                            }
                          >
                            {guest.confirmed}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{guest.specialNotes}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditGuest(guest)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        לא נמצאו אורחים
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cards">
            {filteredGuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {filteredGuests.map((guest) => (
                  <Card key={guest.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{guest.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{guest.relation}</p>
                        </div>
                        <Badge
                          variant={
                            guest.confirmed === "כן" ? "success" : guest.confirmed === "אולי" ? "warning" : "outline"
                          }
                        >
                          {guest.confirmed}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">טלפון:</span>
                          <span>{guest.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">כמות מוזמנים:</span>
                          <span>{guest.invitedCount}</span>
                        </div>
                        {guest.specialNotes && (
                          <div className="flex items-start gap-2">
                            <span className="font-medium">הערות:</span>
                            <span className="text-muted-foreground">{guest.specialNotes}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleEditGuest(guest)}>
                          <Edit className="h-3 w-3 mr-1" />
                          ערוך
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGuest(guest.id)}>
                          <Trash className="h-3 w-3 mr-1" />
                          הסר
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>לא נמצאו אורחים</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            סה"כ: {filteredGuests.length} אורחים ({filteredGuests.reduce((sum, guest) => sum + guest.invitedCount, 0)}{" "}
            מוזמנים)
          </div>
          {guests.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-1" />
              ייצא לאקסל
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
                  onValueChange={(value) => setEditingGuest({ ...editingGuest, relation: value as Guest["relation"] })}
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
                  onChange={(e) => setEditingGuest({ ...editingGuest, invitedCount: Number.parseInt(e.target.value) })}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleUpdateGuest}>עדכן פרטי אורח</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

