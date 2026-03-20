"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Label } from "@/components/ui/primitives/label"
import { Checkbox } from "@/components/ui/primitives/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered-email")
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data: _data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      console.error("SUPABASE COMPLETE ERROR:", error)
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description:
          error.message === "Credenciais de login inválidas"
            ? "E-mail ou senha incorretos."
            : error.message,
      })
      return
    }

    if (formData.rememberMe) {
      localStorage.setItem("remembered-email", formData.email)
    } else {
      localStorage.removeItem("remembered-email")
    }

    toast({
      title: "Login realizado!",
      description: "Bem-vinda ao portal, Elaine.",
    })

    router.refresh()
    router.push("/admin")
  }

  return (
    <div className="glass rounded-2xl p-8 md:p-10 space-y-8 border border-white/5">
      {/* Header */}
      <div className="text-center lg:text-left space-y-1">
        <h1 className="font-display text-3xl font-bold text-white">
          Bem-vinda de volta
        </h1>
        <p className="font-heading text-[hsl(var(--admin-nav-text))]">
          Acesse sua conta para gerenciar o portal
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80 font-heading text-sm">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80 font-heading text-sm">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between invisible">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, rememberMe: checked as boolean })
              }
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="remember"
              className="text-sm text-white/40 cursor-pointer font-heading"
            >
              Lembrar-me
            </Label>
          </div>
          <Link
            href="/recuperar-senha"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-heading"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium cursor-pointer text-white"
          style={{ background: "var(--gradient-mystic)" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-3 text-white/30 font-heading tracking-widest">
            Acesso restrito
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-white/30 font-heading">
        Área exclusiva do administrador.{" "}
        <Link href="/" className="text-primary/70 hover:text-primary transition-colors">
          Ir ao site público
        </Link>
      </p>
    </div>
  )
}
