"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function FloatingParticles({
  count = 20,
  className = "",
}: {
  count?: number
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const { offsetWidth: w, offsetHeight: h } = container
    const particles = container.querySelectorAll(".particle")

    const animate = (p: Element) => {
      gsap.to(p, {
        x: Math.random() * w,
        y: Math.random() * h,
        rotation: Math.random() * 360,
        duration: Math.random() * 4 + 4,
        ease: "sine.inOut",
        onComplete: () => animate(p),
      })
    }

    particles.forEach((p) => {
      gsap.set(p, {
        x: Math.random() * w,
        y: Math.random() * h,
        scale: Math.random() * 0.7 + 0.3,
        opacity: Math.random() * 0.35 + 0.15,
      })
      setTimeout(() => animate(p), Math.random() * 1000)
    })

    return () => gsap.killTweensOf(particles)
  }, [count])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="particle absolute"
          style={{
            width: (i % 3) * 2 + 3,
            height: (i % 3) * 2 + 3,
            borderRadius: "50%",
            background:
              i % 3 === 0
                ? "hsl(var(--lilas-etereo))"
                : i % 3 === 1
                  ? "hsl(var(--rosa-aurora))"
                  : "hsl(var(--dourado-sabedoria))",
          }}
        />
      ))}
    </div>
  )
}
