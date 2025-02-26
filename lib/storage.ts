import type { Guest, Task, BudgetItem, Vendor, WeddingDetails } from "./types"

console.log("Local Storage available:", typeof Storage !== "undefined")
console.log("Current Local Storage content:", localStorage)

const STORAGE_KEY = "weddingPlannerData"

interface StorageData {
  guests: Guest[]
  tasks: Task[]
  budgetItems: BudgetItem[]
  vendors: Vendor[]
  weddingDetails: WeddingDetails
}

export function saveToLocalStorage(data: Partial<StorageData>) {
  console.log("Attempting to save data:", data)
  const currentData = getFromLocalStorage()
  const newData = { ...currentData, ...data }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    console.log("Data saved successfully")
  } catch (error) {
    console.error("Error saving to local storage:", error)
  }
}

export function getFromLocalStorage(): StorageData {
  console.log("Attempting to retrieve data from local storage")
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    console.log("Data retrieved successfully")
    return JSON.parse(data)
  }
  console.log("No data found in local storage")
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

