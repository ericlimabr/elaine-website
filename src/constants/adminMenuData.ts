import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BookMarked,
  Video,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  Tag,
  ImageIcon,
  Book,
  MessageCircle,
} from "lucide-react"

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  isAvailable: boolean // Defines whether the feature is currently active (MVP)
}

const quickActions: NavItem[] = [
  {
    icon: FileText,
    label: "Novo Artigo",
    href: "/admin/artigos/novo",
    isAvailable: true,
  },
  {
    icon: BookOpen,
    label: "Nova Sessão",
    href: "/admin/sessoes/nova",
    isAvailable: false,
  },
  {
    icon: Video,
    label: "Nova Aula",
    href: "/admin/aulas/nova",
    isAvailable: false,
  },
  {
    icon: Calendar,
    label: "Novo Evento",
    href: "/admin/agenda/novo",
    isAvailable: false,
  },
]

const mainNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    isAvailable: true,
  },
  {
    icon: Tag,
    label: "Categorias",
    href: "/admin/categorias",
    isAvailable: true,
  },
  {
    icon: FileText,
    label: "Artigos",
    href: "/admin/artigos",
    isAvailable: true,
  },
  { icon: Video, label: "Aulas", href: "/admin/aulas", isAvailable: false },
  {
    icon: Calendar,
    label: "Agenda",
    href: "/admin/agenda",
    isAvailable: false,
  },
  { icon: ImageIcon, label: "Mídia", href: "/admin/media", isAvailable: true },
  {
    icon: MessageCircle,
    label: "Mensagens",
    href: "/admin/mensagens",
    isAvailable: true,
  },
]

const systemNavItems: NavItem[] = [
  {
    icon: Users,
    label: "Usuários",
    href: "/admin/usuarios",
    isAvailable: false,
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "/admin/configuracoes",
    isAvailable: true,
  },
  {
    icon: HelpCircle,
    label: "Ajuda",
    href: "/admin/ajuda",
    isAvailable: false,
  },
]

export const adminMenuData = {
  quickActions,
  mainNavItems,
  systemNavItems,
}
