"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

interface ThemeOption {
  name: string
  label: string
}

interface ThemeSelectorProps {
  theme: string | undefined
  setTheme: (theme: string) => void
  themes?: ThemeOption[]
}

export default function ThemeSelector({ theme, setTheme, themes }: ThemeSelectorProps) {
  const [mounted, setMounted] = React.useState(false)

  // Handle mounted state to avoid hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Default themes if none provided
  const defaultThemes = [
    { name: "dark", label: "Dark" },
    { name: "light", label: "Light" },
    { name: "blue", label: "Blue" },
    { name: "red", label: "Red" },
    { name: "yellow", label: "Yellow" },
    { name: "green", label: "Green" },
    { name: "purple", label: "Purple" },
  ]

  const themeOptions = themes || defaultThemes

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 gap-2"
          aria-label="Select application theme"
        >
          <span className="text-xs uppercase tracking-wider">Theme</span>
          <Palette className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name)}
            className={cn(
              "cursor-pointer",
              theme === themeOption.name && "font-semibold"
            )}
          >
            {themeOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
