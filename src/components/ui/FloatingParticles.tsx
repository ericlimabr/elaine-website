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
    const particles = containerRef.current.querySelectorAll(".particle")
    particles.forEach((p) => {
      gsap.set(p, {
        x: `random(0, 100)vw`,
        y: `random(0, 100)vh`,
        scale: `random(0.3, 1)`,
        opacity: `random(0.15, 0.5)`,
      })
      gsap.to(p, {
        y: `random(-80, 80)`,
        x: `random(-40, 40)`,
        rotation: `random(-180, 180)`,
        duration: `random(4, 8)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: `random(0, 3)`,
      })
    })
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
