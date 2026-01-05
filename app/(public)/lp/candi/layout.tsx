import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./lp-globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Candi - 転職活動を、ひとつの場所に集約する",
  description: "応募状況、選考予定、関連URL、そして日々の思考。散らばりやすい情報を、Candi が一箇所に整えます。",
  icons: {
    icon: [
      {
        url: "/lp/candi/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/lp/candi/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/lp/candi/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/lp/candi/apple-icon.png",
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
    <div className={`${notoSansJP.className} antialiased min-h-screen bg-background text-foreground`}>
      {children}
      <Analytics />
    </div>
  )
}
