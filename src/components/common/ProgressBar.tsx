import React from 'react';
import '../../styles/components/ProgressBar.css';

interface ProgressBarProps {
  percentage: number;
  variant?: 'primary' | 'secondary' | 'error' | 'tertiary';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, variant = 'primary', className = '' }) => {
  // Cap between 0 and 100
  const width = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`progress-container ${className}`}>
      <div 
        className={`progress-fill ${variant}`} 
        style={{ width: `${width}%` }} 
      />
    </div>
  );
};
