"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, BookText } from "lucide-react"
import { useWritingTheme, writingThemes } from "@/components/writing-theme-provider"

interface WritingThemeSelectorProps {
  isMobile?: boolean
}

export default function WritingThemeSelector({ isMobile = false }: WritingThemeSelectorProps) {
  const [mounted, setMounted] = React.useState(false)
  const { writingTheme, setWritingTheme } = useWritingTheme()

  // Handle mounted state to avoid hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleWritingThemeChange = (newTheme: string) => {
    setWritingTheme(newTheme)
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "default"}
          className="gap-2"
          aria-label="Select writing theme"
        >
          {!isMobile && "Tema de Escritura"}
          <BookText className="h-4 w-4" />
          {!isMobile && <ChevronDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Seleccionar Tema de Escritura</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {writingThemes.map((wTheme) => (
          <DropdownMenuItem
            key={wTheme.id}
            onClick={() => handleWritingThemeChange(wTheme.id)}
            className={cn(
              "cursor-pointer",
              writingTheme === wTheme.id && "font-semibold"
            )}
          >
            {wTheme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
