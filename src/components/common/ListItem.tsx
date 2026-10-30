import React from 'react';
import '../../styles/components/ListItem.css';

interface ListItemProps {
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarName?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  avatarUrl,
  avatarName,
  trailing,
  onClick,
  className = ''
}) => {
  return (
    <div className={`list-item ${className}`} onClick={onClick}>
      <div className="list-item-left">
        {icon && (
          <div 
            className="list-item-icon-circle"
            style={iconColor ? { backgroundColor: `${iconColor}20`, color: iconColor } : undefined}
          >
            <span className="material-symbols-outlined list-item-icon">{icon}</span>
          </div>
        )}
        <div className="list-item-content">
          <div className="list-item-title-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="list-item-title">{title}</span>
            {avatarName && (
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--color-surface-container)', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}
                title={`Added by ${avatarName}`}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={avatarName} style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold' }}>
                    {avatarName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{avatarName}</span>
              </div>
            )}
          </div>
          {subtitle && <span className="list-item-subtitle">{subtitle}</span>}
        </div>
      </div>
      
      {trailing && (
        <div className="list-item-right">
          <span className="list-item-trailing">{trailing}</span>
        </div>
      )}
    </div>
  );
};
