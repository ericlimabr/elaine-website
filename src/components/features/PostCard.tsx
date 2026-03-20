import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ArticlesForPublicListingWithTags } from "@/types/article"

export function PostCard({ post }: { post: ArticlesForPublicListingWithTags }) {
  const formattedDate = new Date(
    post.publishedAt || post.updatedAt || new Date(),
  ).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const hasImage = !!post.coverImage

  const imageSrc = hasImage
    ? (post.coverImage as string)
    : `https://placehold.co/600x400/2F3A4B/FFFFFF?text=${post.title.replace(/\s+/g, "+")}`

  return (
    <div className="group bg-gray-700 rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.03] overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden relative">
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={post.title}
            width={600}
            height={400}
            className="w-full h-full object-cover card-img-scale"
          />
        ) : (
          <Image
            src={imageSrc}
            alt={post.title}
            width={600}
            height={400}
            className="w-full h-full object-cover card-img-scale"
          />
        )}
        <div className="card-accent-border absolute inset-0 pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col grow">
        <p className="text-sm font-medium text-indigo-400 mb-2">
          {post.tags?.[0]?.name || "Psicologia"} | {formattedDate}
        </p>

        <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-300 mb-4 line-clamp-3 grow">{post.excerpt}</p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition duration-200"
        >
          Ler Artigo Completo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}
