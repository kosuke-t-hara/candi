import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./lp-globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Candi🍬 - 転職活動を、ひとつの場所に集約する",
  description: "応募状況、選考予定、関連URL、そして日々の思考。散らばりやすい情報を、Candi が一箇所に整えます。",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${notoSansJP.className} font-lp-sans antialiased min-h-screen bg-background text-foreground`}>
      {children}
      <Analytics />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EMMYNHS6S6"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EMMYNHS6S6');
        `}
      </Script>
    </div>
  )
}
