"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, CheckSquare, Calendar, Clock, AlertCircle, Camera, Edit } from "lucide-react"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage"
import type { Guest, Task, BudgetItem, WeddingDetails, TimelineEvent } from "@/lib/types"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export function Overview() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null)

  useEffect(() => {
    const storedData = getFromLocalStorage()
    setGuests(storedData.guests || [])
    setTasks(storedData.tasks || [])
    setBudgetItems(storedData.budgetItems || [])
    setWeddingDetails(storedData.weddingDetails || null)
    setTimelineEvents(storedData.timelineEvents || [])
    setCouplePhoto(storedData.couplePhoto || null)
  }, [])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setCouplePhoto(base64String)
        saveToLocalStorage({ couplePhoto: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const totalGuests = guests.reduce((sum, guest) => sum + guest.invitedCount, 0)
  const confirmedGuests = guests
    .filter((guest) => guest.confirmed === "כן")
    .reduce((sum, guest) => sum + guest.invitedCount, 0)

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.planned, 0)
  const totalDeposit = budgetItems.reduce((sum, item) => sum + item.deposit, 0)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  const guestRelationData = [
    { name: "משפחה", value: guests.filter((guest) => guest.relation === "משפחה").length },
    { name: "חברים", value: guests.filter((guest) => guest.relation === "חברים").length },
    { name: "עבודה", value: guests.filter((guest) => guest.relation === "עבודה").length },
  ]

  const budgetCategoryData = budgetItems.map((item) => ({
    name: item.category,
    planned: item.planned,
    deposit: item.deposit,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const upcomingEvents = timelineEvents
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <Card className="animate-slide-in">
        <CardHeader>
          <CardTitle className="text-3xl font-bold gradient-text">סקירה כללית</CardTitle>
        </CardHeader>
        <CardContent>
          {weddingDetails ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-text">
                  {weddingDetails.groomName} & {weddingDetails.brideName}
                </h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{new Date(weddingDetails.date).toLocaleDateString("he-IL")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>מספר אורחים משוער: {weddingDetails.estimatedGuests}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>מקום האירוע: {weddingDetails.venue}</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                {couplePhoto ? (
                  <div className="relative">
                    <img
                      src={couplePhoto || "/placeholder.svg"}
                      alt="תמונת הזוג"
                      className="w-48 h-48 object-cover rounded-full shadow-lg"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-2 right-2 cursor-pointer bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/80 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera className="h-12 w-12 text-gray-400" />
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">לא הוזנו פרטי חתונה עדיין</div>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכל אורחים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
            <Progress value={(confirmedGuests / totalGuests) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {confirmedGuests} מתוך {totalGuests} אישרו הגעה
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">תקציב</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalBudget.toLocaleString()}</div>
            <Progress value={(totalDeposit / totalBudget) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              מקדמות: ₪{totalDeposit.toLocaleString()} ({((totalDeposit / totalBudget) * 100).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">משימות</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              הושלמו {((completedTasks / totalTasks) * 100).toFixed(0)}% מהמשימות
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">אירועים קרובים</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <span className="text-sm">{event.title}</span>
                  <Badge variant="outline">{event.date}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 card-hover">
          <CardHeader>
            <CardTitle>התפלגות אורחים</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={guestRelationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {guestRelationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 card-hover">
          <CardHeader>
            <CardTitle>תקציב לפי קטגוריה</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetCategoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" fill="#8884d8" name="תקציב מתוכנן" />
                <Bar dataKey="deposit" fill="#82ca9d" name="מקדמות" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>משימות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  {task.completed ? (
                    <CheckSquare className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-sm">{task.title}</span>
                </div>
                <Badge variant="outline">{task.dueDate}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

