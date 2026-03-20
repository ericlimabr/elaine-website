import "server-only"
import { createClient } from "@/utils/supabase/server"

export interface UserData {
  id: string
  name: string
}

export async function getUser(): Promise<UserData | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  if (!user) {
    console.error("No user found")
    return null
  }

  const userData = {
    id: user.id,
    name:
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "undefined",
  }

  return userData
}
