import "@/app/globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import { Alex_Brush, Nunito_Sans } from "next/font/google"
import ScrollToTopButton from "@/components/features/ScrollToTopButton"
import WhatsAppButton from "@/components/features/WhatsAppButton"
import CustomCursor from "@/components/ui/CustomCursor"
import PageTransition from "@/components/ui/PageTransition"
import { getSystemConfig } from "@/utils/getDbData"
import { sanitizeRawScript, isValidGoogleAnalyticsId } from "@/utils/strings"

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
})

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    "socialWhatsApp",
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
        className={`${alexBrush.variable} ${nunitoSans.variable} antialiased`}
      >
        {children}

        <PageTransition />
        <CustomCursor />
        <ScrollToTopButton hidden />
        <WhatsAppButton number={config?.socialWhatsApp ?? null} />

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
