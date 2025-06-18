"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Play, Clock, Search, Filter, ArrowLeft, CheckCircle, Lock, Check, BookOpen, Star, X } from "lucide-react"
import Link from "next/link"
import { getCourses, getIntroGuide, markCourseCompleted, unmarkCourseCompleted, getUserProgress,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites, } from "@/lib/auth-supabase"
import type { Course, IntroGuide } from "@/lib/types"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function CoursesPage() {
  function formatReadTime(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ""} de lecture`
    }
    return `${minutes} min de lecture`
  }
  const params = useParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [introGuide, setIntroGuide] = useState<IntroGuide | null>(null)
  const { user, profile, loading, isAdmin, hasCompletedIntro } = useAuth()
  const [sortOrder, setSortOrder] = useState("title_asc")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [courseProgress, setCourseProgress] = useState<Map<string, boolean>>(new Map())
  const [courseFavorites, setCourseFavorites] = useState<Map<string, boolean>>(new Map())
  const [processingFavorite, setProcessingFavorite] = useState<Set<string>>(new Set())
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set())
  const isCourseCompleted = (courseId: string) => completedCourses.has(courseId)
  const router = useRouter()
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const allCourses = await getCourses()
      setCourses(allCourses)
      setFilteredCourses(allCourses)

      const guide = await getIntroGuide()
      setIntroGuide(guide)
      // Charger les progressions et favoris si l'utilisateur est connecté
      if (user) {
        try {
          // Charger les progressions
          const progress = await getUserProgress(user.id)
          const progressMap = new Map<string, boolean>()
          progress.forEach((p) => {
            if (p.course_id) progressMap.set(p.course_id, p.completed)
          })
          setCourseProgress(progressMap)

          // Charger les favoris
          const favorites = await getUserFavorites(user.id)
          const favoritesMap = new Map<string, boolean>()
          favorites.forEach((f) => {
            if (f.course_id) favoritesMap.set(f.course_id, true)
          })
          setCourseFavorites(favoritesMap)
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    }

    loadData()
  }, [user])

  const toggleFavorite = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des cours en favoris.",
        variant: "destructive",
      })
      return
    }

    // Éviter les clics multiples
    if (processingFavorite.has(courseId)) return

    setProcessingFavorite((prev) => new Set(prev).add(courseId))

    try {
      const isFavorite = courseFavorites.get(courseId)

      if (isFavorite) {
        // Retirer des favoris
        await removeFromFavorites(user.id, courseId)
        setCourseFavorites((prev) => {
          const newMap = new Map(prev)
          newMap.delete(courseId)
          return newMap
        })
        toast({
          title: "Retiré des favoris",
          description: "Le cours a été retiré de vos favoris.",
        })
      } else {
        // Ajouter aux favoris
        await addToFavorites(user.id, courseId)
        setCourseFavorites((prev) => {
          const newMap = new Map(prev)
          newMap.set(courseId, true)
          return newMap
        })
        toast({
          title: "Ajouté aux favoris",
          description: "Le cours a été ajouté à vos favoris.",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setProcessingFavorite((prev) => {
        const newSet = new Set(prev)
        newSet.delete(courseId)
        return newSet
      })
    }
  }
  
  // Fonction de tri selon sortOrder
  const sortCourses = (coursesToSort: Course[]) => {
    const sorted = [...coursesToSort]
    switch (sortOrder) {
      case "title_asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title_desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "date_asc":
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "date_desc":
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "level_asc":
        const levels = ["débutant", "intermédiaire", "avancé"]
        sorted.sort((a, b) => levels.indexOf(a.level) - levels.indexOf(b.level))
        break
      case "level_desc":
        const levelsDesc = ["avancé", "intermédiaire", "débutant"]
        sorted.sort((a, b) => levelsDesc.indexOf(a.level) - levelsDesc.indexOf(b.level))
        break
      default:
        break
    }
    return sorted
  }

  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter)
    }
    filtered = sortCourses(filtered)

    setFilteredCourses(filtered)
  }, [courses, searchTerm, levelFilter, categoryFilter, sortOrder])

    useEffect(() => {
    if (!user) return

    const fetchProgress = async () => {
      const progress = await getUserProgress(user.id)
      const completed = progress
        .filter((p) => p.completed && p.course_id)
        .map((p) => p.course_id as string)

      setCompletedCourses(new Set(completed))
    }

    fetchProgress()
  }, [user])

  const categories = Array.from(new Set(courses.map((course) => course.category)))

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

  const isCourseLocked = (): boolean => {
    return !!(user && profile?.role === "user" && !hasCompletedIntro)
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
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <ThemeToggle />
                <Link href="/" className="flex items-center space-x-2 ml-4 hover:opacity-80 transition-opacity">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold">EasyIA</span>
                </Link>  
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/guides" className="text-muted-foreground hover:text-blue-600 transition-colors">
                Cours Écrits
              </Link>
              <div className="flex items-center space-x-2">
                {user && profile ? (
                  <UserNav/>
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Cours Vidéo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apprenez l'IA à votre rythme avec nos formations vidéo interactives
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
                  src="img_IA.jpg"
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
            <Select value={sortOrder} onValueChange={setSortOrder} disabled={isCourseLocked()}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title_asc">Alphabetique ↑</SelectItem>
                <SelectItem value="title_desc">Alphabetique ↓</SelectItem>
                <SelectItem value="date_asc">Date ↑</SelectItem>
                <SelectItem value="date_desc">Date ↓</SelectItem>
                <SelectItem value="level_asc">Difficulté ↑</SelectItem>
                <SelectItem value="level_desc">Difficulté ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className={`hover:shadow-xl transition-all duration-300 hover:scale-105 group
                ${isCourseLocked() ? "opacity-60" : ""}
              `}
              style={
                isCourseCompleted(course.id)
                  ? {
                      backgroundImage: 'repeating-linear-gradient(45deg, rgba(34,197,94,0.15) 0, rgba(34,197,94,0.15) 2px, transparent 5px, transparent 10px)',
                      border: '1px solid #22c55e'
                    }
                  : {}
              }
            >
              <div className="relative">
                <img
                  src={
                    course.thumbnail ||
                    "/img_IA.jpg"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/img_IA.jpg"
                  }}

                />
                {isCourseCompleted(course.id) && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg z-10">
                    <Check className="inline h-4 w-4 mr-1" />
                    Terminé
                  </div>
                )}
                {courseFavorites.get(course.id) && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 text-white cursor-default hover:bg-yellow-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Favori
                    </Badge>
                  </div>
                )}
                {isCourseLocked() && (
                  <div className="absolute inset-0 bg-black/70 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Terminez l'introduction</p>
                    </div>
                  </div>
                )}
                {!isCourseLocked() && (
                  <Link href={`/courses/${course.id}`} className="absolute inset-0 rounded-t-lg">
                    <div className="bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full flex items-center justify-center rounded-t-lg">
                      <Button
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 pointer-events-none"
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Regarder
                      </Button>
                    </div>
                  </Link>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle
                    className={`text-lg transition-colors ${!isCourseLocked() ? "group-hover:text-blue-600" : ""}`}>
                    {course.title}
                  </CardTitle>
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                </div>
                <CardDescription>{course.description}</CardDescription>

              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatReadTime(course.duration)}
                  </div>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                {user ? (
                  isCourseLocked() ? (
                    <Button className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" />
                      Cours verrouillé
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${courseFavorites.get(course.id) ? "bg-red-600 hover:bg-red-700": "bg-yellow-600 hover:bg-yellow-700"}`}
                      onClick={() => toggleFavorite(course.id)}
                      disabled={processingFavorite.has(course.id)}
                    >
                      {processingFavorite.has(course.id) ? (
                        "Traitement..."
                      ) : courseFavorites.get(course.id) ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Retirer des favoris
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Ajouter en favoris
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Link href="/login">
                    <Button className="w-full" variant="outline">
                      Se connecter pour regarder
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun cours trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
}
