"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "@/app/actions/faq"
import { useToast } from "@/hooks/use-toast"

type Faq = {
  id: string
  question: string
  answer: string
  order: number
  active: boolean
}

export default function FaqAdminPageComponent({ initialFaqs }: { initialFaqs: Faq[] }) {
  const { toast } = useToast()
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ question: string; answer: string }>({ question: "", answer: "" })
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    setLoading(true)
    const result = await createFaq({ question: newQuestion.trim(), answer: newAnswer.trim() })
    setLoading(false)

    if (!result.success || !result.faq) {
      toast({ variant: "destructive", title: "Erro", description: result.error })
      return
    }

    setFaqs((prev) => [...prev, result.faq!])
    setNewQuestion("")
    setNewAnswer("")
    toast({ title: "FAQ criada com sucesso." })
  }

  const handleStartEdit = (faq: Faq) => {
    setEditingId(faq.id)
    setEditData({ question: faq.question, answer: faq.answer })
  }

  const handleSaveEdit = async (id: string) => {
    setLoading(true)
    const result = await updateFaq(id, editData)
    setLoading(false)

    if (!result.success) {
      toast({ variant: "destructive", title: "Erro", description: result.error })
      return
    }

    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...editData } : f)))
    setEditingId(null)
    toast({ title: "FAQ atualizada." })
  }

  const handleToggleActive = async (faq: Faq) => {
    const result = await updateFaq(faq.id, { active: !faq.active })
    if (!result.success) return
    setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, active: !faq.active } : f)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta FAQ?")) return
    const result = await deleteFaq(id)
    if (!result.success) {
      toast({ variant: "destructive", title: "Erro", description: result.error })
      return
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    toast({ title: "FAQ removida." })
  }

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newFaqs = [...faqs]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newFaqs.length) return
    ;[newFaqs[index], newFaqs[swapIndex]] = [newFaqs[swapIndex], newFaqs[index]]
    setFaqs(newFaqs)
    await reorderFaqs(newFaqs.map((f) => f.id))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Perguntas Frequentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as FAQs exibidas na página de contato.</p>
        </div>
      </div>

      {/* New FAQ form */}
      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nova Pergunta</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Pergunta"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full border rounded-md p-2 text-foreground focus:ring-2 focus:ring-primary outline-none bg-background"
          />
          <textarea
            placeholder="Resposta"
            rows={3}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full border rounded-md p-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none bg-background"
          />
          <button
            onClick={handleCreate}
            disabled={loading || !newQuestion.trim() || !newAnswer.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
          >
            <Plus className="h-4 w-4" />
            Adicionar FAQ
          </button>
        </div>
      </div>

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhuma FAQ cadastrada ainda.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.id} className={`bg-card rounded-xl border p-4 ${!faq.active ? "opacity-60" : ""}`}>
              {editingId === faq.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.question}
                    onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                    className="w-full border rounded-md p-2 text-foreground focus:ring-2 focus:ring-primary outline-none bg-background"
                  />
                  <textarea
                    rows={3}
                    value={editData.answer}
                    onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
                    className="w-full border rounded-md p-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none bg-background"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(faq.id)}
                      disabled={loading}
                      className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="border px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0" onClick={() => handleStartEdit(faq)} role="button">
                    <p className="font-medium text-foreground text-sm">{faq.question}</p>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleMove(index, "up")} disabled={index === 0} className="p-1.5 hover:text-foreground text-muted-foreground disabled:opacity-30">
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleMove(index, "down")} disabled={index === faqs.length - 1} className="p-1.5 hover:text-foreground text-muted-foreground disabled:opacity-30">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleToggleActive(faq)} className="p-1.5 hover:text-foreground text-muted-foreground" title={faq.active ? "Ocultar" : "Exibir"}>
                      {faq.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(faq.id)} className="p-1.5 hover:text-destructive text-muted-foreground">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
