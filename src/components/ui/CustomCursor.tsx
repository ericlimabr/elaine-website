"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

const HIDDEN_ROUTES = ["/admin", "/login"]

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const hidden = HIDDEN_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))

  useEffect(() => {
    document.body.style.cursor = hidden ? "auto" : "none"
    return () => { document.body.style.cursor = "auto" }
  }, [hidden])

  useEffect(() => {
    if (hidden) return
    const dot = dotRef.current
    const halo = haloRef.current
    if (!dot || !halo) return

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" })
      gsap.to(halo, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" })
    }

    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [hidden])

  if (hidden) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lilas"
      />
      {/* Halo */}
      <div
        ref={haloRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lilas/50"
      />
    </>
  )
}
