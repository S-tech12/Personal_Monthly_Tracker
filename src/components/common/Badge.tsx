import React from 'react';
import '../../styles/components/Badge.css';

interface BadgeProps {
  status: 'on-track' | 'warning' | 'over-budget' | 'early-days' | 'info' | 'error';
  label: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  return (
    <span className={`badge ${status} ${className}`}>
      {label}
    </span>
  );
};
