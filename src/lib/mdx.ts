import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

// Define the root directory for blog content
const BLOG_DIR = path.join(process.cwd(), "src/content")

export interface TocItem {
  level: number
  title: string
  url: string
}

export interface PostMetadata {
  title: string
  description: string
  author: string
  date: string
  published: boolean
  tags: string[]
  slug: string
  image?: string
  imageCaption?: string
}

export interface Post {
  metadata: PostMetadata
  content: string
  toc: TocItem[]
}

// Helper to convert heading text into a URL-friendly slug
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

// Extract headings (h2 and h3) from markdown content
function extractToc(content: string): TocItem[] {
  const headingRegex = /^(##|###) (.*$)/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const url = `#${slugify(title)}`

    toc.push({ level, title, url })
  }

  return toc
}

// Retrieve all posts sorted by date
export async function getAllPosts(): Promise<PostMetadata[]> {
  const files = await fs.readdir(BLOG_DIR)

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(BLOG_DIR, file)
        const fileContent = await fs.readFile(filePath, "utf8")
        const { data } = matter(fileContent)

        return {
          ...data,
          slug: file.replace(".mdx", ""),
        } as PostMetadata
      }),
  )

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Retrieve a single post by its slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    const fileContent = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(fileContent)

    // Generate TOC based on the raw markdown content
    const toc = extractToc(content)

    return {
      metadata: {
        ...data,
        slug,
      } as PostMetadata,
      content,
      toc,
    }
  } catch (error) {
    // Return null if the file does not exist
    return null
  }
}
