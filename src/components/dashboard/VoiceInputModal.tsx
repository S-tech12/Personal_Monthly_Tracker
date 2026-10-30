import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import '../../styles/components/VoiceModals.css';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (transcriptText: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  initialText?: string;
}

const EXAMPLE_CHIPS = [
  { text: 'Spent 200 on lunch', icon: 'restaurant' },
  { text: 'Paid 50 for fuel', icon: 'directions_car' },
  { text: 'Bought groceries for 150', icon: 'shopping_bag' }
];

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onDone,
  isLoading = false,
  errorMessage = null,
  onRetry,
  initialText = ''
}) => {
  const [text, setText] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const { isSupported, isListening, error, toggle, stop, start, clearError, reset } = useSpeechToText({
    text,
    setText
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const prevIsOpenRef = useRef(false);

  const handleClose = () => {
    if (text.trim()) {
      setShowDiscardConfirm(true);
      return;
    }
    stop();
    onClose();
  };

  const confirmDiscard = () => {
    setShowDiscardConfirm(false);
    stop();
    onClose();
  };

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setText(initialText || '');
      clearError();
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } else if (!isOpen && prevIsOpenRef.current) {
      stop();
      reset();
      clearError();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialText, stop, reset, clearError]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusables = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (typeof document === 'undefined') return null;

  const handleDone = () => {
    stop();
    const trimmed = text.trim();
    if (trimmed) {
      onDone(trimmed);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClear = () => {
    const wasListening = isListening;
    if (wasListening) stop();
    reset();
    if (wasListening) {
      // Let the cleared state reach the hook before capturing the next base text.
      setTimeout(start, 0);
    }
  };

  const getStatusText = () => {
    if (!isSupported) {
      return 'Voice input is not supported in this browser. Please type your entry.';
    }
    if (isListening) {
      return 'Listening...';
    }
    return 'Tap mic to start';
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="voice-modal-backdrop"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-modal-title"
        >
          <motion.div
            ref={modalContainerRef}
            className="voice-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="voice-modal-drag-bar" />

            <div className="voice-modal-header">
              <div className="voice-modal-title-group">
                <h2 id="voice-modal-title" className="voice-modal-title">Voice Command</h2>
                <p className="voice-modal-subtitle">Speak or type your transaction to record it effortlessly</p>
              </div>
              <button
                type="button"
                className="voice-modal-close-btn"
                onClick={() => {
                  handleClose();
                }}
                aria-label="Close voice modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="voice-modal-body">
              {!isSupported && (
                <div className="voice-modal-notice warning" role="alert">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
                  <span>Voice input is not supported in this browser. Please type your entry.</span>
                </div>
              )}

              {error && (
                <div className="voice-modal-notice error" role="alert">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic_off</span>
                  <span>{error}</span>
                </div>
              )}

              {errorMessage && (
                <div className="voice-modal-notice error" role="alert">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span>{errorMessage}</span>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'inherit',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: '0 4px'
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="voice-mic-section">
                <div className="voice-mic-ring-container">
                  {isListening && (
                    <>
                      <motion.div
                        className="voice-pulse-ring"
                        animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="voice-pulse-ring"
                        animate={{ scale: [1, 2.1], opacity: [0.45, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.3, ease: 'easeOut' }}
                      />
                    </>
                  )}

                  {isSupported && (
                    <button
                      type="button"
                      className={`voice-modal-mic-btn ${isListening ? 'is-listening' : ''}`}
                      onClick={toggle}
                      disabled={isLoading}
                      aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                        {isListening ? 'stop' : 'mic'}
                      </span>
                    </button>
                  )}
                </div>

                {isListening && (
                  <div className="voice-modal-waveform" aria-hidden="true">
                    {[35, 75, 45, 95, 60, 100, 50, 85, 40, 90, 55, 80].map((h, i) => (
                      <motion.span
                        key={i}
                        className="voice-waveform-bar"
                        animate={{ height: [`${Math.max(20, h * 0.3)}%`, `${h}%`, `${Math.max(20, h * 0.5)}%`] }}
                        transition={{ repeat: Infinity, duration: 0.6 + (i % 3) * 0.15, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                )}

                <p className="voice-mic-status-text" aria-live="polite">
                  {getStatusText()}
                </p>
              </div>

              <div className="voice-textarea-wrapper">
                <label htmlFor="voice-transcript-input" className="voice-textarea-label">
                  Recognized / Custom Text
                </label>
                <textarea
                  id="voice-transcript-input"
                  ref={textareaRef}
                  className="voice-modal-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Spent 200 on lunch with friends..."
                  rows={3}
                  disabled={isLoading}
                  aria-label="Spoken transaction text"
                />
              </div>

              <div className="voice-chips-container">
                <span className="voice-chips-label">Quick suggestions:</span>
                <div className="voice-chips-list">
                  {EXAMPLE_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="voice-chip-btn"
                      onClick={() => {
                        stop();
                        setText(chip.text);
                        textareaRef.current?.focus();
                      }}
                      disabled={isLoading}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                        {chip.icon}
                      </span>
                      <span>"{chip.text}"</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="voice-modal-footer">
              <button
                type="button"
                className="voice-modal-btn ghost"
                onClick={handleClear}
                disabled={!text.trim() || isLoading}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                <span>Clear</span>
              </button>

              <button
                type="button"
                className="voice-modal-btn primary"
                onClick={handleDone}
                disabled={!text.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined spin-icon" style={{ fontSize: '18px' }}>
                      progress_activity
                    </span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    <span>Done</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {showDiscardConfirm && (
            <div
              className="voice-modal-backdrop"
              style={{ zIndex: 10000, background: 'rgba(8, 6, 18, 0.72)' }}
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="discard-transaction-title"
            >
              <motion.div
                className="voice-modal-container"
                style={{ maxWidth: '420px', zIndex: 10001 }}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="voice-modal-header">
                  <div className="voice-modal-title-group">
                    <h2 id="discard-transaction-title" className="voice-modal-title">Discard transaction?</h2>
                    <p className="voice-modal-subtitle">Your typed or spoken text will be cleared.</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-error)', fontSize: '28px' }}>
                    warning
                  </span>
                </div>
                <div className="voice-modal-footer" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="voice-modal-btn secondary"
                    onClick={() => setShowDiscardConfirm(false)}
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    className="voice-modal-btn primary"
                    style={{ background: 'var(--color-error)' }}
                    onClick={confirmDiscard}
                  >
                    Discard
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
