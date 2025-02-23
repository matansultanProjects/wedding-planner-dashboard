import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyApTQtlJhZpnioYFNxH8QxErIInHGJ3YrY",
  authDomain: "wedplan-47305.firebaseapp.com",
  projectId: "wedplan-47305",
  storageBucket: "wedplan-47305.firebasestorage.app",
  messagingSenderId: "347009449801",
  appId: "1:347009449801:web:2302bbf5292289e787e498",
  measurementId: "G-PTYFZ3EQGN",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

// Initialize Analytics and get a reference to the service
let analytics = null
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)))
}

export { app, auth, analytics }

