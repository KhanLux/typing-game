"use client"

import React, { useRef, useEffect, memo, useMemo } from "react"
import { cn } from "@/lib/utils"

interface TextDisplayProps {
  text: string
  userInput: string
  currentPosition: number
  className?: string
  style?: React.CSSProperties
}

const TextDisplay = memo(function TextDisplay({ text, userInput, currentPosition, className, style }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Optimización: Usar requestAnimationFrame para el scroll
  useEffect(() => {
    if (cursorRef.current) {
      // Usar requestAnimationFrame para evitar bloquear el hilo principal
      requestAnimationFrame(() => {
        if (cursorRef.current) {
          const cursor = cursorRef.current

          // Scroll into view con comportamiento suave
          cursor.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }
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
      style={style}
      role="textbox"
      aria-label="Texto para mecanografiar"
      aria-readonly="true"
    >
      {/* Optimización: Usar useMemo para evitar recálculos innecesarios */}
      {useMemo(() => {
        // Crear un array de caracteres una sola vez
        return text.split("").map((char, index) => {
          let charClass = "opacity-40" // Default untyped style
          let isCorrect = false
          let isError = false

          if (index < userInput.length) {
            // Typed characters
            if (userInput[index] === char) {
              charClass = "opacity-100" // Correct
              isCorrect = true
            } else {
              charClass = "text-red-500 dark:text-red-400 opacity-100" // Incorrect
              isError = true
            }
          }

          // Current position cursor
          const isCurrent = index === currentPosition

          // Optimización: Usar will-change para mejorar rendimiento de animaciones
          const style = isCurrent ? {
            transform: 'scale(1.1)',
            transition: 'transform 0.15s ease-in-out',
            willChange: 'transform'
          } : {
            transform: 'scale(1)',
            transition: 'transform 0.15s ease-in-out'
          }

          return (
            <span
              key={index}
              className={cn(
                charClass,
                "transition-all duration-150",
                // Mejorar legibilidad en dispositivos móviles
                "text-base sm:text-lg md:text-xl",
                // Mejorar espaciado para facilitar la lectura
                "tracking-normal sm:tracking-wide",
                // Animaciones para caracteres - solo aplicar cuando sea necesario
                isCurrent && "animate-pulse-subtle scale-110",
                isCorrect && "animate-correct",
                isError && "animate-error"
              )}
              style={style}
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
        })
      }, [text, userInput, currentPosition, cursorRef])}
    </div>
  )
})

export default TextDisplay
