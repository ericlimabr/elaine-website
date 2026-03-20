"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { PostType, PostStatus, Prisma } from "@prisma/client"
import { getUser } from "@/utils/getUser"

/**
 * Validation schema for Post data
 */
const postSchema = z.object({
  title: z.string().min(5, "Title is too short (min of 5 characters)"),
  slug: z.string().min(3, "Invalid slug (min of 3 characters)"),
  content: z.string().min(10, "Content must be longer (min of 10 characters)"),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  type: z.nativeEnum(PostType),
  status: z.nativeEnum(PostStatus),
  // Array of tag IDs acting as the primary taxonomy
  tagIds: z.array(z.string()).optional(),
  // For now, we manually pass author info if no auth library is present
  authorId: z.string().optional().nullable(),
  authorName: z.string().min(1, "Author name is required"),
})

export async function createPost(formData: FormData) {
  if (!(await getUser())) return { error: "Unauthorized" }

  // Parsing tags from a JSON string or multiple fields
  const tagIdsRaw = formData.get("tagIds")
  const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw as string) : []

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    status: formData.get("status"),
    tagIds: tagIds,
    // FALLBACK: Replace with your manual session logic or hidden form fields
    authorId: formData.get("authorId"),
    authorName: formData.get("authorName") || "Desconhecido",
  }

  const validated = postSchema.safeParse(rawData)

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  try {
    const { tagIds, ...postData } = validated.data

    await prisma.post.create({
      data: {
        ...postData,
        authorName: postData.authorName, // Guaranteed by Zod

        // Connect existing tags to the post
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },

        publishedAt: postData.status === "PUBLISHED" ? new Date() : null,
      },
    })

    revalidatePath("/admin/artigos")
    revalidatePath("/blog")

    return { success: true }
  } catch (error) {
    console.error("Error creating post:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the Prisma code for "Unique constraint failed"
      if (error.code === "P2002") {
        return {
          error:
            "This slug is already in use. Please choose a different title.",
        }
      }
    }

    return { error: "Internal server error while saving the article." }
  }
}

export async function updatePost(id: string, formData: FormData) {
  if (!(await getUser())) return { error: "Unauthorized" }

  const tagIdsRaw = formData.get("tagIds")
  const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw as string) : []

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    status: formData.get("status"),
    tagIds: tagIds,
    authorName: formData.get("authorName"),
  }

  // Reuse schema but make some fields optional for updates if needed
  const validated = postSchema.partial().safeParse(rawData)

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  try {
    const currentPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    })

    const { tagIds, ...postData } = validated.data

    await prisma.post.update({
      where: { id },
      data: {
        ...(postData as any),
        // Syncing tags: disconnect all existing and connect new ones
        tags: {
          set: [],
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },

        publishedAt:
          postData.status === "PUBLISHED"
            ? currentPost?.publishedAt || new Date()
            : null,
      },
    })

    revalidatePath("/admin/artigos")
    revalidatePath(`/blog/${validated.data.slug}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating post:", error)
    return { error: "Internal error while updating the article." }
  }
}
