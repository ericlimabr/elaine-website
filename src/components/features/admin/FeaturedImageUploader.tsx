"use client"

import { useState } from "react"
import { X, Loader2, ImageIcon, Images } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/primitives/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/utils/styling"
import { sanitizeFilename } from "@/utils/files"
import { ALLOWED_UPLOAD_TYPES } from "@/constants/allowedUploadTypes"

interface FeaturedImageUploaderProps {
  value: string
  onChange: (url: string) => void
  onRemove: () => void
}

export function FeaturedImageUploader({
  value,
  onChange,
  onRemove,
}: FeaturedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
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
        title: "File too large",
        description: "Max size is 5MB",
      })
      return
    }

    try {
      setIsUploading(true)

      // Setup path and unique filename
      const fileName = sanitizeFilename(file.name)
      const filePath = `post-covers/${fileName}`

      // Direct upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      onChange(publicUrl)
      toast({ title: "Image uploaded" })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: `Could not save image to storage: ${error}`,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const openGallery = async () => {
    setShowGallery(true)
    if (galleryImages.length > 0) return

    setLoadingGallery(true)
    const { data, error } = await supabase.storage.from("blog-images").list("post-covers", {
      limit: 100,
      sortBy: { column: "updated_at", order: "desc" },
    })

    if (error) {
      toast({ variant: "destructive", title: "Erro ao carregar galeria" })
      setLoadingGallery(false)
      return
    }

    const images = data
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from("blog-images").getPublicUrl(`post-covers/${f.name}`).data.publicUrl,
      }))

    setGalleryImages(images)
    setLoadingGallery(false)
  }

  const handleSelectFromGallery = (url: string) => {
    onChange(url)
    setShowGallery(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          Imagem de Destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              className="h-40 w-full rounded-lg object-cover border"
              alt="Cover preview"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
              isUploading
                ? "bg-muted/50 cursor-not-allowed"
                : "hover:bg-muted/50 cursor-pointer",
            )}
          >
            <label
              className={cn(
                "flex flex-col items-center gap-2 w-full",
                isUploading ? "cursor-not-allowed" : "cursor-pointer",
              )}
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
              />

              <div className="rounded-full bg-muted p-2">
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="text-center">
                <p className="text-xs font-medium">
                  {isUploading ? "Enviando..." : "Clique para selecionar"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  PNG, JPG ou WEBP (Max 5MB)
                </p>
              </div>
            </label>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={openGallery}
          disabled={isUploading}
        >
          <Images className="h-4 w-4" />
          Selecionar da Galeria
        </Button>

        {showGallery && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Galeria</span>
              <button onClick={() => setShowGallery(false)}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {loadingGallery ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : galleryImages.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-4">Nenhuma imagem na galeria</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {galleryImages.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => handleSelectFromGallery(img.url)}
                    className="aspect-square overflow-hidden rounded border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
