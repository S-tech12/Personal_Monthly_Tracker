import React from 'react';

interface SpeakButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({ isListening, onClick }) => {
  return (
    <div className="mic-wrapper" onClick={onClick}>
      <div className={`mic-ring ${isListening ? 'mic-pulse opacity-100' : ''}`}></div>
      <div 
        className="mic-button" 
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
  );
};
