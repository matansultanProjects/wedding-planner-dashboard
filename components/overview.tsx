"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, DollarSign, CheckSquare, Calendar, Clock, AlertCircle, Camera, Edit, CalendarHeart } from "lucide-react"
import type { Guest, Task, BudgetItem, WeddingDetails } from "@/lib/types"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "./ui/custom-toast"
import { useTranslation } from "@/hooks/useTranslation"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { SaveDataButton } from "./save-data-button"

interface TimelineEvent {
  id: string
  title: string
  date: string
  status: "completed" | "upcoming" | "warning"
}

interface OverviewProps {
  isSharedView?: boolean
  weddingData?: any
}

export function Overview({ isSharedView = false }: OverviewProps) {
  const { user, demoMode, weddingData } = useAuth()
  const { t } = useTranslation()
  const customToast = useCustomToast()
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [weddingDetailsState, setWeddingDetailsState] = useState<WeddingDetails | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null)

  useEffect(() => {
    if (weddingData) {
      setWeddingDetails(weddingData.weddingDetails)
      setGuests(weddingData.guests || [])
      setTasks(weddingData.tasks || [])
      setBudgetItems(weddingData.budgetItems || [])
      setTimelineEvents(weddingData.timelineEvents || [])
      setCouplePhoto(weddingData.couplePhoto || null)
    }
  }, [weddingData])

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (demoMode || !user) return

    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setCouplePhoto(base64String)
        try {
          await updateDoc(doc(db, "weddings", user.uid), { couplePhoto: base64String })
          customToast.success(t("photoUpdated"), t("photoUpdatedDescription"))
        } catch (error) {
          console.error("Error updating photo:", error)
          customToast.error(t("errorUpdatingPhoto"), t("errorUpdatingPhotoDescription"))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateData = () => {
    customToast.success(t("dataUpdated"), t("dataUpdatedDescription"))
  }

  const totalGuests = guests.reduce((sum, guest) => sum + guest.invitedCount, 0)
  const confirmedGuests = guests
    .filter((guest) => guest.confirmed === "כן")
    .reduce((sum, guest) => sum + guest.invitedCount, 0)

  const totalBudget = budgetItems.reduce((sum, item) => sum + (item.planned || 0), 0)
  const totalDeposit = budgetItems.reduce((sum, item) => sum + (item.deposit || 0), 0)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  const guestRelationData = [
    { name: "משפחה", value: guests.filter((guest) => guest.relation === "משפחה").length },
    { name: "חברים", value: guests.filter((guest) => guest.relation === "חברים").length },
    { name: "עבודה", value: guests.filter((guest) => guest.relation === "עבודה").length },
  ]

  const budgetCategoryData = budgetItems.map((item) => ({
    name: item.category,
    planned: item.planned || 0,
    deposit: item.deposit || 0,
  }))

  const COLORS = ["#FF6B8B", "#46CDCF", "#3D84A8", "#ABEDD8"]

  const upcomingEvents = timelineEvents
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Calculate days until wedding
  const daysUntilWedding = weddingDetails?.date
    ? Math.ceil((new Date(weddingDetails.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={handleUpdateData}>{t("refreshData")}</Button>
      </div>

      <Card className="overflow-hidden border-none shadow-card">
        <div className="bg-gradient-to-r from-primary/90 to-pink-500/90 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">{t("overviewTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {weddingDetails ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    {weddingDetails.groomName} & {weddingDetails.brideName}
                  </h2>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg">{new Date(weddingDetails.date).toLocaleDateString("he-IL")}</span>
                    {daysUntilWedding !== null && (
                      <Badge variant="outline" className="ml-2 bg-white/20 text-white border-white/30">
                        {daysUntilWedding} {t("daysLeft")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-5 w-5" />
                    <span className="text-lg">
                      {t("estimatedGuests")}: {weddingDetails.estimatedGuests}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-lg">
                      {t("venue")}: {weddingDetails.venue}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  {couplePhoto ? (
                    <div className="relative">
                      <img
                        src={couplePhoto || "/placeholder.svg"}
                        alt={t("couplePhoto")}
                        className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
                      />
                      {!demoMode && (
                        <label
                          htmlFor="photo-upload"
                          className="absolute bottom-2 right-2 cursor-pointer bg-white text-primary rounded-full p-2 shadow-md hover:bg-white/90 transition-colors"
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
                      )}
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                      {!demoMode ? (
                        <label htmlFor="photo-upload" className="cursor-pointer text-center">
                          <Camera className="h-12 w-12 mx-auto mb-2" />
                          <span className="text-sm">{t("addPhoto")}</span>
                          <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      ) : (
                        <div className="text-center">
                          <Camera className="h-12 w-12 mx-auto mb-2" />
                          <span className="text-sm">{t("noPhotoAvailable")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-white/80 py-6">{t("noWeddingDetailsYet")}</div>
            )}
          </CardContent>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalGuests")}</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
            <Progress value={(confirmedGuests / totalGuests) * 100 || 0} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {confirmedGuests} {t("confirmedOf")} {totalGuests}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("budget")}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalBudget.toLocaleString()}</div>
            <Progress value={(totalDeposit / totalBudget) * 100 || 0} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {t("deposits")}: ₪{totalDeposit.toLocaleString()} ({((totalDeposit / totalBudget) * 100 || 0).toFixed(0)}
              %)
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("tasks")}</CardTitle>
            <CheckSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <Progress value={(completedTasks / totalTasks) * 100 || 0} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((completedTasks / totalTasks) * 100 || 0).toFixed(0)}% {t("tasksCompleted")}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("upcomingEvents")}</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <span className="text-sm">{event.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {event.date}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("noUpcomingEvents")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="charts">{t("dataAndCharts")}</TabsTrigger>
          <TabsTrigger value="tasks">{t("recentTasks")}</TabsTrigger>
        </TabsList>
        <TabsContent value="charts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg">{t("guestDistribution")}</CardTitle>
                <CardDescription>{t("byRelation")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
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
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg">{t("budgetByCategory")}</CardTitle>
                <CardDescription>{t("plannedVsActual")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetCategoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="planned" fill="#FF6B8B" name={t("plannedBudget")} />
                      <Bar dataKey="deposit" fill="#46CDCF" name={t("deposits")} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tasks">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">{t("recentTasks")}</CardTitle>
              <CardDescription>{t("upcomingTasks")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckSquare className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning" />
                        )}
                        <div>
                          <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <Badge variant={task.completed ? "success" : "outline"} className="text-xs">
                        {task.dueDate}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">{t("noTasksToDisplay")}</p>
                )}

                {tasks.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/tasks">{t("viewAllTasks")}</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="overflow-hidden border-none shadow-card bg-gradient-to-r from-secondary to-secondary/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-primary" />
            <CardTitle>{t("weddingTip")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{t("weddingTipContent")}</p>
        </CardContent>
      </Card>
      {!demoMode && <SaveDataButton data={weddingData} collectionName="weddings" documentId={user?.uid || ""} />}
    </div>
  )
}

