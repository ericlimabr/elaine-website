"use client"

import { ReactNode } from "react"
import { useMagnetic } from "@/hooks/useGsap"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(0.3)

  const baseClass = `magnetic-btn relative inline-flex items-center justify-center px-8 py-4 font-heading text-lg tracking-wide rounded-full overflow-hidden transition-all duration-300 ${className}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <button ref={ref} className={baseClass} onClick={onClick}>
          <span className="relative z-10">{children}</span>
          <span className="absolute inset-0 bg-primary/20 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100" />
        </button>
      </a>
    )
  }

  return (
    <button ref={ref} className={baseClass} onClick={onClick}>
      <span className="relative z-10">{children}</span>
    </button>
  )
}
