"use client"

import { MainLayout } from "@/components/main-layout"
import { Budget } from "@/components/budget"
import { useState, useEffect } from "react"

export default function BudgetPage() {
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    // Check if we're in a shared view
    const sharedView = localStorage.getItem("viewingSharedWedding") === "true"
    setIsSharedView(sharedView)
  }, [])

  return (
    <MainLayout isSharedView={isSharedView}>
      <Budget isSharedView={isSharedView} />
    </MainLayout>
  )
}

