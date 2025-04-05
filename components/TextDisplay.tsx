"use client"

import React, { useRef, useEffect, memo } from "react"
import { cn } from "@/lib/utils"

interface TextDisplayProps {
  text: string
  userInput: string
  currentPosition: number
  className?: string
}

const TextDisplay = memo(function TextDisplay({ text, userInput, currentPosition, className }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Scroll to keep cursor in view
  useEffect(() => {
    if (cursorRef.current) {
      const cursor = cursorRef.current

      // Scroll into view with smooth behavior
      cursor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }, [currentPosition])

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full text-foreground font-mono text-base sm:text-lg md:text-xl leading-relaxed relative py-4 px-2 overflow-x-hidden",
        className
      )}
      role="textbox"
      aria-label="Texto para mecanografiar"
      aria-readonly="true"
    >
      {text.split("").map((char, index) => {
        let charClass = "opacity-40" // Default untyped style

        if (index < userInput.length) {
          // Typed characters
          if (userInput[index] === char) {
            charClass = "opacity-100" // Correct
          } else {
            charClass = "text-red-500 dark:text-red-400 opacity-100" // Incorrect
          }
        }

        // Current position cursor
        const isCurrent = index === currentPosition

        return (
          <span
            key={index}
            className={cn(
              charClass,
              "transition-colors duration-100",
              // Mejorar legibilidad en dispositivos móviles
              "text-base sm:text-lg md:text-xl",
              // Mejorar espaciado para facilitar la lectura
              "tracking-normal sm:tracking-wide"
            )}
            aria-current={isCurrent ? "true" : "false"}
            ref={isCurrent ? cursorRef : undefined}
          >
            {isCurrent && (
              <span
                className="absolute h-5 w-0.5 bg-primary animate-blink -ml-0.5"
                aria-hidden="true"
                style={{
                  height: '1.2em', // Altura relativa para adaptarse a diferentes tamaños de texto
                }}
              />
            )}
            {char}
          </span>
        )
      })}
    </div>
  )
})

export default TextDisplay
