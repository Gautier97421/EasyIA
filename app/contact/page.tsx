"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, ArrowLeft, Mail, Phone, MapPin, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendContactMessage } from "@/lib/auth-supabase"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function ContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user, profile, isAdmin } = useAuth()

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

    try {
      if (!user?.email) {
        alert("Email introuvable.")
        setLoading(false)
        return
      }

      await sendContactMessage(name, user.email, subject, message)
      setSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du message:", error)
      alert("Erreur lors de l'envoi du message. " + (error?.message || JSON.stringify(error)))
    }

    setLoading(false)
  }
  
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)  // Initialise email avec l'email du user
      console.log("Email utilisé :", user.email)
    }
  }, [user])

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
              <div className="flex items-center space-x-2">
                {user && profile ? (
                  <UserNav user={{ ...user, name: profile.name, role: profile.role }} />
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Contactez-nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question ? Un problème ? Nous sommes là pour vous aider !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Message envoyé !</h3>
                  <p className="text-muted-foreground">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button className="mt-4" onClick={() => setSuccess(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        placeholder="Votre email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>Vous pouvez aussi nous contacter directement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">gautier.hoarau97421@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Réponse sous 48h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Téléphone</h3>
                    <p className="text-muted-foreground">+33 7 66 56 69 97</p>
                    <p className="text-sm text-muted-foreground">Lun-Ven 14h-18h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Adresse</h3>
                    <p className="text-muted-foreground">
                      Siège : Non communiqué
                      <br />
                      59000 Lille, France
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>Consultez notre FAQ pour des réponses rapides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Comment accéder aux cours ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Créez un compte gratuit et commencez par lire notre guide d'introduction.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Les cours sont-ils gratuits ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, tous nos cours sont entièrement gratuits et accessibles après inscription.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Problème technique ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Contactez-nous via le formulaire en décrivant le problème rencontré.
                    </p>
                  </div>
                </div>
                <Link href="/aide">
                  <Button variant="outline" className="w-full mt-4">
                    Voir toutes les FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
