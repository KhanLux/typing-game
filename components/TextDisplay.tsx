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
        "w-full text-foreground font-mono text-lg leading-relaxed relative py-4",
        className
      )}
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
            className={cn(charClass, "transition-colors duration-100")}
            ref={isCurrent ? cursorRef : undefined}
          >
            {isCurrent && (
              <span className="absolute h-5 w-0.5 bg-primary animate-blink -ml-0.5" />
            )}
            {char}
          </span>
        )
      })}
    </div>
  )
})

export default TextDisplay
