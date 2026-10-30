import React from 'react';
import '../../styles/components/Alert.css';

interface AlertProps {
  type: 'error' | 'warning' | 'info';
  message: string;
  icon?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message, icon, className = '' }) => {
  const defaultIcons = {
    error: 'warning',
    warning: 'error',
    info: 'info'
  };

  const displayIcon = icon || defaultIcons[type];

  return (
    <div className={`alert-banner ${type} ${className}`}>
      <span className={`material-symbols-outlined alert-icon alert-${type}`}>
        {displayIcon}
      </span>
      <p className="alert-message">{message}</p>
    </div>
  );
};
