import React from 'react';
import { motion } from 'framer-motion';
import { Container } from './Container';

export type SectionVariant = 'plain' | 'tint' | 'gradient' | 'card-surface' | 'dark-contrast' | 'accent';

interface SectionProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  id?: string;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
  withDivider?: boolean;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'plain',
  id,
  className = '',
  containerSize = 'lg',
  noPadding = false,
  withDivider = false,
  animate = true,
  style = {}
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'tint':
        return {
          backgroundColor: 'var(--color-surface-variant)',
          borderTop: '1px solid var(--color-outline-muted)',
          borderBottom: '1px solid var(--color-outline-muted)'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(180deg, var(--color-surface-container-low) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-outline-muted)'
        };
      case 'card-surface':
        return {
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-outline-muted)',
          borderBottom: '1px solid var(--color-outline-muted)'
        };
      case 'accent':
        return {
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(168, 85, 247, 0.03) 100%)',
          borderTop: '1px solid var(--color-outline-variant)',
          borderBottom: '1px solid var(--color-outline-variant)'
        };
      case 'dark-contrast':
        return {
          backgroundColor: 'var(--color-surface-container-high)',
          borderTop: '1px solid var(--color-outline-variant)',
          borderBottom: '1px solid var(--color-outline-variant)'
        };
      case 'plain':
      default:
        return {
          backgroundColor: 'transparent'
        };
    }
  };

  const sectionPadding = noPadding 
    ? '0' 
    : 'clamp(3rem, 5.5vw, 5.5rem) 0';

  const content = (
    <Container size={containerSize}>
      {children}
    </Container>
  );

  return (
    <section
      id={id}
      className={`site-section section-${variant} ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        padding: sectionPadding,
        overflow: 'hidden',
        ...getVariantStyles(),
        ...style
      }}
    >
      {withDivider && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, var(--color-outline-variant) 50%, transparent 100%)'
          }} 
        />
      )}

      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </section>
  );
};
