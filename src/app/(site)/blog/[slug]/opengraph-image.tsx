import { ImageResponse } from "next/og"
import { getPostBySlug } from "@/utils/getDbData"
import { getSystemConfig } from "@/utils/getDbData"

export const alt = "Elaine Barbosa - Blog"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, config] = await Promise.all([
    getPostBySlug(slug),
    getSystemConfig(["siteName"]),
  ])

  const siteName = config?.siteName || "Elaine Barbosa"
  const title = post?.title ?? siteName

  // If the article has a cover image, use it as the OG image
  if (post?.coverImage) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Dark overlay + title */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            padding: "60px 80px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ color: "#c4b5fd", fontSize: "22px", letterSpacing: "0.05em" }}>
            {siteName}
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
      </div>,
      { ...size },
    )
  }

  // Fallback: gradient with title
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #1e1b4b, #312e81)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          color: "#818cf8",
          fontSize: "24px",
          marginBottom: "20px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Artigo de {siteName}
      </div>
      <div
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: "40px" }}>
        <div style={{ color: "#94a3b8", fontSize: "24px" }}>
          psicologaelainebarbosa.com.br
        </div>
      </div>
    </div>,
    { ...size },
  )
}
