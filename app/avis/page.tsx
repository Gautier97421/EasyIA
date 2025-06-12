"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, ArrowLeft, Star, Users, ThumbsUp, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/hooks/use-auth"

export default function AvisPage() {
  const router = useRouter()
  const { user, profile, isAdmin } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [name, setName] = useState(user?.email || "")
  const [submitted, setSubmitted] = useState(false)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
  }

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Marketing Manager",
      rating: 5,
      comment: "EasyIA m'a permis de découvrir ChatGPT et d'automatiser mes campagnes email. Je gagne 3h par semaine !",
      date: "Il y a 2 semaines",
    },
    {
      name: "Thomas Martin",
      role: "Consultant",
      rating: 5,
      comment: "Les cours sont très clairs et pratiques. J'utilise maintenant l'IA pour mes présentations clients.",
      date: "Il y a 1 mois",
    },
    {
      name: "Sophie Laurent",
      role: "RH",
      rating: 4,
      comment: "Excellente plateforme pour débuter. Les exemples concrets m'ont beaucoup aidée.",
      date: "Il y a 3 semaines",
    },
    {
      name: "Pierre Durand",
      role: "Chef de projet",
      rating: 5,
      comment: "Formation complète et accessible. Je recommande vivement pour tous les professionnels.",
      date: "Il y a 1 semaine",
    },
  ]

  const stats = {
    totalReviews: 847,
    averageRating: 4.8,
    satisfaction: 98,
    recommendations: 96,
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Avis et Témoignages</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez ce que pensent nos utilisateurs et partagez votre expérience
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.averageRating}/5</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Note moyenne</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalReviews}</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Avis reçus</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.satisfaction}%</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Satisfaction</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.recommendations}%</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recommandent</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Review Form */}
          <Card>
            <CardHeader>
              <CardTitle>Laissez votre avis</CardTitle>
              <CardDescription>Votre retour nous aide à améliorer la plateforme pour tous</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Merci pour votre avis !</h3>
                  <p className="text-muted-foreground">Votre témoignage nous aide à nous améliorer.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Votre note</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {!user && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Votre nom</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom (optionnel)"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="comment">Votre commentaire</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Partagez votre expérience avec EasyIA..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={rating === 0}>
                    Publier mon avis
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Testimonials */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Témoignages récents</h3>

            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">"{testimonial.comment}"</p>
                  <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                </CardContent>
              </Card>
            ))}

            <div className="text-center">
              <Button variant="outline">Voir tous les avis</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
