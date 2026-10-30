import React from 'react';
import '../../styles/components/SegmentedControl.css';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ 
  options, 
  value, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`segmented-control-container ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`segmented-control-btn ${value === option ? 'active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
