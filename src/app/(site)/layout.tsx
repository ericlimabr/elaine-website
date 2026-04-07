import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import MaintenancePageComponent from "@/components/pages/MaintenancePageComponent"
import { getSystemConfig } from "@/utils/getDbData"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  // Retrieves database settings. If it fails, returns null
  const config = await getSystemConfig([
    "metaTitle",
    "metaDescription",
    "ogImageUrl",
    "siteName",
    "siteTagline",
  ])

  // Default values ​​to avoid empty fields
  const defaultTitle = (websiteName: string) =>
    `${websiteName} - Psicóloga Especialista em Saúde Mental da Mulher`
  const defaultDesc = (websiteName: string) =>
    `Site oficial de ${websiteName}. Psicologia, saúde mental e acolhimento para a mulher maturescente.`
  const defaultSiteName = "Elaine Barbosa"
  const defaultOgImage = "/images/site/2026-01/og-image.png"

  const title = defaultTitle(config?.metaTitle ?? "Elaine Barbosa")
  const description = defaultDesc(
    config?.metaDescription ?? "Elaine Barbosa",
  )
  const siteName = config?.siteName ?? defaultSiteName
  const ogImage = config?.ogImageUrl ?? defaultOgImage

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: "https://psicologaelainebarbosa.com.br",
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
    // Ensures that search engine robots index public pages
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getSystemConfig([
    "siteName",
    "maintenanceMode",
    "socialInstagram",
    "socialYoutube",
    "socialLinkedin",
    "socialX",
    "socialFacebook",
    "socialWhatsApp",
    "contactEmail",
  ])

  return (
    <>
      {!config?.maintenanceMode && <Header />}

      {!config?.maintenanceMode ? children : <MaintenancePageComponent />}

      {!config?.maintenanceMode && <Footer settings={config} />}
    </>
  )
}
