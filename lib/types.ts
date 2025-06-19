
export interface UserType {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  hasCompletedIntro: boolean
  createdAt: Date
}



export interface Course {
  id: string
  title: string
  description: string
  prompt: string
  video_url: string
  duration: number
  level: "débutant" | "intermédiaire" | "avancé"
  category: string
  thumbnail: string | null
  tools: string[] // Nouveaux outils utilisés dans le cours
  created_at: string
  updated_at: string
}

export interface Guide {
  id: string
  title: string
  description: string
  content: string
  read_time: number
  level: "débutant" | "intermédiaire" | "avancé"
  category: string
  thumbnail: string | null
  tools: string[] // Nouveaux outils utilisés dans le guide
  created_at: string
  updated_at: string
}

export interface Tool {
  name: string
  description: string
  url: string
  category: string
  icon: string
}

export interface IntroGuide {
  id: string
  title: string
  description: string
  content: string
  readTime: number
}

export interface UserFavorite {
  id: string
  user_id: string
  content_type: "course" | "guide"
  content_id: string
  created_at: Date
}

export interface UserProgress {
  id: string
  user_id: string
  content_type: "course" | "guide"
  content_id: string
  completed: boolean
  completed_at?: Date
  created_at: Date
}