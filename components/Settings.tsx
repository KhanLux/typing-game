"use client"

import React, { memo } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock } from "lucide-react"

interface SettingsProps {
  duration: number
  recommendedDuration?: number
  onDurationChange: (duration: number) => void
  isRunning: boolean
  className?: string
}

const Settings = memo(function Settings({
  duration,
  recommendedDuration,
  onDurationChange,
  isRunning,
  className
}: SettingsProps) {
  const timerOptions = [
    { value: 15, label: "15 segundos" },
    { value: 30, label: "30 segundos" },
    { value: 60, label: "60 segundos" },
    { value: 120, label: "120 segundos" }
  ]

  const handleDurationChange = (value: string) => {
    onDurationChange(parseInt(value, 10))
  }

  return (
    <div
      className={cn("flex flex-col sm:flex-row items-center gap-4", className)}
      role="group"
      aria-labelledby="duration-settings-label"
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span
          id="duration-settings-label"
          className="text-sm font-medium text-muted-foreground"
        >
          Duración:
        </span>
        {recommendedDuration && recommendedDuration !== duration && (
          <span
            className="text-xs text-primary ml-1 hidden sm:inline-block"
            aria-live="polite"
          >
            (Recomendado: {recommendedDuration}s)
          </span>
        )}
      </div>

      <Select
        value={duration.toString()}
        onValueChange={handleDurationChange}
        disabled={isRunning}
        aria-label="Seleccionar duración del test"
      >
        <SelectTrigger
          className="w-[140px] h-8 text-sm"
          aria-label={`Duración actual: ${duration} segundos`}
        >
          <SelectValue placeholder="Seleccionar duración" />
        </SelectTrigger>
        <SelectContent>
          {timerOptions.map(option => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              aria-label={`${option.label}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Información de ayuda para usuarios de lectores de pantalla */}
      <span className="sr-only">
        El test comenzará automáticamente cuando empieces a escribir.
        {isRunning ? " El test está en progreso." : " El test no ha comenzado."}
      </span>
    </div>
  )
})

export default Settings
