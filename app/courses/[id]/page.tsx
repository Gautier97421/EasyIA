"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Clock, Play, CheckCircle, Check, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCourses, markCourseCompleted, getUserProgress, unmarkCourseCompleted } from "@/lib/auth-supabase"
import type { Course } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/auth/user-nav"

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}
const nextCoursesMap: Record<string, string> = {
  "8586ec91-a638-4a4f-b9d3-1fa2710e36bd": "177bf238-3918-450e-95ab-df2cb809e0a8",
  "177bf238-3918-450e-95ab-df2cb809e0a8": "29793b44-19bd-4107-b77f-9fdf1d07ea6e",
  "29793b44-19bd-4107-b77f-9fdf1d07ea6e": "9a79f2e2-2430-4efb-8640-ebcaa81e4530",
}

export default function CourseDetailPage() {
  const params = useParams()
  const currentCourseId = params?.id as string
  const nextCourseId = nextCoursesMap[currentCourseId]
  function formatReadTime(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ""} de lecture`
    }
    return `${minutes} min de lecture`
  }
  const [course, setCourse] = useState<Course | null>(null)
  const { user, profile, loading, isAdmin } = useAuth()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    const loadCourse = async () => {
      const courses = await getCourses()
      const foundCourse = courses.find((c) => c.id === params.id)
      console.log('course.video_url:', foundCourse?.video_url)
      setCourse(foundCourse || null)
    }

    loadCourse()
  }, [params.id])

  useEffect(() => {
    const checkProgress = async () => {
      if (user && params.id && !progressLoaded) {
        const progress = await getUserProgress(user.id)
        const courseProgress = progress.find((p) => p.course_id === params.id && p.completed)
        setIsCompleted(!!courseProgress)
        setProgressLoaded(true)
      }
    }

    checkProgress()
  }, [user, params.id, progressLoaded])

  const handleToggleCompleted = async () => {
    if (!user || !params.id) return

    setIsToggling(true)
    try {
      if (isCompleted) {
        // Démarquer comme terminé
        await unmarkCourseCompleted(user.id, params.id as string)
        setIsCompleted(false)
      } else {
        // Marquer comme terminé
        await markCourseCompleted(user.id, params.id as string)
        setIsCompleted(true)
      }
    } catch (error) {
      console.error("Erreur lors de la modification du statut du cours:", error)
    } finally {
      setIsToggling(false)
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
            <CardTitle>Cours non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder aux cours vidéo.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cours non trouvé</p>
      </div>
    )
  }

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
            <Badge variant="outline">{course.category}</Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Check className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatReadTime(course.duration)}
          </div>
        </div>

        {/* Video Player */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {course.video_url && extractYouTubeId(course.video_url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(course.video_url)}`}
                  title="Video player"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-white flex flex-col items-center justify-center h-full">
                  <Play className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg">Vidéo à venir</p>
                  <p className="text-sm opacity-75">Ce cours sera bientôt disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Durée :</span>
                <span className="ml-2 text-muted-foreground">{course.duration} minutes</span>
              </div>
              <div>
                <span className="font-medium">Niveau :</span>
                <span className="ml-2 text-muted-foreground">{course.level}</span>
              </div>
              <div>
                <span className="font-medium">Catégorie :</span>
                <span className="ml-2 text-muted-foreground">{course.category}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outils utilisés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.tools && course.tools.length > 0 ? (
                  course.tools.map((tool, index) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Aucun outil spécifique</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressLoaded && (
                <Button
                  className={`w-full ${isCompleted ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                  onClick={handleToggleCompleted}
                  disabled={isToggling}
                  variant={isCompleted ? "secondary" : "default"}>
                  {isToggling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isCompleted ? "Dévalidation..." : "Validation..."}
                    </>
                  ) : isCompleted ? (
                    <>
                      <span className="flex items-center gap-0.5">
                        <X className="h-4 w-4" />
                        Marquer comme non terminé
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme terminé
                    </>
                  )}
                </Button>
                )}
              {!progressLoaded && (
                <Button className="w-full" disabled>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Chargement...
                </Button>
              )}
              <Link href="/courses">
                <Button variant="outline" className="w-full mt-4">
                  Retour aux cours
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {nextCourseId && (
          <div className="flex justify-center mt-6">
            <Link href={`/courses/${nextCourseId}`}>
              <Button size="lg">
                <Play className="h-4 w-4 mr-2" />
                Suite du cours
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
