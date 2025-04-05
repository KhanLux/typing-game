/**
 * Servicio para gestionar los efectos de sonido en la aplicación
 */

// Tipos de sonidos disponibles
export enum SoundType {
  KeyPress = 'keypress',
  KeyError = 'keyerror',
  KeyCorrect = 'keycorrect',
  Complete = 'complete',
  Achievement = 'achievement',
  Click = 'click'
}

// Mapeo de tipos de sonido a archivos
const soundFiles: Record<SoundType, string> = {
  [SoundType.KeyPress]: '/sounds/keypress.mp3',
  [SoundType.KeyError]: '/sounds/keyerror.mp3',
  [SoundType.KeyCorrect]: '/sounds/keycorrect.mp3',
  [SoundType.Complete]: '/sounds/complete.mp3',
  [SoundType.Achievement]: '/sounds/achievement.mp3',
  [SoundType.Click]: '/sounds/click.mp3'
};

// Caché de objetos de audio
const audioCache: Record<string, HTMLAudioElement> = {};

// Estado global del sonido
let soundEnabled = true;

/**
 * Inicializa el servicio de audio precargando los sonidos
 */
export const initSoundService = (): void => {
  if (typeof window === 'undefined') return;

  // Cargar la preferencia de sonido del localStorage
  const storedPreference = localStorage.getItem('sound_enabled');
  if (storedPreference !== null) {
    soundEnabled = storedPreference === 'true';
  }

  // Precargar los sonidos
  Object.values(SoundType).forEach(type => {
    try {
      const audio = new Audio(soundFiles[type]);
      audio.preload = 'auto';
      audioCache[type] = audio;
    } catch (error) {
      console.warn(`Error al precargar el sonido ${type}:`, error);
    }
  });
};

/**
 * Reproduce un sonido
 * @param type Tipo de sonido a reproducir
 * @param volume Volumen (0-1, por defecto 0.5)
 */
export const playSound = (type: SoundType, volume: number = 0.5): void => {
  if (typeof window === 'undefined' || !soundEnabled) return;

  try {
    // Usar el audio en caché o crear uno nuevo
    let audio = audioCache[type];
    if (!audio) {
      audio = new Audio(soundFiles[type]);
      audioCache[type] = audio;
    }

    // Configurar y reproducir
    audio.volume = volume;
    audio.currentTime = 0;
    
    // Usar una promesa para manejar la reproducción
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn(`Error al reproducir el sonido ${type}:`, error);
      });
    }
  } catch (error) {
    console.warn(`Error al reproducir el sonido ${type}:`, error);
  }
};

/**
 * Activa o desactiva el sonido
 * @param enabled Estado del sonido (true = activado, false = desactivado)
 */
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  
  // Guardar la preferencia en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('sound_enabled', enabled.toString());
  }
};

/**
 * Obtiene el estado actual del sonido
 * @returns true si el sonido está activado, false en caso contrario
 */
export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

// Inicializar el servicio cuando se importa (en el cliente)
if (typeof window !== 'undefined') {
  initSoundService();
}
