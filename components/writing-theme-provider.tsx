"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the writing themes
export const writingThemes = [
  { id: "quotes", name: "Citas" },
  { id: "code", name: "Fragmentos de Código" },
  { id: "prose", name: "Prosa" },
  { id: "poetry", name: "Poesía" },
]

type WritingThemeContextType = {
  writingTheme: string
  setWritingTheme: (theme: string) => void
}

const WritingThemeContext = createContext<WritingThemeContextType | undefined>(undefined)

export const useWritingTheme = () => {
  const context = useContext(WritingThemeContext)
  if (context === undefined) {
    throw new Error("useWritingTheme must be used within a WritingThemeProvider")
  }
  return context
}

export const WritingThemeProvider = ({ children }: { children: ReactNode }) => {
  const [writingTheme, setWritingTheme] = useState("quotes")
  const [mounted, setMounted] = useState(false)

  // Handle mounted state to avoid hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({ writingTheme, setWritingTheme }),
    [writingTheme]
  )

  return (
    <WritingThemeContext.Provider value={contextValue}>
      {children}
    </WritingThemeContext.Provider>
  )
}
