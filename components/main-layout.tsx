"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Moon,
  Sun,
  Menu,
  Home,
  Users,
  Calendar,
  DollarSign,
  CheckSquare,
  Clock,
  Briefcase,
  Settings,
  Heart,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AuthGuard } from "./auth-guard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/dashboard", label: "סקירה כללית", icon: Home },
  { href: "/wedding-details", label: "פרטי החתונה", icon: Heart },
  { href: "/guests", label: "רשימת אורחים", icon: Users },
  { href: "/seating", label: "סידורי הושבה", icon: Users },
  { href: "/budget", label: "תקציב", icon: DollarSign },
  { href: "/tasks", label: "משימות", icon: CheckSquare },
  { href: "/timeline", label: "ציר זמן", icon: Clock },
  { href: "/vendors", label: "ספקים", icon: Briefcase },
  { href: "/settings", label: "הגדרות", icon: Settings },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { user, signOut, demoMode } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                      <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <Calendar className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">wedfull - מתכנן החתונה שלך</span>
                      </Link>
                    </div>
                    <nav className="flex flex-col p-6 space-y-6 flex-1">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 text-base font-medium transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>
                    <div className="p-6 border-t mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {user ? (
                              <>
                                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback>G</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user ? user.displayName || user.email : "אורח"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {demoMode && (
                                <Badge variant="outline" className="text-xs">
                                  מצב הדגמה
                                </Badge>
                              )}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary hidden md:block" />
                <span className="text-xl font-bold gradient-text">wedfull - מתכנן החתונה שלך</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center space-x-1 mr-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    {user ? (
                      <>
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback>G</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user ? user.displayName || user.email : "אורח"}
                    {demoMode && (
                      <Badge variant="outline" className="mr-2 text-xs">
                        מצב הדגמה
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">הגדרות</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>התנתק</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8">
          <div className="animate-fade-in">{children}</div>
        </main>
        <footer className="border-t py-6 bg-muted/30">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">wedfull - מתכנן החתונה שלך</p>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-right">
              נבנה באהבה עבור היום המיוחד שלכם ❤️
            </p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}

