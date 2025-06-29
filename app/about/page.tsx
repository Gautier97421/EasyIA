"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Users, Target, Heart, Lightbulb, BookOpen, Play } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { getCourses, getGuides, introGuide } from "@/lib/auth-supabase"
import { UserNav } from "@/components/auth/user-nav"
import { IntroGuide } from "@/lib/types"
import { supabase } from "@/lib/auth-supabase"


export default function AboutPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    courses: 0,
    hours: 0,
    satisfaction: 0,
    users: 0,
  })
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }
  async function fetchSatisfaction() {
    const { data, error } = await supabase.from("reviews").select("*")
    console.log(data, error)
    if (error) {
      console.error("Erreur fetch stats", error)
      return 0
    }
    if (!data || data.length === 0) return 0

    const totalReviews = data.length
    const satisfiedCount = data.filter((r) => (r.rating ?? 0) >= 4).length
    const satisfaction = Math.round((satisfiedCount / totalReviews) * 100)
    return satisfaction
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const courses = await getCourses()
        const guides = await getGuides()
        const introGuides: IntroGuide[] = [introGuide]
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        if (error) {
          console.error("Erreur lors du comptage des utilisateurs :", error)
        }

        const totalUsers = count ?? 0

        const totalCourses = courses.length + guides.length
        const totalHours =
          courses.reduce((acc, course) => acc + course.duration, 0) +
          guides.reduce((acc, guide) => acc + guide.read_time, 0) +
          introGuides.reduce((acc, guide) => acc + guide.readTime, 0)
        const satisfaction = await fetchSatisfaction()
        setStats({
          courses: totalCourses,
          hours: Math.ceil(totalHours / 60),
          satisfaction,
          users: totalUsers,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadData()
  }, [])


  const statsDisplay = [
    {
      label: "Cours disponibles",
      value: `${stats.courses}`,
      icon: BookOpen,
    },
    {
      label: "Utilisateurs",
      value: stats.users > 1000 ? "1000+" : `${stats.users}`,
      icon: Users,
    },
    {
      label: "Heures de contenu",
      value: stats.hours > 100 ? "100+" : `${stats.hours}`,
      icon: Play,
    },
    {
      label: "Satisfaction",
      value: `${stats.satisfaction}%`,
      icon: Heart,
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Accessibilité",
      description: "Rendre l'IA compréhensible pour tous, sans prérequis techniques",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900",
    },
    {
      icon: Heart,
      title: "Bienveillance",
      description: "Créer un environnement d'apprentissage positif et encourageant",
      color: "bg-red-100 text-red-600 dark:bg-red-900",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Proposer des méthodes d'apprentissage modernes et efficaces",
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900",
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Favoriser l'entraide et le partage de connaissances",
      color: "bg-green-100 text-green-600 dark:bg-green-900",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-purple-900">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <ThemeToggle />
                <Link href="/" className="flex items-center space-x-2 ml-4 hover:opacity-80 transition-opacity">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold">EasyIA</span>
                </Link>  
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="text-muted-foreground hover:text-blue-600 transition-colors">
                Cours Vidéo
              </Link>
              <Link href="/guides" className="text-muted-foreground hover:text-blue-600 transition-colors">
                Cours Écrits
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
            À propos de nous
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-6">
            La mission : démocratiser l'
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Intelligence Artificielle
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            EasyIA est née d'une conviction simple : l'Intelligence Artificielle ne doit plus être réservée aux experts.
            Nous croyons que chacun peut apprendre à utiliser l'IA pour améliorer son quotidien professionnel.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {statsDisplay.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About site */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">À propos du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EasyIA est une toute nouvelle plateforme dédiée à rendre l'intelligence artificielle accessible et utile dans le monde professionnel.
              </p>
              <p>
                L'objectif est de proposer des contenus simples, pratiques, et directement applicables, même si vous n'avez pas de connaissances techniques avancées.
              </p>
              <p>
                Ce site est en constante évolution, et chaque jour nous travaillons à enrichir l’offre avec de nouveaux cours, guides et ressources adaptés aux besoins des utilisateurs.
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Les valeurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre approche pédagogique et notre développement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse`}
                  >
                    <value.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section - Supprimé le bouton "Voir les cours" */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Rejoignez notre communauté</CardTitle>
              <CardDescription className="text-blue-100">
                Commencez votre apprentissage de l'IA dès aujourd'hui avec nos cours gratuits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  )
}
