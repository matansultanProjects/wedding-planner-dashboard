export interface Guest {
  id: string
  fullName: string
  phoneNumber: string
  relation: "משפחה" | "חברים" | "עבודה"
  invitedCount: number
  confirmed: "כן" | "לא" | "אולי"
  specialNotes: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  category: string
}

export interface BudgetItem {
  id: string
  category: string
  description: string
  estimatedCost: number
  actualCost: number
}

export interface Vendor {
  id: string
  name: string
  category: string
  contact: string
  phone: string
  email: string
  status: "מאושר" | "בתהליך" | "לא מאושר"
  rating: number
}

export interface WeddingDetails {
  groomName: string
  brideName: string
  date: string
  venue: string
  estimatedGuests: number
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  status: "completed" | "upcoming" | "warning"
}

