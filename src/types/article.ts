import { PostStatus, PostType, Prisma, Tag } from "@prisma/client"
import { Post } from "@prisma/client"

export type ArticleType = PostType // "ARTICLE" | "VIDEO" | "STUDY"
export type ArticleStatus = PostStatus // "DRAFT" | "PUBLISHED"
export type ArticlesTags = Tag

export type Article = Post

export const articleTypeLabels: Record<ArticleType, string> = {
  ARTICLE: "Artigo",
  VIDEO: "Vídeo",
  STUDY: "Material de Apoio",
}

export const articleStatusLabels: Record<ArticleStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
}

export type PostsForListing = Prisma.PostGetPayload<{
  select: {
    id: true
    title: true
    status: true
    type: true
    updatedAt: true
    publishedAt: true
  }
}>

export type PostWithoutTags = Prisma.PostGetPayload<{
  include: { tags: false }
}>

export type PostWithTags = Prisma.PostGetPayload<{
  include: { tags: true }
}>

export type ArticlesForPublicListingWithTags = Prisma.PostGetPayload<{
  select: {
    title: true
    slug: true
    excerpt: true
    status: true
    type: true
    coverImage: true
    updatedAt: true
    publishedAt: true
    tags: {
      select: {
        name: true
      }
    }
  }
}>
