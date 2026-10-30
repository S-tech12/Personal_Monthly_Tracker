import React from 'react';
import '../../styles/components/Checkbox.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  labelNode: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  labelNode, 
  id, 
  className = '', 
  ...props 
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`checkbox-container ${className}`}>
      <div className="checkbox-wrapper">
        <input 
          type="checkbox" 
          id={checkboxId} 
          className="checkbox-input" 
          {...props} 
        />
      </div>
      <div className="checkbox-label">
        <label htmlFor={checkboxId}>
          {labelNode}
        </label>
      </div>
    </div>
  );
};
