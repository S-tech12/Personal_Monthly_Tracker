import React from 'react';
import '../../styles/components/Card.css';

interface CardProps {
  title?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, headerRight, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerRight) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
