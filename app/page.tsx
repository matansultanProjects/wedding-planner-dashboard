"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

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

export default function LandingPage() {
  return (
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
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">זוגות מספרים</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full card-hover">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="text-yellow-400">{"★".repeat(testimonial.rating)}</div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </Card>
            </motion.div>
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
  )
}

