"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import Timer from "./Timer"
import TextDisplay from "./TextDisplay"
import Statistics from "./Statistics"
import Results from "./Results"
import Settings from "./Settings"
import { useWritingTheme } from "./writing-theme-provider"
import { getTextsByTheme } from "@/lib/themed-typing-texts"

interface TypingTestProps {
  texts: string[]
  className?: string
}

interface PerformancePoint {
  time: number // seconds elapsed
  wpm: number
  accuracy?: number // accuracy at this point in time
}

const TypingTest = ({ texts, className }: TypingTestProps) => {
  // Get the current writing theme
  const { writingTheme } = useWritingTheme()
  // State for test configuration
  const [duration, setDuration] = useState(60) // default: 60 seconds

  // State for test progress
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [lastTypingTime, setLastTypingTime] = useState(0)

  // State for performance metrics
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [totalErrorsCommitted, setTotalErrorsCommitted] = useState(0) // Total errors including corrected ones
  const [performanceData, setPerformanceData] = useState<PerformancePoint[]>([])

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // This function has been replaced by more specific functions

  // Initialize on component mount
  useEffect(() => {
    // Only set the text if it's not already set
    if (!currentText) {
      setCurrentText(getRandomText())
    }

    // Initialize other state variables
    setUserInput("")
    setCurrentPosition(0)
    setIsRunning(false)
    setIsFinished(false)
    setStartTime(null)
    setElapsedTime(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTotalErrorsCommitted(0)
    setPerformanceData([])
  }, [getRandomText, currentText])

  // Update text when writing theme changes
  useEffect(() => {
    // Only update if not currently running a test
    if (!isRunning && !isFinished) {
      // Get a new text based on the current theme
      setCurrentText(getRandomText())
      console.log(`Writing theme changed to: ${writingTheme}, updated text`)
    }
  }, [writingTheme, getRandomText, isRunning, isFinished])

  // Focus the container when test starts
  useEffect(() => {
    if (isRunning && containerRef.current) {
      containerRef.current.focus()
    }
  }, [isRunning])

  // Calculate WPM - only counting correctly typed characters
  const calculateWpm = useCallback(() => {
    if (!startTime || !isRunning) return 0

    // Count only correctly typed characters
    let correctCharCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (i < currentText.length && userInput[i] === currentText[i]) {
        correctCharCount++;
      }
    }

    const timeInMinutes = elapsedTime / 60
    // Standard: 5 chars = 1 word, but only count correct characters
    const wordCount = correctCharCount / 5

    if (timeInMinutes === 0) return 0

    const wpm = wordCount / timeInMinutes;
    console.log(`WPM calculation: ${correctCharCount} correct chars / 5 = ${wordCount} words in ${timeInMinutes.toFixed(2)} minutes = ${wpm.toFixed(1)} WPM`);

    return wpm
  }, [startTime, isRunning, elapsedTime, userInput, currentText])

  // Update WPM in real-time
  useEffect(() => {
    if (isRunning && !isFinished) {
      // Clear any existing interval
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }

      // Update WPM every second
      wpmIntervalRef.current = setInterval(() => {
        const currentWpm = calculateWpm()
        setWpm(currentWpm)

        // Calculate real accuracy based on total errors committed
        const totalCharsTyped = userInput.length + totalErrorsCommitted;
        const correctChars = userInput.length - errors;
        const realAccuracy = totalCharsTyped > 0
          ? (correctChars / totalCharsTyped) * 100
          : 100;

        // Record performance data point every second
        console.log(`Recording performance data at ${elapsedTime}s: ${currentWpm} WPM, Accuracy: ${realAccuracy.toFixed(1)}%, Errors: ${errors}, Total Errors: ${totalErrorsCommitted}`)
        setPerformanceData(prev => [
          ...prev,
          { time: elapsedTime, wpm: currentWpm, accuracy: realAccuracy }
        ])
      }, 1000)
    }

    return () => {
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current)
      }
    }
  }, [isRunning, isFinished, calculateWpm, elapsedTime, duration])

  // Handle timer tick
  const handleTimerTick = (remainingTime: number) => {
    setElapsedTime(duration - remainingTime)
  }

  // Handle timer completion
  const handleTimerComplete = () => {
    // Calculate final WPM
    const finalWpm = calculateWpm()
    setWpm(finalWpm)

    // Update state first to prevent race conditions
    setIsRunning(false)
    setIsFinished(true)
    setIsTyping(false)

    // Calculate real accuracy based on total errors committed
    const totalCharsTyped = userInput.length + totalErrorsCommitted;
    const correctChars = userInput.length - errors;
    const realAccuracy = totalCharsTyped > 0
      ? (correctChars / totalCharsTyped) * 100
      : 100;

    // Update the accuracy state with the real accuracy
    setAccuracy(realAccuracy);

    // Add final data point
    console.log(`Recording final performance data at ${elapsedTime}s: ${finalWpm} WPM, Accuracy: ${realAccuracy.toFixed(1)}%, Errors: ${errors}, Total Errors: ${totalErrorsCommitted}`)

    // Use a callback to ensure we have the latest performance data
    setPerformanceData(prev => {
      // Create a copy of the previous data
      const updatedData = [...prev];

      // Add the final data point
      updatedData.push({ time: elapsedTime, wpm: finalWpm, accuracy: realAccuracy });

      // Ensure the data is sorted by time
      updatedData.sort((a, b) => a.time - b.time);

      console.log('Final performance data:', updatedData);
      return updatedData;
    });

    // Clear interval
    if (wpmIntervalRef.current) {
      clearInterval(wpmIntervalRef.current)
      wpmIntervalRef.current = null
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }

  // Start the test
  const handleStart = () => {
    // Reset test state without changing the text
    setUserInput("")
    setCurrentPosition(0)
    setIsFinished(false)
    setElapsedTime(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTotalErrorsCommitted(0)
    setPerformanceData([])

    // Set start time and running state
    const now = Date.now()
    setStartTime(now)
    setIsRunning(true)

    // Add initial data point with 0 WPM and 100% accuracy
    console.log('Recording initial performance data at 0s: 0 WPM, Accuracy: 100%')

    // Create a series of initial data points to ensure smooth graph
    // At the start, accuracy is 100% because no errors have been made yet
    const initialData = [
      { time: 0, wpm: 0, accuracy: 100 },
      { time: 1, wpm: 0, accuracy: 100 },
    ];

    setPerformanceData(initialData)
    console.log('Initial performance data:', initialData)
  }

  // Restart the test with a new text
  const handleRestart = () => {
    // Get a new random text
    setCurrentText(getRandomText())

    // Reset all other state variables
    setUserInput("")
    setCurrentPosition(0)
    setIsRunning(false)
    setIsFinished(false)
    setStartTime(null)
    setElapsedTime(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTotalErrorsCommitted(0)
    setPerformanceData([])
  }

  // Set up typing detection
  useEffect(() => {
    return () => {
      // Clean up timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Function to handle typing state
  const updateTypingState = () => {
    // Mark as typing
    setIsTyping(true)
    setLastTypingTime(Date.now())

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to mark as not typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000) // 1 second of inactivity to consider not typing
  }

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

    // If the test is finished, don't process any more input
    if (isFinished) return

    // If the test hasn't started yet and the user presses a valid key, start the test
    if (!isRunning && e.key.length === 1) {
      // Initialize and start the test
      handleStart()
    }

    // If the test is still not running (e.g., after trying to start it), return
    if (!isRunning) return

    // Update typing state
    updateTypingState()

    // Prevent default behavior for most keys
    if (e.key !== "Backspace") {
      e.preventDefault()
    }

    // Handle backspace
    if (e.key === "Backspace" && currentPosition > 0) {
      e.preventDefault()

      // Update position and input
      setCurrentPosition(currentPosition - 1)
      const newUserInput = userInput.slice(0, -1)
      setUserInput(newUserInput)

      // Recalculate current errors (but don't change totalErrorsCommitted)
      let correctChars = 0;
      let currentErrors = 0;

      for (let i = 0; i < newUserInput.length; i++) {
        if (i < currentText.length && newUserInput[i] === currentText[i]) {
          correctChars++;
        } else {
          currentErrors++;
        }
      }

      // Calculate accuracy based on total characters typed (including errors) vs correct characters
      const totalCharsTyped = newUserInput.length + totalErrorsCommitted - currentErrors;
      const accuracyPercent = totalCharsTyped > 0
        ? (correctChars / totalCharsTyped) * 100
        : 100;

      // Update state with current errors and accuracy
      setErrors(currentErrors);
      setAccuracy(accuracyPercent);

      // Log for debugging
      console.log(`After backspace - Accuracy: ${accuracyPercent.toFixed(1)}%, Errors: ${currentErrors}, Total Errors: ${totalErrorsCommitted}, Chars: ${newUserInput.length}, Total Chars: ${totalCharsTyped}`);

      return
    }

    // Ignore if we're at the end of the text
    if (currentPosition >= currentText.length) {
      return
    }

    // Handle character input
    if (e.key.length === 1) {
      const newUserInput = userInput + e.key
      setUserInput(newUserInput)
      setCurrentPosition(currentPosition + 1)

      // Check if the current character is correct
      const isCurrentCharCorrect = e.key === currentText[currentPosition];

      // If the character is incorrect, increment the total errors committed
      if (!isCurrentCharCorrect) {
        setTotalErrorsCommitted(prev => prev + 1);
      }

      // Calculate accuracy and errors
      let correctChars = 0;
      let currentErrors = 0;

      for (let i = 0; i < newUserInput.length; i++) {
        if (i < currentText.length && newUserInput[i] === currentText[i]) {
          correctChars++;
        } else {
          currentErrors++;
        }
      }

      // Calculate accuracy based on total characters typed (including errors) vs correct characters
      const totalCharsTyped = newUserInput.length + totalErrorsCommitted - currentErrors;
      const accuracyPercent = totalCharsTyped > 0
        ? (correctChars / totalCharsTyped) * 100
        : 100;

      // Update state with current errors and accuracy
      setErrors(currentErrors);
      setAccuracy(accuracyPercent);

      // Log for debugging
      console.log(`Current accuracy: ${accuracyPercent.toFixed(1)}%, Errors: ${currentErrors}, Total Errors: ${totalErrorsCommitted}, Chars: ${newUserInput.length}, Total Chars: ${totalCharsTyped}`);

      // Check if text is completed
      if (currentPosition + 1 >= currentText.length) {
        // Calculate final WPM before completing
        const finalWpm = calculateWpm()
        setWpm(finalWpm)

        // Calculate real accuracy based on total errors committed
        const totalCharsTyped = newUserInput.length + totalErrorsCommitted;
        const realCorrectChars = newUserInput.length - currentErrors;
        const realAccuracy = totalCharsTyped > 0
          ? (realCorrectChars / totalCharsTyped) * 100
          : 100;

        // Update the accuracy state with the real accuracy
        setAccuracy(realAccuracy);

        // Add final data point
        console.log(`Recording final performance data at ${elapsedTime}s: ${finalWpm} WPM, Accuracy: ${realAccuracy.toFixed(1)}%, Errors: ${currentErrors}, Total Errors: ${totalErrorsCommitted}`)

        // Use a callback to ensure we have the latest performance data
        setPerformanceData(prev => {
          // Create a copy of the previous data
          const updatedData = [...prev];

          // Add the final data point
          updatedData.push({ time: elapsedTime, wpm: finalWpm, accuracy: realAccuracy });

          // Ensure the data is sorted by time
          updatedData.sort((a, b) => a.time - b.time);

          console.log('Final performance data on text completion:', updatedData);
          return updatedData;
        });

        // Call handleTimerComplete after updating performance data
        setTimeout(() => handleTimerComplete(), 0);
      }
    }
  }

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
              Start typing to begin the test.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TypingTest
