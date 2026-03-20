import { ImageResponse } from "next/og"
import { getPostBySlug } from "@/lib/mdx"
import { getSystemConfig } from "@/utils/getDbData"

export const alt = "Elaine Barbosa - Blog"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  const config = await getSystemConfig(["siteName"])

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
        Artigo de {config?.siteName || "Elaine Barbosa"}
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
        {post?.metadata.title}
      </div>
      <div style={{ marginTop: "40px", display: "flex", alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: "24px" }}>
          psicologaelainebarbosa.com.br
        </div>
      </div>
    </div>,
    { ...size },
  )
}
