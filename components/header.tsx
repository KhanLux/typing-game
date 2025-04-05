"use client"

import React, { useState, useEffect } from "react"
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
import { ChevronDown, Palette, Keyboard, BarChart2, HelpCircle, Volume2, VolumeX } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { HistoryView } from "@/components/HistoryView"
import { Tutorial } from "@/components/Tutorial"
import { isSoundEnabled, setSoundEnabled } from "@/lib/sound-service"
import { getUserPreferences, saveUserPreferences } from "@/lib/storage-service"

// App themes configuration

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
  const [historyOpen, setHistoryOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()

  // Handle mounted state to avoid hydration issues
  useEffect(() => {
    setMounted(true)

    // Cargar preferencias del usuario
    if (typeof window !== 'undefined') {
      const preferences = getUserPreferences();
      if (preferences.theme) {
        handleThemeChange(preferences.theme);
      }

      // Cargar estado del sonido
      setSoundOn(isSoundEnabled());

      // Mostrar tutorial automáticamente para nuevos usuarios
      const hasSeenTutorial = localStorage.getItem('tutorial_seen') === 'true';
      if (!hasSeenTutorial) {
        // Pequeño retraso para asegurar que la interfaz esté cargada
        const timer = setTimeout(() => setTutorialOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [])

  const handleThemeChange = (newTheme: string) => {
    // Asegurarse de que el tema se establezca correctamente
    if (mounted) {
      setTheme(newTheme);
      // Forzar la actualización del tema en el DOM
      document.documentElement.classList.remove('light', 'dark', 'blue', 'red', 'yellow', 'green', 'purple');
      document.documentElement.classList.add(newTheme);

      // Guardar preferencias del usuario
      const preferences = getUserPreferences();
      saveUserPreferences({
        ...preferences,
        theme: newTheme
      });
    }
  }

  // Don't render theme selectors until mounted to avoid hydration mismatch
  const renderThemeSelectors = mounted

  return (
    <header className="w-full border-b border-border bg-background" role="banner">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Keyboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">
            <a href="/" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              Juego de Mecanografía
            </a>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {renderThemeSelectors ? (
            <>
              {/* Tutorial Button */}
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "default"}
                className="gap-2 h-9 px-2 sm:h-10 sm:px-4"
                onClick={() => setTutorialOpen(true)}
                aria-label="Ver tutorial"
              >
                {!isMobile && (
                  <span className="text-sm sm:text-base">Tutorial</span>
                )}
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* Historial Button */}
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "default"}
                className="gap-2 h-9 px-2 sm:h-10 sm:px-4"
                onClick={() => setHistoryOpen(true)}
                aria-label="Ver historial de resultados"
              >
                {!isMobile && (
                  <span className="text-sm sm:text-base">Historial</span>
                )}
                <BarChart2 className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* App Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? "icon" : "default"}
                    className="gap-2 h-9 px-2 sm:h-10 sm:px-4"
                    aria-label="Seleccionar tema de la aplicación"
                  >
                    {!isMobile && (
                      <span className="text-sm sm:text-base">Tema de la App</span>
                    )}
                    <Palette className="h-4 w-4" aria-hidden="true" />
                    {!isMobile && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Seleccionar Tema de la App</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {appThemes.map((appTheme) => (
                    <DropdownMenuItem
                      key={appTheme.name}
                      onClick={() => handleThemeChange(appTheme.name)}
                      className={cn(
                        "cursor-pointer",
                        theme === appTheme.name && "font-semibold"
                      )}
                      aria-current={theme === appTheme.name ? "true" : "false"}
                    >
                      {appTheme.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>

        {/* Componentes modales */}
        <HistoryView open={historyOpen} onOpenChange={setHistoryOpen} />
        <Tutorial open={tutorialOpen} onOpenChange={setTutorialOpen} />
      </div>
    </header>
  )
}

export default Header
