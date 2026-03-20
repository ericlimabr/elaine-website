import { describe, it, expect } from "vitest"
import { formatFileSize, formatWhatsApp, formatCompactNumber } from "../numbers"

// ─── formatFileSize ───────────────────────────────────────────────────────────

describe("formatFileSize", () => {
  it("returns '0 Bytes' for 0", () => {
    expect(formatFileSize(0)).toBe("0 Bytes")
  })

  it("formats bytes correctly", () => {
    expect(formatFileSize(500)).toBe("500 Bytes")
  })

  it("formats kilobytes correctly", () => {
    expect(formatFileSize(1024)).toBe("1 KB")
  })

  it("formats megabytes correctly", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1 MB")
  })

  it("formats gigabytes correctly", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB")
  })

  it("rounds to 2 decimal places by default", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB")
  })

  it("respects a custom decimals argument", () => {
    expect(formatFileSize(1536, 0)).toBe("2 KB")
  })

  it("handles the 5MB upload limit boundary", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB")
  })
})

// ─── formatWhatsApp ───────────────────────────────────────────────────────────

describe("formatWhatsApp", () => {
  it("returns an empty string for empty input", () => {
    expect(formatWhatsApp("")).toBe("")
  })

  it("returns digits only for 1-2 digits", () => {
    expect(formatWhatsApp("11")).toBe("11")
  })

  it("formats partial number with DDD (3-7 digits)", () => {
    expect(formatWhatsApp("11987")).toBe("(11) 987")
  })

  it("formats a full 9-digit mobile number", () => {
    expect(formatWhatsApp("11987654321")).toBe("(11) 98765-4321")
  })

  it("formats a full 8-digit landline number", () => {
    expect(formatWhatsApp("1134567890")).toBe("(11) 34567-890")
  })

  it("strips non-digit characters before formatting", () => {
    expect(formatWhatsApp("(11) 98765-4321")).toBe("(11) 98765-4321")
  })

  it("handles falsy value safely", () => {
    expect(formatWhatsApp(null as unknown as string)).toBe("")
  })
})

// ─── formatCompactNumber ──────────────────────────────────────────────────────

describe("formatCompactNumber", () => {
  it("formats numbers below 1000 as-is", () => {
    expect(formatCompactNumber(500)).toBe("500")
  })

  it("formats thousands with 'k' suffix", () => {
    expect(formatCompactNumber(1000)).toBe("1k")
  })

  it("formats with one decimal place when needed", () => {
    expect(formatCompactNumber(1500)).toBe("1.5k")
  })

  it("formats millions with 'm' suffix", () => {
    expect(formatCompactNumber(1_000_000)).toBe("1m")
  })

  it("returns lowercase compact notation", () => {
    const result = formatCompactNumber(2_500_000)
    expect(result).toBe("2.5m")
  })
})
