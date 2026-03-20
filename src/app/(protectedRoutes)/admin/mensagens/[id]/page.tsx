import {
  countUnreadMessages,
  deleteContactMessage,
  getMessageAndMarkAsRead,
} from "@/app/actions/contact"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  MessageSquare,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import AdminNotFound from "@/components/features/admin/AdminNotFound"
import MarkAsUnreadComponent from "./mark-as-unread-component"
import DeleteContactMessage from "./delete-message"

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const countMessage = await countUnreadMessages(id)

  if (countMessage === 0) {
    return <AdminNotFound />
  }

  const message = await getMessageAndMarkAsRead(id)

  if (!message) {
    return <AdminNotFound />
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/admin/mensagens"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar para a lista
        </Link>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          {/* Card Header */}
          <header className="p-8 border-b bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider mb-2">
                  Mensagem Recebida
                </span>
                <h1 className="text-3xl font-extrabold text-foreground leading-tight">
                  {message.subject}
                </h1>
              </div>

              <div className="flex items-center gap-3 bg-card p-3 rounded-xl border shadow-sm">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground leading-none">
                    {format(new Date(message.createdAt), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    às {format(new Date(message.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sender Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t">
              <div className="flex items-center p-3 bg-card rounded-lg border">
                <div className="bg-primary/10 p-2 rounded-md mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                    Remetente
                  </p>
                  <p className="font-semibold text-foreground">{message.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-card rounded-lg border">
                <div className="bg-primary/10 p-2 rounded-md mr-3">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                    E-mail
                  </p>
                  <a
                    href={`mailto:${encodeURIComponent(message.email)}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Message Body */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs uppercase tracking-widest font-bold">
                Conteúdo
              </span>
            </div>

            <div className="bg-muted/40 rounded-2xl p-8 border">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed text-lg italic">
                "{message.message}"
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`RE: ${message.subject}`)}`}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all shadow-md font-bold flex items-center justify-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Responder por E-mail
              </a>

              <MarkAsUnreadComponent id={message.id} />

              <DeleteContactMessage id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
