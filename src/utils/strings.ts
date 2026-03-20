export function sanitizeRawScript(content: string): string {
  // Prevent breaking out of a <script> context via </script> injection
  return content.replace(/<\/script/gi, "<\\/script")
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function isValidGoogleAnalyticsId(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id)
}

export function sanitizeEmail(email: string): string {
  if (!email) return ""

  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
