import React from 'react';
import '../../styles/components/Toggle.css';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, className = '', ...props }) => {
  return (
    <label className={`toggle-container ${className}`}>
      <input 
        type="checkbox" 
        className="toggle-input" 
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <div className="toggle-track">
        <div className="toggle-thumb"></div>
      </div>
    </label>
  );
};
