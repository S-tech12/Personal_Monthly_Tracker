import React from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { VoiceListeningOverlay } from '../dashboard/VoiceListeningOverlay';
import '../../styles/components/FloatingVoiceButton.css';

export const FloatingVoiceButton: React.FC = () => {
  const {
    isListening,
    isReviewing,
    transcript,
    setTranscript,
    secondsRemaining,
    startListening,
    stopListening,
    reset
  } = useVoiceInput();

  const handleSuccess = () => {
    reset();
  };

  const { isSubmitting, submitCommand } = useVoiceCommand(handleSuccess);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className="floating-voice-wrapper" onClick={toggleMic}>
        <div className={`mic-ring ${isListening ? 'mic-pulse opacity-100' : ''}`}></div>
        <div 
          className="floating-voice-btn"
          style={{
            borderRadius: isListening ? '16px' : '50%',
            backgroundColor: isListening ? 'var(--color-error, #ef4444)' : 'var(--color-primary)',
            transition: 'all 0.3s ease'
          }}
        >
          <span className="material-symbols-outlined mic-icon">
            {isListening ? 'stop' : 'mic'}
          </span>
        </div>
      </div>

      <VoiceListeningOverlay 
        isListening={isListening}
        isReviewing={isReviewing}
        transcript={transcript}
        secondsRemaining={secondsRemaining}
        isSubmitting={isSubmitting}
        onStop={stopListening}
        onSubmit={submitCommand}
        onReRecord={startListening}
        onTranscriptEdit={setTranscript}
        onClose={reset}
      />
    </>
  );
};
