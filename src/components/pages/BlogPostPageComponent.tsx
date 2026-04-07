"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Tag {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  coverImage?: string | null
  publishedAt?: Date | null
  authorName: string
  tags: Tag[]
}

interface Props {
  post: Post
}

export default function BlogPostPageComponent({ post }: Props) {
  const progressRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 40, opacity: 0 })
    }
  }, [post.slug])

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
  }, [post.slug])

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <main className="pt-24">
      {/* Reading progress bar */}
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

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs font-heading bg-primary/20 text-lilas"
              >
                {tag.name}
              </span>
            ))}
            {dateLabel && (
              <span className="text-xs text-muted-foreground">{dateLabel}</span>
            )}
            <span className="text-xs text-muted-foreground">
              por {post.authorName}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-12">
            {post.title}
          </h1>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-2xl object-cover max-h-96 mb-12"
            />
          )}

          {/* Article body — stored as HTML from Tiptap */}
          <div
            className="prose prose-invert max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:font-heading prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:my-4
              prose-blockquote:border-l-2 prose-blockquote:border-rosa/40 prose-blockquote:pl-6 prose-blockquote:font-accent prose-blockquote:text-xl prose-blockquote:text-rosa/80 prose-blockquote:italic
              prose-a:text-lilas prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-lilas/80
              prose-strong:text-foreground
              prose-li:font-heading prose-li:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <p className="font-heading text-sm text-muted-foreground mb-4">
              Compartilhe este artigo
            </p>
            <div className="flex gap-4">
              {[
                {
                  label: "WhatsApp",
                  href: `https://wa.me/?text=${encodeURIComponent(post.title + " https://psicologaelainebarbosa.com.br/blog/" + post.slug)}`,
                },
                {
                  label: "LinkedIn",
                  href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://psicologaelainebarbosa.com.br/blog/" + post.slug)}`,
                },
                {
                  label: "X",
                  href: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent("https://psicologaelainebarbosa.com.br/blog/" + post.slug)}`,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 glass rounded-full text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
