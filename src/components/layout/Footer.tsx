"use client"

import Link from "next/link"
import Image from "next/image"

const logo = "/assets/logo.png"

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="flex items-start gap-3">
            <Image
              src={logo}
              alt="Elaine Barbosa"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <div>
              <span className="font-display text-xl font-bold text-gradient-mystic">
                Elaine Barbosa
              </span>
              <p className="font-heading text-sm tracking-[0.2em] uppercase text-muted-foreground mt-1">
                Psicóloga CRP XX/XXXXX
              </p>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-xs">
            Cuidando da saúde mental da mulher maturescente com acolhimento,
            ciência e espiritualidade.
          </p>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Navegação
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Sobre", to: "/sobre" },
                { label: "Serviços", to: "/servicos" },
                { label: "Blog", to: "/blog" },
                { label: "Contato", to: "/contato" },
              ].map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className="text-muted-foreground hover:text-lilas transition-colors text-sm"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>contato@psicologaelainebarbosa.com.br</span>
              <span>+55 61 99677-2480</span>
              <span>Atendimento Online e Presencial</span>
            </div>
            <div className="flex gap-4 mt-4">
              {["Instagram", "LinkedIn", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-muted-foreground hover:text-lilas transition-colors text-sm"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Elaine Barbosa. Todos os direitos reservados.</span>
          <span className="font-accent text-sm text-lilas/60">
            ✨ Onde a Lua Roxa Encontra Sua Essência
          </span>
        </div>
      </div>
    </footer>
  )
}
