
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
