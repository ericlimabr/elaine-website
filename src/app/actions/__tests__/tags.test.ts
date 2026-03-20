import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/utils/getUser", () => ({ getUser: vi.fn() }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tag: {
      upsert: vi.fn(),
      delete: vi.fn(),
    },
  },
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

import { getUser } from "@/utils/getUser"
import { prisma } from "@/lib/prisma"
import { createTag, deleteTag } from "@/app/actions/tags"

const mockGetUser = vi.mocked(getUser)
const mockUpsert = vi.mocked(prisma.tag.upsert)
const mockDelete = vi.mocked(prisma.tag.delete)

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── createTag ────────────────────────────────────────────────────────────────

describe("createTag — auth guard", () => {
  it("returns unauthorized and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await createTag(makeFormData({}))
    expect(result).toEqual({ error: "Unauthorized" })
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})

describe("createTag — validation", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
  })

  it("returns validation error when name is too short", async () => {
    const result = await createTag(makeFormData({ name: "a", slug: "a" }))
    expect(result).toHaveProperty("error")
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})

describe("createTag — successful creation", () => {
  it("upserts the tag and returns success for valid data", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockUpsert.mockResolvedValue({} as any)
    const result = await createTag(
      makeFormData({ name: "Psicologia", slug: "psicologia" }),
    )
    expect(result).toEqual({ success: true })
    expect(mockUpsert).toHaveBeenCalledOnce()
  })
})

// ─── deleteTag ────────────────────────────────────────────────────────────────

describe("deleteTag — auth guard", () => {
  it("returns unauthorized and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await deleteTag("tag-1")
    expect(result).toEqual({ error: "Unauthorized" })
    expect(mockDelete).not.toHaveBeenCalled()
  })
})

describe("deleteTag — successful deletion", () => {
  it("deletes the tag and returns success when authenticated", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockDelete.mockResolvedValue({} as any)
    const result = await deleteTag("tag-1")
    expect(result).toEqual({ success: true })
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "tag-1" } })
  })
})
