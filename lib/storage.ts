import type { Guest, Task, BudgetItem, Vendor, WeddingDetails } from "./types"

const STORAGE_KEY = "weddingPlannerData"

interface StorageData {
  guests: Guest[]
  tasks: Task[]
  budgetItems: BudgetItem[]
  vendors: Vendor[]
  weddingDetails: WeddingDetails
}

export function saveToLocalStorage(data: Partial<StorageData>) {
  const currentData = getFromLocalStorage()
  const newData = { ...currentData, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
}

export function getFromLocalStorage(): StorageData {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    return JSON.parse(data)
  }
  return {
    guests: [],
    tasks: [],
    budgetItems: [],
    vendors: [],
    weddingDetails: {
      groomName: "",
      brideName: "",
      date: "",
      venue: "",
      estimatedGuests: 0,
    },
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

