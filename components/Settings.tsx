"use client"

import React from "react"
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

const Settings = ({
  duration,
  onDurationChange,
  isRunning,
  className
}: SettingsProps) => {
  const timerOptions = [
    { value: 15, label: "15 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 60, label: "60 seconds" },
    { value: 120, label: "120 seconds" }
  ]

  const handleDurationChange = (value: string) => {
    onDurationChange(parseInt(value, 10))
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Duration:
        </span>
      </div>

      <Select
        value={duration.toString()}
        onValueChange={handleDurationChange}
        disabled={isRunning}
      >
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue placeholder="Select duration" />
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
}

export default Settings
