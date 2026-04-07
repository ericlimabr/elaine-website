"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import TextReveal from "@/components/ui/TextReveal"
import { ArticlesForPublicListingWithTags } from "@/types/article"
import { getAllTags } from "@/utils/getDbData"

gsap.registerPlugin(ScrollTrigger)

type Tag = Awaited<ReturnType<typeof getAllTags>>[number]

interface Props {
  posts: ArticlesForPublicListingWithTags[]
  tags: Tag[]
}

const TAG_COLORS = [
  "bg-rosa/20 text-rosa",
  "bg-primary/20 text-lilas",
  "bg-dourado/20 text-dourado",
  "bg-lilas/20 text-lilas",
  "bg-violeta/20 text-violeta",
]

export default function BlogPageComponent({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const gridRef = useRef<HTMLDivElement>(null)

  const tagColorMap = Object.fromEntries(
    tags.map((t, i) => [t.name, TAG_COLORS[i % TAG_COLORS.length]])
  )

  const filtered = posts.filter((p) => {
    const matchTag =
      activeTag === "Todos" || p.tags.some((t) => t.name === activeTag)
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchTag && matchSearch
  })

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".blog-card")
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: "power3.out" },
    )
  }, [activeTag, searchQuery])

  return (
    <main className="pt-24">
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-accent text-2xl text-rosa mb-2">Blog</p>
            <TextReveal
              tag="h1"
              className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
            >
              Biblioteca do Sagrado Feminino
            </TextReveal>
            <p className="font-heading text-xl text-muted-foreground max-w-2xl mx-auto">
              Reflexões, ciência e espiritualidade para a mulher maturescente.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-full px-6 py-3 font-heading text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <button
                onClick={() => setActiveTag("Todos")}
                className={`px-5 py-2 rounded-full font-heading text-sm tracking-wide transition-all duration-300 ${
                  activeTag === "Todos"
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setActiveTag(tag.name)}
                  className={`px-5 py-2 rounded-full font-heading text-sm tracking-wide transition-all duration-300 ${
                    activeTag === tag.name
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className={`blog-card glass rounded-2xl overflow-hidden group hover:glow-primary transition-all duration-500 ${
                    i === 0 && activeTag === "Todos" ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.name}
                          className={`px-3 py-1 rounded-full text-xs font-heading ${tagColorMap[tag.name] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-gradient-mystic transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="font-heading text-muted-foreground text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("pt-BR")
                          : new Date(post.updatedAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="font-heading text-sm text-lilas group-hover:translate-x-1 transition-transform duration-300">
                        Ler mais →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-heading text-lg py-20">
              Nenhum artigo encontrado.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
