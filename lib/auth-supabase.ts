import { createClient } from "./supabase/client"
import type { Database } from "./types2/database"
import type { User } from "@supabase/supabase-js"
import type { UserType } from "./types"



export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"]
export type Course = Database["public"]["Tables"]["courses"]["Row"]
export type Guide = Database["public"]["Tables"]["guides"]["Row"]
export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export {supabase}
export type UserFavorite = Database["public"]["Tables"]["user_favorites"]["Row"]

const supabase = createClient()

// Cours d'introduction (reste en dur pour l'instant)
export const introGuide = {
  id: "intro",
  title: "🎯 Introduction à EasyIA - À lire en premier !",
  description:
    "Bienvenue sur EasyIA ! Ce guide d'introduction vous explique tout ce que vous devez savoir avant de commencer.",
  content: `# Bienvenue sur EasyIA ! 🎉

## À propos de cette plateforme

Félicitations pour avoir rejoint **EasyIA**, votre nouvelle destination pour apprendre l'Intelligence Artificielle de manière simple et accessible !

## Important à savoir 📚

### Nos cours et contenus

Tous les cours présents sur cette plateforme sont **soigneusement sélectionnés et recommandés** par notre équipe. Ces formations proviennent de diverses sources expertes dans le domaine de l'IA et représentent ce qu'il y a de mieux pour comprendre et maîtriser l'Intelligence Artificielle.

**Points clés :**
- ✅ Cours **recommandés** par nos experts
- ✅ Contenu de **qualité professionnelle**
- ✅ Sélection basée sur l'**efficacité pédagogique**
- ✅ Mise à jour régulière selon les **dernières tendances IA**

### Notre mission

Notre objectif est de vous accompagner dans votre apprentissage de l'IA en vous proposant :

1. **Des ressources triées sur le volet** - Plus besoin de chercher, nous avons fait le travail pour vous
2. **Un parcours structuré** - De débutant à expert, suivez notre progression recommandée
3. **Des outils pratiques** - Découvrez les meilleurs outils IA du moment
4. **Une communauté d'apprentissage** - Échangez avec d'autres passionnés d'IA

## Comment utiliser EasyIA ? 🚀

### 1. Explorez les cours
- **Cours Vidéo** : Formations interactives et visuelles
- **Cours Écrits** : Guides détaillés étape par étape

### 2. Découvrez les outils
- Section dédiée aux meilleurs outils IA
- Recommandations personnalisées selon vos besoins

### 3. Progressez à votre rythme
- Marquez vos cours comme terminés
- Suivez votre progression
- Revenez quand vous voulez

## Prêt à commencer ? 🎯

Maintenant que vous connaissez l'essentiel, vous pouvez explorer tous nos cours et ressources. 

**Bonne découverte de l'IA avec EasyIA !** 🤖✨

---

*L'équipe EasyIA*`,
  readTime: 5,
}

export async function getIntroGuide() {
  return introGuide
}

// Authentification
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error

  // Créer le profil utilisateur
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      role: "user",
      has_completed_intro: false,
    })

    if (profileError) throw profileError
  }

  return data
}

let currentUser: UserType | null = null

export async function signIn(email: string, password: string): Promise<UserType | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Erreur de connexion :", error.message)
    return null
  }

  const user = data.session?.user
  if (!user) {
    console.error("Utilisateur non trouvé après connexion.")
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        name: user.email?.split("@")[0] ?? "Utilisateur",
        role: "user",
        has_completed_intro: false,
      },
    ])

    if (insertError) {
      console.error("Erreur lors de la création du profil :", insertError.message)
      return null
    }
  }
  const { data: finalProfile, error: finalError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (finalError || !finalProfile) {
    console.error("Erreur lors de la récupération du profil :", finalError?.message)
    return null
  }

  const userData: UserType = {
    id: user.id,
    email: user.email ?? "",
    name: finalProfile.name,
    role: finalProfile.role,
    hasCompletedIntro: finalProfile.has_completed_intro,
    createdAt: finalProfile.created_at,
  }

  currentUser = userData

  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  return userData
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<UserType | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error)
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError || !profile) {
    console.error("Erreur lors de la récupération du profil :", profileError)
    return null
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name: profile.name,
    role: profile.role,
    hasCompletedIntro: profile.has_completed_intro,
    createdAt: profile.created_at,
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}


export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeIntro(userId: string) {
  return updateUserProfile(userId, { has_completed_intro: true })
}

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === "admin"
}

// Cours
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return data || []
}

export async function getCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching course:", error)
    return null
  }

  return data
}

export async function addCourse(
  course: Omit<Database["public"]["Tables"]["courses"]["Insert"], "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase.from("courses").insert(course).select().single()

  if (error) {
    console.error("Error adding course:", error)
    throw error
  }
  return data
}

export async function updateCourse(id: string, updates: Database["public"]["Tables"]["courses"]["Update"]) {
  const { data, error } = await supabase
    .from("courses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id)

  if (error) throw error
}

// Guides
export async function getGuides(): Promise<Guide[]> {
  const { data, error } = await supabase.from("guides").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching guides:", error)
    return []
  }

  return data || []
}

export async function getGuide(id: string): Promise<Guide | null> {
  const { data, error } = await supabase.from("guides").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching guide:", error)
    return null
  }

  return data
}

export async function addGuide(
  guide: Omit<Database["public"]["Tables"]["guides"]["Insert"], "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase.from("guides").insert(guide).select().single()

  if (error) {
    console.error("Error adding guide:", error)
    throw error
  }
  return data
}

export async function updateGuide(id: string, updates: Database["public"]["Tables"]["guides"]["Update"]) {
  const { data, error } = await supabase
    .from("guides")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGuide(id: string) {
  const { error } = await supabase.from("guides").delete().eq("id", id)

  if (error) throw error
}

//App essentiels et installation
export async function getEssentialApps() {
  const { data, error } = await supabase.from("essential_apps").select("*").order("id");
  if (error) {
    console.error("Erreur getEssentialApps:", error);
    return [];
  }
  return data;
}

export async function getInstallations() {
  const { data, error } = await supabase.from("installations").select("*, installation_commands(*)").order("id");
  if (error) {
    console.error("Erreur getInstallations:", error);
    return [];
  }
  return data;
}

// Progression utilisateur
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user progress:", error)
    return []
  }

  return data || []
}

export async function unmarkCourseCompleted(userId: string, courseId: string) {
  const { error } = await supabase.from("user_progress").delete().eq("user_id", userId).eq("course_id", courseId)

  if (error) throw error
}

export async function markCourseCompleted(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert({
      user_id: userId,
      course_id: courseId,
      guide_id: null,
      completed: true,
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unmarkGuideCompleted(userId: string, guideId: string) {
  const { error } = await supabase.from("user_progress").delete().eq("user_id", userId).eq("guide_id", guideId)

  if (error) throw error
}

export async function markGuideCompleted(userId: string, guideId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert({
      user_id: userId,
      course_id: null,
      guide_id: guideId,
      completed: true,
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Favoris utilisateur
export async function getUserFavorites(userId: string): Promise<UserFavorite[]> {
  const { data, error } = await supabase.from("user_favorites").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user favorites:", error)
    return []
  }

  return data || []
}

export async function addToFavorites(userId: string, courseId: string | null = null, guideId: string | null = null) {
  try {
    console.log("📥 [addToFavorites] called with:", { userId, courseId, guideId })

    const insertData: any = {
      user_id: userId,
    }

    if (courseId) {
      insertData.course_id = courseId
      insertData.guide_id = null
    } else if (guideId) {
      insertData.guide_id = guideId
      insertData.course_id = null
    } else {
      throw new Error("Either courseId or guideId must be provided")
    }

    const { data, error } = await supabase.from("user_favorites").insert(insertData).select()

    if (error) {
      console.error("Error adding to favorites:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Error in addToFavorites:", error)
    throw error
  }
}

export async function removeFromFavorites(
  userId: string,
  courseId: string | null = null,
  guideId: string | null = null,) {
  try {
    let query = supabase.from("user_favorites").delete().eq("user_id", userId)

    if (courseId) {
      query = query.eq("course_id", courseId).is("guide_id", null)
    } else if (guideId) {
      query = query.eq("guide_id", guideId).is("course_id", null)
    } else {
      throw new Error("Either courseId or guideId must be provided")
    }

    const { error } = await query

    if (error) {
      console.error("Error removing from favorites:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in removeFromFavorites:", error)
    throw error
  }
}


// Avis
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function addReview(userId: string, rating: number, comment?: string) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding review:", error)
    throw error
  }
  return data
}

// Messages de contact
export async function sendContactMessage(name: string, email: string, subject: string, message: string) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name,
      email,
      subject,
      message,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Fonction pour insérer les données initiales
export async function seedDatabase() {
  const initialCourses = [
    {
      title: "Introduction à ChatGPT",
      description: "Découvrez les bases de ChatGPT et comment l'utiliser efficacement",
      video_url: "/placeholder.mp4",
      duration: 15,
      level: "débutant" as const,
      category: "IA Générative",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tools: ["ChatGPT", "OpenAI API"],
    },
    {
      title: "Prompts avancés pour l'IA",
      description: "Maîtrisez l'art du prompting pour obtenir de meilleurs résultats",
      video_url: "/placeholder.mp4",
      duration: 25,
      level: "intermédiaire" as const,
      category: "Techniques",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tools: ["ChatGPT", "Claude", "Gemini"],
    },
    {
      title: "IA pour la productivité",
      description: "Automatisez vos tâches quotidiennes avec l'IA",
      video_url: "/placeholder.mp4",
      duration: 20,
      level: "débutant" as const,
      category: "Productivité",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tools: ["Notion AI", "Zapier", "Make"],
    },
  ]

  const { error: coursesError } = await supabase.from("courses").insert(initialCourses)

  if (coursesError) console.error("Error seeding courses:", coursesError)

  // Insérer les guides initiaux
  const initialGuides = [
    {
      title: "Guide complet de ChatGPT",
      description: "Tout ce que vous devez savoir sur ChatGPT",
      content: `# Guide complet de ChatGPT

## Introduction
ChatGPT est un modèle de langage développé par OpenAI...

## Comment commencer
1. Créez un compte sur OpenAI
2. Accédez à ChatGPT
3. Commencez à poser vos questions

## Conseils pour de meilleurs résultats
- Soyez précis dans vos demandes
- Donnez du contexte
- Utilisez des exemples`,
      read_time: 10,
      level: "débutant" as const,
      category: "IA Générative",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tools: ["ChatGPT", "OpenAI Playground"],
    },
    {
      title: "Créer des présentations avec l'IA",
      description: "Étapes pour générer des présentations professionnelles",
      content: `# Créer des présentations avec l'IA

## Outils recommandés
- ChatGPT pour le contenu
- Gamma pour la génération automatique
- Canva AI pour le design

## Processus étape par étape
1. Définissez votre sujet et objectifs
2. Générez un plan avec l'IA
3. Créez le contenu de chaque slide
4. Ajoutez des visuels appropriés`,
      read_time: 8,
      level: "intermédiaire" as const,
      category: "Productivité",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tools: ["Gamma", "Canva AI", "Beautiful.ai"],
    },
  ]

  const { error: guidesError } = await supabase.from("guides").insert(initialGuides)

  if (guidesError) console.error("Error seeding guides:", guidesError)
}
