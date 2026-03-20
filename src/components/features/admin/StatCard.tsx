import { LucideIcon } from "lucide-react"
import { cn } from "@/utils/styling"
import { formatCompactNumber } from "@/utils/numbers"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  trend?: number
  className?: string
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  className,
}: StatCardProps) {
  const isPositive = !trend || trend > 0 ? true : false

  const formattedValue = formatCompactNumber(value)

  return (
    <div className={cn("stat-card animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {isPositive ? "+" : "-"}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="font-serif text-3xl font-bold text-foreground">
          {formattedValue}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
