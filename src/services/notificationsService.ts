import React from 'react';
import type { Notification } from '../types/notifications.types';

export const notificationsService = {
  getNotifications: async (): Promise<Notification[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            type: 'alert',
            title: 'Rent Budget Alert',
            message: 'You have exceeded your limit by $150.00. Please review your monthly housing expenses.',
            timestamp: '2m ago',
            isRead: false
          },
          {
            id: '2',
            type: 'info',
            title: 'Unusual spending detected',
            message: 'We noticed a higher than average spending in Food categories over the last 48 hours.',
            timestamp: '1h ago',
            isRead: false
          },
          {
            id: '3',
            type: 'success',
            title: 'Monthly Report Sent',
            message: 'Your automated monthly spending analysis for July has been sent to your primary email address.',
            timestamp: '5h ago',
            isRead: false
          },
          {
            id: '4',
            type: 'update',
            title: 'Update Available',
            message: 'VoiceSpend v2.4 is now available. Check out the new bento grid analytics view!',
            timestamp: 'Yesterday',
            isRead: true
          }
        ]);
      }, 500);
    });
  },

  markAllAsRead: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },

  markAsRead: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }
};
