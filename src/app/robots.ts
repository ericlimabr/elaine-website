import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://psicologaelainebarbosa.com.br"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/login/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
