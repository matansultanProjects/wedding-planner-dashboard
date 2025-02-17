"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"

interface BudgetItem {
  id: string
  category: string
  description: string
  planned: number
  deposit: number
  actual: number | null
}

export function Budget() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({})

  useEffect(() => {
    const storedData = getFromLocalStorage()
    if (storedData.budgetItems) {
      setBudgetItems(storedData.budgetItems)
    }
  }, [])

  const handleAddItem = () => {
    if (newItem.category && newItem.description && newItem.planned) {
      const itemToAdd: BudgetItem = {
        id: Date.now().toString(),
        category: newItem.category,
        description: newItem.description,
        planned: Number(newItem.planned),
        deposit: Number(newItem.deposit) || 0,
        actual: null,
      }
      const updatedItems = [...budgetItems, itemToAdd]
      setBudgetItems(updatedItems)
      saveToLocalStorage({ budgetItems: updatedItems })
      setNewItem({})
    }
  }

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0)
  const totalDeposit = budgetItems.reduce((sum, item) => sum + item.deposit, 0)
  const totalActual = budgetItems.reduce((sum, item) => sum + (item.actual || 0), 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>תקציב החתונה</CardTitle>
              <CardDescription>מעקב אחר הוצאות והתקדמות</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  הוסף הוצאה
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוסף הוצאה חדשה</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      קטגוריה
                    </Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="אולם">אולם</SelectItem>
                        <SelectItem value="קייטרינג">קייטרינג</SelectItem>
                        <SelectItem value="שמלת כלה">שמלת כלה</SelectItem>
                        <SelectItem value="צלם">צלם</SelectItem>
                        <SelectItem value="מוזיקה">מוזיקה</SelectItem>
                        <SelectItem value="אחר">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      תיאור
                    </Label>
                    <Input
                      id="description"
                      value={newItem.description || ""}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="planned" className="text-right">
                      סכום מתוכנן
                    </Label>
                    <Input
                      id="planned"
                      type="number"
                      value={newItem.planned || ""}
                      onChange={(e) => setNewItem({ ...newItem, planned: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deposit" className="text-right">
                      מקדמה
                    </Label>
                    <Input
                      id="deposit"
                      type="number"
                      value={newItem.deposit || ""}
                      onChange={(e) => setNewItem({ ...newItem, deposit: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem}>הוסף הוצאה</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="grid gap-0.5">
                  <div className="text-sm font-medium">סה״כ תקציב</div>
                  <div className="text-2xl font-bold">₪{totalPlanned.toLocaleString()}</div>
                </div>
                <div className="grid gap-0.5 text-left">
                  <div className="text-sm font-medium">סה״כ מקדמות</div>
                  <div className="text-2xl font-bold text-pink-500">₪{totalDeposit.toLocaleString()}</div>
                </div>
              </div>
              <Progress value={(totalDeposit / totalPlanned) * 100} className="h-3" />
            </div>
            <div className="grid gap-4">
              {budgetItems.map((item) => (
                <div key={item.id} className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {item.category} - {item.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      מקדמה: ₪{item.deposit.toLocaleString()} / ₪{item.planned.toLocaleString()}
                    </div>
                  </div>
                  <Progress value={(item.deposit / item.planned) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

