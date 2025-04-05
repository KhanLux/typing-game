import { useState, useEffect, useRef, useCallback } from "react";
import { useWpmCalculator } from "./use-wpm-calculator";

interface PerformancePoint {
  time: number; // seconds elapsed
  wpm: number;
  accuracy?: number; // accuracy at this point in time
}

interface UseTypingTestProps {
  texts: string[];
  getRandomText: () => Promise<string> | string;
  duration: number;
}

/**
 * Hook principal para la lógica del test de mecanografía
 */
export const useTypingTest = ({
  texts,
  getRandomText,
  duration,
}: UseTypingTestProps) => {
  // Estado para la configuración del test
  const [currentText, setCurrentText] = useState("");

  // Estado para el progreso del test
  const [userInput, setUserInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);

  // Estado para métricas de rendimiento
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalErrorsCommitted, setTotalErrorsCommitted] = useState(0); // Total de errores incluyendo los corregidos
  const [performanceData, setPerformanceData] = useState<PerformancePoint[]>([]);

  // Estado para análisis detallado de errores
  const [errorIndices, setErrorIndices] = useState<number[]>([]); // Índices donde ocurrieron errores
  const [errorTimestamps, setErrorTimestamps] = useState<number[]>([]); // Timestamps de cuando ocurrieron los errores

  // Refs
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Utilizar el hook de cálculo de WPM
  const { calculateWpm, calculateAccuracy } = useWpmCalculator({
    startTime,
    isRunning,
    elapsedTime,
    userInput,
    currentText,
  });

  // Función para cambiar el texto actual
  const handleTextChange = useCallback((newText: string) => {
    setCurrentText(newText);
  }, []);

  // Inicializar al montar el componente
  useEffect(() => {
    // Solo establecer el texto si no está ya establecido
    if (!currentText) {
      // Manejar tanto promesas como strings
      const textResult = getRandomText();
      if (textResult instanceof Promise) {
        textResult.then(text => setCurrentText(text));
      } else {
        setCurrentText(textResult);
      }
    }

    // Inicializar otras variables de estado
    setUserInput("");
    setCurrentPosition(0);
    setIsRunning(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalErrorsCommitted(0);
    setPerformanceData([]);
  }, [getRandomText, currentText]);

  // Actualizar WPM en tiempo real
  useEffect(() => {
    if (isRunning && !isFinished) {
      // Limpiar cualquier intervalo existente
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current);
      }

      // Actualizar WPM cada segundo
      wpmIntervalRef.current = setInterval(() => {
        const currentWpm = calculateWpm();
        setWpm(currentWpm);

        // Calcular precisión real basada en el total de errores cometidos
        const accuracyValue = calculateAccuracy(totalErrorsCommitted, errors);

        // Solo registrar datos si hay actividad de escritura significativa
        // Esto ayuda a mejorar el cálculo de consistencia
        if (userInput.length > 0) {

          setPerformanceData((prev) => {
            // Evitar duplicados en el mismo segundo
            const existingPoint = prev.find((p) => p.time === elapsedTime);
            if (existingPoint) {
              return prev.map((p) =>
                p.time === elapsedTime
                  ? { time: elapsedTime, wpm: currentWpm, accuracy: accuracyValue }
                  : p
              );
            } else {
              return [
                ...prev,
                { time: elapsedTime, wpm: currentWpm, accuracy: accuracyValue },
              ];
            }
          });
        }
      }, 1000);
    }

    return () => {
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current);
      }
    };
  }, [isRunning, isFinished, calculateWpm, calculateAccuracy, elapsedTime, duration, errors, totalErrorsCommitted, userInput]);

  // Manejar tick del temporizador
  const handleTimerTick = useCallback((remainingTime: number) => {
    setElapsedTime(duration - remainingTime);
  }, [duration]);

  // Manejar finalización del temporizador
  const handleTimerComplete = useCallback(() => {
    // Calcular WPM final
    const finalWpm = calculateWpm();
    setWpm(finalWpm);

    // Actualizar estado primero para prevenir condiciones de carrera
    setIsRunning(false);
    setIsFinished(true);
    setIsTyping(false);

    // Calcular precisión real basada en el total de errores cometidos
    const accuracyValue = calculateAccuracy(totalErrorsCommitted, errors);

    // Actualizar el estado de precisión con la precisión real
    setAccuracy(accuracyValue);


    // Usar un callback para asegurar que tenemos los datos de rendimiento más recientes
    setPerformanceData((prev) => {
      // Crear una copia de los datos previos
      const updatedData = [...prev];

      // Añadir el punto de datos final
      updatedData.push({
        time: elapsedTime,
        wpm: finalWpm,
        accuracy: accuracyValue,
      });

      // Asegurar que los datos están ordenados por tiempo
      updatedData.sort((a, b) => a.time - b.time);

      return updatedData;
    });

    // Limpiar intervalo
    if (wpmIntervalRef.current) {
      clearInterval(wpmIntervalRef.current);
      wpmIntervalRef.current = null;
    }

    // Limpiar timeout de escritura
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [calculateWpm, calculateAccuracy, elapsedTime, errors, totalErrorsCommitted]);

  // Iniciar el test
  const handleStart = useCallback(() => {
    // Resetear estado del test sin cambiar el texto
    setUserInput("");
    setCurrentPosition(0);
    setIsFinished(false);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalErrorsCommitted(0);
    setPerformanceData([]);

    // Establecer tiempo de inicio y estado de ejecución
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);


    // Crear una serie de puntos de datos iniciales para asegurar un gráfico suave y mejor cálculo de consistencia
    // Al inicio, la precisión es 100% porque aún no se han cometido errores
    const initialData = [
      { time: 0, wpm: 0, accuracy: 100 },
      { time: 1, wpm: 0, accuracy: 100 },
      { time: 2, wpm: 0, accuracy: 100 },
    ];

    setPerformanceData(initialData);
  }, []);

  // Reiniciar el test con un nuevo texto
  const handleRestart = useCallback(() => {
    // Obtener un nuevo texto aleatorio
    const textResult = getRandomText();
    if (textResult instanceof Promise) {
      textResult.then(text => {
        setCurrentText(text);

        // Resetear todas las demás variables de estado
        setUserInput("");
        setCurrentPosition(0);
        setIsRunning(false);
        setIsFinished(false);
        setStartTime(null);
        setElapsedTime(0);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTotalErrorsCommitted(0);
        setPerformanceData([]);
        setErrorIndices([]);
        setErrorTimestamps([]);
      });
    } else {
      setCurrentText(textResult);

      // Resetear todas las demás variables de estado
      setUserInput("");
      setCurrentPosition(0);
      setIsRunning(false);
      setIsFinished(false);
      setStartTime(null);
      setElapsedTime(0);
      setWpm(0);
      setAccuracy(100);
      setErrors(0);
      setTotalErrorsCommitted(0);
      setPerformanceData([]);
      setErrorIndices([]);
      setErrorTimestamps([]);
    }
  }, [getRandomText]);

  // Configurar detección de escritura
  useEffect(() => {
    return () => {
      // Limpiar timeout al desmontar
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Función para manejar el estado de escritura
  const updateTypingState = useCallback(() => {
    // Marcar como escribiendo
    setIsTyping(true);
    setLastTypingTime(Date.now());

    // Limpiar cualquier timeout existente
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Establecer timeout para marcar como no escribiendo después de 1 segundo de inactividad
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000); // 1 segundo de inactividad para considerar que no se está escribiendo
  }, []);

  // Manejar entrada de teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ignorar teclas modificadoras y teclas especiales
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "Tab" ||
        e.key === "CapsLock" ||
        e.key === "Escape"
      ) {
        return;
      }

      // Si el test ha terminado, no procesar más entrada
      if (isFinished) return;

      // Si el test no ha comenzado aún y el usuario presiona una tecla válida, iniciar el test
      if (!isRunning && e.key.length === 1) {
        // Inicializar e iniciar el test
        handleStart();
      }

      // Si el test aún no está en ejecución (p. ej., después de intentar iniciarlo), retornar
      if (!isRunning) return;

      // Actualizar estado de escritura
      updateTypingState();

      // Prevenir comportamiento predeterminado para la mayoría de las teclas
      if (e.key !== "Backspace") {
        e.preventDefault();
      }

      // Manejar retroceso
      if (e.key === "Backspace" && currentPosition > 0) {
        e.preventDefault();

        // Actualizar posición y entrada
        setCurrentPosition(currentPosition - 1);
        const newUserInput = userInput.slice(0, -1);
        setUserInput(newUserInput);

        // Recalcular errores actuales (pero no cambiar totalErrorsCommitted)
        let correctChars = 0;
        let currentErrors = 0;

        for (let i = 0; i < newUserInput.length; i++) {
          if (i < currentText.length && newUserInput[i] === currentText[i]) {
            correctChars++;
          } else {
            currentErrors++;
          }
        }

        // Calcular precisión basada en el total de caracteres escritos (incluyendo errores) vs caracteres correctos
        const accuracyValue = calculateAccuracy(totalErrorsCommitted, currentErrors);

        // Actualizar estado con errores actuales y precisión
        setErrors(currentErrors);
        setAccuracy(accuracyValue);


        return;
      }

      // Ignorar si estamos al final del texto
      if (currentPosition >= currentText.length) {
        return;
      }

      // Manejar entrada de caracteres
      if (e.key.length === 1) {
        const newUserInput = userInput + e.key;
        setUserInput(newUserInput);
        setCurrentPosition(currentPosition + 1);

        // Verificar si el carácter actual es correcto
        const isCurrentCharCorrect = e.key === currentText[currentPosition];

        // Si el carácter es incorrecto, incrementar el total de errores cometidos
        if (!isCurrentCharCorrect) {
          setTotalErrorsCommitted((prev) => prev + 1);

          // Registrar el índice y timestamp del error para análisis detallado
          setErrorIndices((prev) => [...prev, currentPosition]);
          setErrorTimestamps((prev) => [...prev, Date.now()]);
        }

        // Calcular precisión y errores
        let correctChars = 0;
        let currentErrors = 0;

        for (let i = 0; i < newUserInput.length; i++) {
          if (i < currentText.length && newUserInput[i] === currentText[i]) {
            correctChars++;
          } else {
            currentErrors++;
          }
        }

        // Calcular precisión basada en el total de caracteres escritos (incluyendo errores) vs caracteres correctos
        const accuracyValue = calculateAccuracy(totalErrorsCommitted, currentErrors);

        // Actualizar estado con errores actuales y precisión
        setErrors(currentErrors);
        setAccuracy(accuracyValue);


        // Verificar si el texto está completado
        if (currentPosition + 1 >= currentText.length) {
          // Calcular WPM final antes de completar
          const finalWpm = calculateWpm();
          setWpm(finalWpm);

          // Calcular precisión real basada en el total de errores cometidos
          const finalAccuracyValue = calculateAccuracy(totalErrorsCommitted, currentErrors);

          // Actualizar el estado de precisión con la precisión real
          setAccuracy(finalAccuracyValue);


          // Usar un callback para asegurar que tenemos los datos de rendimiento más recientes
          setPerformanceData((prev) => {
            // Crear una copia de los datos previos
            const updatedData = [...prev];

            // Añadir el punto de datos final
            updatedData.push({
              time: elapsedTime,
              wpm: finalWpm,
              accuracy: finalAccuracyValue,
            });

            // Asegurar que los datos están ordenados por tiempo
            updatedData.sort((a, b) => a.time - b.time);

            return updatedData;
          });

          // Llamar a handleTimerComplete después de actualizar los datos de rendimiento
          setTimeout(() => handleTimerComplete(), 0);
        }
      }
    },
    [
      isFinished,
      isRunning,
      currentPosition,
      currentText,
      userInput,
      handleStart,
      updateTypingState,
      totalErrorsCommitted,
      elapsedTime,
      calculateWpm,
      calculateAccuracy,
      handleTimerComplete,
    ]
  );

  return {
    // Estado
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

    // Manejadores
    handleKeyDown,
    handleTimerTick,
    handleTimerComplete,
    handleStart,
    handleRestart,
    handleTextChange,
  };
};
