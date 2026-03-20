//"use client"

// Smooth scroll function
export const handleScroll = (
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string | (() => void) | undefined,
) => {
  if (typeof id !== "string") return

  e.preventDefault() // Prevents the # from appearing in the URL

  const targetId = id.replace(/^#/, "")
  const element = document.getElementById(targetId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    // Optional: Updates the URL without reloading and without making the "jump"
    window.history.pushState(null, "", window.location.pathname)
  }
}
