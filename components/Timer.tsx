"use client"

import React, { useState, useEffect, useRef, memo } from "react"
import { cn } from "@/lib/utils"
import CircularTimer from "./CircularTimer"

interface TimerProps {
  duration?: number // in seconds, optional with default
  isRunning: boolean
  onComplete: () => void
  onTick: (remainingTime: number) => void
  className?: string
}

const Timer = memo(function Timer({
  duration = 60, // Default to 60 seconds if not provided
  isRunning,
  onComplete,
  onTick,
  className
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)
  const startTimeRef = useRef<number | null>(null)
  const endTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Reset timer when duration changes
  useEffect(() => {
    // Reiniciar completamente el temporizador cuando cambia la duración
    setTimeLeft(duration)
    setProgress(100)
    startTimeRef.current = null
    endTimeRef.current = null

    // Si el temporizador está en ejecución, actualizar el tiempo de finalización
    if (isRunning && startTimeRef.current) {
      endTimeRef.current = startTimeRef.current + (duration * 1000)
    }
  }, [duration, isRunning])

  // Handle timer start/stop
  useEffect(() => {
    if (isRunning) {
      // Set start time if not already set
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now()
        endTimeRef.current = startTimeRef.current + (duration * 1000)
      }

      // Start animation frame loop
      const updateTimer = () => {
        const now = Date.now()
        const end = endTimeRef.current || 0

        // Calculate remaining time
        const remaining = Math.max(0, Math.ceil((end - now) / 1000))

        // Update state
        setTimeLeft(remaining)
        setProgress((remaining / duration) * 100)

        // Call onTick callback
        onTick(remaining)

        // Check if timer is complete
        if (remaining <= 0) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
          onComplete()
          return
        }

        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(updateTimer)
      }

      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(updateTimer)
    } else {
      // Cancel animation frame when not running
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isRunning, duration, onComplete, onTick])

  // Format time for screen readers (more descriptive)
  const formattedTimeForScreenReader = `${timeLeft} segundos restantes`;

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Circular timer display */}
      <CircularTimer
        progress={progress}
        timeLeft={timeLeft}
        className="animate-fade-in"
      />
      <span className="sr-only">{formattedTimeForScreenReader}</span>
    </div>
  )
})

export default Timer
