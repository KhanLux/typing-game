"use client"

import React, { memo, useMemo, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"
import { Button } from "@/components/ui/button"
import ErrorAnalysis from "./ErrorAnalysis"
import { saveTestResult } from "@/lib/storage-service"

interface PerformancePoint {
  time: number // seconds elapsed
  wpm: number
  accuracy?: number // accuracy at this point in time
}

interface ResultsProps {
  duration: number // total test duration in seconds
  finalWpm: number
  accuracy: number
  errors: number // Current errors (not corrected)
  totalErrorsCommitted?: number // Total errors including corrected ones
  performanceData: PerformancePoint[]
  onRestart: () => void
  text?: string // El texto que se estaba escribiendo
  userInput?: string // Lo que el usuario escribió
  errorIndices?: number[] // Índices donde ocurrieron errores
  errorTimestamps?: number[] // Timestamps de cuando ocurrieron los errores
  className?: string
}

// Eliminada la interfaz y el componente StatCard que no se utilizan

const Results = memo(function Results({
  duration,
  finalWpm,
  accuracy,
  errors,
  totalErrorsCommitted = 0,
  performanceData: rawPerformanceData,
  onRestart,
  className,
  text,
  userInput,
  errorIndices,
  errorTimestamps
}: ResultsProps) {
  // Process performance data to ensure it's valid and sorted
  const performanceData = useMemo(() => {
    // Filter out any invalid data points and ensure they're sorted by time
    const validData = rawPerformanceData
      .filter(point => point && typeof point.time === 'number' && typeof point.wpm === 'number')
      .sort((a, b) => a.time - b.time);

    // Ensure we have at least start and end points
    if (validData.length < 2) {
      // If we have less than 2 points, create a simple start-to-end dataset
      return [
        { time: 0, wpm: 0, accuracy: 100 },
        { time: duration, wpm: finalWpm, accuracy: accuracy }
      ];
    }

    return validData;
  }, [rawPerformanceData, duration, finalWpm, accuracy]);

  // Calculate average WPM - weighted by time intervals
  const avgWpm = useMemo(() => {
    if (performanceData.length <= 1) return finalWpm || 0;

    // Calculate time-weighted average
    let totalWeight = 0;
    let weightedSum = 0;

    // Loop through points and calculate weighted average
    for (let i = 1; i < performanceData.length; i++) {
      const prevPoint = performanceData[i-1];
      const currPoint = performanceData[i];

      // Time interval between points
      const timeInterval = currPoint.time - prevPoint.time;
      if (timeInterval <= 0) continue; // Skip invalid intervals

      // Average WPM during this interval
      const intervalAvgWpm = (prevPoint.wpm + currPoint.wpm) / 2;

      // Add to weighted sum
      weightedSum += intervalAvgWpm * timeInterval;
      totalWeight += timeInterval;
    }

    // Calculate final weighted average
    const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : finalWpm;

    return weightedAvg;
  }, [performanceData, finalWpm])

  // Find max WPM
  const maxWpm = performanceData.length > 0
    ? Math.max(...performanceData.map(point => point.wpm))
    : 0

  // Calculate consistency (based on coefficient of variation of WPM)
  const consistency = useMemo(() => {
    // Necesitamos al menos 3 puntos de datos para un cálculo significativo
    if (performanceData.length < 3) return 50; // Valor predeterminado razonable

    // Filtrar puntos de datos con WPM > 0 para cálculos más precisos
    const validPoints = performanceData.filter(point => point.wpm > 0);
    if (validPoints.length < 3) return 50;

    // Calcular la media
    const mean = validPoints.reduce((sum, point) => sum + point.wpm, 0) / validPoints.length;
    if (mean === 0) return 50; // Evitar división por cero

    // Calcular la desviación estándar
    const squaredDiffs = validPoints.map(point => Math.pow(point.wpm - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);

    // Calcular el coeficiente de variación (CV)
    const cv = stdDev / mean;

    // Convertir CV a un porcentaje de consistencia (menor CV = mayor consistencia)
    // Un CV de 0 significa perfecta consistencia (100%)
    // Un CV de 0.5 o mayor significa baja consistencia (0%)
    const consistencyPercentage = Math.max(0, Math.min(100, 100 - (cv * 200)));


    return Math.round(consistencyPercentage);
  }, [performanceData, avgWpm]);

  // Calculate character statistics
  const charStats = useMemo(() => {
    // Estimate total characters typed based on WPM
    const totalChars = Math.round(finalWpm * (duration / 60) * 5);
    const correctChars = Math.round(totalChars * (accuracy / 100));
    const errorChars = totalChars - correctChars;
    const fixedChars = errors; // Assuming errors is the count of fixed errors
    const unfixedChars = errorChars - fixedChars;

    return {
      total: totalChars,
      correct: correctChars,
      error: errorChars,
      fixed: fixedChars,
      unfixed: unfixedChars
    };
  }, [finalWpm, duration, accuracy, errors]);

  // Función de formato eliminada porque no se utiliza

  // Generar un ID de sesión único para este resultado
  const sessionId = useMemo(() => `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, []);

  // Guardar el resultado en el almacenamiento local (una sola vez)
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    // Solo guardar si hay datos válidos y no se ha guardado aún
    if (finalWpm > 0 && text && !resultSaved) {
      // Usar el ID de sesión para evitar duplicados
      saveTestResult({
        wpm: finalWpm,
        accuracy,
        errors,
        totalErrorsCommitted,
        duration,
        textLength: text.length,
        textPreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
      }, sessionId);

      // Marcar como guardado para evitar duplicados
      setResultSaved(true);
    }
  }, [finalWpm, accuracy, errors, totalErrorsCommitted, duration, text, resultSaved, sessionId]);

  return (
    <div
      className={cn("w-full max-w-4xl mx-auto p-4 sm:p-6 bg-background border border-border rounded-lg", className)}
      role="region"
      aria-label="Resultados de la prueba de mecanografía"
    >
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Main stats */}
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="text-sm text-primary/80 uppercase tracking-wide" id="wpm-label">wpm</div>
            <div
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-primary"
              aria-labelledby="wpm-label"
            >
              {finalWpm.toFixed(0)}
            </div>

            <div className="mt-4 text-sm text-primary/80 uppercase tracking-wide" id="acc-label">acc</div>
            <div
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-primary/90"
              aria-labelledby="acc-label"
            >
              {accuracy.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">tipo de prueba</div>
              <div className="text-xs sm:text-sm">bruto</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">tiempo</div>
              <div className="text-xs sm:text-sm">{duration}s</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">caracteres</div>
              <div className="text-xs sm:text-sm">
                <span className="sr-only">Total: {charStats.total}, Correctos: {charStats.correct}, Corregidos: {charStats.fixed}, Sin corregir: {charStats.unfixed}</span>
                <span aria-hidden="true">{charStats.total}/{charStats.correct}/{charStats.fixed}/{charStats.unfixed}</span>
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">errores totales</div>
              <div className="text-xs sm:text-sm">{totalErrorsCommitted}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">consistencia</div>
              <div className={cn(
                "text-xs sm:text-sm",
                consistency >= 75 ? "text-green-500" :
                consistency >= 50 ? "text-yellow-500" :
                "text-red-500"
              )}>
                {consistency}%
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">ppm promedio</div>
              <div className="text-xs sm:text-sm">{Math.round(avgWpm)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <div
        className="h-64 sm:h-80 mb-6 sm:mb-8 bg-background/50 border border-border/50 p-3 sm:p-4 rounded-md"
        aria-label="Gráfico de rendimiento"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <div className="text-xs text-muted-foreground">palabras por minuto</div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" aria-hidden="true"></div>
              <span className="text-xs">ppm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" aria-hidden="true"></div>
              <span className="text-xs">prom</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" aria-hidden="true"></div>
              <span className="text-xs">pre</span>
            </div>
          </div>
        </div>

        {/* Descripción para lectores de pantalla */}
        <div className="sr-only">
          Gráfico que muestra tu velocidad de escritura y precisión a lo largo del tiempo.
          Velocidad promedio: {Math.round(avgWpm)} palabras por minuto.
          Velocidad máxima: {Math.round(maxWpm)} palabras por minuto.
        </div>

        {performanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => typeof time === 'number' ? time.toFixed(0) : time.toString()}
                stroke="currentColor"
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }}
                domain={[0, duration]}
                allowDataOverflow={false}
                type="number"
                scale="linear"
              />
              <YAxis
                yAxisId="wpm"
                stroke="currentColor"
                tickFormatter={(value) => typeof value === 'number' ? value.toFixed(0) : value}
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }}
                domain={[0, Math.max(maxWpm * 1.2, 100)]}
                allowDataOverflow={false}
                type="number"
                scale="linear"
              />
              <YAxis
                yAxisId="accuracy"
                orientation="right"
                stroke="currentColor"
                tickFormatter={(value) => typeof value === 'number' ? value.toFixed(0) : value}
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }}
                domain={[0, 100]}
                allowDataOverflow={false}
                type="number"
                scale="linear"
              />
              <Tooltip
                formatter={(value, name) => {
                  // Format numbers to have at most 2 decimal places
                  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;

                  if (name === 'wpm') return [`${formattedValue} PPM`, 'Velocidad'];
                  if (name === 'accuracy') return [`${formattedValue}%`, 'Precisión'];
                  return [formattedValue, name];
                }}
                labelFormatter={(time) => `Tiempo: ${typeof time === 'number' ? time.toFixed(0) : time}s`}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
                isAnimationActive={false}
              />
              {avgWpm > 0 && (
                <ReferenceLine
                  yAxisId="wpm"
                  y={avgWpm}
                  stroke="#4ade80" // green-500
                  strokeDasharray="3 3"
                  strokeOpacity={0.8}
                  strokeWidth={2}
                  label={{
                    value: `Prom: ${Math.round(avgWpm)}`,
                    position: 'right',
                    fill: '#4ade80',
                    fontSize: 10,
                    fontWeight: 'bold'
                  }}
                />
              )}
              <Line
                yAxisId="wpm"
                type="monotone"
                dataKey="wpm"
                stroke="#eab308" // yellow-500
                strokeWidth={2}
                dot={{ fill: '#eab308', r: 1 }}
                activeDot={{ r: 3, fill: '#eab308' }}
                animationDuration={1000}
                connectNulls={true}
                isAnimationActive={true}
                name="wpm"
              />
              <Line
                yAxisId="accuracy"
                type="monotone"
                dataKey="accuracy"
                stroke="#ef4444" // red-500
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 1 }}
                activeDot={{ r: 3, fill: '#ef4444' }}
                animationDuration={1000}
                connectNulls={true}
                isAnimationActive={true}
                name="accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No hay datos de rendimiento disponibles
          </div>
        )}
      </div>

      {/* Análisis de errores */}
      {text && userInput && errorIndices && errorIndices.length > 0 && (
        <div className="mt-8 mb-12">
          <ErrorAnalysis
            typingData={{
              text: text,
              input: userInput,
              errorIndices: errorIndices,
              errorTimestamps: errorTimestamps || []
            }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center mt-8 sm:mt-10 mb-4 sm:mb-6">
        <Button
          onClick={onRestart}
          variant="default"
          size="lg"
          className="font-medium px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          aria-label="Intentar de nuevo la prueba de mecanografía"
        >
          Intentar de Nuevo
        </Button>
      </div>
    </div>
  )
})

export default Results
