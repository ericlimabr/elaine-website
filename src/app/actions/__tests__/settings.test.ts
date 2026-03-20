import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/utils/getUser", () => ({ getUser: vi.fn() }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    globalSettings: {
      upsert: vi.fn(),
    },
  },
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

import { getUser } from "@/utils/getUser"
import { prisma } from "@/lib/prisma"
import { updateSettings } from "@/app/actions/settings"

const mockGetUser = vi.mocked(getUser)
const mockUpsert = vi.mocked(prisma.globalSettings.upsert)

const validSettings = {
  siteName: "Test Site",
  siteTagline: "Tagline",
  authorName: "Elaine Barbosa",
  authorBio: "Bio",
  logoUrl: "",
  authorAvatarUrl: "",
  socialWhatsApp: "",
  socialLinkedin: "",
  socialX: "",
  socialInstagram: "",
  socialFacebook: "",
  socialYoutube: "",
  metaTitle: "Test",
  metaDescription: "",
  ogImageUrl: "",
  googleAnalyticsId: "",
  postsPerPage: 10,
  maintenanceMode: false,
  customScriptsHead: "",
  customScriptsFooter: "",
  contactEmail: "",
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.GLOBAL_CONFIG_ID = "test-config-id"
})

// ─── auth guard ───────────────────────────────────────────────────────────────

describe("updateSettings — auth guard", () => {
  it("returns unauthorized and skips DB when unauthenticated", async () => {
    mockGetUser.mockResolvedValue(null)
    const result = await updateSettings(validSettings)
    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})

// ─── Google Analytics ID validation ──────────────────────────────────────────

describe("updateSettings — Google Analytics ID validation", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockUpsert.mockResolvedValue({} as any)
  })

  it("rejects Universal Analytics format (UA-XXXXX-X)", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "UA-12345-1",
    })
    expect(result).toEqual({
      success: false,
      error: "Google Analytics ID inválido. Use o formato G-XXXXXXXXXX.",
    })
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it("rejects an ID missing the G- prefix", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "ABCDEF",
    })
    expect(result).toEqual({
      success: false,
      error: "Google Analytics ID inválido. Use o formato G-XXXXXXXXXX.",
    })
  })

  it("rejects an ID with special characters", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "G-ABC.DEF",
    })
    expect(result).toEqual({
      success: false,
      error: "Google Analytics ID inválido. Use o formato G-XXXXXXXXXX.",
    })
  })

  it("rejects a script injection attempt in the GA ID field", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "'); alert(1) //",
    })
    expect(result).toEqual({
      success: false,
      error: "Google Analytics ID inválido. Use o formato G-XXXXXXXXXX.",
    })
  })

  it("accepts a valid uppercase GA4 ID", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "G-ABC123DEF4",
    })
    expect(result).toEqual({ success: true })
  })

  it("accepts a valid mixed-case GA4 ID (case-insensitive)", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "G-abc123def",
    })
    expect(result).toEqual({ success: true })
  })

  it("accepts an empty GA4 ID (field cleared)", async () => {
    const result = await updateSettings({
      ...validSettings,
      googleAnalyticsId: "",
    })
    expect(result).toEqual({ success: true })
  })
})

// ─── DB interaction ───────────────────────────────────────────────────────────

describe("updateSettings — DB interaction", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ id: "user-1" } as any)
    mockUpsert.mockResolvedValue({} as any)
  })

  it("calls prisma.upsert with the GLOBAL_CONFIG_ID from env", async () => {
    await updateSettings(validSettings)
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "test-config-id" } }),
    )
  })

  it("returns success after a valid upsert", async () => {
    const result = await updateSettings(validSettings)
    expect(result).toEqual({ success: true })
  })
})
