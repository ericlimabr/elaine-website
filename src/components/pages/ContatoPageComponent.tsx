"use client"

import { useState, useRef } from "react"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import gsap from "gsap"
import TextReveal from "@/components/ui/TextReveal"
import MagneticButton from "@/components/ui/MagneticButton"
import { useScrollReveal } from "@/hooks/useGsap"
import { submitContactForm } from "@/app/actions/contact"

const SUBJECT_OPTIONS = [
  "Agendamento de Consulta",
  "Informações sobre Atendimento",
  "Círculos de Mulheres",
  "Parcerias e Colaborações",
  "Outros",
]

interface Props {
  faqs: { id: string; question: string; answer: string }[]
  settings: {
    socialInstagram?: string | null
    socialYoutube?: string | null
    socialLinkedin?: string | null
    socialX?: string | null
    socialFacebook?: string | null
    socialWhatsApp?: string | null
  } | null
}

export default function ContatoPageComponent({ settings, faqs }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useScrollReveal<HTMLFormElement>()
  const successRef = useRef<HTMLDivElement>(null)

  const socialLinks = [
    { label: "Instagram", href: settings?.socialInstagram },
    { label: "YouTube", href: settings?.socialYoutube },
    { label: "LinkedIn", href: settings?.socialLinkedin },
    { label: "X", href: settings?.socialX },
    { label: "Facebook", href: settings?.socialFacebook },
    { label: "WhatsApp", href: settings?.socialWhatsApp },
  ].filter((s) => !!s.href)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    setIsLoading(false)

    if (!result.success) {
      setError(result.error || "Erro ao enviar mensagem. Tente novamente.")
      return
    }

    setSubmitted(true)
    if (successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
  }

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="font-accent text-2xl text-rosa mb-2">Contato</p>
        <TextReveal
          tag="h1"
          className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
        >
          Vamos Conversar?
        </TextReveal>
        <p className="font-heading text-xl text-muted-foreground max-w-2xl mx-auto">
          O primeiro passo é sempre o mais importante. Estou aqui para ouvir
          você.
        </p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {!submitted ? (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                {[
                  { name: "name", label: "Nome", type: "text" },
                  { name: "email", label: "E-mail", type: "email" },
                  { name: "telefone", label: "Telefone / WhatsApp", type: "tel" },
                ].map((field) => (
                  <div key={field.name} className="relative group">
                    <label className="block font-heading text-sm text-muted-foreground mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.name !== "telefone"}
                      className="w-full bg-muted/30 border border-border rounded-xl px-5 py-3 font-heading text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-heading text-sm text-muted-foreground mb-2">
                    Assunto
                  </label>
                  <select
                    name="subject"
                    required
                    defaultValue=""
                    className="w-full appearance-none border border-border rounded-xl px-5 py-3 font-heading text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    style={{ backgroundColor: "hsl(260, 20%, 15%)" }}
                  >
                    <option value="" disabled>Selecione um assunto</option>
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-heading text-sm text-muted-foreground mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-muted/30 border border-border rounded-xl px-5 py-3 font-heading text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <MagneticButton
                  className="w-full bg-primary text-primary-foreground glow-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Mensagem ✦"}
                </MagneticButton>
              </form>
            ) : (
              <div ref={successRef} className="glass rounded-2xl p-12 text-center">
                <span className="text-6xl block mb-4">🌙</span>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="font-heading text-muted-foreground">
                  Obrigada pelo contato. Retornarei em breve com muito carinho.
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">
                Informações
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "E-mail", value: "contato@psicologaelainebarbosa.com.br" },
                  { icon: Phone, label: "WhatsApp", value: "+55 61 99677-2480" },
                  { icon: MapPin, label: "Local", value: "Brasília, DF — Online e Presencial" },
                  { icon: Clock, label: "Horário", value: "Seg-Sex: 8h às 20h" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <info.icon className="h-5 w-5 text-rosa mt-0.5 shrink-0" />
                    <div>
                      <p className="font-heading text-xs text-muted-foreground">{info.label}</p>
                      <p className="font-heading text-sm text-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="glass rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Redes Sociais
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass rounded-full text-sm font-heading text-muted-foreground hover:text-lilas transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Perguntas Frequentes
          </TextReveal>
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={faq.id} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-heading text-foreground font-medium">{faq.question}</span>
                    <span className={`text-lilas transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: openFaq === i ? 200 : 0, opacity: openFaq === i ? 1 : 0 }}
                  >
                    <p className="px-6 pb-5 font-heading text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>}
    </main>
  )
}
