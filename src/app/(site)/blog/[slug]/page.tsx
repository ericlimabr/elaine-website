"use client"

import { useParams } from "next/navigation"
import { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { blogPosts } from "@/data/blogData"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogPosts.find((p) => p.slug === slug)
  const progressRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 40, opacity: 0 })
    }
  }, [slug])

  useEffect(() => {
    if (!progressRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!contentRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [slug])

  if (!post) {
    return (
      <main className="pt-32 px-6 min-h-screen text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          Artigo não encontrado
        </h1>
        <Link href="/blog" className="text-lilas font-heading hover:underline">
          ← Voltar ao Blog
        </Link>
      </main>
    )
  }

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2)
  const sections = post.content.split("\n\n")

  return (
    <main className="pt-24">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-1 z-[200] origin-left"
        style={{ background: "var(--gradient-mystic)", transform: "scaleX(0)" }}
      />

      <article ref={contentRef} className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-lilas font-heading text-sm mb-8 transition-colors"
          >
            ← Voltar ao Blog
          </Link>

          <div className="mb-8">
            <span className="px-3 py-1 rounded-full text-xs font-heading bg-primary/20 text-lilas">
              {post.category}
            </span>
            <span className="ml-3 text-xs text-muted-foreground">
              {post.readTime} de leitura
            </span>
            <span className="ml-3 text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-8">
            {post.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            {sections.map((section, i) => {
              if (section.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="font-display text-2xl font-bold text-foreground mt-12 mb-4"
                  >
                    {section.replace("## ", "")}
                  </h2>
                )
              }
              if (section.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-rosa/40 pl-6 my-8 font-accent text-xl text-rosa/80 italic"
                  >
                    {section.replace("> ", "")}
                  </blockquote>
                )
              }
              if (section.includes("1. ")) {
                const items = section.split("\n").filter(Boolean)
                return (
                  <ol
                    key={i}
                    className="list-decimal list-inside space-y-2 my-6"
                  >
                    {items.map((item, j) => (
                      <li
                        key={j}
                        className="font-heading text-foreground/80 leading-relaxed"
                      >
                        {item.replace(/^\d+\.\s\*\*(.+?)\*\*:?\s*/, "").trim()}
                        {item.match(/\*\*(.+?)\*\*/) && (
                          <strong className="text-foreground">
                            {" "}
                            {item.match(/\*\*(.+?)\*\*/)?.[1]}:{" "}
                          </strong>
                        )}
                      </li>
                    ))}
                  </ol>
                )
              }
              return (
                <p
                  key={i}
                  className="font-heading text-foreground/80 leading-relaxed mb-6"
                >
                  {section}
                </p>
              )
            })}
          </div>

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <p className="font-heading text-sm text-muted-foreground mb-4">
              Compartilhe este artigo
            </p>
            <div className="flex gap-4">
              {["WhatsApp", "LinkedIn", "Twitter"].map((s) => (
                <button
                  key={s}
                  className="px-4 py-2 glass rounded-full text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-foreground mb-8">
                Artigos Relacionados
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="glass rounded-2xl p-6 hover:glow-primary transition-shadow duration-500 group"
                  >
                    <span className="text-xs text-muted-foreground">
                      {r.category}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-foreground mt-2 group-hover:text-lilas transition-colors">
                      {r.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
