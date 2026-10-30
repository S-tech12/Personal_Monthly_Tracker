import React from 'react';
import '../../styles/components/Select.css';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`select-container ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <div className="select-wrapper">
        <select className="select-input" {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined select-icon">expand_more</span>
      </div>
    </div>
  );
};
