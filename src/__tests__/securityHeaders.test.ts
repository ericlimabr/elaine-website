import { describe, it, expect } from "vitest"
import nextConfig from "../../next.config"

describe("Next.js security headers", () => {
  it("exports a headers() function", () => {
    expect(typeof nextConfig.headers).toBe("function")
  })

  it("applies headers to all routes via /(.*) source pattern", async () => {
    const entries = await nextConfig.headers!()
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].source).toBe("/(.*)")
  })

  it("includes X-Frame-Options: SAMEORIGIN to prevent clickjacking", async () => {
    const headers = (await nextConfig.headers!())[0].headers
    expect(headers).toContainEqual({
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    })
  })

  it("includes X-Content-Type-Options: nosniff to prevent MIME sniffing", async () => {
    const headers = (await nextConfig.headers!())[0].headers
    expect(headers).toContainEqual({
      key: "X-Content-Type-Options",
      value: "nosniff",
    })
  })

  it("includes Referrer-Policy: strict-origin-when-cross-origin", async () => {
    const headers = (await nextConfig.headers!())[0].headers
    expect(headers).toContainEqual({
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    })
  })

  it("includes Permissions-Policy restricting camera, microphone and geolocation", async () => {
    const headers = (await nextConfig.headers!())[0].headers
    const pp = headers.find((h) => h.key === "Permissions-Policy")
    expect(pp).toBeDefined()
    expect(pp!.value).toContain("camera=()")
    expect(pp!.value).toContain("microphone=()")
    expect(pp!.value).toContain("geolocation=()")
  })

  it("does not set an overly permissive X-Frame-Options (ALLOWALL is forbidden)", async () => {
    const headers = (await nextConfig.headers!())[0].headers
    const xfo = headers.find((h) => h.key === "X-Frame-Options")
    expect(xfo!.value).not.toBe("ALLOWALL")
  })
})
