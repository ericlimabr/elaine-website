import { ReactNode } from "react"
import { FileWarning, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/styling"

interface AdminNotFoundProps {
  title?: string
  description?: string
  children?: ReactNode
  className?: string
}

export default function AdminNotFound({
  title = "Recurso não encontrado",
  description = "A página ou o registro que você está tentando acessar não existe ou foi removido permanentemente.",
  children,
  className,
}: AdminNotFoundProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] p-8 text-center",
        className,
      )}
    >
      <div className="mb-6 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800/50">
        <FileWarning className="h-12 w-12 text-zinc-400" />
      </div>

      <h2 className="font-merriweather text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        {title}
      </h2>

      <p className="max-w-md text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {children ? (
          children
        ) : (
          <Button href="/admin" icon={ArrowLeft}>
            Voltar ao Painel
          </Button>
        )}
      </div>
    </div>
  )
}
