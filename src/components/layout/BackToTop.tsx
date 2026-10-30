import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="back-to-top-btn"
          style={{
            position: 'fixed',
            bottom: 'clamp(5.5rem, 8vw, 2.5rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            border: '1.5px solid var(--color-outline-variant)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 45,
            transition: 'all 0.2s ease',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
            arrow_upward
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
