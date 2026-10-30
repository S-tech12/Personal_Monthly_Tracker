import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width, 
  height, 
  style, 
  className = '' 
}) => {
  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={{ 
        width, 
        height, 
        backgroundColor: 'var(--color-surface-variant)', 
        borderRadius: variant === 'circular' ? '50%' : (variant === 'rectangular' ? '12px' : '4px'),
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style 
      }} 
    />
  );
};
