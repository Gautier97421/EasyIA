"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, User, Calendar, Star, Play, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/hooks/use-auth"
import { getUserProgress, getUserFavorites, getCourses, getGuides } from "@/lib/auth-supabase"
import type { Course, Guide } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0)
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([])
  const [favoriteGuides, setFavoriteGuides] = useState<Guide[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const progress = await getUserProgress(user.id)
        const completed = progress.filter((p) => p.completed)
        setCompletedCoursesCount(completed.length)
      }
    }

    loadProgress()
  }, [user])

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          setLoadingFavorites(true)

          // Charger les favoris
          const favorites = await getUserFavorites(user.id)

          // Séparer les cours et guides favoris
          const favoriteCourseIds = favorites.filter((f) => f.course_id).map((f) => f.course_id!)

          const favoriteGuideIds = favorites.filter((f) => f.guide_id).map((f) => f.guide_id!)

          // Charger tous les cours et guides
          const [allCourses, allGuides] = await Promise.all([getCourses(), getGuides()])

          // Filtrer pour ne garder que les favoris
          const favCourses = allCourses.filter((course) => favoriteCourseIds.includes(course.id))

          const favGuides = allGuides.filter((guide) => favoriteGuideIds.includes(guide.id))

          setFavoriteCourses(favCourses)
          setFavoriteGuides(favGuides)
        } catch (error) {
          console.error("Error loading favorites:", error)
        } finally {
          setLoadingFavorites(false)
        }
      }
    }

    loadFavorites()
  }, [user])

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder à votre profil.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  const totalFavorites = favoriteCourses.length + favoriteGuides.length

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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Informations de votre compte</p>
        </div>

        <div className="grid gap-6">
          {/* Informations personnelles et statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations et statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email :</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rôle :</span>
                  <span className="capitalize font-medium">{profile?.role || "Utilisateur"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{completedCoursesCount}</div>
                  <div className="text-sm text-muted-foreground">Cours terminés</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{totalFavorites}</div>
                  <div className="text-sm text-muted-foreground">Favoris</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile?.hasCompletedIntro ? "✓" : "✗"}</div>
                  <div className="text-sm text-muted-foreground">Introduction</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mes Favoris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Mes Favoris ({totalFavorites})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFavorites ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement des favoris...</p>
                </div>
              ) : totalFavorites === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucun favori pour le moment</p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/courses">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Cours Vidéo
                      </Button>
                    </Link>
                    <Link href="/guides">
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Cours Écrits
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cours Vidéo Favoris */}
                  {favoriteCourses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Play className="h-5 w-5 text-blue-600" />
                        Cours Vidéo ({favoriteCourses.length})
                      </h3>
                      <div className="grid gap-3">
                        {favoriteCourses.map((course) => (
                          <Link key={course.id} href={`/courses/${course.id}`}>
                            <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                              <div className="relative">
                                <img
                                  src={"/img_IA.jpg"}
                                  alt={course.title}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{course.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {course.level}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{course.duration} min</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cours Écrits Favoris */}
                  {favoriteGuides.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        Cours Écrits ({favoriteGuides.length})
                      </h3>
                      <div className="grid gap-3">
                        {favoriteGuides.map((guide) => (
                          <Link key={guide.id} href={`/guides/${guide.id}`}>
                            <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                              <div className="relative">
                                <img
                                  src={guide.thumbnail || "/placeholder.svg?height=60&width=80"}
                                  alt={guide.title}
                                  className="w-20 h-15 object-cover rounded"
                                />
                                <div className="absolute top-1 right-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{guide.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {guide.level}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {guide.read_time} min de lecture
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membre depuis :</span>
                <span>{"createdAt" in user && user.createdAt ? new Date(user.createdAt as string).toLocaleDateString("fr-FR") : "Inconnu"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
