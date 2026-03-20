import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/utils/getUser", () => ({ getUser: vi.fn() }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactMessage: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))
vi.mock("@/lib/mail", () => ({
  sendContactNotificationEmail: vi.fn().mockResolvedValue({ success: true }),
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))

import { getUser } from "@/utils/getUser"
import { prisma } from "@/lib/prisma"
import {
  submitContactForm,
  countUnreadMessages,
  getContactMessages,
  getMessageAndMarkAsRead,
  markMessageAsUnread,
  deleteContactMessage,
} from "@/app/actions/contact"

const mockGetUser = vi.mocked(getUser)
const mockCount = vi.mocked(prisma.contactMessage.count)
const mockCreate = vi.mocked(prisma.contactMessage.create)
const mockUpdate = vi.mocked(prisma.contactMessage.update)
const mockDelete = vi.mocked(prisma.contactMessage.delete)
const mockFindMany = vi.mocked(prisma.contactMessage.findMany)

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}

const validFields = {
  name: "João Silva",
  email: "joao@example.com",
  subject: "Assunto teste",
  message: "Esta é uma mensagem de teste.",
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── submitContactForm ────────────────────────────────────────────────────────

describe("submitContactForm — honeypot", () => {
  it("returns success without touching the DB when the honeypot field is filled", async () => {
    const fd = makeFormData({ ...validFields, website: "http://bot.com" })
    const result = await submitContactForm(fd)
    expect(result).toEqual({
      success: true,
      message: "Bot detected and ignored.",
    })
    expect(mockCreate).not.toHaveBeenCalled()
  })
})

describe("submitContactForm — required field validation", () => {
  it("returns error when name, email and message are all empty", async () => {
    const fd = makeFormData({ name: "", email: "", message: "" })
    const result = await submitContactForm(fd)
    expect(result).toEqual({
      success: false,
      error: "Campos obrigatórios ausentes.",
    })
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("returns error when only name is missing", async () => {
    const fd = makeFormData({ ...validFields, name: "" })
    const result = await submitContactForm(fd)
    expect(result).toEqual({
      success: false,
      error: "Campos obrigatórios ausentes.",
    })
  })

  it("returns error when only message is missing", async () => {
    const fd = makeFormData({ ...validFields, message: "" })
    const result = await submitContactForm(fd)
    expect(result).toEqual({
      success: false,
      error: "Campos obrigatórios ausentes.",
    })
  })
})

describe("submitContactForm — rate limiting", () => {
  it("blocks submission when the email already has 3 recent messages", async () => {
    mockCount.mockResolvedValue(3)
    const result = await submitContactForm(makeFormData(validFields))
    expect(result).toEqual({
      success: false,
      error: "Muitas tentativas. Tente novamente em 1 hora.",
    })
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("blocks submission when count exceeds the limit", async () => {
    mockCount.mockResolvedValue(10)
    const result = await submitContactForm(makeFormData(validFields))
    expect(result).toEqual({
      success: false,
      error: "Muitas tentativas. Tente novamente em 1 hora.",
    })
  })

  it("allows submission when count is below the limit", async () => {
    mockCount.mockResolvedValue(2)
    mockCreate.mockResolvedValue({} as any)
    const result = await submitContactForm(makeFormData(validFields))
    expect(result).toEqual({ success: true })
    expect(mockCreate).toHaveBeenCalledOnce()
  })
})

describe("submitContactForm — successful submission", () => {
  it("creates a DB record and returns success for a valid submission", async () => {
    mockCount.mockResolvedValue(0)
    mockCreate.mockResolvedValue({} as any)
    const result = await submitContactForm(makeFormData(validFields))
    expect(result).toEqual({ success: true })
    expect(mockCreate).toHaveBeenCalledOnce()
  })

  it("passes sanitized (lowercased, trimmed) email to the DB", async () => {
    mockCount.mockResolvedValue(0)
    mockCreate.mockResolvedValue({} as any)
    const fd = makeFormData({ ...validFields, email: "  JOAO@EXAMPLE.COM  " })
    await submitContactForm(fd)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "joao@example.com" }),
      }),
    )
  })
})

// ─── countUnreadMessages ──────────────────────────────────────────────────────

describe("countUnreadMessages — auth guard", () => {
  it("returns 0 and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await countUnreadMessages()
    expect(result).toBe(0)
    expect(mockCount).not.toHaveBeenCalled()
  })

  it("queries the DB and returns count when authenticated", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockCount.mockResolvedValue(5)
    const result = await countUnreadMessages()
    expect(result).toBe(5)
  })

  it("excludes the given message ID from the unread count", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockCount.mockResolvedValue(3)
    await countUnreadMessages("msg-42")
    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: "msg-42" } }),
      }),
    )
  })
})

// ─── getContactMessages ───────────────────────────────────────────────────────

describe("getContactMessages — auth guard", () => {
  it("returns empty array and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await getContactMessages()
    expect(result).toEqual([])
    expect(mockFindMany).not.toHaveBeenCalled()
  })

  it("returns messages from DB when authenticated", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    const messages = [{ id: "msg-1" }, { id: "msg-2" }]
    mockFindMany.mockResolvedValue(messages as any)
    const result = await getContactMessages()
    expect(result).toEqual(messages)
  })
})

// ─── getMessageAndMarkAsRead ──────────────────────────────────────────────────

describe("getMessageAndMarkAsRead — auth guard", () => {
  it("returns null and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await getMessageAndMarkAsRead("msg-1")
    expect(result).toBeNull()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("marks message as read and returns it when authenticated", async () => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    const msg = { id: "msg-1", read: true }
    mockUpdate.mockResolvedValue(msg as any)
    const result = await getMessageAndMarkAsRead("msg-1")
    expect(result).toEqual(msg)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "msg-1" },
      data: { read: true },
    })
  })
})

// ─── markMessageAsUnread ──────────────────────────────────────────────────────

describe("markMessageAsUnread — auth guard", () => {
  it("does not touch the DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    await markMessageAsUnread("msg-1")
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

// ─── deleteContactMessage ─────────────────────────────────────────────────────

describe("deleteContactMessage — auth guard", () => {
  it("does not touch the DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    await deleteContactMessage("msg-1")
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
