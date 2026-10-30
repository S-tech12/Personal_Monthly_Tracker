import React from 'react';
import '../../styles/components/Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  rightActionNode?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  id, 
  className = '', 
  leftIcon, 
  rightIcon, 
  onRightIconClick, 
  rightActionNode, 
  ...props 
}) => {
  return (
    <div className={`input-container ${className}`}>
      {(label || rightActionNode) && (
        <label htmlFor={id} className="input-label">
          {label && <span>{label}</span>}
          {rightActionNode && <div className="input-right-action">{rightActionNode}</div>}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && (
          <span className="material-symbols-outlined input-left-icon">{leftIcon}</span>
        )}
        <input 
          id={id}
          className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`} 
          {...props} 
        />
        {rightIcon && (
          <button 
            type="button"
            className="material-symbols-outlined input-right-icon"
            onClick={onRightIconClick}
            tabIndex={-1}
            aria-label={onRightIconClick ? "Toggle action" : undefined}
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};
