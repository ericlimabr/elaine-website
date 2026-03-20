import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/utils/getUser", () => ({ getUser: vi.fn() }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

import { getUser } from "@/utils/getUser"
import { prisma } from "@/lib/prisma"
import { createPost, updatePost } from "@/app/actions/posts"

const mockGetUser = vi.mocked(getUser)
const mockCreate = vi.mocked(prisma.post.create)
const mockUpdate = vi.mocked(prisma.post.update)
const mockFindUnique = vi.mocked(prisma.post.findUnique)

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}

const validPostFields = {
  title: "Um Título Válido",
  slug: "um-titulo-valido",
  content: "Conteúdo do artigo com mais de dez caracteres.",
  type: "ARTICLE",
  status: "DRAFT",
  authorName: "Elaine Barbosa",
  tagIds: "[]",
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── createPost ───────────────────────────────────────────────────────────────

describe("createPost — auth guard", () => {
  it("returns unauthorized and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await createPost(makeFormData({}))
    expect(result).toEqual({ error: "Unauthorized" })
    expect(mockCreate).not.toHaveBeenCalled()
  })
})

describe("createPost — validation", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
  })

  it("returns validation errors when required fields are missing", async () => {
    const result = await createPost(makeFormData({}))
    expect(result).toHaveProperty("error")
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("returns validation error when title is too short", async () => {
    const result = await createPost(
      makeFormData({ ...validPostFields, title: "Hi" }),
    )
    expect(result).toHaveProperty("error")
    expect(mockCreate).not.toHaveBeenCalled()
  })
})

describe("createPost — successful creation", () => {
  it("creates the post and returns success for valid data", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockCreate.mockResolvedValue({} as any)
    const result = await createPost(makeFormData(validPostFields))
    expect(result).toEqual({ success: true })
    expect(mockCreate).toHaveBeenCalledOnce()
  })
})

// ─── updatePost ───────────────────────────────────────────────────────────────

describe("updatePost — auth guard", () => {
  it("returns unauthorized and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await updatePost("post-1", makeFormData({}))
    expect(result).toEqual({ error: "Unauthorized" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

describe("updatePost — successful update", () => {
  it("updates the post and returns success for valid data", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockFindUnique.mockResolvedValue({
      id: "post-1",
      publishedAt: null,
      tags: [],
    } as any)
    mockUpdate.mockResolvedValue({} as any)
    const result = await updatePost("post-1", makeFormData(validPostFields))
    expect(result).toEqual({ success: true })
    expect(mockUpdate).toHaveBeenCalledOnce()
  })
})
