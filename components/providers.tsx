"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark', 'blue', 'red', 'yellow', 'green', 'purple']}
      forcedTheme={undefined}
    >
      {children}
    </ThemeProvider>
  )
}
