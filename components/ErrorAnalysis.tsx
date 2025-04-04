"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Definir la estructura de los datos de error
interface ErrorData {
  character: string
  count: number
  position: number
  timeStamp: number
}

interface KeyboardHeatmapProps {
  errorData: Record<string, number>
}

// Componente para mostrar un mapa de calor del teclado
const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ errorData }) => {
  // Definir las filas del teclado en español
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', "'", '¡'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '`', '+'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', '{', '}'],
    ['<', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
    [' '] // Barra espaciadora
  ]

  // Encontrar el valor máximo para normalizar los colores
  const maxErrorCount = Math.max(1, ...Object.values(errorData))

  return (
    <div className="flex flex-col items-center gap-1 my-4">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => {
            const errorCount = errorData[key] || 0
            const intensity = errorCount / maxErrorCount
            const width = key === ' ' ? 'w-32' : 'w-10'

            return (
              <div
                key={key}
                className={cn(
                  "h-10 flex items-center justify-center rounded-md border shadow-sm transition-colors",
                  width,
                  intensity > 0.7 ? "bg-red-500 text-white border-red-600" :
                  intensity > 0.4 ? "bg-orange-400 text-white border-orange-500" :
                  intensity > 0.1 ? "bg-yellow-300 border-yellow-400" :
                  "bg-muted border-muted-foreground/20"
                )}
                title={`${key}: ${errorCount} errores`}
              >
                {key === ' ' ? 'Espacio' : key.toUpperCase()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

interface ErrorAnalysisProps {
  typingData: {
    text: string
    input: string
    errorIndices: number[]
    errorTimestamps: number[]
  }
}

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ typingData }) => {
  // Analizar los errores para identificar patrones
  const {
    characterErrors,
    problemCategories,
    recommendedExercises,
    errorHeatmap
  } = useMemo(() => {
    const characterErrors: Record<string, number> = {}
    const errorHeatmap: Record<string, number> = {}

    // Contar errores por carácter
    for (const index of typingData.errorIndices) {
      const correctChar = typingData.text[index] || ''
      if (correctChar) {
        characterErrors[correctChar] = (characterErrors[correctChar] || 0) + 1
        errorHeatmap[correctChar.toLowerCase()] = (errorHeatmap[correctChar.toLowerCase()] || 0) + 1
      }
    }

    // Identificar categorías de problemas
    const problemCategories = {
      symbols: 0,
      numbers: 0,
      letters: 0,
      spaces: 0,
      accents: 0
    }

    Object.entries(characterErrors).forEach(([char, count]) => {
      if ('0123456789'.includes(char)) {
        problemCategories.numbers += count
      } else if (' '.includes(char)) {
        problemCategories.spaces += count
      } else if ('áéíóúüñÁÉÍÓÚÜÑ'.includes(char)) {
        problemCategories.accents += count
      } else if ('.,;:(){}[]<>!?¡¿@#$%^&*-_=+\'"\\|/'.includes(char)) {
        problemCategories.symbols += count
      } else {
        problemCategories.letters += count
      }
    })

    // Generar ejercicios recomendados basados en los errores
    const recommendedExercises = []

    // Ejercicio para los caracteres más problemáticos
    const topErrorChars = Object.entries(characterErrors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([char]) => char)

    if (topErrorChars.length > 0) {
      const charsExercise = {
        title: "Práctica de caracteres problemáticos",
        description: `Enfócate en los caracteres que más te cuestan: ${topErrorChars.join(', ')}`,
        exercise: topErrorChars.join(' ').repeat(10).split('').sort(() => Math.random() - 0.5).join('')
      }
      recommendedExercises.push(charsExercise)
    }

    // Ejercicio para la categoría más problemática
    const topCategory = Object.entries(problemCategories)
      .sort((a, b) => b[1] - a[1])[0]

    let categoryExercise = {
      title: "",
      description: "",
      exercise: ""
    }

    switch (topCategory[0]) {
      case 'symbols':
        categoryExercise = {
          title: "Práctica de símbolos",
          description: "Mejora tu precisión con los símbolos y signos de puntuación",
          exercise: "El señor (Juan) dijo: «¡Vaya! ¿Cómo es posible? La cuenta es de $150.75, no de $175.50»."
        }
        break
      case 'numbers':
        categoryExercise = {
          title: "Práctica de números",
          description: "Mejora tu velocidad y precisión con los números",
          exercise: "En 2023, el 75% de las 1,234 personas encuestadas prefirieron el modelo 9870 sobre el 8654."
        }
        break
      case 'accents':
        categoryExercise = {
          title: "Práctica de acentos",
          description: "Mejora tu manejo de caracteres con acentos y la letra ñ",
          exercise: "El niño cumplió años y su mamá le organizó una fiesta con piñata. ¡Qué día más feliz!"
        }
        break
      case 'spaces':
        categoryExercise = {
          title: "Práctica de espaciado",
          description: "Mejora tu ritmo y precisión con los espacios",
          exercise: "Uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince."
        }
        break
      default:
        categoryExercise = {
          title: "Práctica general de letras",
          description: "Mejora tu velocidad y precisión con combinaciones de letras comunes",
          exercise: "Cuando examinamos la cuestión con mayor profundidad, vemos que requiere un análisis detallado."
        }
    }

    recommendedExercises.push(categoryExercise)

    return {
      characterErrors,
      problemCategories,
      recommendedExercises,
      errorHeatmap
    }
  }, [typingData])

  // Ordenar los caracteres por número de errores
  const sortedCharErrors = Object.entries(characterErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Calcular el total de errores para los porcentajes
  const totalErrors = typingData.errorIndices.length

  return (
    <Card className="w-full border-primary/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-primary font-semibold">Análisis de Errores</CardTitle>
        <CardDescription className="text-muted-foreground">
          Análisis detallado de tus errores de mecanografía y recomendaciones para mejorar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="heatmap" className="text-sm font-medium">Mapa de Calor</TabsTrigger>
            <TabsTrigger value="characters" className="text-sm font-medium">Caracteres</TabsTrigger>
            <TabsTrigger value="exercises" className="text-sm font-medium">Ejercicios</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-2">
              Este mapa muestra las teclas donde cometes más errores
            </div>
            <KeyboardHeatmap errorData={errorHeatmap} />
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Los caracteres que más te cuestan
            </div>

            {sortedCharErrors.length > 0 ? (
              <div className="space-y-3">
                {sortedCharErrors.map(([char, count]) => (
                  <div key={char} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary">
                        {char === ' ' ? 'Espacio' : `'${char}'`}
                      </span>
                      <span className="text-muted-foreground">{count} errores ({Math.round(count / totalErrors * 100)}%)</span>
                    </div>
                    <Progress value={count / totalErrors * 100} className="h-2"
                      // Colores basados en el porcentaje de errores
                      style={{
                        background: count / totalErrors > 0.3 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        '--progress-color': count / totalErrors > 0.3 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No hay suficientes datos para analizar
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-border/30">
              <h4 className="font-medium mb-3 text-primary">Categorías de errores</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(problemCategories).map(([category, count]) => (
                  <div key={category} className="space-y-1.5 bg-muted/30 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">
                        {category === 'symbols' ? 'Símbolos' :
                         category === 'numbers' ? 'Números' :
                         category === 'letters' ? 'Letras' :
                         category === 'spaces' ? 'Espacios' :
                         category === 'accents' ? 'Acentos' : category}
                      </span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <Progress
                      value={count / totalErrors * 100}
                      className="h-2"
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        '--progress-color': 'rgb(59, 130, 246)'
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Ejercicios personalizados basados en tus errores
            </div>

            {recommendedExercises.length > 0 ? (
              <div className="space-y-6">
                {recommendedExercises.map((exercise, index) => (
                  <div key={index} className="p-5 border border-primary/10 rounded-lg shadow-sm bg-card/50 hover:bg-card/80 transition-colors">
                    <h3 className="font-semibold text-primary mb-1">{exercise.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    <div className="p-4 bg-muted rounded-md text-sm font-mono border border-border/30 shadow-inner">
                      {exercise.exercise}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                Completa más pruebas para recibir ejercicios personalizados
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ErrorAnalysis
