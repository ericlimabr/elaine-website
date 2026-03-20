"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FloatingParticles from "@/components/ui/FloatingParticles"
import TextReveal from "@/components/ui/TextReveal"
import MagneticButton from "@/components/ui/MagneticButton"
import { useScrollReveal, useParallax } from "@/hooks/useGsap"
import Link from "next/link"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const heroBg = "/assets/hero-bg.jpg"

const testimonials = [
  {
    text: "A terapia com Elaine transformou minha relação comigo mesma. Encontrei força onde via fraqueza.",
    author: "Maria L., 52 anos",
  },
  {
    text: "Nos círculos de mulheres, descobri que não estou sozinha nessa jornada. A maturescência pode ser linda.",
    author: "Ana C., 48 anos",
  },
  {
    text: "Elaine me ajudou a ressignificar a menopausa. Hoje vejo esse momento como um portal de transformação.",
    author: "Patrícia R., 55 anos",
  },
]

const pillars = [
  {
    icon: "🌙",
    title: "Acolhimento",
    desc: "Espaço seguro e livre de julgamentos para sua transformação",
  },
  {
    icon: "🔬",
    title: "Ciência",
    desc: "Base científica sólida em psicologia e neurociência",
  },
  {
    icon: "💜",
    title: "Espiritualidade",
    desc: "Integração do sagrado feminino ao processo terapêutico",
  },
  {
    icon: "🌺",
    title: "Empoderamento",
    desc: "Resgate da sua potência e sabedoria ancestral",
  },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)
  const heroSubRef = useRef<HTMLDivElement>(null)
  const heroBgRef = useParallax<HTMLDivElement>(-100)
  const statsRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const manifestoRef = useScrollReveal<HTMLElement>()
  const ctaRef = useScrollReveal<HTMLElement>()

  useLayoutEffect(() => {
    if (testimonialsRef.current) {
      gsap.set(testimonialsRef.current.querySelectorAll(".testimonial-card"), {
        x: 60,
        opacity: 0,
        scale: 0.9,
      })
    }
  }, [])

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(
        heroTitleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
      ).fromTo(
        heroSubRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
    })
    return () => ctx.revert()
  }, [])

  // Counter animation
  useEffect(() => {
    if (!statsRef.current) return
    const ctx = gsap.context(() => {
      const counters = statsRef.current!.querySelectorAll(".counter-num")
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0")
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power1.inOut",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: "top 80%" },
          },
        )
      })
    })
    return () => ctx.revert()
  }, [])

  // Floating cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".pillar-card")
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, rotation: i % 2 === 0 ? -3 : 3 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        )
        gsap.to(card, {
          y: "random(-10, 10)",
          rotation: "random(-2, 2)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        })
      })
    })
    return () => ctx.revert()
  }, [])

  // Testimonials scroll animation
  useEffect(() => {
    if (!testimonialsRef.current) return
    const ctx = gsap.context(() => {
      const items = testimonialsRef.current!.querySelectorAll(".testimonial-card")
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          },
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div ref={heroBgRef} className="absolute inset-0 -top-20 -bottom-20">
          <Image src={heroBg} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-background/50" />
        </div>
        <FloatingParticles count={30} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div ref={heroTitleRef} style={{ opacity: 0 }}>
            <p className="font-accent text-2xl md:text-3xl text-rosa mb-4">
              ✦ Elaine Barbosa · Psicóloga
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
              <span className="text-gradient-mystic">Onde a Lua Roxa</span>
              <br />
              <span className="text-foreground">Encontra Sua Essência</span>
            </h1>
          </div>
          <div ref={heroSubRef} style={{ opacity: 0 }}>
            <p className="font-heading text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Psicóloga especializada na jornada da mulher maturescente.
              Ciência, espiritualidade e acolhimento em cada encontro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <MagneticButton className="bg-primary text-primary-foreground glow-primary hover:bg-primary/90">
                  Agende Sua Sessão
                </MagneticButton>
              </Link>
              <Link href="/sobre">
                <MagneticButton className="border border-foreground/20 text-foreground hover:bg-foreground/5">
                  Conheça Minha História
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-xs font-heading tracking-widest uppercase text-muted-foreground">
            Explore
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-lilas/60 to-transparent" />
        </div>
      </section>

      {/* MANIFESTO */}
      <section ref={manifestoRef} className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-8"
          >
            A Maturescência Não É Declínio. É Renascimento.
          </TextReveal>
          <p className="font-heading text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Eu acredito que a mulher madura carrega em si uma potência
            transformadora. Minha missão é ajudá-la a reconhecer, acolher e
            celebrar essa força.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: 500, label: "Mulheres atendidas", suffix: "+" },
            { num: 8, label: "Anos de experiência", suffix: "+" },
            { num: 1200, label: "Sessões realizadas", suffix: "+" },
            { num: 30, label: "Círculos de mulheres", suffix: "+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-gradient-mystic">
                <span className="counter-num" data-target={stat.num}>
                  0
                </span>
                <span>{stat.suffix}</span>
              </div>
              <p className="mt-2 font-heading text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="max-w-6xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Pilares da Minha Prática
          </TextReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="pillar-card glass rounded-2xl p-8 text-center group hover:glow-primary transition-shadow duration-500"
                style={{ opacity: 0 }}
              >
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {p.icon}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {p.title}
                </h3>
                <p className="font-heading text-muted-foreground text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Vozes da Transformação
          </TextReveal>
          <div ref={testimonialsRef} className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card glass rounded-2xl p-8 relative"
                style={{ opacity: 0 }}
              >
                <span className="text-6xl font-display text-primary/20 absolute top-4 left-6">
                  "
                </span>
                <p className="font-heading text-foreground/80 leading-relaxed italic mt-6 mb-6">
                  {t.text}
                </p>
                <p className="font-accent text-rosa text-sm">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-accent text-2xl text-rosa mb-4">
            Pronta para começar?
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sua Jornada de Transformação Começa Aqui
          </h2>
          <p className="font-heading text-xl text-muted-foreground mb-10">
            O primeiro passo é sempre o mais corajoso. Estou aqui para caminhar
            ao seu lado.
          </p>
          <Link href="/contato">
            <MagneticButton className="bg-primary text-primary-foreground glow-primary text-xl px-12 py-5">
              Agende Sua Primeira Sessão ✦
            </MagneticButton>
          </Link>
        </div>
      </section>
    </main>
  )
}
