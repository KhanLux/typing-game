"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Keyboard, Clock, BarChart2, Award, X, ChevronLeft, ChevronRight } from "lucide-react"

interface TutorialProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TutorialStep {
  title: string
  description: string
  icon: React.ReactNode
  image?: string
}

export function Tutorial({ open, onOpenChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  // Verificar si el usuario ya ha visto el tutorial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('tutorial_seen') === 'true'
      setHasSeenTutorial(seen)
    }
  }, [])

  // Marcar el tutorial como visto cuando se cierra
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutorial_seen', 'true')
    }
    onOpenChange(false)
  }

  // Pasos del tutorial
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Bienvenido al Juego de Mecanografía",
      description: "Este juego te ayudará a mejorar tu velocidad y precisión al escribir. Aprenderás a escribir más rápido mientras te diviertes.",
      icon: <Keyboard className="h-8 w-8 text-primary" />
    },
    {
      title: "Comienza a escribir",
      description: "Para iniciar el juego, simplemente comienza a escribir el texto que aparece en pantalla. El temporizador se iniciará automáticamente cuando presiones la primera tecla.",
      icon: <Clock className="h-8 w-8 text-primary" />
    },
    {
      title: "Sigue el texto",
      description: "Escribe el texto exactamente como aparece. Los caracteres correctos se mostrarán en verde, mientras que los errores se mostrarán en rojo. Puedes corregir los errores usando la tecla de retroceso.",
      icon: <Keyboard className="h-8 w-8 text-primary" />
    },
    {
      title: "Mira tus resultados",
      description: "Al finalizar, verás tus resultados: palabras por minuto (PPM), precisión y otros datos. Estos te ayudarán a medir tu progreso con el tiempo.",
      icon: <BarChart2 className="h-8 w-8 text-primary" />
    },
    {
      title: "Consulta tu historial",
      description: "Puedes ver tu historial de resultados haciendo clic en el botón 'Historial' en la parte superior. Esto te permitirá seguir tu progreso a lo largo del tiempo.",
      icon: <Award className="h-8 w-8 text-primary" />
    }
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTutorialStep = tutorialSteps[currentStep]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {currentTutorialStep.icon}
            {currentTutorialStep.title}
          </DialogTitle>
          <DialogDescription>
            Paso {currentStep + 1} de {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">
            {currentTutorialStep.description}
          </p>

          {currentTutorialStep.image && (
            <div className="border rounded-md overflow-hidden mb-4">
              <img 
                src={currentTutorialStep.image} 
                alt={`Ilustración para ${currentTutorialStep.title}`}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-1 mt-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "w-6 bg-primary" 
                    : "w-1.5 bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "gap-1",
              currentStep === 0 && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
          >
            <X className="h-4 w-4 mr-1" />
            Saltar
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={nextStep}
            className="gap-1"
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                Finalizar
                <X className="h-4 w-4" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
