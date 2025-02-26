import type { Guest, Task, BudgetItem, Vendor, WeddingDetails } from "./types"

function isLocalStorageAvailable() {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

// Use this function before any local storage operations
console.log("Local Storage available:", isLocalStorageAvailable())

const STORAGE_KEY = "weddingPlannerData"

interface StorageData {
  guests: Guest[]
  tasks: Task[]
  budgetItems: BudgetItem[]
  vendors: Vendor[]
  weddingDetails: WeddingDetails
}

function saveData(key: string, data: any) {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(data))
    } else {
      sessionStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

function getData(key: string) {
  try {
    const data = isLocalStorageAvailable() ? localStorage.getItem(key) : sessionStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error retrieving data:", error)
    return null
  }
}

export function saveToLocalStorage(data: Partial<StorageData>) {
  const currentData = getFromLocalStorage()
  const newData = { ...currentData, ...data }
  saveData(STORAGE_KEY, newData)
}

export function getFromLocalStorage(): StorageData {
  return (
    getData(STORAGE_KEY) || {
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
  )
}

export function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("Local storage cleared successfully")
  } catch (error) {
    console.error("Error clearing local storage:", error)
  }
}

