"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Users, Settings, Heart, Target, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/hooks/use-auth"

export default function CarrierePage() {
  const router = useRouter()
  const { user, profile, isAdmin } = useAuth()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Je suis passionné par l'IA et son potentiel pour transformer l'éducation",
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Je crois en la force de la communauté et du partage de connaissances",
    },
    {
      icon: Target,
      title: "Accessibilité",
      description: "Je m'engage à rendre l'IA accessible à tous, sans barrière technique",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Je cherche constamment à améliorer l'expérience d'apprentissage",
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
              <div className="flex items-center space-x-2 ml-4">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">EasyIA</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="text-muted-foreground hover:text-blue-600 transition-colors">
                Cours Vidéo
              </Link>
              <Link href="/guides" className="text-muted-foreground hover:text-blue-600 transition-colors">
                Cours Écrits
              </Link>
              <div className="flex items-center space-x-2">
                {user && profile ? (
                  <UserNav user={{ ...user, name: profile.name, role: profile.role }} />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Inscription</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">À propos d'EasyIA</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'histoire et la vision derrière cette plateforme d'apprentissage de l'Intelligence Artificielle
          </p>
        </div>

        {/* About the Creator */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">À propos du créateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bonjour ! Je suis le créateur d'EasyIA, une plateforme que j'ai développée seul avec la passion de
                démocratiser l'accès à l'Intelligence Artificielle.
              </p>
              <p>
                Avec une formation en développement web et une expertise en IA, j'ai créé EasyIA pour partager mes
                connaissances et aider les professionnels à intégrer l'IA dans leur quotidien, sans avoir besoin de
                compétences techniques avancées.
              </p>
              <p>
                Ce projet est né de ma conviction que l'IA devrait être accessible à tous, et non réservée aux experts.
                Je travaille constamment à l'amélioration de la plateforme et à la création de nouveaux contenus
                pédagogiques.
              </p>
              <p>
                EasyIA n'est pas qu'une simple plateforme de cours, c'est un projet personnel qui reflète ma passion
                pour l'éducation et l'innovation technologique. Chaque cours, chaque guide est pensé pour être
                accessible, pratique et immédiatement applicable dans votre travail quotidien.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Mes valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Ma mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">
                Rendre l'Intelligence Artificielle accessible à tous les professionnels, quel que soit leur niveau
                technique.
              </p>
              <p>
                Je crois fermement que l'IA ne devrait pas être réservée aux développeurs et aux data scientists. Avec
                les bons outils et les bonnes explications, tout le monde peut tirer parti de cette technologie
                révolutionnaire.
              </p>
              <p>
                Mon objectif est de créer des contenus pratiques, concrets et immédiatement applicables pour vous aider
                à intégrer l'IA dans votre quotidien professionnel.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Une question ? Une suggestion ?</CardTitle>
              <CardDescription>
                N'hésitez pas à me contacter pour toute question ou suggestion d'amélioration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button size="lg">Me contacter</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
