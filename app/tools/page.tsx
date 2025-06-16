"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Brain, ArrowLeft, Search, Cpu, Download, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getEssentialApps, getInstallations } from "@/lib/auth-supabase"

export default function ToolsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const { user, profile, isAdmin } = useAuth()
  // const [essentialApps, setEssentialApps] = useState([]);
  // const [installations, setInstallations] = useState([]);
  // const [loading, setLoading] = useState(true);
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }
  // useEffect(() => {
  //   async function fetchData() {
  //     const apps = await getEssentialApps();
  //     const installs = await getInstallations();
  //     setEssentialApps(apps);
  //     setInstallations(installs);
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);

  // Configuration matérielle recommandée
  const hardwareRequirements = [
    {
      category: "Configuration Minimale",
      description: "Pour débuter avec l'IA et les outils de base",
      specs: [
        "Un écran (pas cassé de préférence",
        "Youtube",
        "Du temps et un café",
        "L’envie d’évoluer dans un monde qui va vite",
      ],
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      category: "Configuration Recommandée",
      description: "Pour une utilisation confortable et productive",
      specs: [
        "Processeur : Intel i7 ou AMD Ryzen 7",
        "RAM : 8-16 GB",
        "Stockage : 256-512 GB SSD",
        "GPU : RTX 2060 / RTX 3060 (ou utiliser Google Colab)",
      ],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      category: "Configuration Avancée",
      description: "Pour le développement IA et l'entraînement de modèles",
      specs: [
        "Processeur : Intel i9 ou AMD Ryzen 9",
        "RAM : 16-32 GB ou plus",
        "Stockage : 512GB-1 TB SSD NVMe",
        "GPU : NVIDIA RTX 4070+ avec 12GB+ VRAM",
      ],
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ]

  // Applications essentielles
  const essentialApps = [
    {
      name: "Visual Studio Code",
      description: "Éditeur de code gratuit et puissant avec extensions IA",
      category: "Développement",
      url: "https://code.visualstudio.com",
      icon: "💻",
      free: true,
    },
    {
      name: "Node.js",
      description: "Runtime JavaScript pour exécuter du code côté serveur",
      category: "Runtime",
      url: "https://nodejs.org",
      icon: "🟢",
      free: true,
    },
    {
      name: "Python",
      description: "Langage de programmation incontournable pour l'IA",
      category: "Langage",
      url: "https://python.org",
      icon: "🐍",
      free: true,
    },
    {
      name: "Docker",
      description: "Plateforme de conteneurisation pour déployer vos applications",
      category: "DevOps",
      url: "https://docker.com",
      icon: "🐳",
      free: true,
    },
    {
      name: "Postman",
      description: "Outil pour tester et développer des APIs",
      category: "API",
      url: "https://postman.com",
      icon: "📮",
      free: true,
    },
  ]

  // Installations et configurations
  const installations = [
    {
      category: "Environnement Node.js",
      description: "Configuration de base pour le développement JavaScript",
      commands: [
        "# Vérifier l'installation de Node.js",
        "node --version",
        "npm --version",
        "",
        "# Installer les packages essentiels globalement",
        "npm install -g typescript",
        "npm install -g @vercel/cli",
        "npm install -g create-next-app",
      ],
      icon: "🟢",
    },
    {
      category: "Environnement Python",
      description: "Configuration pour le développement IA avec Python",
      commands: [
        "# Vérifier l'installation de Python",
        "python --version",
        "pip --version",
        "",
        "# Installer les librairies IA essentielles",
        "pip install numpy pandas matplotlib",
        "pip install scikit-learn tensorflow pytorch",
        "pip install openai anthropic",
      ],
      icon: "🐍",
    },
    {
      category: "Extensions VS Code",
      description: "Extensions recommandées pour le développement IA",
      commands: [
        "# Extensions essentielles à installer :",
        "- Python (Microsoft)",
        "- JavaScript and TypeScript (Microsoft)",
        "- GitHub Copilot (GitHub)",
        "- Prettier - Code formatter",
        "- GitLens — Git supercharged",
        "- Thunder Client (alternative à Postman)",
        "- Auto Rename Tag",
      ],
      icon: "💻",
    },
  ]

  const filteredApps = essentialApps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInstallations = installations.filter(
    (install) =>
      install.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      install.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Guide Technique</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour commencer le développement IA
          </p>
          {user && isAdmin && (
            <div className="mt-4">
              <Link href="/admin/tools">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Gérer les outils
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Hardware Requirements Section */}
        {!searchTerm && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Cpu className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-foreground">Configuration Matérielle</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Choisissez la configuration adaptée à vos besoins et budget
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {hardwareRequirements.map((config, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <Badge className={`mb-2 ${config.color}`}>{config.category}</Badge>
                    <CardTitle className="text-lg">{config.category}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {config.specs.map((spec, specIndex) => (
                        <li key={specIndex} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Essential Apps Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Applications Essentielles</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Les outils indispensables pour commencer le développement IA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {app.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{app.category}</Badge>
                          {app.free && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Gratuit
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Installation & Configuration Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Installation & Configuration</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Commandes et étapes pour configurer votre environnement de développement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredInstallations.map((install, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{install.icon}</span>
                    <CardTitle className="text-lg">{install.category}</CardTitle>
                  </div>
                  <CardDescription>{install.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{install.commands.join("\n")}</pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        install.commands.filter((cmd) => !cmd.startsWith("#") && cmd.trim()).join("\n"),
                      )
                    }
                  >
                    Copier les commandes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Besoin d'aide pour l'installation ?</CardTitle>
              <CardDescription>
                Notre équipe peut vous accompagner dans la configuration de votre environnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">Demander de l'aide</Button>
                </Link>
                <Link href="/aide">
                  <Button variant="outline" size="lg">
                    Consulter la FAQ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
