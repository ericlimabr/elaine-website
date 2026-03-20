"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Send,
  Lock,
  Unlock,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Check,
  Link,
  Link2Off,
} from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TiptapLink from "@tiptap/extension-link"
import { Markdown } from "tiptap-markdown"

import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Textarea } from "@/components/ui/primitives/textarea"
import { Label } from "@/components/ui/primitives/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card"
import { Separator } from "@/components/ui/primitives/separator"
import { Toggle } from "@/components/ui/primitives/toggle"
import { Badge } from "@/components/ui/primitives/badge" // Using Badge for the taxonomy
import { cn } from "@/utils/styling"
import { useToast } from "@/hooks/use-toast"
import { createPost, updatePost } from "@/app/actions/posts"
import { UserData } from "@/utils/getUser"
import { FeaturedImageUploader } from "../features/admin/FeaturedImageUploader"
import { ArticlesTags, ArticleStatus, ArticleType } from "@/types/article"

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface ArticleEditorPageProps {
  id?: string
  availableTags: ArticlesTags[] // Tags from DB
  userData: UserData | null
  initialData?: any // Post data from DB
}

export default function ArticleEditorPageComponent({
  id,
  availableTags,
  userData,
  initialData,
}: ArticleEditorPageProps) {
  const router = useRouter()

  const hasInjectedInitialContent = useRef(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugLocked, setSlugLocked] = useState(false)
  const [excerpt, setExcerpt] = useState("")
  const [type, setType] = useState<ArticleType>("ARTICLE")
  const [status, setStatus] = useState<ArticleStatus>("DRAFT")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]) // Replaces category string
  const [coverImage, setCoverImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const handleSetLink = () => {
    if (!linkUrl) return
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    editor?.chain().focus().setLink({ href: url, target: "_blank" }).run()
    setShowLinkInput(false)
    setLinkUrl("")
  }

  const handleRemoveLink = () => {
    editor?.chain().focus().unsetLink().run()
    setShowLinkInput(false)
    setLinkUrl("")
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ html: false, tightLists: true }),
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: initialData?.content || "",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {},
    editorProps: {
      attributes: {
        // It retains its serif typeface and the style of the portal
        class: cn(
          "min-h-125 w-full bg-transparent font-serif text-lg leading-relaxed focus:outline-none prose max-w-none",
          "prose max-w-none text-zinc-900",
          "prose-headings:text-black prose-headings:mb-4 prose-headings:mt-6",
          "prose-p:my-4",
          "[&_li_p]:my-0",
          "prose-li:my-0 prose-ul:my-2 prose-ol:my-2",
          "prose-blockquote:border-l-4 prose-blockquote:border-zinc-300 prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80",
        ),
      },
    },
  })

  // Load existing article if editing
  useEffect(() => {
    if (!!initialData && !hasInjectedInitialContent.current) {
      setTitle(initialData.title)
      setSlug(initialData.slug)
      setSlugLocked(true)
      setExcerpt(initialData.excerpt || "")
      setType(initialData.type || "ARTICLE")
      setStatus(initialData.status || "DRAFT")
      setCoverImage(initialData.coverImage || "")
      // Map tags to IDs
      setSelectedTagIds(initialData.tags?.map((t: any) => t.id) || [])

      if (editor && initialData.content) {
        editor.commands.setContent(initialData.content)
        hasInjectedInitialContent.current = true
      }
    }
  }, [initialData, editor])

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugLocked && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugLocked])

  const { toast } = useToast()

  // Toggle function for tags acting as categories
  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }

  const handleSave = useCallback(
    async (targetStatus?: ArticleStatus) => {
      if (!userData) return

      if (!editor) {
        toast({
          variant: "destructive",
          title: "Error: Editor not initialized.",
        })
        return
      }

      setIsSaving(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("excerpt", excerpt)
      formData.append("type", type)
      formData.append("coverImage", coverImage)

      const trueContent = (editor as any).storage.markdown.getMarkdown()
      formData.append("content", trueContent)

      // Mandatory authorship and taxonomy fields for the Action
      formData.append("tagIds", JSON.stringify(selectedTagIds))
      formData.append("authorName", userData.name)
      formData.append("authorId", userData.id)

      const finalStatus = targetStatus || status
      formData.append("status", finalStatus)

      try {
        let result

        if (id) {
          result = await updatePost(id, formData)
        } else {
          result = await createPost(formData)
        }

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description:
              typeof result.error === "string"
                ? result.error
                : Object.values(result.error).flat()[0] || "Erro de validação.",
          })
        } else {
          toast({
            title: id ? "Artigo atualizado" : "Artigo criado",
            description:
              finalStatus === "PUBLISHED"
                ? "Publicado."
                : "Salvo como rascunho.",
          })

          if (!id) {
            router.push("/admin/artigos")
          } else {
            setStatus(finalStatus)
          }
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Erro no servidor" })
      } finally {
        setIsSaving(false)
      }
    },
    [
      id,
      title,
      slug,
      excerpt,
      type,
      status,
      selectedTagIds,
      coverImage,
      toast,
      router,
    ],
  )

  const onSaveDraft = () => handleSave("DRAFT")
  const onPublish = () => handleSave("PUBLISHED")

  const handleRemoveImage = () => {
    setCoverImage("")
  }

  if (!userData) {
    return <div>Usuário não autenticado.</div>
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/artigos")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button onClick={onPublish} disabled={isSaving} className="gap-2">
              <Send className="h-4 w-4" />
              {status === "PUBLISHED" ? "Atualizar" : "Publicar"}
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main Content Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>H1: </span>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do artigo..."
                  className="h-auto border-0 bg-transparent px-0 font-serif text-3xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Slug */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="select-none">URL:</span>
                <span className="text-muted-foreground">/blog/</span>
                <div className="flex items-center gap-1 rounded border bg-muted/50 px-2 py-1">
                  {slugLocked ? (
                    <span className="font-mono text-xs">
                      {slug || "slug-do-artigo"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full min-w-50 bg-transparent font-mono text-xs focus:outline-none"
                      placeholder="slug-do-artigo"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setSlugLocked(!slugLocked)}
                    className="ml-1 rounded p-1 hover:bg-muted"
                  >
                    {slugLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rich Text Toolbar */}
            <div className="sticky top-16 z-10 bg-background pb-2">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted/30 p-1 text-foreground">
              <Toggle
                size="sm"
                pressed={editor?.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3 className="h-4 w-4" />
              </Toggle>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Toggle
                size="sm"
                pressed={editor?.isActive("bold")}
                onPressedChange={() =>
                  editor?.chain().focus().toggleBold().run()
                }
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor?.isActive("italic")}
                onPressedChange={() =>
                  editor?.chain().focus().toggleItalic().run()
                }
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Toggle
                size="sm"
                onPressedChange={() =>
                  editor?.chain().focus().toggleBlockquote().run()
                }
                pressed={editor?.isActive("blockquote")}
              >
                <Quote className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() =>
                  editor?.chain().focus().toggleBulletList().run()
                }
                pressed={editor?.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                pressed={editor?.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <Toggle
                size="sm"
                pressed={editor?.isActive("link") || showLinkInput}
                onPressedChange={() => {
                  setLinkUrl(editor?.getAttributes("link").href || "")
                  setShowLinkInput((v) => !v)
                }}
              >
                <Link className="h-4 w-4" />
              </Toggle>
              {editor?.isActive("link") && (
                <Toggle
                  size="sm"
                  pressed={false}
                  onPressedChange={handleRemoveLink}
                  title="Remover link"
                >
                  <Link2Off className="h-4 w-4" />
                </Toggle>
              )}
            </div>

            {showLinkInput && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <input
                  autoFocus
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSetLink()
                    if (e.key === "Escape") setShowLinkInput(false)
                  }}
                  placeholder="https://exemplo.com"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
                <button type="button" onClick={handleSetLink} className="text-sm font-medium text-primary hover:underline">
                  Inserir
                </button>
                {editor?.isActive("link") && (
                  <button type="button" onClick={handleRemoveLink} className="text-sm font-medium text-destructive hover:underline">
                    Remover
                  </button>
                )}
                <button type="button" onClick={() => setShowLinkInput(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
            </div>

            <div className="min-h-125 border rounded-md p-4 bg-muted/5 text-black">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            {/* Publication Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Publicação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium border",
                      status === "PUBLISHED"
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSaveDraft}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-3 w-3" /> Rascunho
                  </Button>
                  <Button size="sm" onClick={onPublish} disabled={isSaving}>
                    <Send className="mr-2 h-3 w-3" /> Publicar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card - Unified Taxonomy (Tags as Categories) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Categorias (Tags)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Selecione as Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {!!availableTags &&
                      availableTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={
                            selectedTagIds.includes(tag.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer gap-1"
                          onClick={() => handleToggleTag(tag.id)}
                        >
                          {tag.name}
                          {selectedTagIds.includes(tag.id) && (
                            <Check className="h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm">
                    Tipo de Conteúdo
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as ArticleType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARTICLE">Artigo</SelectItem>
                      <SelectItem value="SERMON" disabled>
                        Vídeo
                      </SelectItem>
                      <SelectItem value="STUDY" disabled>
                        Material de Apoio
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Excerpt Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Resumo (SEO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrição..."
                  className="min-h-25 resize-none text-sm"
                  maxLength={160}
                />
              </CardContent>
            </Card>

            {/* Featured Image Card */}
            <FeaturedImageUploader
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              onRemove={() => setCoverImage("")}
            />
          </div>
        </div>
      </div>
    </>
  )
}
