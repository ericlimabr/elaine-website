import { describe, it, expect } from "vitest"
import {
  sanitizeRawScript,
  escapeHtml,
  sanitizeEmail,
  isValidEmail,
  isValidGoogleAnalyticsId,
} from "../strings"

// ─── sanitizeRawScript ────────────────────────────────────────────────────────

describe("sanitizeRawScript", () => {
  it("returns plain JavaScript unchanged", () => {
    const js = "console.log('hello world')"
    expect(sanitizeRawScript(js)).toBe(js)
  })

  it("escapes </script> to prevent script context breakout", () => {
    expect(sanitizeRawScript("</script><img onerror=alert(1)>")).toBe(
      "<\\/script><img onerror=alert(1)>",
    )
  })

  it("is case-insensitive (</SCRIPT>) — replacement is always lowercase", () => {
    expect(sanitizeRawScript("</SCRIPT>")).toBe("<\\/script>")
  })

  it("is case-insensitive (</Script>) — replacement is always lowercase", () => {
    expect(sanitizeRawScript("</Script>")).toBe("<\\/script>")
  })

  it("escapes all occurrences when multiple </script> tags are present", () => {
    const input = "a</script>b</script>c"
    expect(sanitizeRawScript(input)).toBe("a<\\/script>b<\\/script>c")
  })

  it("returns an empty string unchanged", () => {
    expect(sanitizeRawScript("")).toBe("")
  })

  it("does not affect template literals or regex containing forward slashes", () => {
    const js = "const r = /foo/gi; const s = `hello/world`"
    expect(sanitizeRawScript(js)).toBe(js)
  })

  it("does not affect normal HTML-like strings that are not </script>", () => {
    const js = "document.write('<p>hello</p>')"
    expect(sanitizeRawScript(js)).toBe(js)
  })
})

// ─── escapeHtml ───────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes < to &lt;", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;")
  })

  it("escapes > to &gt;", () => {
    expect(escapeHtml(">")).toBe("&gt;")
  })

  it("escapes & to &amp;", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry")
  })

  it('escapes " to &quot;', () => {
    expect(escapeHtml('"quoted"')).toBe("&quot;quoted&quot;")
  })

  it("escapes ' to &#39;", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s")
  })

  it("escapes a full script injection payload", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    )
  })

  it("escapes all special characters combined", () => {
    expect(escapeHtml(`<a href="url" data-x='y'>Tom & Jerry</a>`)).toBe(
      "&lt;a href=&quot;url&quot; data-x=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;",
    )
  })

  it("returns a plain string without special characters unchanged", () => {
    expect(escapeHtml("Hello world 123")).toBe("Hello world 123")
  })

  it("returns an empty string unchanged", () => {
    expect(escapeHtml("")).toBe("")
  })
})

// ─── sanitizeEmail ────────────────────────────────────────────────────────────

describe("sanitizeEmail", () => {
  it("trims leading and trailing whitespace", () => {
    expect(sanitizeEmail("  user@example.com  ")).toBe("user@example.com")
  })

  it("converts to lowercase", () => {
    expect(sanitizeEmail("User@Example.COM")).toBe("user@example.com")
  })

  it("trims and lowercases together", () => {
    expect(sanitizeEmail("  USER@EXAMPLE.COM  ")).toBe("user@example.com")
  })

  it("returns an empty string for an empty input", () => {
    expect(sanitizeEmail("")).toBe("")
  })

  it("returns an empty string for a falsy input", () => {
    expect(sanitizeEmail(null as unknown as string)).toBe("")
  })
})

// ─── isValidEmail ─────────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("returns true for a valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true)
  })

  it("returns true for a valid email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true)
  })

  it("returns true for a valid email with plus addressing", () => {
    expect(isValidEmail("user+tag@example.com")).toBe(true)
  })

  it("returns false when @ is missing", () => {
    expect(isValidEmail("userexample.com")).toBe(false)
  })

  it("returns false when domain is missing", () => {
    expect(isValidEmail("user@")).toBe(false)
  })

  it("returns false when TLD is missing", () => {
    expect(isValidEmail("user@example")).toBe(false)
  })

  it("returns false when local part is missing", () => {
    expect(isValidEmail("@example.com")).toBe(false)
  })

  it("returns false when there is a space in the email", () => {
    expect(isValidEmail("user @example.com")).toBe(false)
  })

  it("returns false for an empty string", () => {
    expect(isValidEmail("")).toBe(false)
  })
})

// ─── isValidGoogleAnalyticsId ─────────────────────────────────────────────────

describe("isValidGoogleAnalyticsId", () => {
  it("returns true for a valid uppercase GA4 ID", () => {
    expect(isValidGoogleAnalyticsId("G-ABC123DEF4")).toBe(true)
  })

  it("returns true for a valid lowercase GA4 ID (case-insensitive)", () => {
    expect(isValidGoogleAnalyticsId("G-abc123def")).toBe(true)
  })

  it("returns true for a minimal valid ID with one character after the dash", () => {
    expect(isValidGoogleAnalyticsId("G-A")).toBe(true)
  })

  it("returns false for Universal Analytics format (UA-XXXXX-X)", () => {
    expect(isValidGoogleAnalyticsId("UA-12345-1")).toBe(false)
  })

  it("returns false when G- prefix is missing", () => {
    expect(isValidGoogleAnalyticsId("ABC123")).toBe(false)
  })

  it("returns false for just 'G-' with no suffix", () => {
    expect(isValidGoogleAnalyticsId("G-")).toBe(false)
  })

  it("returns false for an ID with spaces", () => {
    expect(isValidGoogleAnalyticsId("G-ABC 123")).toBe(false)
  })

  it("returns false for an ID with special characters", () => {
    expect(isValidGoogleAnalyticsId("G-ABC.DEF")).toBe(false)
  })

  it("returns false for an empty string", () => {
    expect(isValidGoogleAnalyticsId("")).toBe(false)
  })

  it("returns false for a script injection attempt", () => {
    expect(isValidGoogleAnalyticsId("'); alert(1) //")).toBe(false)
  })
})
