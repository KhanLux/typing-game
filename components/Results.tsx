"use client"

import React from "react"
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

const Results = ({
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
}: ResultsProps) => {
  // Process performance data to ensure it's valid and sorted
  const performanceData = React.useMemo(() => {
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
  const avgWpm = React.useMemo(() => {
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

    console.log(`Weighted average WPM: ${weightedAvg.toFixed(1)} (total time: ${totalWeight}s)`)
    return weightedAvg;
  }, [performanceData, finalWpm])

  // Find max WPM
  const maxWpm = performanceData.length > 0
    ? Math.max(...performanceData.map(point => point.wpm))
    : 0

  // Calculate consistency (based on coefficient of variation of WPM)
  const consistency = React.useMemo(() => {
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

    console.log(`Consistency calculation: Mean WPM: ${mean.toFixed(2)}, StdDev: ${stdDev.toFixed(2)}, CV: ${cv.toFixed(2)}, Consistency: ${Math.round(consistencyPercentage)}%`);

    return Math.round(consistencyPercentage);
  }, [performanceData, avgWpm]);

  // Calculate character statistics
  const charStats = React.useMemo(() => {
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

  // Format time for x-axis
  const formatXAxis = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Log performance data for debugging
  console.log('Performance data in Results:', performanceData)
  console.log('Final WPM:', finalWpm)
  console.log('Average WPM:', avgWpm)
  console.log('Max WPM:', maxWpm)

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6 bg-background border border-border", className)}>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Main stats */}
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="text-sm text-primary/80 uppercase tracking-wide">wpm</div>
            <div className="text-6xl font-mono font-bold text-primary">{finalWpm.toFixed(0)}</div>

            <div className="mt-4 text-sm text-primary/80 uppercase tracking-wide">acc</div>
            <div className="text-6xl font-mono font-bold text-primary/90">{accuracy.toFixed(0)}%</div>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">tipo de prueba</div>
              <div className="text-sm">bruto</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">tiempo</div>
              <div className="text-sm">{duration}s</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">caracteres</div>
              <div className="text-sm">{charStats.total}/{charStats.correct}/{charStats.fixed}/{charStats.unfixed}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">errores totales</div>
              <div className="text-sm">{totalErrorsCommitted}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">consistencia</div>
              <div className={cn(
                "text-sm",
                consistency >= 75 ? "text-green-500" :
                consistency >= 50 ? "text-yellow-500" :
                "text-red-500"
              )}>
                {consistency}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">ppm promedio</div>
              <div className="text-sm">{Math.round(avgWpm)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <div className="h-80 mb-8 bg-background/50 border border-border/50 p-4 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-muted-foreground">palabras por minuto</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">ppm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">prom</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">pre</span>
            </div>
          </div>
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
      <div className="flex justify-center mt-10 mb-6">
        <Button
          onClick={onRestart}
          variant="default"
          size="lg"
          className="font-medium px-8 py-6 text-base shadow-md hover:shadow-lg transition-all"
        >
          Intentar de Nuevo
        </Button>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  highlight?: boolean
}

const StatCard = ({ label, value, highlight = false }: StatCardProps) => {
  return (
    <div className={cn(
      "p-3 text-center border",
      highlight
        ? "border-primary/20 bg-primary/5"
        : "border-border bg-accent/5"
    )}>
      <div className="text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <div className={cn(
        "text-xl font-mono font-medium mt-1",
        highlight ? "text-primary" : "text-foreground"
      )}>
        {value}
      </div>
    </div>
  )
}

export default Results
