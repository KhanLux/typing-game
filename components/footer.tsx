"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Github, Keyboard } from "lucide-react"

export const Footer = () => {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Keyboard className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">
            © {currentYear} Typing Game. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 text-sm hover:underline transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="GitHub repository"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open("https://github.com", "_blank")}
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          
          <a 
            href="#" 
            className={cn(
              "text-sm hover:underline transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Privacy Policy"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open("#", "_blank")}
          >
            Privacy Policy
          </a>
          
          <a 
            href="#" 
            className={cn(
              "text-sm hover:underline transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Terms of Service"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open("#", "_blank")}
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
