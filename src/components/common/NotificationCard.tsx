import React from 'react';
import '../../styles/components/NotificationCard.css';
import type { NotificationType } from '../../types/notifications.types';

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string | React.ReactNode;
  timestamp: string;
  isRead: boolean;
  onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  message,
  timestamp,
  isRead,
  onClick
}) => {
  const getIcon = () => {
    switch (type) {
      case 'alert': return 'warning';
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'update': return 'mail';
      default: return 'notifications';
    }
  };

  const getIconFill = () => {
    return type === 'update' ? 0 : 1;
  };

  return (
    <div 
      className={`notification-card type-${type} ${isRead ? 'read' : 'unread'}`}
      onClick={onClick}
    >
      <div className="notification-icon-wrapper">
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: `'FILL' ${getIconFill()}` }}
        >
          {getIcon()}
        </span>
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h3 className="notification-title">{title}</h3>
          <span className="notification-time">{timestamp}</span>
        </div>
        <p className="notification-message">{message}</p>
      </div>
    </div>
  );
};
