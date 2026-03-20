import { FileText, Video, BookOpen, Calendar, LucideIcon } from "lucide-react"
import { cn } from "@/utils/styling"

interface ActivityItem {
  id: string
  type: "article" | "session" | "video" | "event"
  title: string
  time: string
  status: "published" | "draft" | "scheduled"
}

const typeIcons: Record<ActivityItem["type"], LucideIcon> = {
  article: FileText,
  session: BookOpen,
  video: Video,
  event: Calendar,
}

const typeLabels: Record<ActivityItem["type"], string> = {
  article: "Artigo",
  session: "Sessão",
  video: "Vídeo",
  event: "Evento",
}

const statusStyles: Record<ActivityItem["status"], string> = {
  published: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-accent/20 text-accent-foreground",
}

const statusLabels: Record<ActivityItem["status"], string> = {
  published: "Publicado",
  draft: "Rascunho",
  scheduled: "Agendado",
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "article",
    title: "A Maturescência e o Sagrado Feminino",
    time: "Há 2 horas",
    status: "published",
  },
  {
    id: "2",
    type: "article",
    title: "Ansiedade no Climatério — Parte 3",
    time: "Há 5 horas",
    status: "draft",
  },
  {
    id: "3",
    type: "video",
    title: "Introdução à Psicologia Feminina",
    time: "Ontem",
    status: "published",
  },
  {
    id: "4",
    type: "event",
    title: "Círculo de Mulheres — Maturescência",
    time: "Em 3 dias",
    status: "scheduled",
  },
  {
    id: "5",
    type: "article",
    title: "Autoconhecimento na Maturidade",
    time: "Há 2 dias",
    status: "draft",
  },
]

export default function RecentActivityCard() {
  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Atividade Recente
        </h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver tudo
        </button>
      </div>
      <div className="space-y-3">
        {recentActivities.map((activity, index) => {
          const Icon = typeIcons[activity.type]
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 cursor-pointer",
                "animate-slide-in-left",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {typeLabels[activity.type]} · {activity.time}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  statusStyles[activity.status],
                )}
              >
                {statusLabels[activity.status]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
