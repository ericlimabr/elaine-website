import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/mdx"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://psicologaelainebarbosa.com.br"

  // Fetch all published posts to include in the sitemap
  const posts = await getAllPosts()

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Standard static pages of the website
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]

  return [...staticPages, ...postUrls]
}
