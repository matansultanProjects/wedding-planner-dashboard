"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AuthGuard } from "./auth-guard"

const navItems = [
  { href: "/", label: "סקירה כללית" },
  { href: "/wedding-details", label: "פרטי החתונה" },
  { href: "/guests", label: "רשימת אורחים" },
  { href: "/seating", label: "סידורי הושבה" },
  { href: "/budget", label: "תקציב" },
  { href: "/tasks", label: "משימות" },
  { href: "/timeline", label: "ציר זמן" },
  { href: "/vendors", label: "ספקים" },
  { href: "/settings", label: "הגדרות" },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === item.href ? "text-primary" : "text-muted-foreground",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/" className="text-2xl font-bold gradient-text">
                מתכנן החתונה שלך
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="animate-pulse"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </header>
        <main className="flex-1 container py-8">
          <div className="animate-fade-in">{children}</div>
        </main>
        <footer className="border-t py-6 md:px-8">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ for your special day
            </p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}

