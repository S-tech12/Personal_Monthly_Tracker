import React from 'react';
import '../../styles/components/Loader.css';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-animation-wrapper">
        <div className="loader-ring-outer"></div>
        <div className="loader-ring-inner"></div>
        <div className="loader-dot"></div>
      </div>
      <div className="loader-text">{text}</div>
    </div>
  );
};
