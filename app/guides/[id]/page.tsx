"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getGuides } from "@/lib/auth-supabase"
import type { Guide } from "@/lib/auth-supabase"
import { useAuth } from "@/hooks/use-auth"

export default function GuideDetailPage() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const { user, loading } = useAuth()

  useEffect(() => {
    const loadGuide = async () => {
      const guides = await getGuides()
      const foundGuide = guides.find((g) => g.id === params.id)
      setGuide(foundGuide || null)
    }

    loadGuide()
  }, [params.id])

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
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder aux cours écrits.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!guide) {
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
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">EasyIA</span>
            </Link>
            <Link href="/guides">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux cours écrits
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Guide Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getLevelColor(guide.level)}>{guide.level}</Badge>
            <Badge variant="outline">{guide.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{guide.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{guide.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {guide.read_time} minutes de lecture
          </div>
        </div>

        {/* Guide Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, "<br>") }} />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/guides">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Voir tous les cours écrits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
