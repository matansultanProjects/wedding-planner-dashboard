"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Guest } from "@/lib/types"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage"

interface Table {
  id: string
  name: string
  seats: number
  guests: string[]
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
    }
  }

  const assignGuestToTable = (guestId: string, tableId: string) => {
    const guest = guests.find((g) => g.id === guestId)
    if (!guest) return

    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        const currentSeats = table.guests.reduce((sum, id) => {
          const g = guests.find((guest) => guest.id === id)
          return sum + (g ? g.invitedCount : 0)
        }, 0)
        if (currentSeats + guest.invitedCount <= table.seats) {
          return { ...table, guests: [...table.guests, guestId] }
        }
      }
      return table
    })
    setTables(updatedTables)
    saveToLocalStorage({ tables: updatedTables })
  }

  const removeGuestFromTable = (guestId: string, tableId: string) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return { ...table, guests: table.guests.filter((id) => id !== guestId) }
      }
      return table
    })
    setTables(updatedTables)
    saveToLocalStorage({ tables: updatedTables })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>סידורי הושבה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="שם השולחן" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} />
            <Input
              type="number"
              placeholder="מספר מקומות"
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(Number(e.target.value))}
            />
            <Button onClick={addTable}>הוסף שולחן</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <Card key={table.id}>
                <CardHeader>
                  <CardTitle>
                    {table.name} (
                    {table.guests.reduce((sum, id) => {
                      const guest = guests.find((g) => g.id === id)
                      return sum + (guest ? guest.invitedCount : 0)
                    }, 0)}
                    /{table.seats})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {table.guests.map((guestId) => {
                      const guest = guests.find((g) => g.id === guestId)
                      return guest ? (
                        <li key={guestId} className="flex justify-between items-center">
                          {guest.fullName} ({guest.invitedCount})
                          <Button variant="ghost" size="sm" onClick={() => removeGuestFromTable(guestId, table.id)}>
                            הסר
                          </Button>
                        </li>
                      ) : null
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">אורחים לא משובצים</h3>
            <ul>
              {guests
                .filter((guest) => !tables.some((table) => table.guests.includes(guest.id)))
                .map((guest) => (
                  <li key={guest.id} className="flex justify-between items-center mb-2">
                    {guest.fullName} ({guest.invitedCount})
                    <select
                      onChange={(e) => assignGuestToTable(guest.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="">בחר שולחן</option>
                      {tables
                        .filter((table) => {
                          const currentSeats = table.guests.reduce((sum, id) => {
                            const g = guests.find((guest) => guest.id === id)
                            return sum + (g ? g.invitedCount : 0)
                          }, 0)
                          return currentSeats + guest.invitedCount <= table.seats
                        })
                        .map((table) => (
                          <option key={table.id} value={table.id}>
                            {table.name} (
                            {table.guests.reduce((sum, id) => {
                              const g = guests.find((guest) => guest.id === id)
                              return sum + (g ? g.invitedCount : 0)
                            }, 0)}
                            /{table.seats})
                          </option>
                        ))}
                    </select>
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

