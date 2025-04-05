"use client"

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import Timer from "./Timer"
import TextDisplay from "./TextDisplay"
import Results from "./Results"
import Settings from "./Settings"
import { getAllTexts, getTextsByDifficulty } from "@/lib/themed-typing-texts"
import { useTypingTest } from "@/hooks/use-typing-test"

interface TypingTestProps {
  texts: string[]
  className?: string
}

const TypingTest = ({ texts, className }: TypingTestProps) => {
  // Función para calcular la duración recomendada basada en la longitud del texto
  const calculateRecommendedDuration = useCallback((text: string): number => {
    // Calcular la duración basada en la longitud del texto
    const textLength = text.length;

    // Asignar directamente a un intervalo basado en la longitud del texto
    if (textLength < 150) {
      return 15; // Textos muy cortos
    } else if (textLength < 300) {
      return 30; // Textos cortos
    } else if (textLength < 600) {
      return 60; // Textos medianos
    } else {
      return 120; // Textos largos
    }
  }, []);

  // State for test configuration
  const [duration, setDuration] = useState(60) // default: 60 seconds
  const containerRef = useRef<HTMLDivElement>(null)

  // Get a random text from the available texts based on duration
  const getRandomText = useCallback(async () => {
    // Determinar la dificultad basada en la duración actual
    // Esto permite una progresión natural de dificultad
    let difficulty: 'básico' | 'intermedio' | 'avanzado' = 'intermedio'; // Por defecto

    if (duration <= 30) {
      difficulty = 'básico';
    } else if (duration <= 60) {
      difficulty = 'intermedio';
    } else {
      difficulty = 'avanzado';
    }

    // Obtener textos por nivel de dificultad
    const difficultyTexts = getTextsByDifficulty(difficulty);

    // Si no hay suficientes textos para esta dificultad, usar todos los disponibles
    const textsToUse = difficultyTexts.length > 0 ? difficultyTexts :
                       (getAllTexts().length > 0 ? getAllTexts() : texts);

    // Obtener un texto aleatorio
    const randomIndex = Math.floor(Math.random() * textsToUse.length);
    return textsToUse[randomIndex];
  }, [texts, duration])

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
    handleRestart,
    handleTextChange
  } = useTypingTest({
    texts,
    getRandomText,
    duration
  })

  // Inicializar el texto al montar el componente o cuando cambia la duración
  useEffect(() => {
    // Solo actualizar si no hay un test en ejecución
    if (!isRunning && !isFinished) {
      // Obtener un nuevo texto aleatorio basado en la duración actual
      getRandomText().then(newText => {
        // Actualizar el texto en el hook useTypingTest
        if (handleTextChange) {
          handleTextChange(newText);
        }
      });
    }
  }, [isRunning, isFinished, getRandomText, handleTextChange, duration])

  // Focus the container when test starts
  useEffect(() => {
    if (isRunning && containerRef.current) {
      containerRef.current.focus()
    }
  }, [isRunning])

  // Calcular la duración recomendada para el texto actual
  const recommendedDuration = useMemo(() => {
    if (!currentText) return 60; // Valor predeterminado si no hay texto
    return calculateRecommendedDuration(currentText);
  }, [currentText, calculateRecommendedDuration]);

  // Handle duration change - when user manually changes duration
  const handleDurationChange = useCallback((newDuration: number) => {
    // Actualizar la duración
    setDuration(newDuration);

    // No necesitamos obtener un nuevo texto aquí porque el efecto anterior
    // se activará cuando cambie la duración y obtendrá un nuevo texto apropiado
  }, [])

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
              recommendedDuration={recommendedDuration}
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
