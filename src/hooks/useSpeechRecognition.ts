import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition type declarations for webkit and standard APIs
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setTranscript: (text: string | ((prev: string) => string)) => void;
  clearTranscript: () => void;
  secondsRemaining: number;
  errorMessage: string | null;
}

export const useSpeechRecognition = (
  maxDurationSeconds: number = 60,
  language: string = 'en-US'
): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(maxDurationSeconds);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);

  // Check browser support
  const getSpeechRecognitionClass = () => {
    if (typeof window === 'undefined') return null;
    return (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition || null;
  };
  const SpeechRecognitionClass = getSpeechRecognitionClass();
  const browserSupportsSpeechRecognition = Boolean(SpeechRecognitionClass);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);
  const isIntentionallyListeningRef = useRef(false);
  const baseTextRef = useRef(''); // Saved text before current speech segment

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    console.log('[SpeechRecognition] stopListening invoked');
    isIntentionallyListeningRef.current = false;
    clearTimer();
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('[SpeechRecognition] stop error:', e);
      }
    }
  }, [clearTimer]);

  const startListening = useCallback(() => {
    console.log('[SpeechRecognition] startListening invoked');
    const RecClass = getSpeechRecognitionClass();
    if (!RecClass) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    setErrorMessage(null);
    clearTimer();
    setSecondsRemaining(maxDurationSeconds);

    // Make sure previous recognition instance is cleanly terminated before creating a fresh one
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.warn('[SpeechRecognition] abort existing instance:', e);
      }
      recognitionRef.current = null;
    }

    // Save existing text as base text so user's previous speech or manual edits are preserved
    setTranscript((current) => {
      baseTextRef.current = current ? current.trim() + ' ' : '';
      return current;
    });

    const recognition = new RecClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Default to browser language or en-US/en-IN fallback
    recognition.lang = navigator.language || language || 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[SpeechRecognition] onstart - mic active');
      setIsListening(true);
      setIsMicrophoneAvailable(true);
      setErrorMessage(null);
    };

    recognition.onresult = (event: any) => {
      console.log('[SpeechRecognition] onresult - results count:', event.results.length);
      let sessionFinal = '';
      let sessionInterim = '';

      // Crucial: loop from 0 to event.results.length to reconstruct the full session speech
      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        const phrase = item[0]?.transcript || '';
        if (item.isFinal) {
          sessionFinal += phrase + ' ';
        } else {
          sessionInterim += phrase;
        }
      }

      // Combine base text (pre-speech) + session speech (final + interim)
      const combined = (baseTextRef.current + sessionFinal + sessionInterim).replace(/\s+/g, ' ').trim();
      console.log('[SpeechRecognition] live transcript updated:', combined);
      setTranscript(combined);
    };

    recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognition] onerror:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsMicrophoneAvailable(false);
        setErrorMessage('Microphone access was denied. Please allow mic permissions in your browser or type below.');
        isIntentionallyListeningRef.current = false;
        setIsListening(false);
        clearTimer();
      } else if (event.error === 'no-speech') {
        console.log('[SpeechRecognition] no speech detected in chunk, continuing...');
      } else if (event.error === 'audio-capture') {
        setErrorMessage('No microphone was detected. Please connect a microphone or type below.');
        isIntentionallyListeningRef.current = false;
        setIsListening(false);
        clearTimer();
      } else if (event.error === 'network') {
        setErrorMessage('Network connection error during voice recognition. You can type below.');
      } else {
        console.warn(`[SpeechRecognition] non-fatal error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('[SpeechRecognition] onend, isIntentionallyListening:', isIntentionallyListeningRef.current);
      if (isIntentionallyListeningRef.current) {
        // Automatically restart if recognition timed out while user was still recording
        try {
          // Update baseTextRef to the current transcript so restarted session appends cleanly
          setTranscript((curr) => {
            baseTextRef.current = curr ? curr.trim() + ' ' : '';
            return curr;
          });
          recognition.start();
        } catch (err) {
          console.warn('[SpeechRecognition] auto-restart on onend failed:', err);
          setIsListening(false);
          isIntentionallyListeningRef.current = false;
          clearTimer();
        }
      } else {
        setIsListening(false);
        clearTimer();
      }
    };

    recognitionRef.current = recognition;
    isIntentionallyListeningRef.current = true;

    try {
      recognition.start();
    } catch (err: any) {
      console.warn('[SpeechRecognition] initial start error:', err);
      if (err.name !== 'InvalidStateError') {
        setErrorMessage('Could not activate microphone. Please try again.');
      }
    }

    // Start 60s countdown timer
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, language, maxDurationSeconds, stopListening]);

  const resetTranscript = useCallback(() => {
    stopListening();
    baseTextRef.current = '';
    setTranscript('');
    setErrorMessage(null);
    setSecondsRemaining(maxDurationSeconds);
  }, [maxDurationSeconds, stopListening]);

  const clearTranscript = useCallback(() => {
    baseTextRef.current = '';
    setTranscript('');
  }, []);

  const setTranscriptWrapper = useCallback((valueOrFn: string | ((prev: string) => string)) => {
    setTranscript((prev) => {
      const nextVal = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      baseTextRef.current = nextVal ? nextVal.trim() + ' ' : '';
      return nextVal;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isIntentionallyListeningRef.current = false;
      clearTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn('[SpeechRecognition] cleanup abort error:', e);
        }
        recognitionRef.current = null;
      }
    };
  }, [clearTimer]);

  return {
    transcript,
    isListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript: setTranscriptWrapper,
    clearTranscript,
    secondsRemaining,
    errorMessage
  };
};
