"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Plus, Edit, Trash2, Users, BookOpen, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCourses, getGuides, deleteCourse, deleteGuide } from "@/lib/auth-supabase"
import type { Course, Guide } from "@/lib/auth-supabase"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [userCount, setUserCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (loading) return

    if (!user || !isAdmin) {
      router.push("/")
      return
    }

    const loadData = async () => {
      try {
        // Charger les cours et guides
        const allCourses = await getCourses()
        const allGuides = await getGuides()
        setCourses(allCourses)
        setGuides(allGuides)

        // Compter les utilisateurs
        const { count: userCount, error: userError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        if (!userError && userCount !== null) {
          setUserCount(userCount)
        }

        // Calculer la moyenne des avis
        const { data: reviews, error: reviewError } = await supabase.from("reviews").select("rating")

        if (!reviewError && reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
          setAvgRating(Math.round((sum / reviews.length) * 10) / 10) // Arrondi à 1 décimale
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadData()
  }, [user, isAdmin, loading, router, supabase])

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      await deleteCourse(id)
      const updatedCourses = await getCourses()
      setCourses(updatedCourses)
    }
  }

  const handleDeleteGuide = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce guide ?")) {
      await deleteGuide(id)
      const updatedGuides = await getGuides()
      setGuides(updatedGuides)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Vous devez être administrateur pour accéder à cette page.</p>
            <Link href="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
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
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">EasyIA - Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Panel d'Administration</h1>
          <p className="text-xl text-muted-foreground">Gérez les cours et guides de la plateforme</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cours Écrits</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guides.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              {avgRating > 0 && <div className="text-xs text-muted-foreground mt-1">Satisfaction: {avgRating}/5</div>}
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Gestion des Cours</TabsTrigger>
            <TabsTrigger value="guides">Gestion des Cours Écrits</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cours Vidéo</h2>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau cours
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">{course.duration} min</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{course.level}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{course.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cours Écrits</h2>
              <Link href="/admin/guides/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau cours écrit
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {guides.map((guide) => (
                <Card key={guide.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">{guide.read_time} min</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{guide.level}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{guide.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/guides/${guide.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteGuide(guide.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
