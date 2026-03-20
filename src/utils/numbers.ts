export function formatCompactNumber(number: number): string {
  const formatter = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return formatter.format(number).toLowerCase()
}

export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatWhatsApp = (value: string): string => {
  if (!value) return ""

  const digits = value.replace(/\D/g, "")

  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}
