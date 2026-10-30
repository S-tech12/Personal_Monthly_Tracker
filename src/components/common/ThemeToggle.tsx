import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        background: isDark
          ? 'linear-gradient(135deg, #7C3AED, #A855F7)'
          : 'rgba(0,0,0,0.10)',
        border: '1.5px solid',
        borderColor: isDark ? 'transparent' : 'rgba(0,0,0,0.12)',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: 0,
        transition: 'background 0.3s, border-color 0.3s',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        layout
        animate={{ x: isDark ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: isDark ? '#fff' : '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '10px',
            color: isDark ? '#7C3AED' : '#F59E0B',
            fontVariationSettings: "'FILL' 1",
            lineHeight: 1,
          }}
        >
          {isDark ? 'dark_mode' : 'light_mode'}
        </span>
      </motion.span>
    </motion.button>
  );
};
