"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { signIn } from "@/lib/auth-supabase"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [error, setError] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await signIn(email, password)

      if (!user) {
        setError("Email ou mot de passe incorrect.")
      } else {
        console.log("Connexion réussie:", user)
        localStorage.setItem("justLoggedIn", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))
        window.location.href = "/" // Rechargement complet
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err)
      setError("Une erreur inattendue s'est produite.")
    } finally {
      setLoading(false)
    }
  }


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResetMessage("")
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setResetMessage("Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.")
        setIsResetting(false)
      }
    } catch (err: any) {
      console.error("Erreur de réinitialisation:", err)
      setError("Une erreur inattendue s'est produite")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <div className="self-start mb-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">EasyIA</span>
          </div>
          <CardTitle>{isResetting ? "Réinitialiser le mot de passe" : "Connexion"}</CardTitle>
          <CardDescription>
            {isResetting
              ? "Entrez votre email pour recevoir un lien de réinitialisation"
              : "Connectez-vous à votre compte pour accéder aux formations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetting ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              {resetMessage && <div className="text-green-600 text-sm text-center">{resetMessage}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setIsResetting(false)}
                  className="text-sm text-blue-600"
                >
                  Retour à la connexion
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-xs text-blue-600 p-0 h-auto"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
