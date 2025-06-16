export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: "admin" | "user"
          has_completed_intro: boolean
          satisfaction_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: "admin" | "user"
          has_completed_intro?: boolean
          satisfaction_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: "admin" | "user"
          has_completed_intro?: boolean
          satisfaction_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          video_url: string
          duration: number
          level: "débutant" | "intermédiaire" | "avancé"
          category: string
          thumbnail: string
          tools: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          video_url: string
          duration: number
          level: "débutant" | "intermédiaire" | "avancé"
          category: string
          thumbnail: string
          tools: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          video_url?: string
          duration?: number
          level?: "débutant" | "intermédiaire" | "avancé"
          category?: string
          thumbnail?: string
          tools?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      guides: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          read_time: number
          level: "débutant" | "intermédiaire" | "avancé"
          category: string
          thumbnail: string
          tools: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          read_time: number
          level: "débutant" | "intermédiaire" | "avancé"
          category: string
          thumbnail: string
          tools: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          read_time?: number
          level?: "débutant" | "intermédiaire" | "avancé"
          category?: string
          thumbnail?: string
          tools?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          guide_id: string | null
          completed: boolean
          progress_percentage: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          guide_id?: string | null
          completed?: boolean
          progress_percentage?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          guide_id?: string | null
          completed?: boolean
          progress_percentage?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          guide_id: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          guide_id?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          guide_id?: string | null
          added_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
      }
    }
  }
}
