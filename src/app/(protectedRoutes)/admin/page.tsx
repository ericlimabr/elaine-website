import { FileText, BookOpen, Video, Eye } from "lucide-react"
import StatCard from "@/components/features/admin/StatCard"
import RecentActivityCard from "@/components/features/admin/RecentActivityCard"
import QuickActionsCard from "@/components/features/admin/QuickActionsCard"

const stats = [
  {
    icon: FileText,
    label: "Total de Artigos",
    value: 42,
    trend: 12,
  },
  {
    icon: BookOpen,
    label: "Sermões Publicados",
    value: 28,
    trend: 8,
  },
  {
    icon: Video,
    label: "Aulas Gravadas",
    value: 15,
    trend: -3,
  },
  {
    icon: Eye,
    label: "Visualizações (mês)",
    value: 2422,
    trend: 24,
  },
]

export default function AdminPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Bem-vinda de volta, Elaine
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aqui está uma visão geral do seu portal.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity - Spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivityCard />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActionsCard />
        </div>
      </div>

      {/* Draft Alert */}
      <div className="mt-8 rounded-xl border border-border bg-muted p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              Você tem 3 rascunhos pendentes
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue trabalhando nos seus artigos e sermões não publicados
              para manter seu portal atualizado.
            </p>
            <button className="mt-2 text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-2">
              Ver rascunhos →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
