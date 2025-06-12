"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Clock, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getIntroGuide, completeIntro } from "@/lib/auth-supabase"
import type { IntroGuide } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function IntroPage() {
  const [introGuide, setIntroGuide] = useState<IntroGuide | null>(null)
  const { user, profile, loading, isAdmin, refreshProfile } = useAuth()
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    const loadGuide = async () => {
      const guide = await getIntroGuide()
      setIntroGuide(guide)
    }

    loadGuide()

    // Si l'utilisateur a déjà complété l'intro, rediriger vers les cours
    if (profile?.hasCompletedIntro) {
      router.push("/courses")
    }
  }, [profile, router])

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
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder au cours d'introduction.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!introGuide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cours d'introduction non trouvé</p>
      </div>
    )
  }
  
  const handleCompleteIntro = async () => {
    if (user) {
      setIsCompleting(true)
      try {
        await completeIntro(user.id)

        await refreshProfile() // ← MET À JOUR LE PROFIL LOCAL

        router.push("/courses") // ← redirection propre, sans forcer un rechargement complet
      } catch (error) {
        console.error("Erreur lors de la complétion de l'intro:", error)
        setIsCompleting(false)
      }
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
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">EasyIA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Guide Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Obligatoire</Badge>
            <Badge variant="outline">Introduction</Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{introGuide.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{introGuide.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {introGuide.readTime} minutes de lecture
          </div>
        </div>

        {/* Guide Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: introGuide.content
                    .replace(/\n/g, "<br>")
                    .replace(
                      /src="placeholder"/g,
                      'src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center"',
                    ),
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Completion Actions */}
        <div className="text-center space-y-4">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Prêt à débloquer tous les cours ?
                </h3>
              </div>
              <p className="text-green-700 dark:text-green-300 mb-4">
                En marquant ce cours comme terminé, vous débloquerez l'accès à tous nos cours vidéo et écrits !
              </p>
              <Button
                onClick={handleCompleteIntro}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={isCompleting}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isCompleting ? "Validation en cours..." : "Marquer comme terminé et débloquer les cours"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
