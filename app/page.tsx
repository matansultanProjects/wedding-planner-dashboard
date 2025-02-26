"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CalendarHeart, Check, ArrowRight, Star, Users, DollarSign, Clock, Briefcase } from "lucide-react"

const testimonials = [
  {
    name: "רון ומאיה",
    text: "הפלטפורמה הזו עזרה לנו כל כך בתכנון החתונה שלנו! כל המשימות והספקים במקום אחד.",
    image: "/wedfull-logo.png",
    rating: 5,
  },
  {
    name: "דניאל ושירה",
    text: "ממליצים בחום! חסך לנו המון זמן וכאב ראש בתכנון החתונה.",
    image: "/wedfull-logo.png",
    rating: 5,
  },
  {
    name: "עידן ונועה",
    text: "הכלי המושלם לניהול אירוע! מאוד אינטואיטיבי ונוח לשימוש.",
    image: "/wedfull-logo.png",
    rating: 5,
  },
]

const features = [
  {
    title: "ניהול אורחים",
    description: "נהל את רשימת האורחים, אישורי הגעה וסידורי הישיבה בקלות",
    icon: Users,
  },
  {
    title: "ניהול תקציב",
    description: "עקוב אחר ההוצאות והתשלומים שלך בצורה חכמה",
    icon: DollarSign,
  },
  {
    title: "ניהול ספקים",
    description: "רכז את כל הספקים, החוזים והתשלומים במקום אחד",
    icon: Briefcase,
  },
  {
    title: "ניהול משימות",
    description: "קבל תזכורות ועקוב אחר המשימות החשובות לקראת היום הגדול",
    icon: Clock,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/70 to-secondary/30">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-primary/90 to-pink-500/90 container mx-auto px-4 py-6" >
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/12-removebg-preview.png" alt="Wedfull Logo" width={100} height={100} />
            <span className="text-2xl font-bold gradient-text-black">Wedfull</span>
          </Link>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">התחברות</Button>
            </Link>
           
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            תכנון החתונה שלכם
            <br />
            פשוט יותר מתמיד
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            פלטפורמה חכמה לניהול כל פרטי החתונה במקום אחד, מותאמת במיוחד לזוגות ישראלים
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-12 animate-pulse">
                התחל עכשיו בחינם
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
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 gradient-text">
          כל מה שצריך לתכנון החתונה המושלמת
        </h2>
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
                  <div className="text-4xl mb-4 bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center">
                    <feature.icon className="h-8 w-8" />
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
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">למה לבחור ב-Wedfull?</h2>
            <div className="space-y-4">
              {[
                "ממשק משתמש נוח ואינטואיטיבי",
                "גישה מכל מקום ומכל מכשיר",
                "תבניות מוכנות מראש לתכנון מהיר",
                "התראות ותזכורות חכמות",
                "שיתוף פעולה עם בן/בת הזוג וספקים",
                "תמיכה בעברית ובמנהגי חתונות ישראליות",
                "אבטחה מתקדמת לשמירה על פרטיותכם",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p>{benefit}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  התחל לתכנן עכשיו
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="dashboard-preview.png"
              alt="Wedfull Dashboard Preview"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-background rounded-xl shadow-card p-4 max-w-xs">
              <p className="text-sm font-medium">"תכנון החתונה שלנו היה פשוט וקל בזכות Wedfull!"</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 gradient-text">איך זה עובד?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "הירשמו בקלות", description: "צרו חשבון חינמי ב-Wedfull תוך דקות", icon: CalendarHeart },
            { title: "התחילו לתכנן", description: "השתמשו בכלים שלנו לניהול אורחים, תקציב ומשימות", icon: Check },
            { title: "חגגו בגדול", description: "התרכזו בחגיגה בזמן ש-Wedfull מטפל בפרטים הקטנים", icon: Users },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-primary/10 text-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 gradient-text">זוגות מספרים</h2>
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
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4 border-2 border-primary/20"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">מוכנים להתחיל לתכנן את החתונה שלכם?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            הצטרפו לאלפי זוגות שכבר משתמשים ב-Wedfull לתכנון החתונה המושלמת
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 h-12 animate-pulse">
              צור חשבון בחינם
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary/90 to-pink-500/90 container  border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/12-removebg-preview.png" alt="Wedfull Logo" width={150} height={150} className="mr-2" />
            {/* <span className="font-bold text-lg gradient-text">Wedfull</span> */}
          </div>
          <nav className="flex space-x-4 mb-4 md:mb-0">
      
      
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              עזרה ותמיכה 
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook">
              <Image src="/facebook-icon.png" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Image src="/instagram-icon.png" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Image src="/tiktokicon.png" alt="Twitter" width={24} height={24} />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">© 2024 Wedfull. כל הזכויות שמורות.</div>
      </footer>
    </div>
  )
}

