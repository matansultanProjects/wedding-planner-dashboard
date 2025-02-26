"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, CalendarIcon, Users, ArrowRight, ArrowLeft } from "lucide-react"
import type { WeddingDetails } from "@/lib/types"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"
import { useAuth } from "@/components/auth-provider"
import { dummyWeddingDetails } from "@/lib/dummyData"

const steps = [
  { id: 1, title: "פרטים בסיסיים", icon: Heart },
  { id: 2, title: "תאריך ומיקום", icon: CalendarIcon },
  { id: 3, title: "פרטי אירוע", icon: Users },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, demoMode } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>(dummyWeddingDetails)

  useEffect(() => {
    if (demoMode) {
      // Skip onboarding for demo mode users
      router.push("/dashboard")
    } else if (user) {
      const storedData = getFromLocalStorage()
      if (storedData.weddingDetails) {
        setWeddingDetails(storedData.weddingDetails)
      }
    }
  }, [user, demoMode, router])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      if (!demoMode) {
        saveToLocalStorage({ weddingDetails })
      }
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return weddingDetails.groomName && weddingDetails.brideName
      case 2:
        return weddingDetails.date
      case 3:
        return weddingDetails.venue && weddingDetails.estimatedGuests > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm hidden md:block">{step.title}</span>
                </div>
              )
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="w-full">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold gradient-text mb-2">ברוכים הבאים!</h1>
                      <p className="text-muted-foreground">בואו נתחיל בהכרות קצרה</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="groomName">שם החתן</Label>
                        <Input
                          id="groomName"
                          placeholder="הכנס את שם החתן"
                          value={weddingDetails.groomName}
                          onChange={(e) => setWeddingDetails({ ...weddingDetails, groomName: e.target.value })}
                          readOnly={demoMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brideName">שם הכלה</Label>
                        <Input
                          id="brideName"
                          placeholder="הכנס את שם הכלה"
                          value={weddingDetails.brideName}
                          onChange={(e) => setWeddingDetails({ ...weddingDetails, brideName: e.target.value })}
                          readOnly={demoMode}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold gradient-text mb-2">מתי החתונה?</h1>
                      <p className="text-muted-foreground">בחרו את התאריך המיוחל</p>
                    </div>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={weddingDetails.date ? new Date(weddingDetails.date) : undefined}
                        onSelect={(date) => date && setWeddingDetails({ ...weddingDetails, date: date.toISOString() })}
                        className="rounded-md border"
                        disabled={demoMode}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold gradient-text mb-2">פרטי האירוע</h1>
                      <p className="text-muted-foreground">כמה פרטים אחרונים ונתחיל!</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="venue">מקום האירוע</Label>
                        <Select
                          value={weddingDetails.venue}
                          onValueChange={(value) => setWeddingDetails({ ...weddingDetails, venue: value })}
                          disabled={demoMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="בחר מקום" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="אולם אירועים">אולם אירועים</SelectItem>
                            <SelectItem value="גן אירועים">גן אירועים</SelectItem>
                            <SelectItem value="חוף הים">חוף הים</SelectItem>
                            <SelectItem value="מקום אחר">מקום אחר</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimatedGuests">מספר אורחים משוער</Label>
                        <Input
                          id="estimatedGuests"
                          type="number"
                          placeholder="הכנס מספר אורחים משוער"
                          value={weddingDetails.estimatedGuests || ""}
                          onChange={(e) =>
                            setWeddingDetails({ ...weddingDetails, estimatedGuests: Number(e.target.value) })
                          }
                          readOnly={demoMode}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="w-32">
                <ArrowLeft className="w-4 h-4 ml-2" />
                הקודם
              </Button>
              <Button onClick={handleNext} disabled={!isStepValid()} className="w-32">
                {currentStep === steps.length ? "סיום" : "הבא"}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step Indicators - Mobile */}
        <div className="mt-4 text-center md:hidden">
          <span className="text-sm text-muted-foreground">
            {steps[currentStep - 1].title} ({currentStep}/{steps.length})
          </span>
        </div>
      </div>
    </div>
  )
}

