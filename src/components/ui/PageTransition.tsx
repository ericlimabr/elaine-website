"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import gsap from "gsap"

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isAnimating = useRef(false)
  const prevPathname = useRef<string | null>(null)

  // Reveal on initial mount and on every pathname change
  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    gsap.fromTo(
      overlayRef.current,
      { scaleY: 1, transformOrigin: "bottom" },
      {
        scaleY: 0,
        duration: 0.65,
        ease: "power4.inOut",
        onComplete: () => {
          isAnimating.current = false
        },
      },
    )
  }, [pathname])

  // Intercept all internal link clicks (capture phase — fires before React/Next)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/")) return
      if (isAnimating.current) return

      e.preventDefault()
      e.stopPropagation()

      isAnimating.current = true

      gsap.fromTo(
        overlayRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 0.55,
          ease: "power4.inOut",
          onComplete: () => router.push(href),
        },
      )
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [router])

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        transform: "scaleY(1)",
        transformOrigin: "bottom",
        background: "linear-gradient(135deg, hsl(271 81% 40%), hsl(258 89% 66%), hsl(330 86% 70%))",
        pointerEvents: "none",
      }}
    />
  )
}
