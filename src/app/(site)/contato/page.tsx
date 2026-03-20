"use client"

import { useState, useRef } from "react"
import gsap from "gsap"
import TextReveal from "@/components/ui/TextReveal"
import MagneticButton from "@/components/ui/MagneticButton"
import { useScrollReveal } from "@/hooks/useGsap"

const faqs = [
  {
    q: "Como funciona a primeira sessão?",
    a: "A primeira sessão é um espaço de acolhimento onde vamos nos conhecer, entender suas necessidades e traçar juntas um plano terapêutico personalizado.",
  },
  {
    q: "Atende por plano de saúde?",
    a: "Atualmente trabalho apenas com atendimento particular. Posso fornecer recibo para reembolso junto ao seu plano.",
  },
  {
    q: "Quanto tempo dura o processo terapêutico?",
    a: "Cada processo é único. Geralmente, os primeiros resultados são sentidos em 8-12 sessões, mas a jornada é contínua e respeita seu ritmo.",
  },
  {
    q: "Os círculos de mulheres são abertos a todas?",
    a: "Sim! Os círculos são abertos a todas as mulheres que desejam se conectar com sua essência e compartilhar experiências em um espaço seguro.",
  },
]

export default function Contato() {
  const [formState, setFormState] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useScrollReveal<HTMLFormElement>()
  const successRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
                {[
                  { name: "nome", label: "Nome", type: "text" },
                  { name: "email", label: "E-mail", type: "email" },
                  {
                    name: "telefone",
                    label: "Telefone / WhatsApp",
                    type: "tel",
                  },
                ].map((field) => (
                  <div key={field.name} className="relative group">
                    <label className="block font-heading text-sm text-muted-foreground mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required
                      value={formState[field.name as keyof typeof formState]}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.name]: e.target.value,
                        })
                      }
                      className="w-full bg-muted/30 border border-border rounded-xl px-5 py-3 font-heading text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-heading text-sm text-muted-foreground mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formState.mensagem}
                    onChange={(e) =>
                      setFormState({ ...formState, mensagem: e.target.value })
                    }
                    className="w-full bg-muted/30 border border-border rounded-xl px-5 py-3 font-heading text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <MagneticButton className="w-full bg-primary text-primary-foreground glow-primary">
                  Enviar Mensagem ✦
                </MagneticButton>
              </form>
            ) : (
              <div
                ref={successRef}
                className="glass rounded-2xl p-12 text-center"
              >
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
                  {
                    icon: "📧",
                    label: "E-mail",
                    value: "contato@psicologaelainebarbosa.com.br",
                  },
                  { icon: "📱", label: "WhatsApp", value: "+55 61 99677-2480" },
                  {
                    icon: "📍",
                    label: "Local",
                    value: "Brasília, DF — Online e Presencial",
                  },
                  { icon: "🕐", label: "Horário", value: "Seg-Sex: 8h às 20h" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span className="text-xl">{info.icon}</span>
                    <div>
                      <p className="font-heading text-xs text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="font-heading text-sm text-foreground">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">
                Redes Sociais
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Instagram", "YouTube", "LinkedIn", "Telegram"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="px-4 py-2 glass rounded-full text-sm font-heading text-muted-foreground hover:text-lilas transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <TextReveal
            tag="h2"
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-foreground"
          >
            Perguntas Frequentes
          </TextReveal>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-heading text-foreground font-medium">
                    {faq.q}
                  </span>
                  <span
                    className={`text-lilas transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: openFaq === i ? 200 : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-5 font-heading text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
