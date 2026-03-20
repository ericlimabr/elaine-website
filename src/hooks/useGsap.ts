import { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal<T extends HTMLElement>(
  options?: gsap.TweenVars,
) {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { y: 60, opacity: 0 })
  }, [])
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        ...options,
      })
    })
    return () => ctx.revert()
  }, [])
  return ref
}

export function useParallax<T extends HTMLElement>(speed: number = -50) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    gsap.to(el, {
      y: speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [])
  return ref
}

export function useMagnetic<T extends HTMLElement>(strength: number = 0.3) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) * strength
      const y = (e.clientY - top - height / 2) * strength
      gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" })
    }
    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" })
    }
    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)
    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
    }
  }, [strength])
  return ref
}
