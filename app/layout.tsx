import type React from "react"
import "@/app/globals.css"
import { Rubik, Heebo } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

// Load Heebo font with Hebrew and Latin subsets
const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Load Rubik font with Hebrew and Latin subsets
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: "wedfull - מתכנן החתונה שלך | Wedding Planner Dashboard",
  description: "פלטפורמה מקיפה לתכנון חתונה מושלמת",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${heebo.variable} ${rubik.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'