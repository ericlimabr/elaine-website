import { getSystemConfig } from "@/utils/getDbData"
import { Hammer, Mail, Instagram, Linkedin } from "lucide-react"

export default async function MaintenancePageComponent() {
  const config = await getSystemConfig([
    "socialInstagram",
    "socialLinkedin",
    "contactEmail",
  ])

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8">
        {/* Header/Logo Area */}
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-zinc-900">
            Elaine Barbosa · Psicóloga
          </h1>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-full shadow-sm border border-zinc-100">
              <Hammer className="h-8 w-8 text-indigo-600 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-zinc-800">
            Estamos em manutenção
          </h2>

          <p className="text-zinc-600 leading-relaxed">
            Prezados leitores, o portal está passando por uma atualização
            técnica para melhor servi-los. Em breve retornaremos com novos
            artigos sobre psicologia.
          </p>
        </div>

        {/* Footer/Contact */}
        <div className="pt-8 border-t border-zinc-200">
          <p className="text-sm text-zinc-400 mb-4 uppercase tracking-widest font-medium">
            Acompanhe pelas redes
          </p>
          <div className="flex justify-center gap-6">
            {config?.socialInstagram && (
              <a
                href={config.socialInstagram}
                className="text-zinc-400 hover:text-indigo-600 transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {config?.socialLinkedin && (
              <a
                href={config.socialLinkedin}
                className="text-zinc-400 hover:text-indigo-600 transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {config?.contactEmail && (
              <a
                href={`mailto:${config.contactEmail}`}
                className="text-zinc-400 hover:text-indigo-600 transition"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
