import React from 'react';
import '../../styles/components/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'success' | 'text';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined btn-icon">{icon}</span>
      )}
      {children}
    </button>
  );
};
