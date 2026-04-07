"use client"

import { useEffect, useState } from "react"
import {
  Save,
  Globe,
  Share2,
  Navigation,
  ShieldAlert,
  User,
  Camera,
} from "lucide-react"
import { sanitizeFilename } from "@/utils/files"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import AbsoluteScreenLockLoader from "../ui/AbsoluteScreenLockLoader"
import { updateSettings } from "@/app/actions/settings"
import { formatWhatsApp } from "@/utils/numbers"
import { isValidEmail, sanitizeEmail } from "@/utils/strings"

export interface SettingsState {
  authorName: string
  siteName: string
  siteTagline: string
  authorBio: string
  logoUrl: string
  authorAvatarUrl: string
  socialWhatsApp: string
  socialLinkedin: string
  socialX: string
  socialInstagram: string
  socialFacebook: string
  socialYoutube: string
  metaTitle: string
  metaDescription: string
  ogImageUrl: string
  googleAnalyticsId: string
  postsPerPage: number
  //enableComments: boolean
  maintenanceMode: boolean
  customScriptsHead: string
  customScriptsFooter: string
  //footerText: string
  contactEmail: string
  //contactPhone: string
}

export default function SettingsPageComponent({
  initialSettings,
}: {
  initialSettings: any
}) {
  const { toast } = useToast()

  const [settings, setSettings] = useState<SettingsState>(initialSettings ?? {
    authorName: "",
    siteName: "",
    siteTagline: "",
    authorBio: "",
    logoUrl: "",
    authorAvatarUrl: "",
    socialWhatsApp: "",
    socialLinkedin: "",
    socialX: "",
    socialInstagram: "",
    socialFacebook: "",
    socialYoutube: "",
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
    googleAnalyticsId: "",
    postsPerPage: 9,
    maintenanceMode: false,
    customScriptsHead: "",
    customScriptsFooter: "",
    contactEmail: "",
  })

  const [activeTab, setActiveTab] = useState("geral")
  const [loading, setLoading] = useState(false)

  const [isUploading, setIsUploading] = useState<string | null>(null)

  const supabase = createClient()
  const handleSettingsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "authorAvatarUrl" | "ogImageUrl",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setIsUploading(field)

      const fileName = sanitizeFilename(file.name)
      const filePath = `system/${field}-${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      setSettings((prev) => ({
        ...prev,
        [field]: publicUrl,
      }))

      toast({ title: "Imagem atualizada com sucesso" })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message,
      })
    } finally {
      setIsUploading(null)
      setLoading(false)
      e.target.value = ""
    }
  }

  const handleInputChange = (field: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSettingsUpdate = async () => {
    setLoading(true)
    try {
      if (!!settings.contactEmail && !isValidEmail(settings.contactEmail)) {
        throw new Error("O e-mail de contato está em um formato inválido")
      }

      const response = await updateSettings(settings)

      if (!response.success) {
        throw new Error(response.error || "Falha no update das configurações")
      }

      toast({ title: "Configurações atualizadas com sucesso" })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="font-serif text-2xl font-bold">
          Configurações do Sistema
        </h1>
        <button
          onClick={handleSettingsUpdate}
          disabled={loading}
          className="flex items-center gap-2 bg-primary px-4 py-2 text-white rounded-md hover:bg-primary/90 transition"
        >
          <Save className="h-4 w-4" />
          Salvar Alterações
        </button>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-4 border-b">
        {[
          { id: "geral", label: "Geral", icon: Globe },
          { id: "social", label: "Social", icon: Share2 },
          { id: "seo", label: "SEO", icon: Navigation },
          { id: "avancado", label: "Avançado", icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        {activeTab === "geral" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Logo do Portal
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-40 items-center justify-center rounded-lg border-2 border-dashed border bg-muted/50 overflow-hidden">
                    {settings?.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Sem Logo
                      </span>
                    )}
                  </div>
                  <label className="cursor-pointer bg-white border px-3 py-1.5 rounded-md text-xs font-medium hover:bg-muted/50 transition">
                    Alterar Logo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleSettingsUpload(e, "logoUrl")}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Avatar do Autor
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0">
                    {settings?.authorAvatarUrl ? (
                      <img
                        src={settings.authorAvatarUrl}
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted border-2 border-dashed border">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <button className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-white shadow-sm hover:bg-primary/90">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Recomendado: 400x400px
                    </p>
                    <label className="cursor-pointer text-xs font-bold text-primary hover:text-primary">
                      Fazer upload do rosto
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleSettingsUpload(e, "authorAvatarUrl")
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Site
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary outline-none transition"
                  defaultValue={settings?.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  placeholder="Ex: Elaine Barbosa Psicóloga"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Slogan / Tagline
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary outline-none transition"
                  defaultValue={settings?.siteTagline}
                  onChange={(e) =>
                    handleInputChange("siteTagline", e.target.value)
                  }
                  placeholder="Ex: Psicologia, Saúde Mental e Acolhimento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bio do Autor
                </label>
                <textarea
                  className="w-full border rounded-md p-2 h-32 focus:ring-2 focus:ring-primary outline-none transition"
                  defaultValue={settings?.authorBio}
                  onChange={(e) =>
                    handleInputChange("authorBio", e.target.value)
                  }
                  placeholder="Escreva uma breve biografia para o rodapé e página sobre..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="contato@exemplo.com"
                  value={settings.contactEmail || ""}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  onBlur={(e) =>
                    handleInputChange(
                      "contactEmail",
                      sanitizeEmail(e.target.value),
                    )
                  }
                />
                {settings.contactEmail &&
                  !isValidEmail(settings.contactEmail) && (
                    <p className="text-xs text-red-500 mt-1">
                      E-mail inválido. Verifique o formato.
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="(00) 99999-9999"
                  value={settings.socialWhatsApp || ""}
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value)
                    handleInputChange("socialWhatsApp", formatted)
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={settings?.socialLinkedin}
                  placeholder="https://..."
                  onChange={(e) =>
                    handleInputChange("socialLinkedin", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  X (Twitter)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={settings?.socialX}
                  placeholder="https://..."
                  onChange={(e) => handleInputChange("socialX", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={settings?.socialInstagram}
                  placeholder="https://..."
                  onChange={(e) =>
                    handleInputChange("socialInstagram", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={settings?.socialFacebook}
                  placeholder="https://..."
                  onChange={(e) =>
                    handleInputChange("socialFacebook", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  defaultValue={settings?.socialYoutube}
                  placeholder="https://..."
                  onChange={(e) =>
                    handleInputChange("socialYoutube", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              {/* Search Engine Preview Mockup */}
              <div className="p-4 bg-muted/50 rounded-lg border border mb-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Google Preview
                </span>
                <h3 className="text-blue-700 text-lg font-medium leading-tight mt-1">
                  {settings.metaTitle || settings.siteName}
                </h3>
                <p className="text-green-700 text-xs py-0.5">
                  https://psicologaelainebarbosa.com.br
                </p>
                <p className="text-foreground/80 text-xs line-clamp-2">
                  {settings.metaDescription ||
                    "Adicione uma descrição para atrair leitores no Google."}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título de SEO (Meta Title)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={settings.metaTitle || undefined}
                  onChange={(e) =>
                    handleInputChange("metaTitle", e.target.value)
                  }
                  placeholder="Título que aparece na aba do navegador e no Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição de SEO (Meta Description)
                </label>
                <textarea
                  className="w-full border rounded-md p-2 h-24"
                  value={settings.metaDescription || undefined}
                  onChange={(e) =>
                    handleInputChange("metaDescription", e.target.value)
                  }
                  placeholder="Resumo do portal para os buscadores..."
                />
              </div>

              {/* Social Share Image (OG Image) */}
              <div className="space-y-3 pt-4">
                <label className="block text-sm font-bold text-foreground">
                  Imagem de Compartilhamento (WhatsApp/Redes)
                </label>
                <div className="flex flex-col gap-4">
                  <div className="aspect-video w-full max-w-sm rounded-lg border-2 border-dashed border bg-muted/50 flex items-center justify-center overflow-hidden">
                    {settings.ogImageUrl ? (
                      <img
                        src={settings.ogImageUrl}
                        alt="OG Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Share2 className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase">
                          1200 x 630px recomendado
                        </p>
                      </div>
                    )}
                  </div>
                  <label className="w-fit cursor-pointer bg-white border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted/50 transition">
                    {isUploading === "ogImageUrl"
                      ? "Enviando..."
                      : "Escolher Imagem de Capa"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleSettingsUpload(e, "ogImageUrl")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "avancado" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Seção: Analytics e Performance */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Analytics & Performance
                </h3>
                <label className="block text-sm font-medium mb-1">
                  Google Analytics ID (G-XXXXX)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 font-mono text-sm"
                  placeholder="G-XXXXXXXXXX"
                  defaultValue={settings?.googleAnalyticsId}
                  onChange={(e) =>
                    handleInputChange("googleAnalyticsId", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Insira apenas o código de rastreamento para habilitar as
                  métricas de acesso.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Artigos por Página
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-full border rounded-md p-2"
                    defaultValue={settings?.postsPerPage || 9}
                    onChange={(e) =>
                      handleInputChange(
                        "postsPerPage",
                        parseInt(e.target.value) || 9,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <hr className="border" />

            {/* Seção: Segurança e Manutenção */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Estado do Sistema
              </h3>
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-amber-900">
                    Modo de Manutenção
                  </label>
                  <p className="text-xs text-amber-700">
                    Ao ativar, o público verá uma tela de espera enquanto você
                    trabalha.
                  </p>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.maintenanceMode ? "bg-amber-600" : "bg-muted"}`}
                    onClick={() => {
                      handleInputChange(
                        "maintenanceMode",
                        !settings?.maintenanceMode,
                      )
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.maintenanceMode ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {settings?.maintenanceMode ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border" />

            {/* Seção: Scripts Customizados */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Scripts de Terceiros
                <span className="text-xs mt-1 text-red-800">
                  {" "}
                  ● Cuidado ao inserir códigos personalizados
                </span>
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Injeção no &lt;head&gt;
                </label>
                <textarea
                  className="w-full border rounded-md p-2 h-32 font-mono text-xs bg-muted/50"
                  placeholder=""
                  onChange={(e) =>
                    handleInputChange("customScriptsHead", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Injeção no &lt;body&gt;
                </label>
                <textarea
                  className="w-full border rounded-md p-2 h-32 font-mono text-xs bg-muted/50"
                  placeholder=""
                  onChange={(e) =>
                    handleInputChange("customScriptsFooter", e.target.value)
                  }
                />
                <p className="text-xs mt-1 text-red-800">
                  Cuidado: scripts mal formatados podem quebrar o carregamento
                  do site.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AbsoluteScreenLockLoader loading={loading} loader={loading} />
    </div>
  )
}
