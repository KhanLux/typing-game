"use client"

import React, { memo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  onDurationChange: (duration: number) => void
  isRunning: boolean
  className?: string
}

const Settings = memo(function Settings({
  duration,
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
    <div className={cn("flex flex-col sm:flex-row items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Duración:
        </span>
      </div>

      <Select
        value={duration.toString()}
        onValueChange={handleDurationChange}
        disabled={isRunning}
      >
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue placeholder="Seleccionar duración" />
        </SelectTrigger>
        <SelectContent>
          {timerOptions.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botón de inicio eliminado - el juego comienza automáticamente al escribir */}
    </div>
  )
})

export default Settings
