"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: string
  className?: string
  tag?: "h1" | "h2" | "h3" | "p" | "span"
  delay?: number
  splitBy?: "words" | "chars"
}

export default function TextReveal({
  children,
  className = "",
  tag: Tag = "h2",
  delay = 0,
  splitBy = "words",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    gsap.set(containerRef.current.querySelectorAll(".reveal-item"), {
      y: 60,
      opacity: 0,
      rotationX: -40,
    })
  }, [children, splitBy])

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const items = el.querySelectorAll(".reveal-item")

    gsap.fromTo(
      items,
      { y: 60, opacity: 0, rotationX: -40 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: splitBy === "chars" ? 0.02 : 0.08,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [children, delay, splitBy])

  const parts = splitBy === "chars" ? children.split("") : children.split(" ")

  return (
    <div ref={containerRef} style={{ perspective: 600 }}>
      <Tag className={className}>
        {parts.map((part, i) => (
          <span
            key={i}
            className="reveal-item inline-block"
            style={{ display: "inline-block" }}
          >
            {part}
            {splitBy === "words" && i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Tag>
    </div>
  )
}
