import { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import toast from 'react-hot-toast';

export const useVoiceInput = () => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  
  const timerRef = useRef<number | null>(null);

  const {
    transcript: speechTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Keep our editableTranscript in sync with the speech API when listening
  useEffect(() => {
    if (listening) {
      setEditableTranscript(speechTranscript);
    }
  }, [speechTranscript, listening]);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser doesn't support speech recognition.");
      return;
    }

    setIsReviewing(false);
    resetTranscript();
    setEditableTranscript('');
    setSecondsRemaining(60);

    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopListening = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    SpeechRecognition.stopListening();
    setIsReviewing(true);
  };

  const reset = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    SpeechRecognition.stopListening();
    resetTranscript();
    setIsReviewing(false);
    setEditableTranscript('');
    setSecondsRemaining(60);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      SpeechRecognition.stopListening();
    };
  }, []);

  return {
    isListening: listening,
    isReviewing,
    transcript: editableTranscript,
    setTranscript: setEditableTranscript,
    secondsRemaining,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    reset
  };
};
