"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import Timer from "./Timer"
import TextDisplay from "./TextDisplay"
import Results from "./Results"
import Settings from "./Settings"
import { useWritingTheme } from "./writing-theme-provider"
import { getTextsByTheme } from "@/lib/themed-typing-texts"
import { useTypingTest } from "@/hooks/use-typing-test"

interface TypingTestProps {
  texts: string[]
  className?: string
}

const TypingTest = ({ texts, className }: TypingTestProps) => {
  // Get the current writing theme
  const { writingTheme } = useWritingTheme()
  // State for test configuration
  const [duration, setDuration] = useState(60) // default: 60 seconds
  const containerRef = useRef<HTMLDivElement>(null)

  // Get a random text based on the current writing theme
  const getRandomText = useCallback(() => {
    // Get texts filtered by the current theme
    const themedTexts = getTextsByTheme(writingTheme);

    // If there are no texts for this theme, use the provided texts
    const textsToUse = themedTexts.length > 0 ? themedTexts : texts;

    // Get a random text from the filtered list
    const randomIndex = Math.floor(Math.random() * textsToUse.length);
    return textsToUse[randomIndex];
  }, [texts, writingTheme])

  // Use the typing test hook
  const {
    currentText,
    userInput,
    currentPosition,
    isRunning,
    isFinished,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    totalErrorsCommitted,
    performanceData,
    errorIndices,
    errorTimestamps,
    handleKeyDown,
    handleTimerTick,
    handleTimerComplete,
    handleRestart
  } = useTypingTest({
    texts,
    getRandomText,
    duration
  })

  // Update text when writing theme changes
  useEffect(() => {
    // Only update if not currently running a test
    if (!isRunning && !isFinished) {
      console.log(`Writing theme changed to: ${writingTheme}, updated text`)
    }
  }, [writingTheme, isRunning, isFinished])

  // Focus the container when test starts
  useEffect(() => {
    if (isRunning && containerRef.current) {
      containerRef.current.focus()
    }
  }, [isRunning])

  // Handle duration change
  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
  }

  return (
    <div className={cn("w-full mx-auto", className)}>
      {isFinished ? (
        <Results
          duration={duration}
          finalWpm={wpm}
          accuracy={accuracy}
          errors={errors}
          totalErrorsCommitted={totalErrorsCommitted}
          performanceData={performanceData}
          onRestart={handleRestart}
          text={currentText}
          userInput={userInput}
          errorIndices={errorIndices}
          errorTimestamps={errorTimestamps}
        />
      ) : (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="w-full outline-none"
        >
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Settings
              duration={duration}
              onDurationChange={handleDurationChange}
              isRunning={isRunning}
            />

            {isRunning && (
              <Timer
                duration={duration}
                isRunning={isRunning}
                onComplete={handleTimerComplete}
                onTick={handleTimerTick}
              />
            )}
          </div>

          <TextDisplay
            text={currentText}
            userInput={userInput}
            currentPosition={currentPosition}
            className="mb-6"
          />

          {/* Estadísticas eliminadas para mantener la interfaz limpia */}

          {!isRunning && !isFinished && (
            <div className="text-center mt-6 text-sm text-muted-foreground">
              Comienza a escribir para iniciar la prueba.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TypingTest
