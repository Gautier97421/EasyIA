"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types2/database"

type Profile = {
  id: string
  name: string
  email: string
  role: string
  hasCompletedIntro: boolean
}

export function useAuth() {
  const [user, setUser] = useState<(User & { name?: string; role?: string }) | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (!error && profileData) {
      setProfile(profileData)
      localStorage.setItem("currentUser", JSON.stringify(profileData))
    }
  }

  const getUser = async () => {
    setLoading(true)
    // tente le cache local
    const localUser = localStorage.getItem("currentUser")
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser)
        setProfile(parsed)
        setUser({ ...parsed, id: parsed.id, email: parsed.email, name: parsed.name, role: parsed.role })
        setLoading(false)
        return
      } catch {}
    }
    // sinon fetch session
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchProfile(session.user.id)
        setUser({ ...session.user, name: profile?.name, role: profile?.role })
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") localStorage.removeItem("currentUser")
      getUser()
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const isAdmin = user?.role === "admin"
  const hasCompletedIntro = profile?.hasCompletedIntro ?? false

  // Nouvelle fonction à exposer
  const refreshProfile = async () => {
    if (!user) return
    await fetchProfile(user.id)
  }

  return { user, profile, loading, isAdmin, hasCompletedIntro: profile?.hasCompletedIntro ?? false, refreshProfile }
}
