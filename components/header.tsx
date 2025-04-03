"use client"

import React from "react"
import { useTheme } from "next-themes"
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
import { ChevronDown, Palette } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import WritingThemeSelector from "@/components/writing-theme-selector"

// Writing themes are imported from writing-theme-provider

// Define the application themes
const appThemes = [
  { name: "dark", label: "Dark" },
  { name: "light", label: "Light" },
  { name: "blue", label: "Blue" },
  { name: "red", label: "Red" },
  { name: "yellow", label: "Yellow" },
  { name: "green", label: "Green" },
  { name: "purple", label: "Purple" },
]

export const Header = () => {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()

  // Handle mounted state to avoid hydration issues
  React.useEffect(() => {
    setMounted(true)
    console.log('Header mounted, theme:', theme)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  // Don't render theme selectors until mounted to avoid hydration mismatch
  const renderThemeSelectors = mounted

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight">Typing Game</h1>
        </div>

        <div className="flex items-center gap-2">
          {renderThemeSelectors ? (
            <>
              {/* Writing Theme Selector */}
              <WritingThemeSelector isMobile={isMobile} />

              {/* App Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? "icon" : "default"}
                    className="gap-2"
                    aria-label="Select application theme"
                  >
                    {!isMobile && "App Theme"}
                    <Palette className="h-4 w-4" />
                    {!isMobile && <ChevronDown className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select App Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {appThemes.map((appTheme) => (
                    <DropdownMenuItem
                      key={appTheme.name}
                      onClick={() => handleThemeChange(appTheme.name)}
                      className={cn(
                        "cursor-pointer",
                        theme === appTheme.name && "font-semibold"
                      )}
                    >
                      {appTheme.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
