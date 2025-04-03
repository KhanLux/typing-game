import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { GeistMono } from "geist/font"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Typing Test",
  description: "A minimalist typing test application",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistMono.variable} font-mono`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}