"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  status: "completed" | "upcoming" | "warning"
}

export function Timeline() {
  const { toast } = useToast()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({})

  useEffect(() => {
    const storedData = getFromLocalStorage()
    if (storedData.timelineEvents) {
      setEvents(storedData.timelineEvents)
    }
  }, [])

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.title && newEvent.description && newEvent.status) {
      const eventToAdd: TimelineEvent = {
        id: Date.now().toString(),
        date: newEvent.date,
        title: newEvent.title,
        description: newEvent.description,
        status: newEvent.status as "completed" | "upcoming" | "warning",
      }
      const updatedEvents = [...events, eventToAdd]
      setEvents(updatedEvents)
      saveToLocalStorage({ timelineEvents: updatedEvents })
      setNewEvent({})
      toast({
        title: "אירוע נוסף",
        description: `${eventToAdd.title} נוסף בהצלחה לציר הזמן`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ציר זמן</CardTitle>
              <CardDescription>אבני דרך ואירועים חשובים</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  הוסף אירוע
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוסף אירוע חדש</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      תאריך
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      כותרת
                    </Label>
                    <Input
                      id="title"
                      value={newEvent.title || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      תיאור
                    </Label>
                    <Input
                      id="description"
                      value={newEvent.description || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      סטטוס
                    </Label>
                    <Select
                      value={newEvent.status}
                      onValueChange={(value) => setNewEvent({ ...newEvent, status: value as TimelineEvent["status"] })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="בחר סטטוס" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">הושלם</SelectItem>
                        <SelectItem value="upcoming">קרב</SelectItem>
                        <SelectItem value="warning">אזהרה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddEvent}>הוסף אירוע</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4">
            <div className="absolute top-0 bottom-0 right-[19px] w-px bg-muted" />
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                {event.status === "completed" ? (
                  <CheckCircle2 className="relative mt-1 h-5 w-5 text-green-500" />
                ) : event.status === "warning" ? (
                  <AlertCircle className="relative mt-1 h-5 w-5 text-yellow-500" />
                ) : (
                  <Clock className="relative mt-1 h-5 w-5 text-blue-500" />
                )}
                <div className="flex-1 grid gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge variant={event.status === "completed" ? "success" : "secondary"}>{event.date}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

