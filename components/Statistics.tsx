"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StatisticsProps {
  wpm: number
  accuracy: number
  errors: number
  className?: string
}

const Statistics = ({ wpm, accuracy, errors, className }: StatisticsProps) => {
  return (
    <div className={cn("flex justify-center gap-8", className)}>
      <StatCard
        label="wpm"
        value={wpm.toFixed(0)}
        color="text-primary"
      />
      <StatCard
        label="acc"
        value={`${accuracy.toFixed(1)}%`}
        color={accuracy > 95 ? "text-green-500" :
               accuracy > 85 ? "text-yellow-500" :
               "text-red-500"}
      />
      <StatCard
        label="err"
        value={errors.toString()}
        color={errors === 0 ? "text-green-500" :
               errors < 5 ? "text-yellow-500" :
               "text-red-500"}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  color: string
}

const StatCard = ({ label, value, color }: StatCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium text-muted-foreground tracking-wide">
        {label}
      </div>
      <div className={cn("text-2xl font-mono font-medium mt-1", color)}>
        {value}
      </div>
    </div>
  )
}

export default Statistics
