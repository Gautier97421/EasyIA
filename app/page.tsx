"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Lightbulb, BookOpen, Play, Target, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { getCourses, getGuides } from "@/lib/auth-supabase"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const { user, isAdmin } = useAuth()
  const [coursesCount, setCoursesCount] = useState(0)
  const [guidesCount, setGuidesCount] = useState(0)

  useEffect(() => {
    // Récupérer les nombres réels de cours et guides
    const loadData = async () => {
      try {
        const courses = await getCourses()
        const guides = await getGuides()
        setCoursesCount(courses.length)
        setGuidesCount(guides.length)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-purple-900 transition-all duration-500">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                <h1 className="text-2xl font-bold text-foreground">EasyIA</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                {/* Bouton "Accueil" supprimé de la page d'accueil */}
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
                >
                  Cours Vidéo
                </Link>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
                >
                  Cours Écrits
                </Link>
              </nav>
              {user ? (
                <UserNav user={user} />
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
      </header>

      {/* Hero Section */}
      <section id="accueil" className="py-20 animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 animate-bounce">
            Formation IA pour tous
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 animate-slide-up">
            Découvrez le potentiel de l'
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
              Intelligence Artificielle
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up-delay">
            Une plateforme simple et accessible pour comprendre comment l'IA peut transformer votre travail quotidien,
            même sans connaissances techniques.
          </p>
          <div className="flex justify-center animate-slide-up-delay-2">
            <Link href="#quick-access">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Commencer l'apprentissage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why AI Section */}
      <section id="pourquoi" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Pourquoi apprendre l'IA maintenant ?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              L'IA n'est plus réservée aux experts. Elle devient un outil quotidien qui peut améliorer votre
              productivité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Gain de productivité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Automatisez les tâches répétitives et concentrez-vous sur ce qui compte vraiment. L'IA peut vous faire
                  gagner plusieurs heures par semaine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Nouvelles idées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  L'IA peut vous aider à brainstormer, résoudre des problèmes complexes et trouver des solutions
                  créatives auxquelles vous n'auriez pas pensé.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Avantage concurrentiel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Les entreprises qui adoptent l'IA prennent de l'avance. Soyez prêt pour l'avenir du travail dès
                  aujourd'hui.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section id="quick-access" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Accès rapide aux ressources</h3>
            <p className="text-lg text-muted-foreground">Choisissez votre format d'apprentissage préféré</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/courses" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-500">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <Play className="h-10 w-10 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl">Cours Vidéo</CardTitle>
                  <CardDescription>Formations interactives et visuelles</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Apprenez à votre rythme avec nos vidéos explicatives, démonstrations pratiques et exercices guidés.
                  </p>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {coursesCount} vidéos disponibles
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/guides" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-green-500">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <BookOpen className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Cours Écrits</CardTitle>
                  <CardDescription>Tutoriels détaillés étape par étape</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Suivez nos cours écrits pratiques avec captures d'écran, exemples concrets et conseils d'experts.
                  </p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {guidesCount} cours disponibles
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Concrete Examples Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Exemples concrets d'utilisation</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment l'IA peut transformer votre quotidien professionnel avec ces cas d'usage réels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-center">Rédaction d'emails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Générez des emails professionnels en quelques secondes. Répondez aux clients, rédigez des propositions
                  commerciales ou des suivis de projet.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Gain de temps : 70%
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-center">Création de contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Créez des articles de blog, des posts sur les réseaux sociaux, des descriptions de produits ou des
                  communiqués de presse.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Productivité x3
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-center">Analyse de données</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Analysez vos données de vente, identifiez des tendances, créez des rapports et obtenez des insights
                  actionnables.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Précision +85%
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Lightbulb className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-center">Support client</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Automatisez les réponses aux questions fréquentes, créez des chatbots intelligents et améliorez la
                  satisfaction client.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Satisfaction +40%
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-center">Planification de projets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Créez des plans de projet détaillés, estimez les délais, identifiez les risques et optimisez les
                  ressources.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Efficacité +60%
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-center">Formation d'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Créez des programmes de formation personnalisés, évaluez les compétences et développez les talents de
                  votre équipe.
                </p>
                <Badge variant="outline" className="w-full justify-center">
                  Engagement +50%
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            Prêt à découvrir le potentiel de l'IA ?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Rejoignez nous et tout nos utilisateurs qui utilisent déjà l'IA pour améliorer leur quotidien
          </p>
          {user ? (
            <Link href="#quick-access">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 animate-bounce-in"
              >
                <Play className="mr-2 h-5 w-5" />
                Accéder à mes cours
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 animate-bounce-in"
              >
                <Users className="mr-2 h-5 w-5" />
                Créer un compte
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">EasyIA</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Votre plateforme d'apprentissage de l'IA, simple et accessible à tous.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground transition-colors">
                    Cours vidéo
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-foreground transition-colors">
                    Cours écrits
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-foreground transition-colors">
                    Guide technique
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/aide" className="hover:text-foreground transition-colors">
                    Aide
                  </Link>
                </li>
                <li>
                  <Link href="/avis" className="hover:text-foreground transition-colors">
                    Avis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/carriere" className="hover:text-foreground transition-colors">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EasyIA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
