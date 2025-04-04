import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { GeistMono } from "geist/font"
import { Providers } from "@/components/providers"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "Juego de Mecanografía",
  description: "Una aplicación minimalista para practicar mecanografía en español",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/keyboard-icon.svg', type: 'image/svg+xml' }
    ],
  }
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