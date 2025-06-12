"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, Plus, Edit, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface HardwareConfig {
  id: string
  category: string
  description: string
  specs: string[]
  color: string
}

interface EssentialApp {
  id: string
  name: string
  description: string
  category: string
  url: string
  icon: string
  free: boolean
}

interface Installation {
  id: string
  category: string
  description: string
  commands: string[]
  icon: string
}

export default function AdminToolsPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  // États pour les configurations matérielles
  const [hardwareConfigs, setHardwareConfigs] = useState<HardwareConfig[]>([
    {
      id: "1",
      category: "Configuration Minimale",
      description: "Pour débuter avec l'IA et les outils de base",
      specs: [
        "Processeur : Intel i5 ou AMD Ryzen 5",
        "RAM : 8 GB minimum",
        "Stockage : 256 GB SSD",
        "Connexion : Internet stable (10 Mbps+)",
      ],
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: "2",
      category: "Configuration Recommandée",
      description: "Pour une utilisation confortable et productive",
      specs: [
        "Processeur : Intel i7 ou AMD Ryzen 7",
        "RAM : 16 GB",
        "Stockage : 512 GB SSD",
        "GPU : Carte graphique dédiée (optionnel)",
      ],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: "3",
      category: "Configuration Avancée",
      description: "Pour le développement IA et l'entraînement de modèles",
      specs: [
        "Processeur : Intel i9 ou AMD Ryzen 9",
        "RAM : 32 GB ou plus",
        "Stockage : 1 TB SSD NVMe",
        "GPU : NVIDIA RTX 4070+ avec 12GB+ VRAM",
      ],
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ])

  // États pour les applications essentielles
  const [essentialApps, setEssentialApps] = useState<EssentialApp[]>([
    {
      id: "1",
      name: "Visual Studio Code",
      description: "Éditeur de code gratuit et puissant avec extensions IA",
      category: "Développement",
      url: "https://code.visualstudio.com",
      icon: "💻",
      free: true,
    },
    {
      id: "2",
      name: "Node.js",
      description: "Runtime JavaScript pour exécuter du code côté serveur",
      category: "Runtime",
      url: "https://nodejs.org",
      icon: "🟢",
      free: true,
    },
    {
      id: "3",
      name: "Python",
      description: "Langage de programmation incontournable pour l'IA",
      category: "Langage",
      url: "https://python.org",
      icon: "🐍",
      free: true,
    },
  ])

  // États pour les installations
  const [installations, setInstallations] = useState<Installation[]>([
    {
      id: "1",
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
      id: "2",
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
  ])

  // États pour l'édition
  const [editingHardware, setEditingHardware] = useState<HardwareConfig | null>(null)
  const [editingApp, setEditingApp] = useState<EssentialApp | null>(null)
  const [editingInstallation, setEditingInstallation] = useState<Installation | null>(null)

  useEffect(() => {
    if (loading) return

    if (!user || !isAdmin) {
      router.push("/")
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const handleSaveHardware = (config: HardwareConfig) => {
    if (editingHardware?.id) {
      setHardwareConfigs((prev) => prev.map((c) => (c.id === config.id ? config : c)))
    } else {
      setHardwareConfigs((prev) => [...prev, { ...config, id: Date.now().toString() }])
    }
    setEditingHardware(null)
  }

  const handleSaveApp = (app: EssentialApp) => {
    if (editingApp?.id) {
      setEssentialApps((prev) => prev.map((a) => (a.id === app.id ? app : a)))
    } else {
      setEssentialApps((prev) => [...prev, { ...app, id: Date.now().toString() }])
    }
    setEditingApp(null)
  }

  const handleSaveInstallation = (installation: Installation) => {
    if (editingInstallation?.id) {
      setInstallations((prev) => prev.map((i) => (i.id === installation.id ? installation : i)))
    } else {
      setInstallations((prev) => [...prev, { ...installation, id: Date.now().toString() }])
    }
    setEditingInstallation(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-purple-900">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">EasyIA - Admin Tools</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Gestion des Outils</h1>
          <p className="text-xl text-muted-foreground">Gérez les configurations, applications et installations</p>
        </div>

        <Tabs defaultValue="hardware" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hardware">Configurations Matérielles</TabsTrigger>
            <TabsTrigger value="apps">Applications Essentielles</TabsTrigger>
            <TabsTrigger value="installations">Installations</TabsTrigger>
          </TabsList>

          {/* Hardware Configurations Tab */}
          <TabsContent value="hardware" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Configurations Matérielles</h2>
              <Button
                onClick={() =>
                  setEditingHardware({
                    id: "",
                    category: "",
                    description: "",
                    specs: [],
                    color: "bg-gray-100 text-gray-800",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle configuration
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hardwareConfigs.map((config) => (
                <Card key={config.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className={config.color}>{config.category}</Badge>
                        <CardTitle className="mt-2">{config.category}</CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingHardware(config)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setHardwareConfigs((prev) => prev.filter((c) => c.id !== config.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {config.specs.map((spec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Essential Apps Tab */}
          <TabsContent value="apps" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Applications Essentielles</h2>
              <Button
                onClick={() =>
                  setEditingApp({ id: "", name: "", description: "", category: "", url: "", icon: "", free: true })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle application
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialApps.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{app.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{app.name}</CardTitle>
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingApp(app)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setEssentialApps((prev) => prev.filter((a) => a.id !== app.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-3">{app.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Installations Tab */}
          <TabsContent value="installations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Installations</h2>
              <Button
                onClick={() =>
                  setEditingInstallation({ id: "", category: "", description: "", commands: [], icon: "" })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle installation
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {installations.map((installation) => (
                <Card key={installation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{installation.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{installation.category}</CardTitle>
                          <CardDescription>{installation.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingInstallation(installation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setInstallations((prev) => prev.filter((i) => i.id !== installation.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{installation.commands.join("\n")}</pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Hardware Config Edit Modal */}
        {editingHardware && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingHardware.id ? "Modifier" : "Ajouter"} une configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={editingHardware.category}
                    onChange={(e) => setEditingHardware({ ...editingHardware, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingHardware.description}
                    onChange={(e) => setEditingHardware({ ...editingHardware, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="specs">Spécifications (une par ligne)</Label>
                  <Textarea
                    id="specs"
                    rows={6}
                    value={editingHardware.specs.join("\n")}
                    onChange={(e) => setEditingHardware({ ...editingHardware, specs: e.target.value.split("\n") })}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Classe CSS pour la couleur</Label>
                  <Input
                    id="color"
                    value={editingHardware.color}
                    onChange={(e) => setEditingHardware({ ...editingHardware, color: e.target.value })}
                    placeholder="ex: bg-green-100 text-green-800"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveHardware(editingHardware)}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setEditingHardware(null)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* App Edit Modal */}
        {editingApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingApp.id ? "Modifier" : "Ajouter"} une application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={editingApp.name}
                    onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingApp.description}
                    onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={editingApp.category}
                    onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={editingApp.url}
                    onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icône (emoji)</Label>
                  <Input
                    id="icon"
                    value={editingApp.icon}
                    onChange={(e) => setEditingApp({ ...editingApp, icon: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="free"
                    checked={editingApp.free}
                    onChange={(e) => setEditingApp({ ...editingApp, free: e.target.checked })}
                  />
                  <Label htmlFor="free">Application gratuite</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveApp(editingApp)}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setEditingApp(null)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Installation Edit Modal */}
        {editingInstallation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingInstallation.id ? "Modifier" : "Ajouter"} une installation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={editingInstallation.category}
                    onChange={(e) => setEditingInstallation({ ...editingInstallation, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingInstallation.description}
                    onChange={(e) => setEditingInstallation({ ...editingInstallation, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="commands">Commandes (une par ligne)</Label>
                  <Textarea
                    id="commands"
                    rows={8}
                    value={editingInstallation.commands.join("\n")}
                    onChange={(e) =>
                      setEditingInstallation({ ...editingInstallation, commands: e.target.value.split("\n") })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icône (emoji)</Label>
                  <Input
                    id="icon"
                    value={editingInstallation.icon}
                    onChange={(e) => setEditingInstallation({ ...editingInstallation, icon: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveInstallation(editingInstallation)}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setEditingInstallation(null)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
