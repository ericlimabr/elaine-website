export function sanitizeFilename(filename: string): string {
  const extension = filename.split(".").pop()
  const nameWithoutExtension = filename.split(".").slice(0, -1).join(".")

  const sanitized = nameWithoutExtension
    .toLowerCase()
    .normalize("NFD") // Remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-") // Replace everything that is not a letter/number with a hyphen
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-|-$/g, "") // Remove hyphens at the beginning or end

  // Add a short timestamp to ensure it's unique, but keep the name readable
  const uniqueSuffix = Date.now().toString().slice(-4)
  return `${sanitized}-${uniqueSuffix}.${extension}`
}
