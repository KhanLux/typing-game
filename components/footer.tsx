"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Github, Keyboard, Linkedin } from "lucide-react"

export const Footer = () => {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Keyboard className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">
            © {currentYear} Juego de Mecanografía. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/KhanLux"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 text-sm hover:underline transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="GitHub repository"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open("https://github.com/KhanLux", "_blank")}
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/kevin-collazos-783564224/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 text-sm hover:underline transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="LinkedIn"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open("https://www.linkedin.com/in/kevin-collazos-783564224/", "_blank")}
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
