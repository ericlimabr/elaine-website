import Image from "next/image"
import { Sparkles } from "lucide-react"
import { getSystemConfig } from "@/utils/getDbData"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getSystemConfig(["siteName"])

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-nav-bg))] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[hsl(var(--admin-nav-bg-dense))] relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-primary/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-[hsl(var(--rosa-aurora))] opacity-20 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-56 h-56 rounded-full bg-[hsl(var(--violeta-cosmico))] opacity-15 blur-[80px] pointer-events-none" />

        {/* Gradient border on the right edge */}
        <div
          className="absolute top-0 right-0 w-px h-full opacity-40 pointer-events-none"
          style={{ background: "var(--gradient-mystic)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-mystic)" }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">
            Portal Admin
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-6">
          <div
            className="w-16 h-[2px] mb-8 rounded-full"
            style={{ background: "var(--gradient-mystic)" }}
          />
          <blockquote className="space-y-4">
            <p className="font-accent text-2xl leading-relaxed text-white/90">
              "Cuidando da saúde mental da mulher maturescente com acolhimento,
              ciência e espiritualidade."
            </p>
            <footer className="font-heading text-sm tracking-widest uppercase text-gradient-mystic">
              — Elaine Barbosa
            </footer>
          </blockquote>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Elaine Barbosa"
            width={28}
            height={28}
            className="opacity-60"
          />
          <span className="text-sm text-white/40">
            {config?.siteName || "Elaine Barbosa"} &copy;{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 relative">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Portal Admin
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
