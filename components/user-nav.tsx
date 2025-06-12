"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"


export function UserNav() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session?.user) {
          // Récupérer le profil utilisateur
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single()

          setUser({...data.session.user,profile: {...profileData,hasCompletedIntro: profileData.has_completed_intro, }})
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Vérifier si l'utilisateur vient de se connecter
    const justLoggedIn = localStorage.getItem("justLoggedIn")
    if (justLoggedIn) {
      localStorage.removeItem("justLoggedIn")
      window.location.reload() // Recharger une fois pour s'assurer que tout est à jour
    }

    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      checkUser()
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      // Force le rechargement complet de la page
      window.location.href = "/"
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Connexion
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Inscription</Button>
        </Link>
      </div>
    )
  }

  const isAdmin = user.profile?.role === "admin"
  const initials = user.profile?.name
    ? user.profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.profile?.name || "Utilisateur"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Mon profil</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Administration</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Se déconnecter</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
