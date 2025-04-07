"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CircularTimerProps {
  progress: number // 0-100
  timeLeft: number
  className?: string
}

const CircularTimer = ({
  progress,
  timeLeft,
  className
}: CircularTimerProps) => {
  const [prevTimeLeft, setPrevTimeLeft] = useState(timeLeft)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on client side
  useEffect(() => {
    audioRef.current = new Audio('/sounds/tick.mp3')
    audioRef.current.volume = 0.2

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Play tick sound when timeLeft changes
  useEffect(() => {
    if (prevTimeLeft !== timeLeft && timeLeft > 0 && timeLeft <= 10) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(e => console.error('Error playing sound:', e))
      }
    }
    setPrevTimeLeft(timeLeft)
  }, [timeLeft, prevTimeLeft])

  // Calculate the stroke dash offset based on progress
  const circumference = 2 * Math.PI * 45 // 45 is the radius of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Determine color based on remaining time
  const getTimerColor = () => {
    if (progress > 60) return "stroke-primary"
    if (progress > 30) return "stroke-yellow-500"
    return "stroke-red-500"
  }

  // Determine text color based on remaining time
  const getTextColor = () => {
    if (progress > 60) return "text-foreground"
    if (progress > 30) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* SVG for circular progress */}
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="stroke-muted/30"
        />

        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={getTimerColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>

      {/* Timer text in the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("font-mono text-2xl font-medium tracking-tight", getTextColor())}
          aria-hidden="true"
          animate={{ scale: timeLeft <= 10 && timeLeft > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {timeLeft}
        </motion.span>
        <span className="text-xs text-muted-foreground">seg</span>
      </div>
    </div>
  )
}

export default CircularTimer
