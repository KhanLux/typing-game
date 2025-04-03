"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WritingThemeProvider } from "@/components/writing-theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WritingThemeProvider>
        {children}
      </WritingThemeProvider>
    </ThemeProvider>
  )
}
