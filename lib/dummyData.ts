import type { WeddingDetails, Guest, Task, BudgetItem, Vendor, TimelineEvent } from "./types"

export const dummyWeddingDetails: WeddingDetails = {
  groomName: "ישראל",
  brideName: "ישראלה",
  date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(), // 6 months from now
  venue: "אולם האחוזה",
  estimatedGuests: 200,
}

export const dummyGuests: Guest[] = [
  {
    id: "1",
    fullName: "דוד כהן",
    phoneNumber: "050-1234567",
    relation: "משפחה",
    invitedCount: 4,
    confirmed: "כן",
    specialNotes: "אלרגי לאגוזים",
  },
  {
    id: "2",
    fullName: "רחל לוי",
    phoneNumber: "052-7654321",
    relation: "חברים",
    invitedCount: 2,
    confirmed: "אולי",
    specialNotes: "",
  },
  {
    id: "3",
    fullName: "יוסי גולדברג",
    phoneNumber: "054-9876543",
    relation: "עבודה",
    invitedCount: 1,
    confirmed: "לא",
    specialNotes: "צמחוני",
  },
  // Add more dummy guests...
]

export const dummyTasks: Task[] = [
  {
    id: "1",
    title: "בחירת שמלת כלה",
    description: "קביעת תורים למדידות",
    dueDate: "2023-08-15",
    completed: true,
    category: "הכנות",
  },
  {
    id: "2",
    title: "הזמנת די-ג'יי",
    description: "לבדוק המלצות ולסגור חוזה",
    dueDate: "2023-09-01",
    completed: false,
    category: "ספקים",
  },
  {
    id: "3",
    title: "סידורי הושבה",
    description: "תכנון סידורי הישיבה לאורחים",
    dueDate: "2023-10-20",
    completed: false,
    category: "תכנון",
  },
  // Add more dummy tasks...
]

export const dummyBudgetItems: BudgetItem[] = [
  { id: "1", category: "אולם", description: "מקדמה לאולם", estimatedCost: 20000, actualCost: 20000 },
  { id: "2", category: "קייטרינג", description: "תשלום ראשון לקייטרינג", estimatedCost: 30000, actualCost: 28000 },
  { id: "3", category: "שמלת כלה", description: "תשלום מקדמה לשמלה", estimatedCost: 8000, actualCost: 7500 },
  // Add more dummy budget items...
]

export const dummyVendors: Vendor[] = [
  {
    id: "1",
    name: "אולם האחוזה",
    category: "אולם",
    contact: "שרה",
    phone: "03-1234567",
    email: "ahuzah@example.com",
    status: "מאושר",
    rating: 5,
  },
  {
    id: "2",
    name: "הקייטרינג של יוסי",
    category: "קייטרינג",
    contact: "יוסי",
    phone: "054-7654321",
    email: "yossi@example.com",
    status: "מאושר",
    rating: 4,
  },
  {
    id: "3",
    name: "צלמים מקצוענים",
    category: "צילום",
    contact: "דנה",
    phone: "052-9876543",
    email: "dana@example.com",
    status: "בתהליך",
    rating: 0,
  },
  // Add more dummy vendors...
]

export const dummyTimelineEvents: TimelineEvent[] = [
  { id: "1", title: "פגישה עם מעצבת שמלות", date: "2023-08-10", status: "upcoming" },
  { id: "2", title: "טעימות אצל הקייטרינג", date: "2023-09-05", status: "upcoming" },
  { id: "3", title: "הכנת הזמנות", date: "2023-09-20", status: "warning" },
  // Add more dummy timeline events...
]

