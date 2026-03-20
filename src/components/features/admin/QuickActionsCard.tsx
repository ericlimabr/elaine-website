import { Button } from "@/components/ui/primitives/button"
import { adminMenuData } from "@/constants/adminMenuData"
import Link from "next/link"

export default function QuickActionsCard() {
  const { quickActions } = adminMenuData

  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Ações Rápidas
        </h3>
        <p className="text-sm text-muted-foreground">
          Crie novo conteúdo rapidamente
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.isAvailable ? action.href : "#"}
          >
            <Button
              variant="outline"
              className={`h-auto flex-col gap-2 py-4${action.isAvailable ? " hover:border-primary hover:bg-primary/50 transition-all animate-fade-in cursor-pointer" : " cursor-not-allowed opacity-50"}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
