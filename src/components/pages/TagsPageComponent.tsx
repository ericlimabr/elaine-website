"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Hash,
  Lock,
  Unlock,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Badge } from "@/components/ui/primitives/badge"
import { Card, CardContent } from "@/components/ui/primitives/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/primitives/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/primitives/alert-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/utils/styling"
import { useToast } from "@/hooks/use-toast"
import { createTag, deleteTag } from "@/app/actions/tags"
import { isValid, parseISO } from "date-fns"

const safeFormatDate = (dateValue: any) => {
  if (!dateValue) return "—"

  // Tenta converter para objeto Date real
  const date =
    typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue)

  // Se a data for inválida (NaN), não deixa o format rodar
  if (!isValid(date)) {
    return "Data inválida"
  }

  return format(date, "dd MMM yyyy", { locale: ptBR })
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface TagsPageProps {
  initialTags: any[]
}

export default function TagsPageComponent({ initialTags }: TagsPageProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // States for Creation
  const [newTagName, setNewTagName] = useState("")
  const [newTagSlug, setNewTagSlug] = useState("")
  const [slugLocked, setSlugLocked] = useState(false)

  // States for Listing and Filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<any>(null)

  // Auto-Slug Logic
  useEffect(() => {
    if (!slugLocked && newTagName) {
      setNewTagSlug(generateSlug(newTagName))
    }
  }, [newTagName, slugLocked])

  const filteredTags = useMemo(() => {
    return initialTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, initialTags])

  const handleDeleteRequest = (tag: any) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleSaveTag = async () => {
    if (!newTagName || !newTagSlug) return
    setIsSaving(true)

    const formData = new FormData()
    formData.append("name", newTagName)
    formData.append("slug", newTagSlug)

    const result = await createTag(formData)

    if (result?.success) {
      toast({
        title: "Tag criada!",
        description: `A tag ${newTagName} foi salva.`,
      })
      setNewTagName("")
      setNewTagSlug("")
      setSlugLocked(false)
    } else if (result?.error) {
      const msg =
        typeof result.error === "object"
          ? result.error.name?.[0] || result.error.slug?.[0]
          : result.error

      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: msg || "Erro desconhecido.",
      })
    }
    setIsSaving(false)
  }

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return

    const result = await deleteTag(tagToDelete.id)

    if (result?.success) {
      toast({ title: "Tag excluída" })
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir.",
      })
    }
    setDeleteDialogOpen(false)
    setTagToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Gestão de Tags
        </h1>
        <p className="text-sm text-muted-foreground">
          Crie e organize as etiquetas do portal
        </p>
      </div>

      {/* Formulário de Criação Rápida */}
      <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Nome da Tag */}
            <div className="grid flex-2 gap-2">
              <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                Nome da Tag
              </label>
              <Input
                placeholder="Ex: Maturescência"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="bg-background"
              />
            </div>

            {/* Slug com Trava */}
            <div className="grid flex-1 gap-2">
              <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center justify-between">
                Slug
                <button
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="text-[10px] text-primary hover:underline font-normal"
                >
                  {slugLocked ? "Liberar" : "Manual"}
                </button>
              </label>
              <div className="relative">
                <Input
                  placeholder="slug-automatico"
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(generateSlug(e.target.value))}
                  disabled={!slugLocked}
                  className={cn(
                    "bg-background font-mono text-xs pr-9",
                    !slugLocked && "opacity-70 cursor-not-allowed",
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {slugLocked ? (
                    <Unlock className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <Button
              className="gap-2 cursor-pointer h-10 px-6"
              disabled={!newTagName}
              onClick={handleSaveTag}
            >
              <Check className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Tag"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabela de Tags */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Categoria</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Uso (Posts)</TableHead>
              <TableHead className="hidden lg:table-cell">Criada em</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma tag encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow
                  key={tag.id}
                  className="group transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      {tag.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      /{tag.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-normal">
                      {tag._count?.posts || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {safeFormatDate(tag.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => console.log("Editar:", tag.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(tag)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a tag **{tagToDelete?.name}**? Isso
              removerá a associação desta etiqueta de todos os conteúdos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
