import { CalendarHeart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings as CustomSettings } from "@/components/settings"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">
          <CalendarHeart className="inline-block ml-2" />
          מתכנן החתונה שלך
        </h1>
        <p className="text-lg text-muted-foreground">נהל את כל פרטי החתונה שלך במקום אחד</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">הגדרות</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הגדרות</DialogTitle>
          </DialogHeader>
          <CustomSettings />
        </DialogContent>
      </Dialog>
    </div>
  )
}

