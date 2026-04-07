"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Label } from "@/components/ui/primitives/label"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erro", description: "As senhas não coincidem." })
      return
    }

    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      })
      return
    }

    toast({
      title: "Sucesso!",
      description: "Verifique seu e-mail para confirmar o cadastro.",
    })

    router.push("/login")
  }

  return (
    <>
      {/* Header */}
      <div className="text-center lg:text-left">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para o login
        </Link>
        <h1 className="font-serif text-3xl font-bold text-white">Criar nova conta</h1>
        <p className="mt-2 text-[hsl(var(--admin-nav-text))]">Preencha os dados para acessar o gerenciamento</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mt-8">
        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-nav-text))]" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-[hsl(var(--admin-nav-border))] border-[hsl(var(--admin-nav-border))] text-white placeholder:text-[hsl(var(--admin-nav-text))] focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-nav-text))]" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-[hsl(var(--admin-nav-border))] border-[hsl(var(--admin-nav-border))] text-white placeholder:text-[hsl(var(--admin-nav-text))] focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-nav-text))]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-[hsl(var(--admin-nav-border))] border-[hsl(var(--admin-nav-border))] text-white placeholder:text-[hsl(var(--admin-nav-text))] focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--admin-nav-text))] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-nav-text))]" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 bg-[hsl(var(--admin-nav-border))] border-[hsl(var(--admin-nav-border))] text-white focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-base font-medium mt-2 cursor-pointer" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Criando conta...
            </span>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[hsl(var(--admin-nav-text))] mt-8">
        Já possui uma conta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Fazer login
        </Link>
      </p>
    </>
  )
}
