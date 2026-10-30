import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/components/VoiceListeningOverlay.css';

interface VoiceListeningOverlayProps {
  isListening: boolean;
  isReviewing: boolean;
  transcript: string;
  secondsRemaining: number;
  isSubmitting: boolean;
  onStop: () => void;
  onSubmit: (finalTranscript: string) => void;
  onReRecord: () => void;
  onTranscriptEdit: (text: string) => void;
  onClose: () => void;
  browserSupportsSpeechRecognition?: boolean;
  isMicrophoneAvailable?: boolean;
}

export const VoiceListeningOverlay: React.FC<VoiceListeningOverlayProps> = ({
  isListening,
  isReviewing,
  transcript,
  secondsRemaining,
  isSubmitting,
  onStop,
  onSubmit,
  onReRecord,
  onTranscriptEdit,
  onClose,
  browserSupportsSpeechRecognition = true,
  isMicrophoneAvailable = true
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedText, setLastSubmittedText] = useState('');
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isListening || isReviewing || isSubmitting || isSuccess) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isListening, isReviewing, isSubmitting, isSuccess, onClose]);

  const handleSubmit = (textToSubmit: string) => {
    setLastSubmittedText(textToSubmit);
    onSubmit(textToSubmit);
  };

  const isOpen = isListening || isReviewing || isSubmitting || isSuccess;

  // Determine error states
  const hasUnsupportedBrowser = !browserSupportsSpeechRecognition;
  const hasPermissionDenied = isMicrophoneAvailable === false;
  const hasEmptyTranscriptError = !isListening && isReviewing && !transcript.trim() && !isSubmitting && !isSuccess;

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="voice-overlay-portal" role="dialog" aria-modal="true" aria-labelledby="voice-status-heading">
          {/* Backdrop with blur & dim */}
          <motion.div
            className="voice-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            className="voice-overlay-card"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Handle */}
            <div className="voice-sheet-handle" />

            {/* Top Bar with Cancel / Close */}
            <div className="voice-overlay-top-bar">
              <div className="voice-top-meta">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
                  graphic_eq
                </span>
                <span className="voice-top-label">VoiceSpend Assistant</span>
              </div>

              <button
                type="button"
                className="voice-overlay-close-btn"
                onClick={onClose}
                aria-label="Close voice assistant"
                title="Cancel & Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Main Interactive Body */}
            <div className="voice-overlay-body">
              {/* STATE 1: BROWSER NOT SUPPORTED */}
              {hasUnsupportedBrowser && (
                <div className="voice-state-block error-state">
                  <div className="voice-state-icon-circle error-circle">
                    <span className="material-symbols-outlined">browser_not_supported</span>
                  </div>
                  <h3 id="voice-status-heading" className="voice-state-title" aria-live="polite">
                    Speech Recognition Unavailable
                  </h3>
                  <p className="voice-state-desc">
                    Your current web browser does not support voice input. For the best experience, please use Google Chrome, Microsoft Edge, or Safari.
                  </p>
                  <div className="voice-state-actions">
                    <button type="button" className="voice-btn-primary" onClick={onClose}>
                      Got It
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 2: PERMISSION DENIED */}
              {!hasUnsupportedBrowser && hasPermissionDenied && (
                <div className="voice-state-block error-state">
                  <div className="voice-state-icon-circle error-circle">
                    <span className="material-symbols-outlined">mic_off</span>
                  </div>
                  <h3 id="voice-status-heading" className="voice-state-title" aria-live="polite">
                    Microphone Permission Needed
                  </h3>
                  <p className="voice-state-desc">
                    Please allow microphone access in your browser address bar or settings to speak and log your expenses.
                  </p>
                  <div className="voice-state-actions">
                    <button type="button" className="voice-btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="button" className="voice-btn-primary" onClick={onReRecord}>
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 3: SUCCESS STATE */}
              {!hasUnsupportedBrowser && !hasPermissionDenied && isSuccess && (
                <div className="voice-state-block success-state">
                  <motion.div
                    className="voice-state-icon-circle success-circle"
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  >
                    <span className="material-symbols-outlined">check</span>
                  </motion.div>
                  <h3 id="voice-status-heading" className="voice-state-title" aria-live="polite">
                    Done!
                  </h3>
                  <p className="voice-state-desc">
                    {lastSubmittedText ? `"${lastSubmittedText}"` : 'Your expense was parsed and logged successfully.'}
                  </p>
                  <div className="success-auto-badge">
                    <span>Auto-closing...</span>
                  </div>
                </div>
              )}

              {/* STATE 4: PROCESSING / SUBMITTING */}
              {!hasUnsupportedBrowser && !hasPermissionDenied && !isSuccess && isSubmitting && (
                <div className="voice-state-block processing-state">
                  <div className="voice-processing-rings">
                    <span className="material-symbols-outlined spin-icon processing-spinner">
                      progress_activity
                    </span>
                  </div>
                  <h3 id="voice-status-heading" className="voice-state-title" aria-live="polite">
                    Processing your expense...
                  </h3>
                  <p className="voice-state-desc">
                    Parsing amounts, currencies, and categories with smart finance AI.
                  </p>
                  {transcript && (
                    <div className="voice-preview-bubble">
                      <span>"{transcript}"</span>
                    </div>
                  )}
                </div>
              )}

              {/* STATE 5: LISTENING STATE */}
              {!hasUnsupportedBrowser && !hasPermissionDenied && !isSuccess && !isSubmitting && isListening && (
                <div className="voice-state-block listening-state">
                  {/* Central Large Mic with Pulsing Rings */}
                  <div className="voice-listening-center">
                    <motion.div
                      className="expanding-ring ring-level-1"
                      animate={{ scale: [1, 1.85], opacity: [0.65, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="expanding-ring ring-level-2"
                      animate={{ scale: [1, 2.35], opacity: [0.45, 0] }}
                      transition={{ repeat: Infinity, duration: 2.3, delay: 0.35, ease: 'easeOut' }}
                    />
                    <div className="large-listening-mic-btn">
                      <span className="material-symbols-outlined large-mic-icon">mic</span>
                    </div>
                  </div>

                  {/* Dynamic Audio Waveform */}
                  <div className="overlay-waveform-row">
                    {[35, 75, 45, 95, 60, 100, 50, 85, 40, 90, 55, 80, 45, 70].map((h, i) => (
                      <motion.span
                        key={i}
                        className="waveform-bar"
                        animate={{ height: [`${Math.max(20, h * 0.4)}%`, `${h}%`, `${Math.max(25, h * 0.6)}%`] }}
                        transition={{ repeat: Infinity, duration: 0.65 + (i % 3) * 0.15, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>

                  {/* Status Heading with aria-live */}
                  <div className="voice-live-status-pill">
                    <span className="pulsing-live-dot" />
                    <span id="voice-status-heading" aria-live="polite">Listening...</span>
                  </div>

                  {/* Live Transcript Display */}
                  <div className="voice-live-transcript-box">
                    <p className={`voice-live-transcript-text ${!transcript ? 'placeholder' : ''}`}>
                      {transcript || 'Speak now... (e.g., "Spent 250 on lunch" or "Add 500 for fuel")'}
                    </p>
                  </div>

                  {/* Countdown & Stop Action */}
                  <div className="voice-listening-footer">
                    <span className="voice-countdown-timer">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                      {secondsRemaining}s remaining
                    </span>

                    <button
                      type="button"
                      className="voice-stop-recording-btn"
                      onClick={onStop}
                      title="Finish and Review"
                      aria-label="Finish speaking"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>stop</span>
                      <span>Done Speaking</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 6: EMPTY TRANSCRIPT / COULD NOT HEAR */}
              {!hasUnsupportedBrowser && !hasPermissionDenied && !isSuccess && !isSubmitting && hasEmptyTranscriptError && (
                <div className="voice-state-block error-state">
                  <div className="voice-state-icon-circle warn-circle">
                    <span className="material-symbols-outlined">hearing_disabled</span>
                  </div>
                  <h3 id="voice-status-heading" className="voice-state-title" aria-live="polite">
                    Couldn't hear you, try again
                  </h3>
                  <p className="voice-state-desc">
                    No speech was detected. Make sure your microphone is close and try speaking something like "Spent 200 on lunch".
                  </p>
                  <div className="voice-state-actions">
                    <button type="button" className="voice-btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="button" className="voice-btn-primary" onClick={onReRecord}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
                      <span>Tap to Speak Again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 7: REVIEWING & CONFIRMING */}
              {!hasUnsupportedBrowser && !hasPermissionDenied && !isSuccess && !isSubmitting && isReviewing && !hasEmptyTranscriptError && (
                <div className="voice-state-block review-state">
                  <div className="review-state-header">
                    <div className="review-state-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_note</span>
                      <span>Review Entry</span>
                    </div>
                    <h3 id="voice-status-heading" className="voice-state-title">
                      Confirm Your Expense
                    </h3>
                    <p className="voice-state-desc">
                      Edit the recognized text if needed, then submit to automatically log it.
                    </p>
                  </div>

                  <div className="review-textarea-wrapper">
                    <textarea
                      className="voice-review-textarea"
                      value={transcript}
                      onChange={(e) => onTranscriptEdit(e.target.value)}
                      placeholder="Type or edit your expense details..."
                      rows={3}
                      aria-label="Editable recognized expense text"
                    />
                  </div>

                  <div className="voice-review-actions-row">
                    <button
                      type="button"
                      className="voice-btn-secondary"
                      onClick={onReRecord}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>replay</span>
                      <span>Re-record</span>
                    </button>

                    <button
                      type="button"
                      className="voice-btn-primary"
                      onClick={() => handleSubmit(transcript)}
                      disabled={!transcript.trim()}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                      <span>Submit Expense</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
