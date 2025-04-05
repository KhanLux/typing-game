/**
 * Servicio para manejar el almacenamiento local de datos
 * Proporciona funciones para guardar y recuperar datos del localStorage
 */

// Claves para el almacenamiento
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'typing_game_preferences',
  RESULTS_HISTORY: 'typing_game_history',
};

// Tipos de datos
export interface UserPreferences {
  theme: string;
  duration: number;
  lastUsed?: string; // Fecha de última modificación
}

export interface TestResult {
  id: string; // Identificador único
  date: string; // Fecha y hora de la prueba
  duration: number; // Duración de la prueba en segundos
  wpm: number; // Palabras por minuto
  accuracy: number; // Precisión (0-100)
  errors: number; // Errores no corregidos
  totalErrorsCommitted: number; // Total de errores cometidos
  textLength: number; // Longitud del texto
  textPreview: string; // Primeros 50 caracteres del texto
}

// Número máximo de resultados a almacenar
const MAX_HISTORY_ITEMS = 100;

/**
 * Verifica si localStorage está disponible
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Guarda datos en localStorage
 * @param key Clave para almacenar los datos
 * @param data Datos a almacenar
 * @returns true si se guardó correctamente, false en caso contrario
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage no está disponible');
    return false;
  }

  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
};

/**
 * Recupera datos de localStorage
 * @param key Clave para recuperar los datos
 * @param defaultValue Valor por defecto si no hay datos
 * @returns Los datos recuperados o el valor por defecto
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage no está disponible');
    return defaultValue;
  }

  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error('Error al recuperar de localStorage:', error);
    return defaultValue;
  }
};

/**
 * Guarda las preferencias del usuario
 * @param preferences Preferencias del usuario
 * @returns true si se guardó correctamente, false en caso contrario
 */
export const saveUserPreferences = (preferences: UserPreferences): boolean => {
  // Añadir fecha de última modificación
  const preferencesWithDate = {
    ...preferences,
    lastUsed: new Date().toISOString(),
  };
  return saveToStorage(STORAGE_KEYS.USER_PREFERENCES, preferencesWithDate);
};

/**
 * Recupera las preferencias del usuario
 * @returns Las preferencias del usuario o valores por defecto
 */
export const getUserPreferences = (): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'dark',
    duration: 60,
  };
  return getFromStorage<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences);
};

/**
 * Guarda un resultado de prueba en el historial
 * @param result Resultado de la prueba
 * @param sessionId Identificador único de sesión para evitar duplicados
 * @returns true si se guardó correctamente, false en caso contrario
 */
export const saveTestResult = (result: Omit<TestResult, 'id' | 'date'>, sessionId?: string): boolean => {
  // Recuperar historial actual
  const history = getTestHistory();

  // Verificar si ya existe un resultado con el mismo sessionId (si se proporciona)
  if (sessionId && history.some(item => item.id === sessionId)) {
    console.log('Resultado ya guardado, evitando duplicado');
    return true; // Ya existe, consideramos que se guardó correctamente
  }

  // Verificar si hay un resultado muy similar en los últimos 2 segundos (para evitar duplicados)
  const now = new Date();
  const recentDuplicate = history.find(item => {
    // Verificar si hay un resultado con los mismos valores en los últimos 2 segundos
    const itemDate = new Date(item.date);
    const timeDiff = Math.abs(now.getTime() - itemDate.getTime());
    return timeDiff < 2000 && // Menos de 2 segundos de diferencia
           item.wpm === result.wpm &&
           item.accuracy === result.accuracy &&
           item.duration === result.duration;
  });

  if (recentDuplicate) {
    console.log('Detectado resultado similar reciente, evitando duplicado');
    return true; // Consideramos que ya se guardó
  }

  // Crear nuevo resultado con ID (usando sessionId si se proporciona) y fecha
  const newResult: TestResult = {
    ...result,
    id: sessionId || generateId(),
    date: new Date().toISOString(),
  };

  // Añadir al principio del historial
  const updatedHistory = [newResult, ...history];

  // Limitar el tamaño del historial
  if (updatedHistory.length > MAX_HISTORY_ITEMS) {
    updatedHistory.length = MAX_HISTORY_ITEMS;
  }

  return saveToStorage(STORAGE_KEYS.RESULTS_HISTORY, updatedHistory);
};

/**
 * Recupera el historial de resultados
 * @returns El historial de resultados o un array vacío
 */
export const getTestHistory = (): TestResult[] => {
  return getFromStorage<TestResult[]>(STORAGE_KEYS.RESULTS_HISTORY, []);
};

/**
 * Elimina un resultado del historial
 * @param id ID del resultado a eliminar
 * @returns true si se eliminó correctamente, false en caso contrario
 */
export const deleteTestResult = (id: string): boolean => {
  const history = getTestHistory();
  const updatedHistory = history.filter(result => result.id !== id);

  if (updatedHistory.length === history.length) {
    // No se encontró el resultado
    return false;
  }

  return saveToStorage(STORAGE_KEYS.RESULTS_HISTORY, updatedHistory);
};

/**
 * Elimina todo el historial de resultados
 * @returns true si se eliminó correctamente, false en caso contrario
 */
export const clearTestHistory = (): boolean => {
  return saveToStorage(STORAGE_KEYS.RESULTS_HISTORY, []);
};

/**
 * Genera un ID único
 * @returns ID único
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
