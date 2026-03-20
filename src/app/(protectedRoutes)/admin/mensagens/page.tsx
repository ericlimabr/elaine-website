import { getContactMessages } from "@/app/actions/contact"
import Link from "next/link"
import { Mail, MailOpen, ChevronRight, Inbox } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function MessagesListPage() {
  const messages = await getContactMessages()

  return (
    <div className="min-h-screen bg-muted/30 text-foreground p-6 md:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Caixa de Entrada
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as mensagens de contato recebidas pelo portal.
          </p>
        </div>
        <div className="bg-card p-3 rounded-xl border shadow-sm">
          <Inbox className="h-6 w-6 text-primary" />
        </div>
      </header>

      <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <Inbox className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Tudo limpo!
            </h2>
            <p className="text-muted-foreground max-w-xs">
              Você ainda não recebeu nenhuma mensagem de contato.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => {
              const isUnread = !msg.read

              return (
                <Link
                  key={msg.id}
                  href={`/admin/mensagens/${msg.id}`}
                  className={`
                    group relative flex items-start gap-5 p-5 transition-all duration-150
                    hover:bg-muted/50
                    ${isUnread ? "bg-primary/5" : "bg-card"}
                  `}
                >
                  {/* Indicador lateral para Não Lidas */}
                  {isUnread && (
                    <span className="absolute left-0 inset-y-0 w-1 bg-primary"></span>
                  )}

                  {/* Ícone status da mensagem */}
                  <div
                    className={`p-3 rounded-full shrink-0 transition-colors ${
                      isUnread
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                    }`}
                  >
                    {isUnread ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <MailOpen className="h-5 w-5" />
                    )}
                  </div>

                  {/* Conteúdo resumido */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <p
                        className={`text-sm truncate ${
                          isUnread
                            ? "font-bold text-foreground"
                            : "font-medium text-foreground/70"
                        }`}
                      >
                        {msg.name}
                      </p>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          isUnread
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {format(new Date(msg.createdAt), "dd MMM, HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <h2
                      className={`text-base truncate ${
                        isUnread
                          ? "font-extrabold text-foreground"
                          : "font-semibold text-foreground/80"
                      }`}
                    >
                      {msg.subject}
                    </h2>

                    <p className="text-sm text-muted-foreground line-clamp-1 pr-10">
                      {msg.message}
                    </p>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
