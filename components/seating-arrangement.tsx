"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import type { Guest } from "@/lib/types"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage"
import { Plus, Minus, Users, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Table {
  id: string
  name: string
  seats: number
  guests: string[] // Guest IDs
}

interface GuestItemProps {
  guest: Guest
  onRemove: () => void
  showRemoveButton?: boolean
}

const GuestItem = ({ guest, onRemove, showRemoveButton = true }: GuestItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "GUEST",
    item: { id: guest.id, invitedCount: guest.invitedCount },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex justify-between items-center p-2 rounded-md bg-secondary/50",
        isDragging ? "opacity-50" : "opacity-100",
      )}
    >
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <div>
          <span className="font-medium">{guest.fullName}</span>
          <Badge variant="secondary" className="ml-2">
            {guest.invitedCount} אורחים
          </Badge>
        </div>
      </div>
      {showRemoveButton && (
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      )}
    </motion.div>
  )
}

const TableComponent = ({ table, guests, onRemoveGuest, onAddGuest, onRemoveTable }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "GUEST",
    drop: (item: { id: string; invitedCount: number }) => onAddGuest(item.id, table.id),
    canDrop: (item: { id: string; invitedCount: number }) => {
      const currentOccupancy = table.guests.reduce((sum, guestId) => {
        const guest = guests.find((g) => g.id === guestId)
        return sum + (guest?.invitedCount || 0)
      }, 0)
      return currentOccupancy + item.invitedCount <= table.seats
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const tableGuests = table.guests.map((guestId) => guests.find((g) => g.id === guestId)).filter(Boolean)
  const currentOccupancy = tableGuests.reduce((sum, guest) => sum + (guest?.invitedCount || 0), 0)
  const occupancyPercentage = (currentOccupancy / table.seats) * 100

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        ref={drop}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isOver && canDrop && "ring-2 ring-primary shadow-lg",
          isOver && !canDrop && "ring-2 ring-destructive",
          !isOver && "hover:shadow-md",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{table.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={occupancyPercentage >= 100 ? "destructive" : "secondary"}>
                {currentOccupancy}/{table.seats} מקומות
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => onRemoveTable(table.id)}>
                <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {tableGuests.length === 0 ? "אין אורחים משובצים" : `${tableGuests.length} קבוצות אורחים`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tableGuests.map(
              (guest) =>
                guest && <GuestItem key={guest.id} guest={guest} onRemove={() => onRemoveGuest(guest.id, table.id)} />,
            )}
          </div>
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                occupancyPercentage >= 100 ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const UnassignedGuests = ({ guests, onAddGuest }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "GUEST",
    drop: (item: { id: string }) => onAddGuest(item.id, null),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <Card ref={drop} className={cn("mt-6 transition-all duration-300", isOver && "ring-2 ring-primary shadow-lg")}>
      <CardHeader>
        <CardTitle className="text-lg">אורחים לא משובצים</CardTitle>
        <CardDescription>
          {guests.length} קבוצות אורחים ({guests.reduce((sum, guest) => sum + guest.invitedCount, 0)} סך הכל)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {guests.map((guest) => (
            <GuestItem key={guest.id} guest={guest} onRemove={() => {}} showRemoveButton={false} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SeatingArrangement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [newTableName, setNewTableName] = useState("")
  const [newTableSeats, setNewTableSeats] = useState(8)

  useEffect(() => {
    const storedData = getFromLocalStorage()
    setGuests(storedData.guests || [])
    setTables(storedData.tables || [])
  }, [])

  const addTable = () => {
    if (newTableName) {
      const newTable: Table = {
        id: Date.now().toString(),
        name: newTableName,
        seats: newTableSeats,
        guests: [],
      }
      const updatedTables = [...tables, newTable]
      setTables(updatedTables)
      saveToLocalStorage({ tables: updatedTables })
      setNewTableName("")
      setNewTableSeats(8)
      toast({
        title: "שולחן נוסף",
        description: `שולחן ${newTableName} נוסף בהצלחה`,
      })
    }
  }

  const removeTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (table) {
      const updatedTables = tables.filter((t) => t.id !== tableId)
      setTables(updatedTables)
      saveToLocalStorage({ tables: updatedTables })
      toast({
        title: "שולחן הוסר",
        description: `שולחן ${table.name} הוסר בהצלחה`,
      })
    }
  }

  const assignGuestToTable = (guestId: string, tableId: string | null) => {
    const guest = guests.find((g) => g.id === guestId)
    if (!guest) return

    const updatedTables = tables.map((table) => {
      // Remove guest from all tables first
      if (table.guests.includes(guestId)) {
        return { ...table, guests: table.guests.filter((id) => id !== guestId) }
      }

      // If tableId is null, we're just removing the guest
      if (tableId === null) {
        return table
      }

      // Add guest to the specified table if there's enough space
      if (table.id === tableId) {
        const currentOccupancy = table.guests.reduce((sum, id) => {
          const g = guests.find((guest) => guest.id === id)
          return sum + (g?.invitedCount || 0)
        }, 0)

        if (currentOccupancy + guest.invitedCount <= table.seats) {
          toast({
            title: "שיבוץ אורח",
            description: `${guest.fullName} שובץ בהצלחה לשולחן ${table.name}`,
          })
          return { ...table, guests: [...table.guests, guestId] }
        } else {
          toast({
            title: "שגיאה בשיבוץ",
            description: `אין מספיק מקום בשולחן ${table.name}`,
            variant: "destructive",
          })
        }
      }
      return table
    })

    setTables(updatedTables)
    saveToLocalStorage({ tables: updatedTables })
  }

  const removeGuestFromTable = (guestId: string, tableId: string) => {
    const guest = guests.find((g) => g.id === guestId)
    const table = tables.find((t) => t.id === tableId)
    if (guest && table) {
      const updatedTables = tables.map((t) => {
        if (t.id === tableId) {
          return { ...t, guests: t.guests.filter((id) => id !== guestId) }
        }
        return t
      })
      setTables(updatedTables)
      saveToLocalStorage({ tables: updatedTables })
      toast({
        title: "הסרת שיבוץ",
        description: `${guest.fullName} הוסר מהשולחן ${table.name}`,
      })
    }
  }

  const unassignedGuests = guests.filter((guest) => !tables.some((table) => table.guests.includes(guest.id)))

  const totalGuests = guests.reduce((sum, guest) => sum + guest.invitedCount, 0)
  const assignedGuests = tables.reduce((sum, table) => {
    return (
      sum +
      table.guests.reduce((tableSum, guestId) => {
        const guest = guests.find((g) => g.id === guestId)
        return tableSum + (guest?.invitedCount || 0)
      }, 0)
    )
  }, 0)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">סידורי הושבה</CardTitle>
                <CardDescription>
                  {assignedGuests}/{totalGuests} אורחים משובצים
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base">
                {tables.reduce((sum, table) => sum + table.seats, 0)} מקומות ישיבה
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="grow">
                <Label htmlFor="tableName">שם השולחן</Label>
                <Input
                  id="tableName"
                  placeholder="שם השולחן"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                />
              </div>
              <div className="grow">
                <Label htmlFor="tableSeats">מספר מקומות</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setNewTableSeats((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="tableSeats"
                    type="number"
                    min="1"
                    value={newTableSeats}
                    onChange={(e) => setNewTableSeats(Number(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={() => setNewTableSeats((prev) => prev + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={addTable} disabled={!newTableName}>
                  <Plus className="mr-2 h-4 w-4" /> הוסף שולחן
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {tables.map((table) => (
                  <TableComponent
                    key={table.id}
                    table={table}
                    guests={guests}
                    onRemoveGuest={removeGuestFromTable}
                    onAddGuest={assignGuestToTable}
                    onRemoveTable={removeTable}
                  />
                ))}
              </AnimatePresence>
            </div>

            <UnassignedGuests guests={unassignedGuests} onAddGuest={assignGuestToTable} />
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}

