import { useCallback } from "react";

interface UseWpmCalculatorProps {
  startTime: number | null;
  isRunning: boolean;
  elapsedTime: number;
  userInput: string;
  currentText: string;
}

/**
 * Hook para calcular las palabras por minuto (WPM) en tiempo real
 */
export const useWpmCalculator = ({
  startTime,
  isRunning,
  elapsedTime,
  userInput,
  currentText,
}: UseWpmCalculatorProps) => {
  /**
   * Calcula las palabras por minuto (WPM) basado en los caracteres correctamente escritos
   */
  const calculateWpm = useCallback(() => {
    if (!startTime || !isRunning) return 0;

    // Contar solo caracteres correctamente escritos
    let correctCharCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (i < currentText.length && userInput[i] === currentText[i]) {
        correctCharCount++;
      }
    }

    const timeInMinutes = elapsedTime / 60;
    // Estándar: 5 caracteres = 1 palabra, pero solo contar caracteres correctos
    const wordCount = correctCharCount / 5;

    if (timeInMinutes === 0) return 0;

    const wpm = wordCount / timeInMinutes;
    console.log(
      `WPM calculation: ${correctCharCount} correct chars / 5 = ${wordCount} words in ${timeInMinutes.toFixed(
        2
      )} minutes = ${wpm.toFixed(1)} WPM`
    );

    return wpm;
  }, [startTime, isRunning, elapsedTime, userInput, currentText]);

  /**
   * Calcula la precisión basada en los caracteres correctos e incorrectos
   */
  const calculateAccuracy = useCallback(
    (totalErrorsCommitted: number, currentErrors: number) => {
      // Calcular precisión basada en el total de caracteres escritos (incluyendo errores) vs caracteres correctos
      const totalCharsTyped = userInput.length + totalErrorsCommitted - currentErrors;
      const correctChars = userInput.length - currentErrors;
      
      const accuracyPercent = totalCharsTyped > 0
        ? (correctChars / totalCharsTyped) * 100
        : 100;
      
      return accuracyPercent;
    },
    [userInput]
  );

  return {
    calculateWpm,
    calculateAccuracy,
  };
};
