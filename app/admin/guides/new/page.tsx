"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addGuide } from "@/lib/auth-supabase"
import { useAuth } from "@/hooks/use-auth"

export default function NewGuidePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [readTime, setReadTime] = useState("")
  const [level, setLevel] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [tools, setTools] = useState<string[]>([])
  const [newTool, setNewTool] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return

    if (!user || !isAdmin) {
      router.push("/")
    }
  }, [user, isAdmin, authLoading, router])

  const addTool = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools([...tools, newTool.trim()])
      setNewTool("")
    }
  }

  const removeTool = (toolToRemove: string) => {
    setTools(tools.filter((tool) => tool !== toolToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addGuide({
        title,
        description,
        content,
        read_time: Number.parseInt(readTime),
        level: level as "débutant" | "intermédiaire" | "avancé",
        category,
        thumbnail: thumbnail || "\img_IA.jpg",
        tools,
      })

      router.push("/admin")
    } catch (error) {
      console.error("Erreur lors de la création du guide:", error)
    }

    setLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
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
                <span className="text-2xl font-bold">EasyIA - Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau Cours Écrit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du cours *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu du cours *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Rédigez le contenu de votre cours ici..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="readTime">Temps de lecture (minutes) *</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Niveau *</Label>
                  <Select value={level} onValueChange={setLevel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="débutant">Débutant</SelectItem>
                      <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="ex: IA Générative, Productivité..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de l'image (optionnel)</Label>
                <Input
                  id="thumbnail"
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Outils utilisés dans ce cours</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="ex: ChatGPT, Notion AI..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTool())}
                  />
                  <Button type="button" onClick={addTool} variant="outline">
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                      {tool}
                      <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTool(tool)} />
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Ces outils apparaîtront automatiquement dans la section "Outils recommandés"
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer le cours"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
