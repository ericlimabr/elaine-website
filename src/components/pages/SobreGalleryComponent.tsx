"use client"

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import TextReveal from "@/components/ui/TextReveal"
import { useScrollReveal } from "@/hooks/useGsap"

const elainePortrait = "/assets/elaine-portrait.png"

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  {
    year: "2018",
    title: "Formação em Psicologia",
    desc: "Graduação e início da jornada clínica com foco em mulheres adultas.",
  },
  {
    year: "2020",
    title: "Especialização em Maturescência",
    desc: "Aprofundamento nos estudos sobre a transição da mulher madura.",
  },
  {
    year: "2022",
    title: "Círculos de Mulheres",
    desc: "Criação dos primeiros círculos terapêuticos para mulheres maturescentes.",
  },
  {
    year: "2024",
    title: "Lua Roxa",
    desc: "Nascimento da marca e expansão do atendimento online.",
  },
  {
    year: "2026",
    title: "Hoje",
    desc: "Mais de 500 mulheres atendidas, mentorias e conteúdo digital.",
  },
]

const values = [
  { name: "Acolhimento", icon: "🤲" },
  { name: "Autenticidade", icon: "💎" },
  { name: "Coragem", icon: "🦋" },
  { name: "Ciência", icon: "🔬" },
  { name: "Espiritualidade", icon: "🌙" },
  { name: "Empatia", icon: "💜" },
]

interface Props {
  galleryImages: string[]
}

export default function SobreGalleryComponent({ galleryImages }: Props) {
  const heroImgRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const valuesRef = useScrollReveal<HTMLDivElement>()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useLayoutEffect(() => {
    if (heroImgRef.current) {
      gsap.set(heroImgRef.current, { clipPath: "circle(0% at 50% 50%)" })
    }
    if (timelineRef.current) {
      gsap.set(timelineRef.current.querySelectorAll(".timeline-item"), { x: -40, opacity: 0 })
    }
    if (galleryRef.current) {
      gsap.set(galleryRef.current.querySelectorAll(".gallery-item"), { y: 50, opacity: 0, scale: 0.9 })
    }
  }, [])

  useEffect(() => {
    if (!heroImgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(heroImgRef.current, {
        clipPath: "circle(100% at 50% 50%)",
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!timelineRef.current) return
    const ctx = gsap.context(() => {
      const items = timelineRef.current!.querySelectorAll(".timeline-item")
      items.forEach((item) => {
        gsap.to(item, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%" },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!galleryRef.current) return
    const ctx = gsap.context(() => {
      const items = galleryRef.current!.querySelectorAll(".gallery-item")
      items.forEach((item, i) => {
        gsap.to(item, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: item, start: "top 88%" },
          delay: i * 0.05,
        })
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = "hidden"
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % galleryImages.length : null,
        )
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + galleryImages.length) % galleryImages.length
            : null,
        )
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [lightboxIndex, galleryImages.length])

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div
            ref={heroImgRef}
            className="relative aspect-[3/4] max-w-md mx-auto organic-shape overflow-hidden"
          >
            <Image
              src={elainePortrait}
              alt="Elaine Barbosa"
              width={448}
              height={597}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
          <div>
            <p className="font-accent text-2xl text-rosa mb-2">Sobre mim</p>
            <TextReveal
              tag="h1"
              className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6"
            >
              Elaine Barbosa
            </TextReveal>
            <p className="font-heading text-xl text-muted-foreground leading-relaxed mb-6">
              Psicóloga, mulher maturescente e eterna aprendiz. Acredito que
              cada mulher carrega em si a sabedoria ancestral necessária para
              sua própria transformação.
            </p>
            <blockquote className="border-l-2 border-rosa/40 pl-6 font-accent text-xl text-rosa/80 italic">
              "Eu não ensino ninguém a envelhecer. Eu convido mulheres a
              renascerem."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Minha Jornada
          </TextReveal>
          <div ref={timelineRef} className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-rosa/40 to-transparent" />
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className="timeline-item relative pl-20 md:pl-0 mb-16 last:mb-0"
                style={{ opacity: 0 }}
              >
                <div
                  className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"}`}
                >
                  <span className="font-display text-3xl font-bold text-gradient-mystic">
                    {item.year}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="font-heading text-muted-foreground mt-2">
                    {item.desc}
                  </p>
                </div>
                <div className="absolute left-6 md:left-1/2 top-2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary glow-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6">
        <div ref={valuesRef} className="max-w-4xl mx-auto text-center">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold mb-16 text-foreground"
          >
            Valores que Me Guiam
          </TextReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.name}
                className="glass rounded-2xl p-6 hover:glow-primary transition-shadow duration-500 group"
              >
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300">
                  {v.icon}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {v.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — last section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-rosa/5 blur-[100px]" />
        <div className="max-w-6xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-foreground"
          >
            Galeria
          </TextReveal>
          <p className="font-heading text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Momentos de conexão, cura e celebração nos círculos de mulheres e
            eventos
          </p>
          <div
            ref={galleryRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {galleryImages.map((src, i) => (
              <button
                key={src}
                onClick={() => setLightboxIndex(i)}
                style={{ opacity: 0 }}
                className={`gallery-item group relative overflow-hidden rounded-2xl cursor-pointer ${
                  i === 0 || i === 5
                    ? "row-span-2 aspect-[3/4]"
                    : "aspect-square"
                }`}
              >
                <Image
                  src={src}
                  alt="Elaine Barbosa"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        className={`fixed bottom-8 left-8 z-[90] w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 glow-primary ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-foreground/60 hover:text-foreground text-3xl z-10"
            aria-label="Fechar"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex(
                (lightboxIndex - 1 + galleryImages.length) % galleryImages.length,
              )
            }}
            className="absolute left-4 md:left-8 text-foreground/60 hover:text-foreground text-4xl z-10"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((lightboxIndex + 1) % galleryImages.length)
            }}
            className="absolute right-4 md:right-8 text-foreground/60 hover:text-foreground text-4xl z-10"
            aria-label="Próxima"
          >
            ›
          </button>
          <div
            className="max-w-4xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex]}
              alt="Elaine Barbosa"
              width={1200}
              height={900}
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </main>
  )
}
