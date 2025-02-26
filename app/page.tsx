"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CalendarHeart, Check, ArrowRight } from "lucide-react"

const testimonials = [
  {
    name: "רון ומאיה" ,
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
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-center mb-6">
            <CalendarHeart className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            תכנון החתונה שלכם
            <br />
            פשוט יותר מתמיד
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            פלטפורמה חכמה לניהול כל פרטי החתונה במקום אחד
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-12">
                התחל עכשיו
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                גלה עוד
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">כל מה שצריך לתכנון החתונה המושלמת</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-none shadow-card h-full card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-4xl mb-4 bg-secondary rounded-full w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">למה לבחור בנו?</h2>
            <div className="space-y-4">
              {[
                "ממשק משתמש נוח ואינטואיטיבי",
                "גישה מכל מקום ומכל מכשיר",
                "תבניות מוכנות מראש לתכנון מהיר",
                "התראות ותזכורות חכמות",
                "שיתוף פעולה עם בן/בת הזוג וספקים",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/login">
                <Button className="gap-2">
                  התחל לתכנן עכשיו
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-r from-primary/90 to-pink-500/90 rounded-2xl shadow-card flex items-center justify-center">
              <CalendarHeart className="h-24 w-24 text-white" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-card p-4 max-w-xs">
              <p className="text-sm font-medium">"תכנון החתונה שלנו היה פשוט וקל בזכות הכלי הנהדר הזה!"</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">זוגות מספרים</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-none shadow-card h-full card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-primary/20"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <div className="text-yellow-400">{"★".repeat(testimonial.rating)}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכנים להתחיל לתכנן את החתונה שלכם?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            הצטרפו לאלפי זוגות שכבר משתמשים בפלטפורמה שלנו
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 h-12">
              צור חשבון בחינם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CalendarHeart className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">מתכנן החתונה שלך</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 מתכנן החתונה שלך. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  )
}

