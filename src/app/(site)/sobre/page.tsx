import fs from "fs"
import path from "path"
import SobreGalleryComponent from "@/components/pages/SobreGalleryComponent"

export default function Sobre() {
  const galleryDir = path.join(process.cwd(), "public/assets/gallery")
  const files = fs.readdirSync(galleryDir)
  const galleryImages = files
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .map((f) => `/assets/gallery/${f}`)

  return <SobreGalleryComponent galleryImages={galleryImages} />
}
