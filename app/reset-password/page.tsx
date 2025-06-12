"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Vérifier si l'utilisateur a un hash de réinitialisation dans l'URL
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        setError("Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.")
      }
    }

    checkSession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
      } else {
        setMessage("Mot de passe mis à jour avec succès. Vous allez être redirigé...")
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation:", err)
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
          <CardTitle>Réinitialiser votre mot de passe</CardTitle>
          <CardDescription>Créez un nouveau mot de passe pour votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
