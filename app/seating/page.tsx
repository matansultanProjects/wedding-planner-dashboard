"use client"

import { MainLayout } from "@/components/main-layout"
import { SeatingArrangement } from "@/components/seating-arrangement"
import { useState, useEffect } from "react"

export default function SeatingPage() {
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    // Check if we're in a shared view
    const sharedView = localStorage.getItem("viewingSharedWedding") === "true"
    setIsSharedView(sharedView)
  }, [])

  return (
    <MainLayout isSharedView={isSharedView}>
      <SeatingArrangement isSharedView={isSharedView} />
    </MainLayout>
  )
}

