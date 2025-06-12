"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  console.log("USER =", user)
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

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-muted-foreground">Cours terminés</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile?.hasCompletedIntro ? "✓" : "✗"}</div>
                  <div className="text-sm text-muted-foreground">Introduction</div>
                </div>
              </div>
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
