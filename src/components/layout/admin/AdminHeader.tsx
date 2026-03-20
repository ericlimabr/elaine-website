"use client"

import { ExternalLink, Bell, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/primitives/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/primitives/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

interface AdminHeaderProps {
  breadcrumbs?: { label: string; href?: string }[]
}

function AdminHeader({
  breadcrumbs = [{ label: "Dashboard" }, { label: "Visão Geral" }],
}: AdminHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão.",
      })
      return
    }

    toast({
      title: "Sessão encerrada",
      description: "Você saiu do portal administrativo.",
    })

    router.refresh()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-admin-nav-border bg-admin-nav-bg">
      <div className="flex h-full items-center justify-between px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-admin-nav-text/50" />
              )}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "font-medium text-white"
                    : "text-admin-nav-text hover:text-white cursor-pointer transition-colors"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* View Public Site Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-admin-nav-border bg-transparent text-admin-nav-text hover:bg-admin-nav-border hover:text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Site Público
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-admin-nav-text hover:bg-admin-nav-border hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full ring-2 ring-admin-nav-border hover:ring-primary transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="Elaine Barbosa" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    EB
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card border-border"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Elaine Barbosa
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    contato@psicologaelainebarbosa.com.br
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
