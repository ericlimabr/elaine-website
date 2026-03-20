"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { cn } from "@/utils/styling"
import { adminMenuData } from "@/constants/adminMenuData"

export default function AdminSidebar({
  countUnreadMessages,
}: {
  countUnreadMessages?: number
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const { mainNavItems } = adminMenuData
  const { systemNavItems } = adminMenuData

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-admin-nav-bg-dense border-r border-admin-nav-border">
      <div className="flex h-full flex-col">
        {/* Logo / Brand */}
        <div className="flex h-16 items-center border-b border-admin-nav-border px-6 min-h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-mystic)" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-bold text-white">
                Portal Admin
              </span>
              <span className="text-xs text-admin-nav-text">
                Elaine Barbosa
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-admin-nav-text/60">
              Principal
            </span>
          </div>
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.isAvailable ? item.href : ""}
              className={cn(
                "admin-nav-link justify-between min-h-11",
                isActive(item.href) && "admin-nav-link-active",
                `${!item.isAvailable ? " cursor-not-allowed opacity-50" : ""}`,
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.label === "Mensagens" &&
                (!countUnreadMessages || countUnreadMessages === 0 ? (
                  <></>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-admin-nav-badge-bg px-2 py-1 text-xs font-medium text-admin-nav-badge-text bg-red-600 text-white">
                    {countUnreadMessages > 99 ? "99+" : countUnreadMessages}
                  </span>
                ))}
            </Link>
          ))}

          {/* Secondary Navigation */}
          <div className="mb-2 mt-8 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-admin-nav-text/60">
              Sistema
            </span>
          </div>
          {systemNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.isAvailable ? item.href : ""}
              className={cn(
                "admin-nav-link",
                isActive(item.href) && "admin-nav-link-active",
                `${!item.isAvailable ? " cursor-not-allowed opacity-50" : ""}`,
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-admin-nav-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-admin-nav-border/40 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">EB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                Elaine Barbosa
              </span>
              <span className="text-xs text-admin-nav-text">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
