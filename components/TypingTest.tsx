"use client"

import React, { useState, useRef, useCallback, useEffect, useMemo, lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import Timer from "./Timer"
import TextDisplay from "./TextDisplay"
import Settings from "./Settings"
import { getAllTexts, getTextsByDifficulty } from "@/lib/themed-typing-texts"
import { useTypingTest } from "@/hooks/use-typing-test"
import { getUserPreferences, saveUserPreferences } from "@/lib/storage-service"

// Carga diferida del componente Results (pesado debido a los gráficos)
const Results = lazy(() => import('./Results'))

interface TypingTestProps {
  texts: string[]
  className?: string
}

const TypingTest = ({ texts, className }: TypingTestProps) => {
  // Función para calcular la duración recomendada basada en la longitud del texto
  // Optimización: Usar useMemo para valores constantes en lugar de useCallback
  const calculateRecommendedDuration = useMemo(() => {
    return (text: string): number => {
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
    };
  }, []);

  // State for test configuration
  const [duration, setDuration] = useState(60) // default: 60 seconds
  const containerRef = useRef<HTMLDivElement>(null)

  // Cargar preferencias del usuario
  useEffect(() => {
    const preferences = getUserPreferences();
    if (preferences.duration) {
      setDuration(preferences.duration);
    }
  }, [])

  // Optimización: Usar useMemo para la lógica de selección de dificultad
  const difficultySelector = useMemo(() => {
    return (currentDuration: number): 'básico' | 'intermedio' | 'avanzado' => {
      if (currentDuration <= 30) {
        return 'básico';
      } else if (currentDuration <= 60) {
        return 'intermedio';
      } else {
        return 'avanzado';
      }
    };
  }, []);

  // Get a random text from the available texts based on duration
  const getRandomText = useCallback(async () => {
    // Determinar la dificultad basada en la duración actual
    const difficulty = difficultySelector(duration);

    // Obtener textos por nivel de dificultad
    const difficultyTexts = getTextsByDifficulty(difficulty);

    // Si no hay suficientes textos para esta dificultad, usar todos los disponibles
    const textsToUse = difficultyTexts.length > 0 ? difficultyTexts :
                       (getAllTexts().length > 0 ? getAllTexts() : texts);

    // Obtener un texto aleatorio
    const randomIndex = Math.floor(Math.random() * textsToUse.length);
    return textsToUse[randomIndex];
  }, [texts, duration, difficultySelector])

  // Use the typing test hook
  const {
    currentText,
    userInput,
    currentPosition,
    isRunning,
    isFinished,
    // elapsedTime, // No se utiliza en este componente
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

    // Guardar preferencias del usuario
    saveUserPreferences({
      theme: document.documentElement.classList.contains('dark') ? 'dark' :
            document.documentElement.classList.contains('light') ? 'light' :
            document.documentElement.classList.contains('blue') ? 'blue' :
            document.documentElement.classList.contains('red') ? 'red' :
            document.documentElement.classList.contains('yellow') ? 'yellow' :
            document.documentElement.classList.contains('green') ? 'green' :
            document.documentElement.classList.contains('purple') ? 'purple' : 'dark',
      duration: newDuration
    });

    // No necesitamos obtener un nuevo texto aquí porque el efecto anterior
    // se activará cuando cambie la duración y obtendrá un nuevo texto apropiado
  }, [])

  return (
    <main
      className={cn("w-full max-w-4xl mx-auto px-4 py-6", className)}
      aria-live="polite"
    >
      {isFinished ? (
        // Optimización: Usar Suspense para mostrar un fallback mientras se carga Results
        <Suspense fallback={
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-8 w-32 bg-primary/20 rounded mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        }>
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
        </Suspense>
      ) : (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="w-full outline-none"
          role="textbox"
          aria-label="Área de mecanografía"
          aria-describedby="typing-instructions"
        >
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
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
            className="mb-6 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          />

          {/* Instrucciones para el usuario */}
          {!isRunning && !isFinished && (
            <div
              id="typing-instructions"
              className="text-center mt-6 text-sm sm:text-base text-muted-foreground animate-pulse-subtle"
              aria-live="polite"
            >
              Comienza a escribir para iniciar la prueba.
            </div>
          )}

          {/* Información para lectores de pantalla */}
          <div className="sr-only" aria-live="assertive">
            {isRunning ? "Prueba en progreso. Escribe el texto mostrado." : ""}
            {isFinished ? "Prueba completada. Revisa tus resultados." : ""}
          </div>
        </div>
      )}
    </main>
  )
}

export default TypingTest
