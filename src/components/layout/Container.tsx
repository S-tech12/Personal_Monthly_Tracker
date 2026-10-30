import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  style = {}
}) => {
  const maxWidths = {
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1440px',
    full: '100%'
  };

  return (
    <div
      className={`site-container ${className}`}
      style={{
        width: '100%',
        maxWidth: maxWidths[size],
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'clamp(1rem, 3.5vw, 2rem)',
        paddingRight: 'clamp(1rem, 3.5vw, 2rem)',
        ...style
      }}
    >
      {children}
    </div>
  );
};
