import { useCallback, useRef } from "react";

interface SoundOptions {
  volume?: number;
  frequency?: number;
  duration?: number;
}

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }, [getAudioContext]);

  const playCorrect = useCallback((options?: SoundOptions) => {
    const { volume = 0.3 } = options || {};
    // Cheerful ascending notes
    playTone(523.25, 0.1, "sine", volume); // C5
    setTimeout(() => playTone(659.25, 0.1, "sine", volume), 100); // E5
    setTimeout(() => playTone(783.99, 0.15, "sine", volume), 200); // G5
  }, [playTone]);

  const playIncorrect = useCallback((options?: SoundOptions) => {
    const { volume = 0.25 } = options || {};
    // Descending buzz sound
    playTone(200, 0.15, "sawtooth", volume);
    setTimeout(() => playTone(150, 0.2, "sawtooth", volume * 0.8), 150);
  }, [playTone]);

  const playSuccess = useCallback((options?: SoundOptions) => {
    const { volume = 0.3 } = options || {};
    // Victory fanfare
    const notes = [
      { freq: 523.25, delay: 0 },    // C5
      { freq: 587.33, delay: 100 },  // D5
      { freq: 659.25, delay: 200 },  // E5
      { freq: 783.99, delay: 300 },  // G5
      { freq: 1046.50, delay: 450 }, // C6
    ];
    
    notes.forEach(({ freq, delay }) => {
      setTimeout(() => playTone(freq, 0.2, "sine", volume), delay);
    });
  }, [playTone]);

  const playClick = useCallback((options?: SoundOptions) => {
    const { volume = 0.15 } = options || {};
    playTone(800, 0.05, "sine", volume);
  }, [playTone]);

  const playAchievement = useCallback((options?: SoundOptions) => {
    const { volume = 0.35 } = options || {};
    // Magical achievement sound
    const notes = [
      { freq: 392, delay: 0 },     // G4
      { freq: 523.25, delay: 150 }, // C5
      { freq: 659.25, delay: 300 }, // E5
      { freq: 783.99, delay: 450 }, // G5
      { freq: 1046.50, delay: 600 }, // C6
      { freq: 1318.51, delay: 800 }, // E6
    ];
    
    notes.forEach(({ freq, delay }) => {
      setTimeout(() => playTone(freq, 0.25, "sine", volume), delay);
    });
  }, [playTone]);

  const playCoins = useCallback((options?: SoundOptions) => {
    const { volume = 0.2 } = options || {};
    // Coin collect sound
    playTone(987.77, 0.08, "square", volume); // B5
    setTimeout(() => playTone(1318.51, 0.12, "square", volume), 80); // E6
  }, [playTone]);

  const playSyncSuccess = useCallback((options?: SoundOptions) => {
    const { volume = 0.15 } = options || {};
    // Soft digital confirmation sound (Google Pay style)
    // Short, clean, premium - 200-300ms duration
    const notes = [
      { freq: 659.25, duration: 0.1, delay: 0 },    // E5 - bright, clean start
      { freq: 783.99, duration: 0.15, delay: 100 }, // G5 - deeper confirmation
    ];

    notes.forEach(({ freq, duration, delay }) => {
      setTimeout(() => playTone(freq, duration, "sine", volume), delay);
    });
  }, [playTone]);

  const playQRRedemption = useCallback((options?: SoundOptions) => {
    const { volume = 0.25 } = options || {};
    // Premium QR redemption sound - 3 ascending tones (Google Pay / Apple Pay style)
    // Confident, trustworthy, celebratory
    // Total duration: ~400ms
    const notes = [
      { freq: 587.33, duration: 0.12, delay: 0 },    // D5 - confident, warm
      { freq: 783.99, duration: 0.12, delay: 130 },  // G5 - ascending
      { freq: 1046.50, duration: 0.16, delay: 260 }, // C6 - triumph
    ];

    notes.forEach(({ freq, duration, delay }) => {
      setTimeout(() => playTone(freq, duration, "sine", volume), delay);
    });
  }, [playTone]);

  return {
    playCorrect,
    playIncorrect,
    playSuccess,
    playClick,
    playAchievement,
    playCoins,
    playSyncSuccess,
    playQRRedemption,
    playTone,
  };
}
