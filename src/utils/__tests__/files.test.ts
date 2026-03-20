import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { sanitizeFilename } from "../files"

describe("sanitizeFilename", () => {
  beforeEach(() => {
    // Fix Date.now() so the 4-digit suffix is predictable
    vi.spyOn(Date, "now").mockReturnValue(1234567890)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("preserves the file extension", () => {
    const result = sanitizeFilename("photo.jpg")
    expect(result.endsWith(".jpg")).toBe(true)
  })

  it("converts the name to lowercase", () => {
    const result = sanitizeFilename("MyPhoto.JPG")
    expect(result.startsWith("myphoto")).toBe(true)
  })

  it("removes accented characters", () => {
    const result = sanitizeFilename("fôto-ação.png")
    // accents stripped, result should only contain ascii
    expect(result).toMatch(/^[a-z0-9-]+\.\w+$/)
  })

  it("replaces spaces with hyphens", () => {
    const result = sanitizeFilename("my photo.png")
    expect(result).toContain("my-photo")
  })

  it("replaces special characters with hyphens", () => {
    const result = sanitizeFilename("file!@#name.png")
    expect(result).toMatch(/^file-+name-\d{4}\.png$/)
  })

  it("collapses consecutive hyphens into one", () => {
    const result = sanitizeFilename("my---photo.png")
    expect(result).not.toContain("--")
  })

  it("removes leading hyphens", () => {
    const result = sanitizeFilename("---photo.png")
    expect(result).not.toMatch(/^-/)
  })

  it("removes trailing hyphens before the suffix", () => {
    const result = sanitizeFilename("photo---.png")
    // the name part before the suffix should not end in a hyphen
    const namePart = result.split("-").slice(0, -1).join("-")
    expect(namePart).not.toMatch(/-$/)
  })

  it("appends a 4-digit numeric suffix before the extension", () => {
    const result = sanitizeFilename("photo.png")
    // Date.now() = 1234567890 → last 4 digits = "7890"
    expect(result).toMatch(/^photo-7890\.png$/)
  })

  it("produces a result matching the expected full pattern", () => {
    const result = sanitizeFilename("My Photo.JPEG")
    expect(result).toMatch(/^my-photo-\d{4}\.jpeg$/i)
  })
})
