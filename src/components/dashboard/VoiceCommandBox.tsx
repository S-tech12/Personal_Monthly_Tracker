import React from 'react';
import { motion } from 'framer-motion';

interface VoiceCommandBoxProps {
  isListening: boolean;
  onToggleMic: () => void;
  onQuickPrompt?: (promptText: string) => void;
  className?: string;
}

const EXAMPLE_COMMANDS = [
  { text: 'Spent 250 on lunch', icon: 'restaurant', category: 'Food' },
  { text: 'Add 500 for fuel', icon: 'local_gas_station', category: 'Transport' },
  { text: 'Paid 1200 for groceries', icon: 'shopping_cart', category: 'Shopping' }
];

export const VoiceCommandBox: React.FC<VoiceCommandBoxProps> = ({
  isListening,
  onToggleMic,
  onQuickPrompt,
  className = ''
}) => {
  return (
    <div className={`voice-command-box ${isListening ? 'is-active' : ''} ${className}`}>
      {/* Top decorative ambient gradient accent */}
      <div className="voice-box-top-accent" />

      {/* Header status bar */}
      <div className="voice-box-header">
        <div className="voice-box-badge">
          <span className={`voice-beacon ${isListening ? 'pulsing' : 'idle'}`} />
          <span>{isListening ? 'Live Recording' : 'Voice Assistant Ready'}</span>
        </div>
        <span className="voice-box-shortcut">English • Real-time</span>
      </div>

      {/* Prominent Well-Centered Mic Area */}
      <div className="voice-box-mic-container">
        {/* Subtle idle pulse rings when not listening */}
        {!isListening && (
          <>
            <motion.div
              className="voice-idle-ring ring-1"
              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0.08, 0.35] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            <motion.div
              className="voice-idle-ring ring-2"
              animate={{ scale: [1, 1.7, 1], opacity: [0.2, 0.03, 0.2] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 0.5, ease: 'easeInOut' }}
            />
          </>
        )}

        {/* Active pulse rings when listening */}
        {isListening && (
          <>
            <motion.div
              className="voice-active-ring active-ring-1"
              animate={{ scale: [1, 1.9], opacity: [0.65, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
            />
            <motion.div
              className="voice-active-ring active-ring-2"
              animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
              transition={{ repeat: Infinity, duration: 2.1, delay: 0.35, ease: 'easeOut' }}
            />
          </>
        )}

        {/* Main Microphone Button */}
        <motion.button
          type="button"
          onClick={onToggleMic}
          className={`voice-box-mic-btn ${isListening ? 'listening' : ''}`}
          aria-label={isListening ? 'Stop voice recording' : 'Start voice expense recording'}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        >
          <span className="material-symbols-outlined voice-box-mic-icon">
            {isListening ? 'stop' : 'mic'}
          </span>
        </motion.button>
      </div>

      {/* Text Hierarchy: Title & Helper */}
      <div className="voice-box-text-block">
        <h3 className="voice-box-title">
          {isListening ? 'Listening to your expense...' : 'Voice Expense Assistant'}
        </h3>
        <p className="voice-box-helper">
          {isListening
            ? 'Speak clearly — amount, currency, and category are parsed automatically.'
            : 'Tap the mic and speak naturally to record or categorize an expense.'}
        </p>
      </div>

      {/* Example Commands Chips */}
      <div className="voice-box-examples-section">
        <span className="voice-examples-label">Try saying:</span>
        <div className="voice-examples-chips">
          {EXAMPLE_COMMANDS.map((cmd, idx) => (
            <motion.button
              key={idx}
              type="button"
              className="voice-example-chip"
              onClick={() => onQuickPrompt && onQuickPrompt(cmd.text)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              title={`Click to try "${cmd.text}"`}
            >
              <span className="material-symbols-outlined chip-icon" style={{ fontSize: '15px' }}>
                {cmd.icon}
              </span>
              <span className="chip-text">"{cmd.text}"</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
