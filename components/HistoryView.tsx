"use client"

import React, { useState, useEffect, useMemo } from "react"
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getTestHistory, clearTestHistory, deleteTestResult, TestResult } from "@/lib/storage-service"
import { Trash2, X, BarChart2, Award, Clock } from "lucide-react"

interface HistoryViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryView({ open, onOpenChange }: HistoryViewProps) {
  const [history, setHistory] = useState<TestResult[]>([])
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  // Cargar historial al abrir el diálogo
  useEffect(() => {
    if (open) {
      const testHistory = getTestHistory()
      setHistory(testHistory)
    }
  }, [open])

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        avgWpm: 0,
        maxWpm: 0,
        avgAccuracy: 0,
        totalTests: 0,
        recentImprovement: 0,
      }
    }

    const totalWpm = history.reduce((sum, result) => sum + result.wpm, 0)
    const maxWpm = Math.max(...history.map(result => result.wpm))
    const totalAccuracy = history.reduce((sum, result) => sum + result.accuracy, 0)
    
    // Calcular mejora reciente (últimos 5 tests vs 5 anteriores)
    let recentImprovement = 0
    if (history.length >= 10) {
      const recent5 = history.slice(0, 5)
      const previous5 = history.slice(5, 10)
      
      const avgRecent = recent5.reduce((sum, result) => sum + result.wpm, 0) / 5
      const avgPrevious = previous5.reduce((sum, result) => sum + result.wpm, 0) / 5
      
      recentImprovement = avgRecent - avgPrevious
    }

    return {
      avgWpm: totalWpm / history.length,
      maxWpm: maxWpm,
      avgAccuracy: totalAccuracy / history.length,
      totalTests: history.length,
      recentImprovement,
    }
  }, [history])

  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    // Tomar los últimos 20 resultados y revertirlos para mostrarlos en orden cronológico
    return [...history]
      .slice(0, 20)
      .reverse()
      .map((result, index) => ({
        name: `Test ${index + 1}`,
        wpm: result.wpm,
        accuracy: result.accuracy,
      }))
  }, [history])

  // Manejar eliminación de un resultado
  const handleDeleteResult = (id: string) => {
    if (deleteTestResult(id)) {
      setHistory(prev => prev.filter(result => result.id !== id))
    }
  }

  // Manejar eliminación de todo el historial
  const handleClearHistory = () => {
    if (clearTestHistory()) {
      setHistory([])
      setIsConfirmingClear(false)
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Historial de Resultados
          </DialogTitle>
          <DialogDescription>
            Visualiza tu progreso y estadísticas de mecanografía a lo largo del tiempo.
          </DialogDescription>
        </DialogHeader>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-accent/10 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Pruebas realizadas</div>
            <div className="text-2xl font-mono font-bold">{stats.totalTests}</div>
          </div>
          <div className="bg-accent/10 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">PPM promedio</div>
            <div className="text-2xl font-mono font-bold">{stats.avgWpm.toFixed(1)}</div>
          </div>
          <div className="bg-accent/10 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">PPM máximo</div>
            <div className="text-2xl font-mono font-bold">{stats.maxWpm.toFixed(1)}</div>
          </div>
          <div className="bg-accent/10 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Precisión promedio</div>
            <div className="text-2xl font-mono font-bold">{stats.avgAccuracy.toFixed(1)}%</div>
          </div>
        </div>

        {/* Gráfico de progreso */}
        {history.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Progreso reciente</h3>
            <div className="h-64 border border-border/50 rounded-md p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="wpm"
                    name="PPM"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="accuracy"
                    name="Precisión"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tabla de resultados */}
        {history.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableCaption>Historial de pruebas de mecanografía</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Fecha</TableHead>
                  <TableHead className="text-right">PPM</TableHead>
                  <TableHead className="text-right">Precisión</TableHead>
                  <TableHead className="text-right">Duración</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium text-xs">
                      {formatDate(result.date)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.wpm.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.accuracy.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.duration}s
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteResult(result.id)}
                        aria-label="Eliminar resultado"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No hay resultados en el historial.</p>
            <p className="text-sm mt-2">Completa algunas pruebas para ver tu progreso aquí.</p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          {isConfirmingClear ? (
            <>
              <div className="text-sm text-destructive mr-auto">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </div>
              <Button
                variant="outline"
                onClick={() => setIsConfirmingClear(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearHistory}
              >
                Confirmar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="mr-auto"
                onClick={() => history.length > 0 && setIsConfirmingClear(true)}
                disabled={history.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Borrar historial
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
