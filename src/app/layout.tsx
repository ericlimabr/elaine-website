import "@/app/globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono, Inter, Merriweather } from "next/font/google"
import ScrollToTopButton from "@/components/features/ScrollToTopButton"
import CustomCursor from "@/components/ui/CustomCursor"
import { getSystemConfig } from "@/utils/getDbData"
import { sanitizeRawScript, isValidGoogleAnalyticsId } from "@/utils/strings"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
})

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSystemConfig(["metaTitle"])
  const websiteName = config?.metaTitle ?? "Elaine Barbosa"

  return {
    title: `${websiteName} - Psicóloga Especialista em Saúde Mental da Mulher`,
    icons: {
      icon: "/assets/logo.png",
      shortcut: "/assets/logo.png",
      apple: "/assets/logo.png",
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await getSystemConfig([
    "googleAnalyticsId",
    "customScriptsHead",
    "customScriptsFooter",
  ])

  const safeGaId = isValidGoogleAnalyticsId(config?.googleAnalyticsId ?? "")
    ? config!.googleAnalyticsId
    : null

  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics (gtag.js) */}
        {safeGaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${safeGaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${safeGaId}');
              `}
            </Script>
          </>
        )}

        {/* Custom Head Scripts */}
        {config?.customScriptsHead && (
          <script
            dangerouslySetInnerHTML={{
              __html: sanitizeRawScript(config.customScriptsHead),
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${merriweather.variable} antialiased`}
      >
        {children}

        <CustomCursor />
        <ScrollToTopButton />

        {/* Custom Body Scripts */}
        {config?.customScriptsFooter && (
          <script
            dangerouslySetInnerHTML={{
              __html: sanitizeRawScript(config.customScriptsFooter),
            }}
          />
        )}
      </body>
    </html>
  )
}
