"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import TextReveal from "@/components/ui/TextReveal"
import MagneticButton from "@/components/ui/MagneticButton"
import { useScrollReveal } from "@/hooks/useGsap"

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: "💜",
    title: "Terapia Individual",
    desc: "Atendimento personalizado para mulheres em transição. Abordagem integrativa que une psicologia clínica, neurociência e práticas do sagrado feminino.",
    details: [
      "Sessões de 50 minutos",
      "Online ou presencial",
      "Abordagem integrativa",
    ],
  },
  {
    icon: "👥",
    title: "Grupos Terapêuticos",
    desc: "Pequenos grupos de mulheres maturescentes que compartilham experiências e apoiam-se mutuamente no processo de transformação.",
    details: [
      "Grupos de 6-8 mulheres",
      "Encontros quinzenais",
      "Temas rotativos",
    ],
  },
  {
    icon: "🎓",
    title: "Mentorias",
    desc: "Programa de mentoria para mulheres que desejam um acompanhamento mais profundo e estruturado em sua jornada de autodescoberta.",
    details: ["Programa de 3 meses", "Sessões semanais", "Material de apoio"],
  },
  {
    icon: "🌙",
    title: "Círculos de Mulheres",
    desc: "Encontros rituais que celebram as fases da lua e do feminino. Espaço de partilha, cura e reconexão com a essência.",
    details: [
      "Encontros mensais",
      "Rituais e vivências",
      "Comunidade acolhedora",
    ],
  },
  {
    icon: "📱",
    title: "Atendimento Online",
    desc: "Sessões por videochamada com a mesma qualidade e profundidade do atendimento presencial. Praticidade sem perder a conexão.",
    details: [
      "Plataforma segura",
      "Flexibilidade de horário",
      "De qualquer lugar",
    ],
  },
]

const process = [
  {
    step: "01",
    title: "Primeiro Contato",
    desc: "Uma conversa inicial gratuita para entender suas necessidades e expectativas.",
  },
  {
    step: "02",
    title: "Avaliação",
    desc: "Sessões iniciais para compreender sua história e traçar um plano terapêutico.",
  },
  {
    step: "03",
    title: "Jornada",
    desc: "Sessões regulares com abordagem integrativa, respeitando seu ritmo e processo.",
  },
  {
    step: "04",
    title: "Transformação",
    desc: "Acompanhamento das conquistas e ajustes no plano conforme sua evolução.",
  },
]

export default function Servicos() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const ctaRef = useScrollReveal<HTMLDivElement>()

  useEffect(() => {
    if (!cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll(".service-card")
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, rotateY: -10 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 85%" },
        },
      )
    })
  }, [])

  useEffect(() => {
    if (!processRef.current) return
    const steps = processRef.current.querySelectorAll(".process-step")
    steps.forEach((step) => {
      gsap.fromTo(
        step,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 85%" },
        },
      )
    })
  }, [])

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="font-accent text-2xl text-rosa mb-2">Serviços</p>
        <TextReveal
          tag="h1"
          className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
        >
          Caminhos de Transformação
        </TextReveal>
        <p className="font-heading text-xl text-muted-foreground max-w-2xl mx-auto">
          Cada jornada é única. Escolha o caminho que ressoa com você.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div
          ref={cardsRef}
          className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: 1000 }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card glass rounded-2xl p-8 group hover:glow-primary transition-all duration-500"
            >
              <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="font-heading text-muted-foreground text-sm leading-relaxed mb-6">
                {s.desc}
              </p>
              <ul className="space-y-2">
                {s.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-lilas/60" />
                    <span className="font-heading">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Como Funciona
          </TextReveal>
          <div ref={processRef} className="space-y-12">
            {process.map((p, i) => (
              <div key={p.step} className="process-step flex gap-8 items-start">
                <span className="font-display text-5xl font-bold text-gradient-mystic shrink-0">
                  {p.step}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {p.title}
                  </h3>
                  <p className="font-heading text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div ref={ctaRef} className="max-w-2xl mx-auto">
          <p className="font-accent text-2xl text-rosa mb-4">
            Pronta para dar o primeiro passo?
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Agende Uma Conversa Inicial Gratuita
          </h2>
          <Link href="/contato">
            <MagneticButton className="bg-primary text-primary-foreground glow-primary text-xl px-12 py-5">
              Quero Agendar ✦
            </MagneticButton>
          </Link>
        </div>
      </section>
    </main>
  )
}
