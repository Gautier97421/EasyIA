"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain, ArrowLeft, Search, HelpCircle, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function AidePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const { user, profile, isAdmin } = useAuth()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const faqItems = [
    {
      id: "1",
      question: "Comment créer un compte sur EasyIA ?",
      answer:
        "Pour créer un compte, cliquez sur 'Inscription' en haut à droite de la page. Remplissez le formulaire avec votre nom, email et mot de passe. Vous recevrez un email de confirmation pour activer votre compte.",
      category: "Compte",
    },
    {
      id: "2",
      question: "Comment accéder aux cours ?",
      answer:
        "Après avoir créé votre compte et vous être connecté, vous devez d'abord lire notre guide d'introduction obligatoire. Une fois terminé, vous aurez accès à tous nos cours vidéo et écrits.",
      category: "Cours",
    },
    {
      id: "3",
      question: "Les cours sont-ils vraiment gratuits ?",
      answer:
        "Oui, absolument ! Tous nos cours sont entièrement gratuits. Nous croyons que l'éducation en IA doit être accessible à tous.",
      category: "Cours",
    },
    {
      id: "4",
      question: "Puis-je télécharger les cours pour les regarder hors ligne ?",
      answer:
        "Actuellement, nos cours sont disponibles uniquement en streaming sur notre plateforme. Nous travaillons sur une fonctionnalité de téléchargement pour l'avenir.",
      category: "Cours",
    },
    {
      id: "5",
      question: "Comment suivre ma progression ?",
      answer:
        "Votre progression est automatiquement sauvegardée. Vous pouvez marquer les cours comme terminés et voir votre avancement dans votre profil.",
      category: "Progression",
    },
    {
      id: "6",
      question: "J'ai oublié mon mot de passe, que faire ?",
      answer:
        "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Entrez votre email et vous recevrez un lien pour réinitialiser votre mot de passe.",
      category: "Compte",
    },
    {
      id: "7",
      question: "Quels sont les prérequis pour suivre les cours ?",
      answer:
        "Nos cours sont conçus pour tous les niveaux. Pour les débutants, aucun prérequis n'est nécessaire. Pour les cours avancés, une connaissance de base en programmation peut être utile.",
      category: "Cours",
    },
    {
      id: "8",
      question: "Comment installer les outils recommandés ?",
      answer:
        "Consultez notre section 'Guide Technique' qui contient toutes les instructions d'installation pour les outils essentiels comme Python, Node.js, et VS Code.",
      category: "Technique",
    },
    {
      id: "9",
      question: "Puis-je suggérer de nouveaux cours ?",
      answer:
        "Bien sûr ! Nous sommes toujours à l'écoute de nos utilisateurs. Contactez-nous via le formulaire de contact avec vos suggestions de cours.",
      category: "Suggestions",
    },
    {
      id: "10",
      question: "La plateforme est-elle accessible sur mobile ?",
      answer:
        "Oui, notre plateforme est entièrement responsive et fonctionne parfaitement sur mobile, tablette et ordinateur.",
      category: "Technique",
    },
    {
      id: "11",
      question: "Comment obtenir un certificat de completion ?",
      answer:
        "Actuellement, nous ne délivrons pas de certificats officiels, mais nous travaillons sur cette fonctionnalité. Votre progression est enregistrée dans votre profil.",
      category: "Certification",
    },
    {
      id: "12",
      question: "Puis-je partager mon compte avec d'autres personnes ?",
      answer:
        "Chaque compte est personnel et ne doit pas être partagé. Nous encourageons chaque utilisateur à créer son propre compte gratuit.",
      category: "Compte",
    },
  ]

  const categories = Array.from(new Set(faqItems.map((item) => item.category)))

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedFAQ = categories.reduce(
    (acc, category) => {
      acc[category] = filteredFAQ.filter((item) => item.category === category)
      return acc
    },
    {} as Record<string, typeof faqItems>,
  )

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
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Centre d'aide</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions les plus fréquentes
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">🚀 Commencer</CardTitle>
              <CardDescription>Guide pour débuter sur EasyIA</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/intro">
                <Button>Lire l'introduction</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">🛠️ Outils</CardTitle>
              <CardDescription>Configuration et installation</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/tools">
                <Button>Guide technique</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">💬 Avis</CardTitle>
              <CardDescription>Partagez vos idées et suggestions pour aider la plateforme.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/avis">
                <Button>Les avis</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedFAQ).map(
            ([category, items]) =>
              items.length > 0 && (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      {items.length}
                    </span>
                    {category}
                  </h2>
                  <Card>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {items.map((item) => (
                          <AccordionItem key={item.id} value={item.id} className="border-b last:border-b-0">
                            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50">
                              <span className="font-medium">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ),
          )}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Essayez avec d'autres mots-clés ou consultez toutes nos questions fréquentes.
            </p>
            <Button onClick={() => setSearchTerm("")}>Voir toutes les FAQ</Button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Vous ne trouvez pas votre réponse ?</CardTitle>
              <CardDescription>Notre équipe est là pour vous aider ! Contactez-nous directement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">Nous contacter</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
