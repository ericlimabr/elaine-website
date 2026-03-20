"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
const logo = "/assets/logo.png"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Sobre", path: "/sobre" },
  { label: "Serviços", path: "/servicos" },
  { label: "Blog", path: "/blog" },
  { label: "Contato", path: "/contato" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuLinksRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current) return
    const links = menuLinksRef.current.querySelectorAll(".menu-link-item")

    if (menuOpen) {
      document.body.style.overflow = "hidden"
      const tl = gsap.timeline()
      tl.to(menuRef.current, {
        clipPath: "circle(150% at calc(100% - 2rem) 2rem)",
        duration: 0.6,
        ease: "power3.inOut",
      }).fromTo(
        links,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
    } else {
      document.body.style.overflow = ""
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
        duration: 0.4,
        ease: "power3.inOut",
      })
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? "glass-strong py-3" : "py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="relative z-[101] flex items-center gap-2">
            <Image src={logo} alt="Elaine Barbosa" width={48} height={48} />
            <div>
              <span className="block font-display text-lg font-bold text-gradient-mystic">
                Elaine Barbosa
              </span>
              <span className="block font-heading text-xs tracking-[0.3em] uppercase text-muted-foreground">
                Psicóloga
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-heading text-lg tracking-wide transition-colors duration-300 hover:text-lilas ${
                  pathname === link.path ? "text-lilas" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contato"
              className="px-6 py-2.5 rounded-full border border-lilas/30 font-heading text-sm tracking-wider uppercase text-lilas hover:bg-lilas/10 transition-all duration-300"
            >
              Agende uma Sessão
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative z-[101] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[99] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(260 30% 6% / 0.97), hsl(271 81% 20% / 0.97))",
          clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
        }}
      >
        <div ref={menuLinksRef} className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="menu-link-item font-display text-4xl font-bold text-foreground hover:text-gradient-mystic transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="menu-link-item mt-4 px-8 py-3 rounded-full border border-lilas/40 font-heading text-xl text-lilas"
          >
            Agende uma Sessão
          </Link>
        </div>
      </div>
    </>
  )
}
