"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Phone, Mail, DollarSign, Briefcase, User, Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"

interface Vendor {
  id: string
  name: string
  category: string
  contact: string
  phone: string
  email: string
  cost: number
  status: "מאושר" | "בתהליך" | "לא מאושר"
}

export function VendorManager() {
  const { toast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({})
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    const storedData = getFromLocalStorage()
    if (storedData.vendors) {
      setVendors(storedData.vendors)
    }
  }, [])

  const handleAddVendor = () => {
    if (newVendor.name && newVendor.category && newVendor.contact) {
      const vendorToAdd: Vendor = {
        id: Date.now().toString(),
        name: newVendor.name,
        category: newVendor.category,
        contact: newVendor.contact,
        phone: newVendor.phone || "",
        email: newVendor.email || "",
        cost: newVendor.cost || 0,
        status: "בתהליך",
      }
      const updatedVendors = [...vendors, vendorToAdd]
      setVendors(updatedVendors)
      saveToLocalStorage({ vendors: updatedVendors })
      setNewVendor({})
      toast({
        title: "ספק נוסף",
        description: `${vendorToAdd.name} נוסף בהצלחה לרשימת הספקים`,
      })
    }
  }

  const handleEditVendor = () => {
    if (editingVendor) {
      const updatedVendors = vendors.map((v) => (v.id === editingVendor.id ? editingVendor : v))
      setVendors(updatedVendors)
      saveToLocalStorage({ vendors: updatedVendors })
      setEditingVendor(null)
      toast({
        title: "ספק עודכן",
        description: `פרטי הספק ${editingVendor.name} עודכנו בהצלחה`,
      })
    }
  }

  const handleDeleteVendor = (id: string) => {
    const vendorName = vendors.find((v) => v.id === id)?.name
    const updatedVendors = vendors.filter((v) => v.id !== id)
    setVendors(updatedVendors)
    saveToLocalStorage({ vendors: updatedVendors })
    toast({
      title: "ספק הוסר",
      description: `${vendorName} הוסר מרשימת הספקים`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                <Briefcase className="inline-block mr-2" />
                ספקים
              </CardTitle>
              <CardDescription>ניהול ספקי החתונה</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  הוסף ספק
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוסף ספק חדש</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      שם
                    </Label>
                    <Input
                      id="name"
                      value={newVendor.name || ""}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      קטגוריה
                    </Label>
                    <Select
                      value={newVendor.category}
                      onValueChange={(value) => setNewVendor({ ...newVendor, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="אולם">אולם</SelectItem>
                        <SelectItem value="קייטרינג">קייטרינג</SelectItem>
                        <SelectItem value="צלם">צלם</SelectItem>
                        <SelectItem value="מוזיקה">מוזיקה</SelectItem>
                        <SelectItem value="עיצוב">עיצוב</SelectItem>
                        <SelectItem value="אחר">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      איש קשר
                    </Label>
                    <Input
                      id="contact"
                      value={newVendor.contact || ""}
                      onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      טלפון
                    </Label>
                    <Input
                      id="phone"
                      value={newVendor.phone || ""}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      אימייל
                    </Label>
                    <Input
                      id="email"
                      value={newVendor.email || ""}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      עלות
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newVendor.cost || ""}
                      onChange={(e) => setNewVendor({ ...newVendor, cost: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddVendor}>הוסף ספק</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {vendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{vendor.name}</h3>
                        <p className="text-sm text-muted-foreground">{vendor.category}</p>
                      </div>
                      <Badge variant={vendor.status === "מאושר" ? "success" : "secondary"}>{vendor.status}</Badge>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">איש קשר:</span>
                        {vendor.contact}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">עלות:</span>₪{vendor.cost.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditingVendor(vendor)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ערוך ספק</DialogTitle>
                          </DialogHeader>
                          {editingVendor && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  שם
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingVendor.name}
                                  onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-category" className="text-right">
                                  קטגוריה
                                </Label>
                                <Select
                                  value={editingVendor.category}
                                  onValueChange={(value) => setEditingVendor({ ...editingVendor, category: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="בחר קטגוריה" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="אולם">אולם</SelectItem>
                                    <SelectItem value="קייטרינג">קייטרינג</SelectItem>
                                    <SelectItem value="צלם">צלם</SelectItem>
                                    <SelectItem value="מוזיקה">מוזיקה</SelectItem>
                                    <SelectItem value="עיצוב">עיצוב</SelectItem>
                                    <SelectItem value="אחר">אחר</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-contact" className="text-right">
                                  איש קשר
                                </Label>
                                <Input
                                  id="edit-contact"
                                  value={editingVendor.contact}
                                  onChange={(e) => setEditingVendor({ ...editingVendor, contact: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-phone" className="text-right">
                                  טלפון
                                </Label>
                                <Input
                                  id="edit-phone"
                                  value={editingVendor.phone}
                                  onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  אימייל
                                </Label>
                                <Input
                                  id="edit-email"
                                  value={editingVendor.email}
                                  onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-cost" className="text-right">
                                  עלות
                                </Label>
                                <Input
                                  id="edit-cost"
                                  type="number"
                                  value={editingVendor.cost}
                                  onChange={(e) => setEditingVendor({ ...editingVendor, cost: Number(e.target.value) })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right">
                                  סטטוס
                                </Label>
                                <Select
                                  value={editingVendor.status}
                                  onValueChange={(value) =>
                                    setEditingVendor({ ...editingVendor, status: value as Vendor["status"] })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="בחר סטטוס" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="מאושר">מאושר</SelectItem>
                                    <SelectItem value="בתהליך">בתהליך</SelectItem>
                                    <SelectItem value="לא מאושר">לא מאושר</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <Button onClick={handleEditVendor}>שמור שינויים</Button>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

