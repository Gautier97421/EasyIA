"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, BookOpen, Clock, Search, Filter, ArrowLeft, Settings, Lock } from "lucide-react"
import Link from "next/link"
import { getGuides, getIntroGuide } from "@/lib/auth-supabase"
import type { Guide, IntroGuide } from "@/lib/types"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [introGuide, setIntroGuide] = useState<IntroGuide | null>(null)
  const { user, profile, loading, isAdmin, hasCompletedIntro } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      const allGuides = await getGuides()
      setGuides(allGuides)
      setFilteredGuides(allGuides)

      const guide = await getIntroGuide()
      setIntroGuide(guide)
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = guides

    if (searchTerm) {
      filtered = filtered.filter(
        (guide) =>
          guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((guide) => guide.level === levelFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((guide) => guide.category === categoryFilter)
    }

    setFilteredGuides(filtered)
  }, [guides, searchTerm, levelFilter, categoryFilter])

  const categories = Array.from(new Set(guides.map((guide) => guide.category)))

  const getLevelColor = (level: string) => {
    switch (level) {
      case "débutant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermédiaire":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "avancé":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isCourseLocked = () => {
    return user && profile?.role === "user" && !hasCompletedIntro
  }

  const shouldShowIntro = () => {
    return user && profile?.role === "user" && !hasCompletedIntro
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-purple-900">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Cours Écrits</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez nos cours écrits détaillés étape par étape pour maîtriser l'IA
          </p>
        </div>

        {/* Introduction Course - Only for users who haven't completed it */}
        {shouldShowIntro() && introGuide && (
          <div className="mb-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Commencez par ici !</h2>
              <p className="text-blue-700 dark:text-blue-300">
                Avant d'accéder aux cours, veuillez lire notre guide d'introduction obligatoire.
              </p>
            </div>

            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center"
                  alt={introGuide.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">Obligatoire</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">{introGuide.title}</CardTitle>
                <CardDescription>{introGuide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {introGuide.readTime} min de lecture
                  </div>
                  <Badge variant="outline">Introduction</Badge>
                </div>
                <Link href="/intro">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Commencer l'introduction
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isCourseLocked()}
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter} disabled={isCourseLocked()}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="débutant">Débutant</SelectItem>
                <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={isCourseLocked()}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              className={`hover:shadow-xl transition-all duration-300 hover:scale-105 group ${isCourseLocked() ? "opacity-60" : ""}`}
            >
              <div className="relative">
                <img
                  src={
                    guide.thumbnail ||
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=center" ||
                    "/placeholder.svg"
                  }
                  alt={guide.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=center"
                  }}
                />
                {isCourseLocked() && (
                  <div className="absolute inset-0 bg-black/70 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Terminez l'introduction</p>
                    </div>
                  </div>
                )}
                {!isCourseLocked() && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <BookOpen className="h-6 w-6 mr-2" />
                      Lire
                    </Button>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle
                    className={`text-lg transition-colors ${!isCourseLocked() ? "group-hover:text-blue-600" : ""}`}
                  >
                    {guide.title}
                  </CardTitle>
                  <Badge className={getLevelColor(guide.level)}>{guide.level}</Badge>
                </div>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {guide.read_time} min de lecture
                  </div>
                  <Badge variant="outline">{guide.category}</Badge>
                </div>
                {user ? (
                  isCourseLocked() ? (
                    <Button className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" />
                      Cours verrouillé
                    </Button>
                  ) : (
                    <Link href={`/guides/${guide.id}`}>
                      <Button className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Commencer le cours
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link href="/login">
                    <Button className="w-full" variant="outline">
                      Se connecter pour lire
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun cours trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
}
