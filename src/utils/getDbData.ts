"use server"

import "server-only"
import { SettingsState } from "@/components/pages/SettingsPageComponent"
import { prisma } from "@/lib/prisma"
import {
  ArticlesForPublicListingWithTags,
  PostsForListing,
  PostWithoutTags,
  PostWithTags,
} from "@/types/article"
import { $Enums } from "@prisma/client"

type SettingsKeys = keyof SettingsState

export async function getSystemConfig(): Promise<SettingsState | null>

export async function getSystemConfig<K extends SettingsKeys>(
  fields: K[],
): Promise<Pick<SettingsState, K> | null>

export async function getSystemConfig<K extends SettingsKeys>(
  fields?: K[],
): Promise<SettingsState | Pick<SettingsState, K> | null> {
  const id = process.env.GLOBAL_CONFIG_ID

  try {
    if (!id)
      throw new Error("GLOBAL_CONFIG_ID not defined in environment variables")

    const select = fields?.reduce(
      (acc, field) => {
        acc[field] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    const config = await prisma.globalSettings.findUnique({
      where: { id },
      select: select && Object.keys(select).length > 0 ? select : undefined,
    })

    if (!config) return null

    if (!fields || fields.length === 0) {
      const { id: _, ...rest } = config as any
      return rest as SettingsState
    }

    return config as Pick<SettingsState, K>
  } catch (error) {
    console.error("Falha ao buscar config no banco (Build-time):", error)
    return null
  }
}

export async function getAllTags() {
  return await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true }, // This populates the tag._count.posts field that we use in the table.
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function getPostById(id: string) {
  if (!id) {
    console.warn("post called with empty id")
    return null
  }

  return await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  })
}

export async function getPostBySlug(slug: string) {
  if (!slug) {
    console.warn("post called with empty slug")
    return null
  }

  return await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  })
}

export async function getAllPosts(): Promise<PostWithoutTags[]> {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getAllPostsForListing(): Promise<PostsForListing[]> {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      type: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getAllPostsWithTags(): Promise<PostWithTags[]> {
  return await prisma.post.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getAllArticlesForPublicListingWithTags({
  limit,
  skip = 0,
  tagNames = [],
}: {
  limit: number
  skip?: number
  tagNames?: string[]
}): Promise<ArticlesForPublicListingWithTags[]> {
  return await prisma.post.findMany({
    take: limit,
    skip: skip,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      status: true,
      type: true,
      coverImage: true,
      updatedAt: true,
      publishedAt: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: $Enums.PostStatus.PUBLISHED,
      type: $Enums.PostType.ARTICLE,
      ...(tagNames.length > 0 && {
        tags: {
          some: {
            name: { in: tagNames },
          },
        },
      }),
    },
  })
}

export async function getAllAuthors() {
  return await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  })
}
