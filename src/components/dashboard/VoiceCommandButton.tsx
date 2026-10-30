import React from 'react';
import { motion } from 'framer-motion';

interface VoiceCommandButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'compact' | 'hero';
  label?: string;
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  onClick,
  className = '',
  variant = 'primary',
  label = 'Voice Command'
}) => {
  if (variant === 'hero') {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`hero-cta-btn ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Open voice command modal"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>mic</span>
        <span>{label}</span>
      </motion.button>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`voice-cmd-compact-btn ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open voice command modal"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          minHeight: '44px',
          padding: '0 1.125rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary)',
          color: '#ffffff',
          border: 'none',
          fontFamily: 'var(--font-family-display)',
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 14px -2px var(--color-primary-glow)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
        <span>{label}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`voice-cmd-standard-btn ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Open voice command modal"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        minHeight: '46px',
        padding: '0 1.25rem',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-primary)',
        color: '#ffffff',
        border: 'none',
        fontFamily: 'var(--font-family-display)',
        fontSize: '0.875rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 6px 18px -3px var(--color-primary-glow)'
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
      <span>{label}</span>
    </motion.button>
  );
};
