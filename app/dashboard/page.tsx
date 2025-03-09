"use client"

import { MainLayout } from "@/components/main-layout"
import { Overview } from "@/components/overview"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    // Check if we're in a shared view - only run on client side
    if (typeof window !== "undefined") {
      const sharedView = localStorage.getItem("viewingSharedWedding") === "true"
      setIsSharedView(sharedView)
      console.log("Dashboard page - shared view:", sharedView)
    }
  }, [])

  return (
    <MainLayout isSharedView={isSharedView}>
      <Overview isSharedView={isSharedView} />
    </MainLayout>
  )
}

