import { notFound } from "next/navigation"
import { marked } from "marked"
import { Metadata } from "next"
import { getPostBySlug } from "@/utils/getDbData"
import BlogPostPageComponent from "@/components/pages/BlogPostPageComponent"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.status !== "PUBLISHED") return {}

  const url = `https://psicologaelainebarbosa.com.br/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      type: "article",
      ...(post.coverImage
        ? { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt ?? undefined,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.status !== "PUBLISHED") notFound()

  const contentHtml = await marked(post.content ?? "")

  return <BlogPostPageComponent post={{ ...post, content: contentHtml }} />
}
