"use client"

import { MainLayout } from "@/components/main-layout"
import { GuestList } from "@/components/guest-list"
import { useState, useEffect } from "react"

export default function GuestsPage() {
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    // Check if we're in a shared view
    const sharedView = localStorage.getItem("viewingSharedWedding") === "true"
    setIsSharedView(sharedView)
  }, [])

  return (
    <MainLayout isSharedView={isSharedView}>
      <GuestList isSharedView={isSharedView} />
    </MainLayout>
  )
}

