"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import ThemeSelector from "@/components/theme-selector"
// Removed writing theme related imports

interface TypingTestProps {
  quotes: string[]
}

export default function TypingTest({ quotes }: TypingTestProps) {
  const [currentQuote, setCurrentQuote] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [liveWpm, setLiveWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isFinished, setIsFinished] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { theme, setTheme } = useTheme()
  // Removed writing theme related code
  const [cursorStyle, setCursorStyle] = useState({
    left: 0,
    top: 0,
    height: 0,
  })

  // Handle mounted state to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update cursor position
  useEffect(() => {
    if (textContainerRef.current) {
      const textContainer = textContainerRef.current
      const chars = textContainer.querySelectorAll("span[data-char]")

      if (chars.length > 0 && currentPosition < chars.length) {
        const currentChar = chars[currentPosition]
        const rect = currentChar.getBoundingClientRect()
        const containerRect = textContainer.getBoundingClientRect()

        setCursorStyle({
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          height: rect.height,
        })
      }
    }
  }, [currentPosition, currentQuote, userInput])

  // Get a random quote based on writing theme
  const getRandomQuote = () => {
    // In a real implementation, you would have different quote sets for each writing theme
    // For now, we'll just use the provided quotes
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  // Initialize game
  const initGame = () => {
    setCurrentQuote(getRandomQuote())
    setUserInput("")
    setStartTime(null)
    setEndTime(null)
    setWpm(0)
    setLiveWpm(0)
    setAccuracy(100)
    setIsFinished(false)
    setIsStarted(false)
    setCurrentPosition(0)
    setCursorStyle({ left: 0, top: 0, height: 0 })

    // Clear any existing interval
    if (wpmIntervalRef.current) {
      clearInterval(wpmIntervalRef.current)
      wpmIntervalRef.current = null
    }
  }

  // Start the game
  useEffect(() => {
    initGame()
    return () => {
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }
    }
  }, [])

  // Focus the container when loaded
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [isFinished])

  // Reset game when mounted
  useEffect(() => {
    if (mounted) {
      initGame()
    }
  }, [mounted])

  // Calculate WPM
  const calculateWPM = () => {
    if (!startTime || !isStarted) return 0

    const timeInMinutes = (Date.now() - startTime) / 60000
    const wordCount = userInput.length / 5 // standard: 5 chars = 1 word

    if (timeInMinutes === 0) return 0
    return Math.round(wordCount / timeInMinutes)
  }

  // Update WPM in real-time
  useEffect(() => {
    if (isStarted && !isFinished) {
      // Clear any existing interval
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }

      // Update WPM every second
      wpmIntervalRef.current = setInterval(() => {
        setLiveWpm(calculateWPM())
      }, 1000)

      // Calculate initial WPM
      setLiveWpm(calculateWPM())
    }

    return () => {
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }
    }
  }, [isStarted, isFinished, userInput])

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ignore modifier keys and special keys
    if (
      e.ctrlKey ||
      e.altKey ||
      e.metaKey ||
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Tab" ||
      e.key === "CapsLock" ||
      e.key === "Escape"
    ) {
      return
    }

    // Prevent default behavior for most keys
    if (e.key !== "Backspace") {
      e.preventDefault()
    }

    // Start timer on first keystroke
    if (!isStarted && !startTime) {
      setStartTime(Date.now())
      setIsStarted(true)
    }

    // Handle backspace
    if (e.key === "Backspace" && currentPosition > 0) {
      e.preventDefault()
      setCurrentPosition(currentPosition - 1)
      setUserInput(userInput.slice(0, -1))
      return
    }

    // Ignore if we're at the end of the quote
    if (currentPosition >= currentQuote.length) {
      return
    }

    // Handle character input
    if (e.key.length === 1) {
      const newUserInput = userInput + e.key
      setUserInput(newUserInput)
      setCurrentPosition(currentPosition + 1)

      // Calculate accuracy
      let correctChars = 0
      for (let i = 0; i < newUserInput.length; i++) {
        if (i < currentQuote.length && newUserInput[i] === currentQuote[i]) {
          correctChars++
        }
      }
      const accuracyPercent = newUserInput.length > 0 ? Math.floor((correctChars / newUserInput.length) * 100) : 100
      setAccuracy(accuracyPercent)

      // Check if quote is completed
      if (newUserInput === currentQuote || currentPosition + 1 >= currentQuote.length) {
        setEndTime(Date.now())
        setIsFinished(true)

        // Set final WPM
        setWpm(calculateWPM())

        // Clear interval
        if (wpmIntervalRef.current) {
          clearInterval(wpmIntervalRef.current)
          wpmIntervalRef.current = null
        }
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    initGame()
  }



  // Get cursor color based on theme
  const getCursorColor = () => {
    switch (theme) {
      case "blue":
        return "bg-blue-500"
      case "red":
        return "bg-red-500"
      case "yellow":
        return "bg-yellow-500"
      case "green":
        return "bg-green-500"
      case "purple":
        return "bg-purple-500"
      case "dark":
        return "bg-blue-400"
      case "light":
      default:
        return "bg-blue-500"
    }
  }

  // Get error text color based on theme
  const getErrorColor = () => {
    switch (theme) {
      case "blue":
        return "text-red-500"
      case "red":
        return "text-red-600"
      case "yellow":
        return "text-red-600"
      case "green":
        return "text-red-600"
      case "purple":
        return "text-red-500"
      case "dark":
        return "text-red-500"
      case "light":
      default:
        return "text-red-500"
    }
  }

  // If not mounted yet, don't render to avoid hydration mismatch
  if (!mounted) return null

  // Results Screen
  if (isFinished) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-0 text-left">
          <div className="text-muted-foreground text-xl">wpm</div>
          <div
            className={cn(
              "text-7xl font-normal",
              theme === "dark"
                ? "text-neutral-500"
                : theme === "light"
                  ? "text-neutral-600"
                  : theme === "blue"
                    ? "text-blue-700"
                    : theme === "red"
                      ? "text-red-700"
                      : theme === "yellow"
                        ? "text-yellow-700"
                        : theme === "green"
                          ? "text-green-700"
                          : theme === "purple"
                            ? "text-purple-700"
                            : "text-neutral-600",
            )}
          >
            {wpm}
          </div>
          <div className="text-muted-foreground text-xl mt-6">acc</div>
          <div
            className={cn(
              "text-7xl font-normal",
              theme === "dark"
                ? "text-neutral-500"
                : theme === "light"
                  ? "text-neutral-600"
                  : theme === "blue"
                    ? "text-blue-700"
                    : theme === "red"
                      ? "text-red-700"
                      : theme === "yellow"
                        ? "text-yellow-700"
                        : theme === "green"
                          ? "text-green-700"
                          : theme === "purple"
                            ? "text-purple-700"
                            : "text-neutral-600",
            )}
          >
            {accuracy}%
          </div>
        </div>

        <div className="flex gap-4 mt-16">
          <Button
            onClick={resetGame}
            variant="ghost"
            className={cn(
              "text-sm uppercase tracking-wider",
              theme === "dark"
                ? "text-neutral-500"
                : theme === "light"
                  ? "text-neutral-600"
                  : theme === "blue"
                    ? "text-blue-600"
                    : theme === "red"
                      ? "text-red-600"
                      : theme === "yellow"
                        ? "text-yellow-600"
                        : theme === "green"
                          ? "text-green-600"
                          : theme === "purple"
                            ? "text-purple-600"
                            : "text-neutral-600",
            )}
          >
            start over
          </Button>
        </div>

        <div className="flex gap-4 mt-4">
          {/* Theme Selector */}
          <ThemeSelector
            theme={theme}
            setTheme={setTheme}
          />

          {/* Writing Theme Selector removed */}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-3 py-8 px-4">
      {/* Interactive quote display - no background, no borders */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-3xl max-h-80 overflow-y-auto focus:outline-none focus:ring-0"
      >
        <div ref={textContainerRef} className="relative text-lg md:text-xl leading-relaxed">
          {/* Cursor */}
          <span
            className={cn("absolute w-0.5 will-change-transform", getCursorColor(), isStarted ? "" : "animate-cursor")}
            style={{
              left: `${cursorStyle.left}px`,
              top: `${cursorStyle.top}px`,
              height: `${cursorStyle.height}px`,
              transition: "all 30ms cubic-bezier(0.25, 0.1, 0.25, 1.0)",
            }}
          />

          {/* Text */}
          {currentQuote.split("").map((char, index) => {
            let style = "opacity-40" // Default untyped style

            if (index < userInput.length) {
              // Typed characters
              if (userInput[index] === char) {
                style = "opacity-100" // Correct
              } else {
                style = cn(getErrorColor(), "opacity-100") // Incorrect
              }
            }

            return (
              <span key={index} data-char={index} className={style}>
                {char}
              </span>
            )
          })}
        </div>
      </div>

      {/* Live WPM counter and writing theme */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "text-sm mt-4 flex items-center gap-1.5 h-5",
            theme === "dark"
              ? "text-neutral-500"
              : theme === "light"
                ? "text-neutral-600"
                : theme === "blue"
                  ? "text-blue-600"
                  : theme === "red"
                    ? "text-red-600"
                    : theme === "yellow"
                      ? "text-yellow-600"
                      : theme === "green"
                        ? "text-green-600"
                        : theme === "purple"
                          ? "text-purple-600"
                          : "text-neutral-600",
          )}
        >
          {isStarted && !isFinished ? (
            <>
              <span className="font-medium">{liveWpm}</span>
              <span className="uppercase text-xs tracking-wider">wpm</span>
            </>
          ) : (
            <span className="text-xs uppercase tracking-wider">{!isStarted ? "click and start typing" : ""}</span>
          )}
        </div>

        {/* Writing theme indicator removed */}
      </div>

      {/* Reset button - minimal style */}
      <Button
        onClick={resetGame}
        variant="ghost"
        size="sm"
        className={cn(
          "mt-2 text-xs uppercase tracking-wider",
          theme === "dark"
            ? "text-neutral-500"
            : theme === "light"
              ? "text-neutral-600"
              : theme === "blue"
                ? "text-blue-600"
                : theme === "red"
                  ? "text-red-600"
                  : theme === "yellow"
                    ? "text-yellow-600"
                    : theme === "green"
                      ? "text-green-600"
                      : theme === "purple"
                        ? "text-purple-600"
                        : "text-neutral-600",
        )}
      >
        Reset
      </Button>


    </div>
  )
}



