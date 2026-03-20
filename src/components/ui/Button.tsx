import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/utils/styling"

interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: "primary" | "outline"
  icon?: LucideIcon
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const isInternalLink = (href: string): boolean => {
  try {
    if (href.startsWith("/") || href.startsWith("#")) return true

    const url = new URL(href)
    return (
      url.hostname === "psicologaelainebarbosa.com.br" ||
      url.hostname === "localhost"
    )
  } catch {
    return false
  }
}

export function Button({
  href,
  children,
  variant = "primary",
  icon: Icon,
  className,
  onClick,
}: ButtonProps) {
  const isThisLinkInternal = isInternalLink(href)

  const baseStyles =
    "inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition duration-300 border"

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 border-transparent",
    outline:
      "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  }

  return (
    <Link
      href={href}
      target={isThisLinkInternal ? "_self" : "_blank"}
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" aria-hidden="true" />}
      {children}
    </Link>
  )
}
