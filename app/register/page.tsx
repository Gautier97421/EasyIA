"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Inscription avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name,
          role: "user",
          has_completed_intro: false,
        })

        if (profileError) {
          setError(profileError.message)
        } else {
          setSuccess(true)

          // Stockage temporaire pour confirmer la connexion
          localStorage.setItem("justLoggedIn", "true")

          // Redirection après un court délai
          setTimeout(() => {
            window.location.href = "/"
          }, 2000)
        }
      }
    } catch (err: any) {
      console.error("Erreur d'inscription:", err)
      setError("Une erreur inattendue s'est produite")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">EasyIA</span>
          </div>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>Créez un compte pour accéder à toutes les formations</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">Inscription réussie !</div>
              <p>Vous allez être redirigé vers la page d'accueil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
