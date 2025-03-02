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
import { useCustomToast } from "@/components/ui/custom-toast"
import { useTranslation } from "react-i18next"

interface BudgetItem {
  id: string
  category: string
  description: string
  planned: number
  deposit: number
  actual: number | null
}

export function Budget() {
  const customToast = useCustomToast()
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({})
  const { t } = useTranslation()

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
      customToast.success(t("budgetItemAdded"), t("budgetItemAddedDescription", { item: itemToAdd.description }))
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
              <CardTitle>{t("budgetTitle")}</CardTitle>
              <CardDescription>{t("expenseTracking")}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  {t("addExpense")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("addNewExpense")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      {t("category")}
                    </Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="אולם">{t("hall")}</SelectItem>
                        <SelectItem value="קייטרינג">{t("catering")}</SelectItem>
                        <SelectItem value="שמלת כלה">{t("weddingDress")}</SelectItem>
                        <SelectItem value="צלם">{t("photographer")}</SelectItem>
                        <SelectItem value="מוזיקה">{t("music")}</SelectItem>
                        <SelectItem value="אחר">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      {t("description")}
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
                      {t("plannedAmount")}
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
                      {t("deposit")}
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
                <Button onClick={handleAddItem}>{t("addExpense")}</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="grid gap-0.5">
                  <div className="text-sm font-medium">{t("totalBudget")}</div>
                  <div className="text-2xl font-bold">₪{totalPlanned.toLocaleString()}</div>
                </div>
                <div className="grid gap-0.5 text-left">
                  <div className="text-sm font-medium">{t("totalDeposits")}</div>
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
                      {t("depositAmount", {
                        deposit: item.deposit.toLocaleString(),
                        planned: item.planned.toLocaleString(),
                      })}
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

