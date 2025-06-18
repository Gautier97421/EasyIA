"use client"

import type React from "react"
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/auth-supabase"

export default function AvisPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    satisfaction: 0,
    recommendations: 0,
  })
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  async function fetchTestimonials() {
    const { data: reviews, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(3);

    if (error) {
      console.error("Erreur chargement avis :", error.message)
      return
    }

    const userIds = reviews.map((r) => r.user_id)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", userIds)

    if (profileError) {
      console.error("Erreur chargement profils :", profileError.message)
      return
    }

    const merged = reviews.map((r) => ({
      ...r,
      profiles: profileData?.find((p) => p.id === r.user_id) || null,
    }))

    setTestimonials(merged || [])
  }


  // Fetch stats
  async function fetchStats() {
    const { data, error } = await supabase.from("reviews").select("*")
    if (error) {
      console.error("Erreur fetch stats", error)
      return
    }
    if (!data || data.length === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        satisfaction: 0,
        recommendations: 0,
      })
      return
    }
    const userIds = data.map((r) => r.user_id)
    const totalReviews = data.length
    const sumRatings = data.reduce((acc, r) => acc + (r.rating ?? 0), 0)
    const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1))
    const satisfiedCount = data.filter((r) => r.rating >= 4).length
    const satisfaction = Math.round((satisfiedCount / totalReviews) * 100)
    const recommendations = satisfaction

    setStats({
      averageRating,
      totalReviews,
      satisfaction,
      recommendations,
    })
  }
  async function canPostReview(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('reviews')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return false;
    }

    if (data.length === 0) return true;

    const lastReviewDate = new Date(data[0].created_at);
    const now = new Date();
    const hoursSinceLastReview = (now.getTime() - lastReviewDate.getTime()) / 1000 / 3600;

    return hoursSinceLastReview >= 24;
  }

  useEffect(() => {
    fetchTestimonials()
    fetchStats()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !user) return

    const canPost = await canPostReview(user.id)
    if (!canPost) {
      alert("Vous avez déjà posté un avis dans les dernières 24 heures. Merci de patienter.")
      return
    }

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        rating,
        comment,
      },
    ])

    if (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error.message)
      return
    }

    setSubmitted(true)
    setComment("")
    setRating(0)
    await fetchTestimonials()
    await fetchStats()
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
                <Link href="/" className="flex items-center space-x-2 ml-4 hover:opacity-80 transition-opacity">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold">EasyIA</span>
                </Link>  
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
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                      <Label htmlFor="role">Votre rôle ou métier</Label>
                      <Input
                        id="role"
                        value={user ? profile?.role || "" : "Vous devez être connecté pour remplir ce champ"}
                        disabled={!user}
                        className={!user ? "text-red-500 placeholder-red-500" : ""}
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!user || rating === 0}
                  >
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
                      <CardTitle className="text-lg">{testimonial.profiles?.name || "Utilisateur anonyme"}</CardTitle>
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
                  <p className="text-xs text-muted-foreground">{new Date(testimonial.created_at).toLocaleDateString()}</p>
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
