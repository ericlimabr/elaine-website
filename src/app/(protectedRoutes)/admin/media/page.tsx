"use client"

import React, { useEffect, useState } from "react"
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Copy,
  Search,
  Loader2,
  Info,
  X,
  Maximize2,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Card, CardContent } from "@/components/ui/primitives/card"
import { Checkbox } from "@/components/ui/primitives/checkbox"
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
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/utils/styling"
import { sanitizeFilename } from "@/utils/files"
import { ALLOWED_UPLOAD_TYPES } from "@/constants/allowedUploadTypes"
import { formatFileSize } from "@/utils/numbers"
import AbsoluteScreenLockLoader from "@/components/ui/AbsoluteScreenLockLoader"

interface MediaItem {
  id: string
  url: string
  name: string
  created_at: string
  last_accessed_at: string
  updated_at: string
  metadata: {
    cacheControl: string
    contentType: string
    contentLength: number
    etag: string
    httpStatusCode: number
    lastModified: string
    mimetype: string
    size: number
  }
}

export default function MediaGalleryPage() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [infoItem, setInfoItem] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)

  const supabase = createClient()
  const listAllMedia = async (): Promise<MediaItem[]> => {
    const { data, error } = await supabase.storage
      .from("blog-images")
      .list("post-covers", {
        limit: 100,
        offset: 0,
        sortBy: { column: "updated_at", order: "desc" },
      })

    if (error) {
      console.error("Error listing media:", error)
      return []
    }

    const mediaWithUrls = data.map(({ bucket_id, owner, buckets, ...file }) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("blog-images")
        .getPublicUrl(`post-covers/${file.name}`) // Full Path

      return {
        ...file,
        url: publicUrl,
      }
    })

    return (
      (mediaWithUrls.filter(
        (item) => item.name !== ".emptyFolderPlaceholder",
      ) as MediaItem[]) || []
    )
  }

  useEffect(() => {
    const fetchMedia = async () => {
      const mediaItems = await listAllMedia()
      setFilteredMedia(mediaItems)
      setLoading(false)
    }

    fetchMedia()
  }, [])

  const handleSelectItem = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMedia.map((item) => item.name))
    }
  }

  const handleDeleteSingle = (name: string) => {
    setItemToDelete(name)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSelected = () => {
    setItemToDelete(null)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    const folder = "post-covers/"

    const itemsToRemove = itemToDelete
      ? [`${folder}${itemToDelete}`]
      : selectedItems.map((name) => `${folder}${name}`)

    if (itemsToRemove.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar",
        description: "Não há imagens selecionadas para deletar.",
      })
      return
    }

    try {
      setLoading(true)
      setIsDeleting(true)

      const { error } = await supabase.storage
        .from("blog-images")
        .remove(itemsToRemove)

      if (error) throw error

      setFilteredMedia((prev) =>
        prev.filter(
          (item) => !itemsToRemove.includes(`post-covers/${item.name}`),
        ),
      )

      toast({
        title: itemsToRemove.length > 1 ? "Mídias removidas" : "Mídia removida",
        description: "O storage foi atualizado com sucesso.",
      })

      setSelectedItems([])
      setItemToDelete(null)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar",
        description: error.message,
      })
    } finally {
      setIsDeleting(false)
      setLoading(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copiada",
      description: "A URL da imagem foi copiada para a área de transferência.",
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    confirmUpload(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      confirmUpload(e.target.files)
    }
  }

  const confirmUpload = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Formato não suportado",
        description: "Envie apenas imagens (JPG, PNG, WEBP ou GIF)",
      })
      return
    }

    if (file.size > 5242880) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O limite máximo é de 5MB",
      })
      return
    }

    try {
      setLoading(true)
      setIsUploading(true)

      const fileName = sanitizeFilename(file.name)
      const filePath = `post-covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      const now = new Date().toISOString()

      const newItem: MediaItem = {
        id: Math.random().toString(36).substring(2, 9),
        url: publicUrl,
        name: fileName,
        created_at: now,
        last_accessed_at: now,
        updated_at: now,
        metadata: {
          cacheControl: "public, max-age=3600",
          contentType: file.type,
          contentLength: file.size,
          etag: "",
          httpStatusCode: 200,
          lastModified: now,
          mimetype: file.type,
          size: file.size,
        },
      }

      setFilteredMedia((prev) => [newItem, ...prev])

      toast({
        title: "Upload concluído",
        description: "A imagem já está disponível no seu vault",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha no envio",
        description: error.message || "Não foi possível carregar a imagem",
      })
    } finally {
      setIsUploading(false)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Galeria de Mídia
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie as imagens do seu portal
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="gap-2"
                disabled={isDeleting || isUploading}
              >
                <Trash2 className="h-4 w-4" />
                Excluir ({selectedItems.length})
              </Button>
            )}
            <label htmlFor="file-upload">
              <Button
                asChild
                className="gap-2 cursor-pointer"
                disabled={isDeleting || isUploading}
              >
                <span>
                  <Upload className="h-4 w-4" />
                  Enviar Imagem
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex h-40 items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
            isUploading && "pointer-events-none opacity-50",
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Enviando...</p>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Arraste imagens aqui ou{" "}
                <label
                  htmlFor="file-upload-zone"
                  className="cursor-pointer font-medium text-primary hover:underline"
                >
                  clique para enviar
                </label>
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                PNG, JPG, GIF até 5MB
              </p>
              <input
                id="file-upload-zone"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          )}
        </div>

        {/* Search and Select All */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar imagens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={
                selectedItems.length === filteredMedia.length &&
                filteredMedia.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Selecionar todos ({filteredMedia.length})
            </label>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredMedia.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-muted-foreground/25">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-muted-foreground">
                {searchQuery
                  ? "Nenhuma imagem encontrada"
                  : "Nenhuma imagem na galeria"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMedia.map((item) => (
              <React.Fragment key={item.id}>
                <Card
                  className={cn(
                    "group relative overflow-hidden transition-all duration-200 hover:shadow-lg",
                    selectedItems.includes(item.name) && "ring-2 ring-primary",
                  )}
                >
                  <CardContent className="p-0">
                    {/* Selection Checkbox */}
                    <div className="absolute left-2 top-2 z-10">
                      <Checkbox
                        checked={selectedItems.includes(item.name)}
                        onCheckedChange={() => handleSelectItem(item.name)}
                        className="h-5 w-5 border-2 border-white bg-black/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </div>

                    {/* Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Overlay with Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                        title="Ver imagem"
                        onClick={() => setPreviewItem(item)}
                        disabled={isDeleting || isUploading}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                        title="Detalhes"
                        onClick={() => setInfoItem(item.name)}
                        disabled={isDeleting || isUploading}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                        onClick={() => handleCopyUrl(item.url)}
                        title="Copiar URL"
                        disabled={isDeleting || isUploading}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-9 w-9"
                        onClick={() => handleDeleteSingle(item.name)}
                        title="Excluir"
                        disabled={isDeleting || isUploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Info Footer */}
                    <div className="border-t bg-card p-2">
                      <p className="truncate text-xs font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(item.metadata.size)} •{" "}
                        {item.updated_at.split("T")[0].replace(/-/g, "/")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {infoItem === item.name && (
                  <div className="absolute inset-x-2 bottom-2 z-20 rounded-lg bg-zinc-900 p-3 shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between border-b border-zinc-700 pb-1.5 mb-2">
                      <span className="text-[18px] font-bold uppercase tracking-wider text-zinc-400">
                        Detalhes
                      </span>
                      <button
                        onClick={() => setInfoItem(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[18px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Nome:</span>
                        <span className="font-mono text-zinc-200 truncate ml-4 min-w-30 max-w-2xl">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Tamanho:</span>
                        <span className="text-zinc-200">
                          {formatFileSize(item.metadata.size)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Tipo:</span>
                        <span className="text-zinc-200">
                          {item.metadata.mimetype.split("/")[1].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Atualização:</span>
                        <span className="text-zinc-200">
                          {item.updated_at.split("T")[0].replace(/-/g, "/")} -{" "}
                          {item.updated_at.split("T")[1].substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                {itemToDelete
                  ? "Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita."
                  : `Tem certeza que deseja excluir ${selectedItems.length} imagem(ns)? Esta ação não pode ser desfeita.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <AbsoluteScreenLockLoader
        loading={!!infoItem || loading}
        loader={loading}
        onClick={() => setInfoItem(null)}
      />

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setPreviewItem(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreviewItem(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={previewItem.url}
            alt={previewItem.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
