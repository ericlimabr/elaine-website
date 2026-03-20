import { describe, it, expect } from "vitest"
import { ALLOWED_UPLOAD_TYPES } from "../allowedUploadTypes"

describe("ALLOWED_UPLOAD_TYPES", () => {
  it("includes image/jpeg", () => {
    expect(ALLOWED_UPLOAD_TYPES).toContain("image/jpeg")
  })

  it("includes image/png", () => {
    expect(ALLOWED_UPLOAD_TYPES).toContain("image/png")
  })

  it("includes image/webp", () => {
    expect(ALLOWED_UPLOAD_TYPES).toContain("image/webp")
  })

  it("includes image/gif", () => {
    expect(ALLOWED_UPLOAD_TYPES).toContain("image/gif")
  })

  it("does NOT include application/pdf", () => {
    expect(ALLOWED_UPLOAD_TYPES).not.toContain("application/pdf")
  })

  it("does NOT include text/html", () => {
    expect(ALLOWED_UPLOAD_TYPES).not.toContain("text/html")
  })

  it("does NOT include image/svg+xml (XSS risk)", () => {
    expect(ALLOWED_UPLOAD_TYPES).not.toContain("image/svg+xml")
  })

  it("does NOT include application/javascript", () => {
    expect(ALLOWED_UPLOAD_TYPES).not.toContain("application/javascript")
  })
})
