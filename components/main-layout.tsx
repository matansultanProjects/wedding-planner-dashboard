"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  ArrowLeft,
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
import { SupportChat } from "./support-chat"
import { ShareLink } from "./share-link"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { href: "/dashboard", label: "לוח בקרה", icon: Home },
  { href: "/wedding-details", label: "פרטי חתונה", icon: Heart },
  { href: "/guests", label: "רשימת אורחים", icon: Users },
  { href: "/seating", label: "סידורי הושבה", icon: Users },
  { href: "/budget", label: "תקציב", icon: DollarSign },
  { href: "/tasks", label: "משימות", icon: CheckSquare },
  { href: "/timeline", label: "ציר זמן", icon: Clock },
  { href: "/vendors", label: "ספקים", icon: Briefcase },
  { href: "/settings", label: "הגדרות", icon: Settings },
]

interface MainLayoutProps {
  children: React.ReactNode
  isSharedView?: boolean
}

export function MainLayout({ children, isSharedView = false }: MainLayoutProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut, demoMode } = useAuth()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const exitSharedView = () => {
    localStorage.removeItem("viewingSharedWedding")
    localStorage.removeItem("sharedWeddingId")
    router.push("/dashboard")
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/10">
        <motion.header
          className={cn(
            "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            scrollY > 0 && "border-b shadow-sm",
          )}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                  <nav className="flex flex-col h-full">
                    <div className="p-6 border-b">
                      <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <Calendar className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">wedfull - מתכנן החתונה שלך</span>
                      </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-6">
                      <AnimatePresence>
                        {navItems.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center gap-3 px-6 py-3 text-base font-medium transition-colors hover:bg-secondary",
                                  pathname === item.href ? "text-primary bg-secondary" : "text-muted-foreground",
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <Icon className="h-5 w-5" />
                                {item.label}
                              </Link>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary hidden md:block" />
                <span className="text-xl font-bold gradient-text">wedfull - מתכנן החתונה שלך</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {isSharedView && (
                <Button variant="outline" size="sm" onClick={exitSharedView} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  חזור לחתונה שלי
                </Button>
              )}

              {!isSharedView && !demoMode && <ShareLink />}

              <nav className="hidden md:flex items-center space-x-1">
                <AnimatePresence>
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
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
                      <AvatarFallback>א</AvatarFallback>
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
                  <DropdownMenuItem>
                    <Link href="/settings" className="w-full">
                      הגדרות
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>התנתקות</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>
        <main className="flex-1 container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
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
        <SupportChat />
      </div>
    </AuthGuard>
  )
}

