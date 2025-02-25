"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

const testimonials = [
  {
    name: "רון ומאיה",
    text: "הפלטפורמה הזו עזרה לנו כל כך בתכנון החתונה שלנו! כל המשימות והספקים במקום אחד.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "דניאל ושירה",
    text: "ממליצים בחום! חסך לנו המון זמן וכאב ראש בתכנון החתונה.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "עידן ונועה",
    text: "הכלי המושלם לניהול אירוע! מאוד אינטואיטיבי ונוח לשימוש.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    name: "עידן ונועה",
    text: "הכלי המושלם לניהול אירוע! מאוד אינטואיטיבי ונוח לשימוש.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  }, {
    name: "עידן ונועה",
    text: "הכלי המושלם לניהול אירוע! מאוד אינטואיטיבי ונוח לשימוש.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  }, {
    name: "עידן ונועה",
    text: "הכלי המושלם לניהול אירוע! מאוד אינטואיטיבי ונוח לשימוש.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
]

const features = [
  {
    title: "ניהול אורחים",
    description: "נהל את רשימת האורחים, אישורי הגעה וסידורי הישיבה בקלות",
    icon: "👥",
  },
  {
    title: "ניהול תקציב",
    description: "עקוב אחר ההוצאות והתשלומים שלך בצורה חכמה",
    icon: "💰",
  },
  {
    title: "ניהול ספקים",
    description: "רכז את כל הספקים, החוזים והתשלומים במקום אחד",
    icon: "📋",
  },
  {
    title: "ניהול משימות",
    description: "קבל תזכורות ועקוב אחר המשימות החשובות לקראת היום הגדול",
    icon: "✅",
  },
]

const comparison = [
  { feature: "ניהול אורחים", platform: "✔", traditional: "✔" },
  { feature: "ניהול תקציב", platform: "✔", traditional: "❌" },
  { feature: "השוואת ספקים", platform: "✔", traditional: "❌" },
  { feature: "חיסכון בזמן וכסף", platform: "✔", traditional: "❌" },
]

const blogPosts = [
  "איך לבחור אולם אירועים בצורה חכמה?",
  "10 טיפים לצמצום תקציב החתונה מבלי להתפשר על איכות",
  "רשימת משימות לחתונה – אל תפספסו אף פרט!"
]

const faqs = [
  "האם אני יכול להשתמש בפלטפורמה בחינם?",
  "איך אני עוקב אחרי תקציב החתונה שלי?",
  "האם אפשר לנהל את כל הספקים במקום אחד?"
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary relative">
      <Link href="https://wa.me/+972502555383" target="_blank" className="fixed bottom-4 right-4 z-50">
        <motion.div whileHover={{ scale: 1.1 }}>
          <img src="https://static-00.iconduck.com/assets.00/whatsapp-icon-1020x1024-iykox85t.png" alt="WhatsApp" className="w-14 h-14 shadow-lg rounded-full" />
        </motion.div>
      </Link>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            תכנון החתונה שלכם
            <br />
            פשוט יותר מתמיד
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            פלטפורמה חכמה לניהול כל פרטי החתונה במקום אחד
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg">
                התחל עכשיו
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg">
                גלה עוד
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>
       {/* About Section */}
   <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">קצת עלינו</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          אנחנו כאן כדי להפוך את תכנון החתונה שלכם לחוויה פשוטה, נוחה ומהנה! הפלטפורמה שלנו מציעה כלים חכמים לניהול האורחים, הספקים, התקציב וכל המשימות החשובות, כך שתוכלו להתמקד במה שבאמת חשוב – לחגוג את היום המיוחד שלכם ללא דאגות.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">כל מה שצריך לתכנון החתונה המושלמת</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full card-hover">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gray-100 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">מה הזוגות אומרים עלינו?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 text-center shadow-lg">
              <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">{testimonial.name}</h3>
              <p className="text-muted-foreground mb-2">{testimonial.text}</p>
              <p className="text-yellow-500">⭐️⭐️⭐️⭐️⭐️</p>
            </Card>
          ))}
        </div>
      </section>
      

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gray-100 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">שאלות נפוצות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6 shadow-md">
              <h3 className="text-lg font-semibold">{faq}</h3>
            </Card>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכנים להתחיל לתכנן את החתונה שלכם?</h2>
          <p className="text-xl text-muted-foreground mb-8">הצטרפו לאלפי זוגות שכבר משתמשים בפלטפורמה שלנו</p>
          <Link href="/login">
            <Button size="lg" className="text-lg">
              צור חשבון בחינם
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2024 מתכנן החתונה שלך. כל הזכויות שמורות.</p>
      </footer>
      </div>
    </div>
  );
}
